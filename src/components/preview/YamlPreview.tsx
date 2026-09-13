'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { useToast } from '../../context/ToastContext';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  Download,
  WrapText,
  FileCode,
  Maximize2,
  Minimize2,
  Search,
  X,
} from 'lucide-react';
import { GitHubIcon } from '../icons/BrandIcons';
import { CommitToGitHubModal } from './CommitToGitHubModal';

export const YamlPreview: React.FC = () => {
  const { yaml, state } = useWorkflow();
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling while in fullscreen
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Compute highlighted code line by line
  const highlightedLines = useMemo(() => {
    if (!mounted) {
      return yaml.split('\n').map((l) => l || ' ');
    }
    try {
      const grammar = Prism.languages.yaml || Prism.languages.markup;
      const highlighted = Prism.highlight(yaml, grammar, 'yaml');
      return highlighted.split('\n');
    } catch (e) {
      return yaml.split('\n');
    }
  }, [yaml, mounted]);

  const rawLines = useMemo(() => yaml.split('\n'), [yaml]);

  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2ea043', '#58a6ff', '#a371f7'],
      });
      showToast({
        type: 'success',
        title: 'YAML Copied to Clipboard!',
        description: `Ready to paste into .github/workflows/${state.global.filename || 'main.yml'}`,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
      showToast({
        type: 'error',
        title: 'Failed to Copy',
        description: 'Please copy manually from the editor.',
      });
    }
  };

  const handleDownload = () => {
    try {
      const filename = state.global.filename.endsWith('.yml') || state.global.filename.endsWith('.yaml')
        ? state.global.filename
        : `${state.global.filename || 'workflow'}.yml`;

      const blob = new Blob([yaml], { type: 'text/yaml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      showToast({
        type: 'success',
        title: 'Workflow Downloaded!',
        description: `Saved ${filename} to your downloads.`,
      });
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to download', err);
      showToast({
        type: 'error',
        title: 'Download Failed',
        description: 'An error occurred while generating the file.',
      });
    }
  };

  return (
    <>
      {/* Backdrop overlay when in fullscreen mode */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 animate-fade-in cursor-pointer"
          onClick={() => setIsFullscreen(false)}
          title="Click outside to exit fullscreen (Esc)"
        />
      )}

      <div
        className={`flex flex-col rounded-2xl border overflow-hidden transition-all ${
          isFullscreen
            ? 'fixed inset-4 md:inset-8 z-50 border-[#58a6ff]/50 ring-1 ring-[#58a6ff]/30 shadow-2xl animate-fade-in max-h-none h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] bg-[#0d1117]/95 backdrop-blur-2xl'
            : 'border-white/[0.09] bg-[#0d1117]/80 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] h-[calc(100vh-13rem)] min-h-[500px]'
        }`}
      >
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#161b22]/70 backdrop-blur-xl gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileCode className="w-4 h-4 text-[#58a6ff] shrink-0" />
            <span className="font-mono text-xs font-semibold text-[#f0f6fc] truncate">
              .github/workflows/{state.global.filename || 'main.yml'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-[#8b949e] text-[10px] font-mono border border-white/[0.08] shrink-0">
              {rawLines.length} lines
            </span>
            {isFullscreen && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#388bfd]/15 text-[#79c0ff] border border-[#388bfd]/30">
                Fullscreen Mode • Press <kbd className="font-mono px-1 rounded bg-[#0d1117] text-[#c9d1d9]">Esc</kbd> to exit
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <div className="relative hidden sm:block">
              <Search className="w-3 h-3 text-[#6e7681] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter YAML..."
                className="pl-7 pr-6 py-1.5 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:bg-[#0d1117]/90 w-32 focus:w-48 transition-all backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#f0f6fc]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Wrap Toggle */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWrapLines(!wrapLines)}
              className={`p-2 rounded-xl border text-xs font-medium transition-all backdrop-blur-md ${
                wrapLines
                  ? 'bg-[#388bfd]/20 border-[#388bfd] text-[#58a6ff] shadow-sm'
                  : 'bg-white/[0.03] border-white/[0.08] text-[#8b949e] hover:text-[#f0f6fc] hover:bg-white/[0.06]'
              }`}
              title="Toggle word wrap"
            >
              <WrapText className="w-3.5 h-3.5" />
            </motion.button>

            {/* Fullscreen Toggle / Exit Esc Button */}
            {isFullscreen ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#b62324]/20 hover:border-[#f85149]/60 hover:text-[#f85149] border border-white/[0.09] text-xs font-semibold text-[#f0f6fc] transition-all shadow-sm group backdrop-blur-md"
                title="Exit Fullscreen (Esc)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
                <kbd className="text-[10px] px-1.5 py-0.2 rounded bg-[#0d1117] border border-white/[0.08] font-mono text-[#8b949e] group-hover:text-[#f85149]">
                  Esc
                </kbd>
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(true)}
                className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#8b949e] hover:text-[#f0f6fc] hover:border-[#58a6ff]/50 transition-all backdrop-blur-md"
                title="Expand Fullscreen (Esc to exit)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </motion.button>
            )}

            {/* Copy to Clipboard Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all duration-200 ${
                copied
                  ? 'bg-[#238636] border-[#2ea043] text-white shadow-lg shadow-green-500/20 ring-2 ring-[#2ea043]/30'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.09] hover:border-white/[0.2] text-[#f0f6fc] shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 animate-bounce" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>

            {/* Download YAML Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={handleDownload}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all duration-200 ${
                downloadSuccess
                  ? 'bg-[#238636] border-[#2ea043] text-white shadow-lg shadow-green-500/20 ring-2 ring-[#2ea043]/30'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.09] hover:border-white/[0.2] text-[#f0f6fc] shadow-sm'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 animate-bounce" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .yml</span>
                </>
              )}
            </motion.button>

            {/* Commit directly to GitHub Repository Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => setCommitModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] border border-white/10 text-white shadow-lg shadow-green-950/40 hover:shadow-green-500/20 backdrop-blur-md transition-all duration-200 group"
              title="Commit generated workflow directly to your GitHub repository"
            >
              <GitHubIcon className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              <span>Commit to GitHub</span>
            </motion.button>
        </div>
      </div>

      {/* Code Editor Body with Synchronized Line Numbers */}
      <div
        className="relative flex-1 overflow-auto bg-[#0d1117]/60 backdrop-blur-md py-3 text-[13px] font-mono leading-relaxed"
        suppressHydrationWarning
      >
        {highlightedLines.map((lineHtml, idx) => {
          const rawLine = rawLines[idx] || '';
          const isMatch = searchQuery && rawLine.toLowerCase().includes(searchQuery.toLowerCase());

          return (
            <div
              key={idx}
              className={`flex items-start px-2 transition-colors ${
                isMatch ? 'bg-[#f0883e]/20' : 'hover:bg-[#161b22]/80'
              }`}
            >
              {/* Line Number */}
              <span className="select-none w-10 text-right pr-3 text-[#484f58] font-mono text-[11px] pt-[2px] shrink-0 border-r border-[#21262d]/60 mr-3">
                {idx + 1}
              </span>

              {/* Line Code */}
              <span
                className={`flex-1 font-mono text-[12.5px] text-[#c9d1d9] ${
                  wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
                }`}
                dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
              />
            </div>
          );
        })}
      </div>
    </div>

    {/* Commit directly to GitHub Modal */}
    <CommitToGitHubModal
      isOpen={commitModalOpen}
      onClose={() => setCommitModalOpen(false)}
      yaml={yaml}
      defaultFilename={state.global.filename}
    />
    </>
  );
};
