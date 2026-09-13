'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { GitHubIcon } from '../icons/BrandIcons';
import confetti from 'canvas-confetti';
import {
  X,
  Lock,
  GitBranch,
  FolderGit2,
  FileCode2,
  Check,
  ExternalLink,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface CommitToGitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  yaml: string;
  defaultFilename: string;
}

export const CommitToGitHubModal: React.FC<CommitToGitHubModalProps> = ({
  isOpen,
  onClose,
  yaml,
  defaultFilename,
}) => {
  const { showToast } = useToast();

  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [rememberToken, setRememberToken] = useState(true);
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [filePath, setFilePath] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize stored values & file path
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('gh_studio_pat') || '';
      const storedRepo = localStorage.getItem('gh_studio_repo') || '';
      if (storedToken) setToken(storedToken);
      if (storedRepo) setRepo(storedRepo);
    }
  }, []);

  useEffect(() => {
    const filename = defaultFilename.endsWith('.yml') || defaultFilename.endsWith('.yaml')
      ? defaultFilename
      : `${defaultFilename || 'main'}.yml`;

    setFilePath(`.github/workflows/${filename}`);
    setCommitMessage(`ci: add ${filename} workflow via Pipeline Studio`);
    setError(null);
    setSuccessUrl(null);
  }, [defaultFilename, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessUrl(null);

    const cleanToken = token.trim();
    const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
    const cleanBranch = branch.trim() || 'main';
    const cleanPath = filePath.trim().replace(/^\//, '');

    if (!cleanToken) {
      setError('GitHub Personal Access Token is required.');
      return;
    }

    if (!cleanRepo || !cleanRepo.includes('/')) {
      setError('Please provide a valid repository in the format "owner/repo" (e.g. octocat/hello-world).');
      return;
    }

    if (!cleanPath) {
      setError('Workflow file path cannot be empty.');
      return;
    }

    setIsLoading(true);

    try {
      if (rememberToken && typeof window !== 'undefined') {
        localStorage.setItem('gh_studio_pat', cleanToken);
        localStorage.setItem('gh_studio_repo', cleanRepo);
      }

      // Convert YAML string to UTF-8 Base64
      const utf8Bytes = new TextEncoder().encode(yaml);
      let binary = '';
      for (let i = 0; i < utf8Bytes.byteLength; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      const base64Content = btoa(binary);

      const apiUrl = `https://api.github.com/repos/${cleanRepo}/contents/${cleanPath}`;

      // Check if file already exists to get sha for updating
      let existingSha: string | undefined = undefined;
      try {
        const checkRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(cleanBranch)}`, {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          existingSha = checkData.sha;
        }
      } catch (err) {
        // file doesn't exist yet or other non-fatal lookup error
      }

      // Commit file to repository
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage.trim() || `ci: update ${cleanPath}`,
          content: base64Content,
          branch: cleanBranch,
          sha: existingSha,
        }),
      });

      const data = await putRes.json();

      if (!putRes.ok) {
        const errorMsg = data.message || 'Failed to commit file to GitHub.';
        if (putRes.status === 401) {
          throw new Error('Authentication failed: Invalid GitHub token or expired permissions.');
        }
        if (putRes.status === 404) {
          throw new Error(`Repository "${cleanRepo}" or branch "${cleanBranch}" not found. Verify repository name and permissions.`);
        }
        if (putRes.status === 403) {
          throw new Error('Permission denied: Token requires "repo" or "contents:write" permission.');
        }
        throw new Error(errorMsg);
      }

      const fileUrl = data.content?.html_url || `https://github.com/${cleanRepo}/blob/${cleanBranch}/${cleanPath}`;
      setSuccessUrl(fileUrl);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#238636', '#2ea043', '#58a6ff', '#3fb950'],
      });

      showToast({
        type: 'success',
        title: 'Committed to GitHub!',
        description: `Successfully pushed ${cleanPath} to ${cleanRepo} (${cleanBranch})`,
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while communicating with GitHub.');
      showToast({
        type: 'error',
        title: 'Commit Failed',
        description: err.message || 'Failed to commit workflow to GitHub repository.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] cursor-pointer"
            onClick={onClose}
          />

          {/* Dialog Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: '-46%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-46%', x: '-50%' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl z-[1000] p-6 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#0d1117] border border-[#30363d]">
                  <GitHubIcon className="w-5 h-5 text-[#f0f6fc]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f0f6fc]">
                    Commit Workflow to GitHub
                  </h3>
                  <p className="text-[11px] text-[#94a3b8]">
                    Automatically push this YAML file directly to your GitHub repository
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success State Notification */}
            {successUrl ? (
              <div className="p-4 rounded-xl bg-[#238636]/15 border border-[#238636]/40 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-sm font-bold text-[#3fb950]">
                  <Check className="w-4 h-4" />
                  <span>Workflow Successfully Committed!</span>
                </div>
                <p className="text-xs text-[#c9d1d9]">
                  Your GitHub Actions workflow file has been pushed to the remote repository and will automatically trigger according to its event rules.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={successUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-[#f0f6fc] border border-[#30363d] transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Commit Form */
              <form onSubmit={handleCommit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-[#f85149]/15 border border-[#f85149]/40 text-xs text-[#ff7b72] flex items-start gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Target Repository */}
                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-[#58a6ff]" />
                      Repository Target (<code className="text-[#79c0ff]">owner/repo</code>)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    placeholder="e.g. NisalSandeep/my-awesome-project"
                    required
                    className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] placeholder-[#64748b] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/25 font-mono"
                  />
                </div>

                {/* Branch & File Path Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-[#a371f7]" />
                      Target Branch
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="main"
                      required
                      className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/25"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5 flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      File Path in Repo
                    </label>
                    <input
                      type="text"
                      value={filePath}
                      onChange={(e) => setFilePath(e.target.value)}
                      placeholder=".github/workflows/ci.yml"
                      required
                      className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/25"
                    />
                  </div>
                </div>

                {/* Commit Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    Commit Message
                  </label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="ci: add workflow via Pipeline Studio"
                    required
                    className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/25"
                  />
                </div>

                {/* GitHub Personal Access Token */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#f0f6fc] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#f0883e]" />
                      GitHub Personal Access Token (PAT)
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=GitHub%20Actions%20Pipeline%20Studio"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-0.5"
                    >
                      <span>Generate Token</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      required
                      className="w-full pl-3 pr-10 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/25"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#f0f6fc]"
                    >
                      {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#8b949e] mt-1">
                    Requires <code className="text-[#79c0ff]">repo</code> scope (or fine-grained with <code className="text-[#79c0ff]">Contents: Read & Write</code>).
                  </p>
                </div>

                {/* Remember Token Checkbox */}
                <div className="flex items-center gap-2 pt-1 select-none">
                  <input
                    type="checkbox"
                    id="rememberToken"
                    checked={rememberToken}
                    onChange={(e) => setRememberToken(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#0d1117] text-[#2f81f7] focus:ring-0"
                  />
                  <label htmlFor="rememberToken" className="text-xs text-[#8b949e] cursor-pointer">
                    Remember token and repository locally in this browser
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#30363d]">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-3.5 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-[#f0f6fc] border border-[#30363d] transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-xs font-semibold text-white shadow-lg shadow-green-950/40 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Committing to GitHub...</span>
                      </>
                    ) : (
                      <>
                        <GitHubIcon className="w-3.5 h-3.5 text-white" />
                        <span>Commit & Push Workflow</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(modalContent, document.body);
};
