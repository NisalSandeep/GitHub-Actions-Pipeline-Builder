'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { useToast } from '../../context/ToastContext';
import {
  GITHUB_ACTIONS_SUGGESTIONS,
  SuggestionItem,
  getSuggestionsForInput,
} from '../../utils/yamlValidator';
import { load, dump } from 'js-yaml';
import confetti from 'canvas-confetti';
import {
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Wand2,
  Maximize2,
  Minimize2,
  KeyRound,
  Layers,
  Cpu,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GitHubIcon } from '../icons/BrandIcons';
import { CommitToGitHubModal } from '../preview/CommitToGitHubModal';

interface ManualYamlEditorProps {
  embeddedInBuilder?: boolean;
}

export const ManualYamlEditor: React.FC<ManualYamlEditorProps> = ({
  embeddedInBuilder = false,
}) => {
  const {
    state,
    yaml: visualYaml,
    manualYaml,
    setManualYaml,
    isManualMode,
    setIsManualMode,
    activeYaml,
    validationResult,
    syncVisualToManual,
    importYamlToVisual,
  } = useWorkflow();

  const { showToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Textarea, snippet container, and cursor tracking
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const rafScrollRef = useRef<number | null>(null);

  const handleSnippetWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (snippetContainerRef.current && e.deltaY !== 0) {
      snippetContainerRef.current.scrollLeft += e.deltaY * 0.8;
    }
  };

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [suggestionActiveIdx, setSuggestionActiveIdx] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionCoords, setSuggestionCoords] = useState<{ top: number; left: number } | null>(null);

  // Initialize manualYaml with visualYaml if currently empty
  useEffect(() => {
    if (!manualYaml) {
      setManualYaml(visualYaml);
    }
  }, [manualYaml, visualYaml, setManualYaml]);

  // Synchronize scrolling between line numbers and textarea with requestAnimationFrame
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    rafScrollRef.current = requestAnimationFrame(() => {
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
    });
  };

  useEffect(() => {
    return () => {
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    };
  }, []);

  // Compute lines
  const lines = useMemo(() => {
    return (manualYaml || visualYaml).split('\n');
  }, [manualYaml, visualYaml]);

  // Error lines set
  const errorLineMap = useMemo(() => {
    const map = new Map<number, string>();
    validationResult.errors.forEach((err) => {
      map.set(err.line, err.message);
    });
    return map;
  }, [validationResult.errors]);

  // Warning lines set
  const warningLineMap = useMemo(() => {
    const map = new Map<number, string>();
    validationResult.warnings.forEach((warn) => {
      if (warn.line) map.set(warn.line, warn.message);
    });
    return map;
  }, [validationResult.warnings]);

  // Handle cursor movement to update Ln/Col and autocompletion
  const updateCursorAndSuggestions = useCallback(
    (val: string, selectionStart: number) => {
      const textBefore = val.slice(0, selectionStart);
      const linesBefore = textBefore.split('\n');
      const currentLineNum = linesBefore.length;
      const currentLineText = linesBefore[linesBefore.length - 1] || '';
      const currentColNum = currentLineText.length + 1;

      setCursorPos({ line: currentLineNum, col: currentColNum });

      // Detect current word
      const wordMatch = currentLineText.match(/([a-zA-Z0-9_$-]+)$/);
      const currentWord = wordMatch ? wordMatch[1] : '';

      if (currentWord.length >= 2) {
        const matches = getSuggestionsForInput(currentLineText, currentWord);
        if (matches.length > 0) {
          setSuggestions(matches);
          setSuggestionActiveIdx(0);
          setShowSuggestions(true);
          return;
        }
      }
      setShowSuggestions(false);
    },
    []
  );

  // Handle Textarea Change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setManualYaml(val);
    if (!isManualMode) {
      setIsManualMode(true);
    }
    updateCursorAndSuggestions(val, e.target.selectionStart);
  };

  // Insert snippet at current cursor position
  const insertSnippet = useCallback(
    (snippet: string) => {
      const ta = textareaRef.current;
      const currentText = manualYaml || visualYaml;
      if (!ta) {
        setManualYaml(currentText + '\n' + snippet);
        setIsManualMode(true);
        return;
      }

      const start = ta.selectionStart;
      const end = ta.selectionEnd;

      // Check current word to replace
      const textBefore = currentText.slice(0, start);
      const textAfter = currentText.slice(end);
      const linesBefore = textBefore.split('\n');
      const currentLine = linesBefore[linesBefore.length - 1] || '';
      const wordMatch = currentLine.match(/([a-zA-Z0-9_$-]+)$/);
      const wordLen = wordMatch ? wordMatch[1].length : 0;

      const adjustedBefore = currentText.slice(0, start - wordLen);
      const newText = adjustedBefore + snippet + textAfter;

      setManualYaml(newText);
      setIsManualMode(true);
      setShowSuggestions(false);

      setTimeout(() => {
        ta.focus();
        const newPos = adjustedBefore.length + snippet.length;
        ta.setSelectionRange(newPos, newPos);
      }, 0);
    },
    [manualYaml, visualYaml, setManualYaml, setIsManualMode]
  );

  // Keyboard Navigation: Tab (indent 2 spaces), Arrows for suggestions, Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionActiveIdx((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionActiveIdx((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = suggestions[suggestionActiveIdx];
        if (selected) {
          insertSnippet(selected.snippet);
        }
        return;
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        return;
      }
    }

    // Tab Key: Insert 2 spaces
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;

      const updated = val.substring(0, start) + '  ' + val.substring(end);
      setManualYaml(updated);
      setIsManualMode(true);

      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Jump to specific line in textarea
  const jumpToLine = (targetLine: number) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const allLines = ta.value.split('\n');
    let charCount = 0;
    for (let i = 0; i < Math.min(targetLine - 1, allLines.length); i++) {
      charCount += allLines[i].length + 1;
    }
    ta.focus();
    ta.setSelectionRange(charCount, charCount + (allLines[targetLine - 1]?.length || 0));

    // Scroll line into view
    const lineHeight = 21; // approximate px per line
    ta.scrollTop = Math.max(0, (targetLine - 5) * lineHeight);
  };

  // Sync manual YAML code back to Visual Architect
  const handleSyncToVisual = () => {
    const currentCode = manualYaml || visualYaml;
    const res = importYamlToVisual(currentCode);
    if (res.success) {
      setIsManualMode(false);
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#3fb950', '#58a6ff', '#a371f7'],
      });
      showToast({
        type: 'success',
        title: 'Synced to Visual Builder!',
        description: 'Updated pipeline steps, triggers, and runner settings from manual code.',
      });
    } else {
      showToast({
        type: 'error',
        title: 'Sync to Visual Failed',
        description: res.error || 'Syntax errors detected. Fix errors before syncing to visual.',
      });
    }
  };

  // Beautify / Format YAML
  const handleFormatYaml = () => {
    try {
      const currentCode = manualYaml || visualYaml;
      const parsed = load(currentCode);
      if (parsed && typeof parsed === 'object') {
        const reformatted = dump(parsed, {
          indent: 2,
          lineWidth: 120,
          noRefs: true,
        });
        setManualYaml(reformatted);
        setIsManualMode(true);
        showToast({
          type: 'success',
          title: 'YAML Formatted',
          description: 'Realigned indentation and structured syntax.',
        });
      } else {
        showToast({
          type: 'warning',
          title: 'Format Skipped',
          description: 'Could not parse document into a valid object.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Formatting Error',
        description: err?.message || 'Fix syntax errors before auto-formatting.',
      });
    }
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      const code = manualYaml || visualYaml;
      await navigator.clipboard.writeText(code);
      setCopied(true);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2ea043', '#58a6ff', '#a371f7'],
      });
      showToast({
        type: 'success',
        title: 'Manual Workflow YAML Copied!',
        description: 'Ready to paste into .github/workflows/main.yml',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // Download .yml file
  const handleDownload = () => {
    try {
      const code = manualYaml || visualYaml;
      const filename = state.global.filename.endsWith('.yml') || state.global.filename.endsWith('.yaml')
        ? state.global.filename
        : `${state.global.filename || 'workflow'}.yml`;

      const blob = new Blob([code], { type: 'text/yaml;charset=utf-8' });
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
        description: `Saved ${filename} to your downloads folder.`,
      });
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Fullscreen Backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 animate-fade-in cursor-pointer"
          onClick={() => setIsFullscreen(false)}
          title="Click outside or press Esc to exit fullscreen"
        />
      )}

      <div
        className={`flex flex-col rounded-2xl border transition-all ${
          isFullscreen
            ? 'fixed inset-4 md:inset-8 z-50 border-[#58a6ff]/50 ring-1 ring-[#58a6ff]/30 shadow-2xl bg-[#0d1117]/95 backdrop-blur-2xl h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]'
            : embeddedInBuilder
            ? 'border-white/[0.1] bg-[#0d1117]/85 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] min-h-[580px]'
            : 'border-white/[0.09] bg-[#0d1117]/80 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] h-[calc(100vh-13rem)] min-h-[520px]'
        }`}
      >
        {/* Top Header & Action Controls (Single-Row IDE Header, Strictly Non-Wrapping) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3.5 py-2 border-b border-white/[0.08] bg-[#161b22]/95 backdrop-blur-2xl shadow-md gap-2 shrink-0 min-h-[46px]">
          {/* File Tab & Mode Status Badge */}
          <div className="flex items-center gap-2 min-w-0 shrink">
            <div className="p-1.5 rounded-lg bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-[#58a6ff] shrink-0">
              <FileCode className="w-3.5 h-3.5" />
            </div>
            <span
              className="font-mono text-xs font-semibold text-[#f0f6fc] truncate max-w-[140px] sm:max-w-[200px] md:max-w-xs"
              title={`.github/workflows/${state.global.filename || 'main.yml'}`}
            >
              .github/workflows/{state.global.filename || 'main.yml'}
            </span>
            {isManualMode ? (
              <span className="px-2 py-0.5 rounded-full bg-[#f0883e]/20 text-[#ffa657] border border-[#f0883e]/40 text-[10px] font-semibold whitespace-nowrap shrink-0">
                Manual Mode
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 text-[10px] font-semibold whitespace-nowrap shrink-0">
                Visual Synced
              </span>
            )}
          </div>

          {/* Action Toolbar (Strictly single line, non-wrapping) */}
          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            {/* Sync to Visual Builder */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSyncToVisual}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#388bfd]/15 hover:bg-[#388bfd]/25 border border-[#388bfd]/30 text-[#79c0ff] hover:text-[#f0f6fc] text-xs font-semibold backdrop-blur-md transition-all whitespace-nowrap shrink-0"
              title="Parse this YAML and load into the Visual Architect"
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span className="whitespace-nowrap hidden sm:inline">To Visual</span>
              <span className="whitespace-nowrap sm:hidden">Visual</span>
            </motion.button>

            {/* Sync from Visual Builder */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                syncVisualToManual();
                setIsManualMode(false);
                showToast({
                  type: 'info',
                  title: 'Synced from Visual Builder',
                  description: 'Loaded latest visual pipeline configuration into code editor.',
                });
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#94a3b8] hover:text-[#f0f6fc] text-xs font-semibold backdrop-blur-md transition-all whitespace-nowrap shrink-0"
              title="Reset code to match Visual Builder configuration"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span className="whitespace-nowrap hidden sm:inline">Sync Visual</span>
              <span className="whitespace-nowrap sm:hidden">Sync</span>
            </motion.button>

            {/* Format YAML Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFormatYaml}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#94a3b8] hover:text-[#f0f6fc] text-xs font-semibold backdrop-blur-md transition-all whitespace-nowrap shrink-0"
              title="Clean and beautify YAML indentation"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#d29922]" />
              <span className="whitespace-nowrap">Format</span>
            </motion.button>

            {/* Copy Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all whitespace-nowrap shrink-0 ${
                copied
                  ? 'bg-[#238636] border-[#2ea043] text-white shadow-md shadow-green-950/30'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.09] text-[#f0f6fc]'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#58a6ff]" />}
              <span className="whitespace-nowrap">{copied ? 'Copied' : 'Copy'}</span>
            </motion.button>

            {/* Download Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] text-[#f0f6fc] text-xs font-semibold backdrop-blur-md transition-all whitespace-nowrap shrink-0"
              title="Download .yml file"
            >
              <Download className="w-3.5 h-3.5 text-[#3fb950]" />
              <span className="whitespace-nowrap">Download</span>
            </motion.button>

            {/* Commit to GitHub Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCommitModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] border border-white/10 text-white shadow-md shadow-green-950/40 backdrop-blur-md transition-all whitespace-nowrap shrink-0"
              title="Directly commit manual workflow to your GitHub repository"
            >
              <GitHubIcon className="w-3.5 h-3.5 text-white" />
              <span className="whitespace-nowrap">Commit</span>
            </motion.button>

            {/* Fullscreen Toggle */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#8b949e] hover:text-[#f0f6fc] backdrop-blur-md shrink-0"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-[#8b949e]" />}
            </motion.button>
          </div>
        </div>

        {/* Real-Time Validator & Quick Stats Strip (Row 2, ultra sleek & compact) */}
        <div className="px-3.5 py-1.5 bg-[#121620]/90 border-b border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {validationResult.isValid ? (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3fb950] bg-[#238636]/15 border border-[#238636]/35 px-2.5 py-0.5 rounded-lg shadow-sm shadow-green-950/20 whitespace-nowrap shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Valid GitHub Actions Workflow</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#ff7b72] bg-[#f85149]/15 border border-[#f85149]/40 px-2.5 py-0.5 rounded-lg shadow-sm shadow-red-950/20 truncate min-w-0">
                <XCircle className="w-3.5 h-3.5 text-[#ff7b72] shrink-0" />
                <span className="truncate">
                  Line {validationResult.errors[0]?.line || 1}: {validationResult.errors[0]?.message}
                </span>
                {validationResult.errors[0]?.line && (
                  <button
                    type="button"
                    onClick={() => jumpToLine(validationResult.errors[0].line)}
                    className="underline hover:text-white text-[10px] font-mono shrink-0 ml-1 text-[#ff7b72]"
                  >
                    [Jump]
                  </button>
                )}
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-medium text-[#d29922] bg-[#d29922]/15 border border-[#d29922]/30 px-2 py-0.5 rounded-lg shrink-0">
                <AlertTriangle className="w-3 h-3 text-[#d29922]" />
                <span className="whitespace-nowrap">{validationResult.warnings.length} Notices</span>
              </div>
            )}
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e] shrink-0">
            <span className="flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/[0.06] whitespace-nowrap">
              <Layers className="w-3 h-3 text-[#a371f7]" />
              <strong>{validationResult.stats.jobsCount}</strong>
              <span className="hidden sm:inline">Jobs</span>
            </span>
            <span className="flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/[0.06] whitespace-nowrap">
              <FileCode className="w-3 h-3 text-[#58a6ff]" />
              <strong>{validationResult.stats.stepsCount}</strong>
              <span className="hidden sm:inline">Steps</span>
            </span>
            {validationResult.stats.secrets.length > 0 && (
              <span className="hidden md:flex items-center gap-1 bg-[#388bfd]/15 text-[#79c0ff] px-2 py-0.5 rounded-lg border border-[#388bfd]/30 whitespace-nowrap">
                <KeyRound className="w-3 h-3 text-[#58a6ff]" />
                <strong>{validationResult.stats.secrets.length}</strong>
                <span className="hidden lg:inline">Secrets</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="flex items-center gap-1 text-[#8b949e] hover:text-[#f0f6fc] text-[11px] px-1.5 py-0.5 rounded-md hover:bg-white/[0.05] transition-colors ml-0.5"
            >
              <span>Details</span>
              {showDiagnostics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Quick Snippet Insert Chips Bar (Row 3, smooth horizontal scroll with NO scrollbar) */}
        <div
          ref={snippetContainerRef}
          onWheel={handleSnippetWheel}
          className="px-3.5 py-2 bg-[#161b22]/50 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar scroll-smooth"
        >
          <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-[#f0883e]" />
            Insert Snippet:
          </span>
          {[
            { label: '+ Checkout', snippet: '      - name: Checkout code\n        uses: actions/checkout@v4\n' },
            { label: '+ Setup Node', snippet: '      - name: Set up Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n' },
            { label: '+ Setup Python', snippet: '      - name: Set up Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: "3.11"\n          cache: pip\n' },
            { label: '+ Setup Go', snippet: '      - name: Set up Go\n        uses: actions/setup-go@v5\n        with:\n          go-version: "^1.22"\n' },
            { label: '+ Matrix Test', snippet: '    strategy:\n      matrix:\n        os: [ubuntu-latest, macos-latest]\n        node-version: [18, 20]\n' },
            { label: '+ Secret Ref', snippet: '${{ secrets.API_SECRET_KEY }}' },
            { label: '+ Cache Step', snippet: '      - name: Cache dependencies\n        uses: actions/cache@v4\n        with:\n          path: ~/.cache\n          key: ${{ runner.os }}-build-${{ hashFiles(\'**/*\') }}\n' },
            { label: '+ Docker Build', snippet: '      - name: Build Docker Image\n        uses: docker/build-push-action@v5\n        with:\n          push: false\n          tags: myapp:latest\n' },
            { label: '+ permissions', snippet: 'permissions:\n  contents: read\n' },
          ].map((chip) => (
            <motion.button
              key={chip.label}
              type="button"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => insertSnippet(chip.snippet)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#58a6ff]/40 text-[#c9d1d9] hover:text-[#58a6ff] border border-white/[0.08] text-[11px] font-mono whitespace-nowrap transition-all shadow-sm shrink-0 leading-none flex items-center"
            >
              {chip.label}
            </motion.button>
          ))}
        </div>

        {/* Code Editor Body with Synchronized Line Numbers & Error Gutter */}
        <div className="relative flex-1 flex overflow-hidden bg-[#0d1117]/80 min-h-[360px]">
          {/* Gutter Line Numbers with Error Badges */}
          <div
            ref={lineNumbersRef}
            className="select-none w-12 py-3 bg-[#121620]/60 border-r border-white/[0.08] overflow-hidden text-right font-mono text-[11px] text-[#484f58] shrink-0"
          >
            {lines.map((_, idx) => {
              const lineNum = idx + 1;
              const hasError = errorLineMap.has(lineNum);
              const hasWarning = warningLineMap.has(lineNum);

              return (
                <div
                  key={lineNum}
                  onClick={() => jumpToLine(lineNum)}
                  className={`h-[21px] leading-[21px] pr-2.5 flex items-center justify-end gap-1 cursor-pointer transition-colors ${
                    hasError
                      ? 'text-[#ff7b72] bg-[#f85149]/20 font-bold'
                      : hasWarning
                      ? 'text-[#d29922] bg-[#d29922]/15'
                      : 'hover:text-[#8b949e]'
                  }`}
                  title={
                    hasError
                      ? `Error on line ${lineNum}: ${errorLineMap.get(lineNum)}`
                      : hasWarning
                      ? `Notice: ${warningLineMap.get(lineNum)}`
                      : `Line ${lineNum}`
                  }
                >
                  {hasError && <span className="text-[10px] text-[#ff7b72] leading-none">✕</span>}
                  <span>{lineNum}</span>
                </div>
              );
            })}
          </div>

          {/* Interactive Code Textarea */}
          <div className="relative flex-1 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={manualYaml || visualYaml}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              onClick={(e) => {
                const ta = e.currentTarget;
                updateCursorAndSuggestions(ta.value, ta.selectionStart);
              }}
              onKeyUp={(e) => {
                const ta = e.currentTarget;
                updateCursorAndSuggestions(ta.value, ta.selectionStart);
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="w-full h-full p-3 bg-transparent text-[#f0f6fc] font-mono text-[12.5px] leading-[21px] resize-none focus:outline-none focus:ring-0 selection:bg-[#388bfd]/30 whitespace-pre overflow-auto"
              placeholder="# Enter your GitHub Actions workflow YAML here...
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4"
            />

            {/* Inline Autocomplete Suggestions Popover */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-4 right-4 max-w-sm w-80 rounded-2xl bg-[#161b22]/95 border border-[#388bfd]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-2 z-30"
                >
                  <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider border-b border-white/[0.08]">
                    <span>Suggestions (↑↓ to select, Tab/Enter to insert)</span>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="text-[#8b949e] hover:text-[#f0f6fc]"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="py-1 max-h-52 overflow-y-auto space-y-1">
                    {suggestions.map((item, idx) => {
                      const isSelected = idx === suggestionActiveIdx;
                      return (
                        <div
                          key={item.label}
                          onClick={() => insertSnippet(item.snippet)}
                          className={`p-2 rounded-xl text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#388bfd]/25 border border-[#388bfd]/50 text-[#f0f6fc]'
                              : 'hover:bg-white/[0.05] border border-transparent text-[#c9d1d9]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-semibold text-[#58a6ff]">
                              {item.label}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/[0.06] text-[#8b949e] uppercase font-bold">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8b949e] mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapsible Diagnostics & Structure Drawer */}
        <AnimatePresence>
          {showDiagnostics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="border-t border-white/[0.08] bg-[#121620]/95 backdrop-blur-xl px-4 py-3 overflow-hidden text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Errors & Warnings List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">
                    Syntax &amp; Schema Diagnostics
                  </div>
                  {validationResult.errors.length === 0 && validationResult.warnings.length === 0 ? (
                    <div className="p-2.5 rounded-xl bg-[#238636]/10 border border-[#238636]/30 text-[#3fb950] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Clean code! Zero syntax errors or schema warnings.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {validationResult.errors.map((err, i) => (
                        <div
                          key={`err-${i}`}
                          onClick={() => jumpToLine(err.line)}
                          className="p-2 rounded-xl bg-[#f85149]/10 border border-[#f85149]/30 text-[#ff7b72] flex items-start gap-2 cursor-pointer hover:bg-[#f85149]/20 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-bold">Line {err.line}:</span> {err.message}
                          </div>
                        </div>
                      ))}
                      {validationResult.warnings.map((warn, i) => (
                        <div
                          key={`warn-${i}`}
                          className="p-2 rounded-xl bg-[#d29922]/10 border border-[#d29922]/30 text-[#d29922] flex items-start gap-2"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            {warn.line && <span className="font-bold">Line {warn.line}: </span>}
                            {warn.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Extracted Topology & Secrets List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">
                    Detected Pipeline Topology
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#161b22]/70 border border-white/[0.08] space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e]">Triggers:</span>
                      <span className="font-mono text-[#f0f6fc]">
                        {validationResult.stats.triggers.join(', ') || 'none'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e]">Runner Environments:</span>
                      <span className="font-mono text-[#58a6ff]">
                        {validationResult.stats.runners.join(', ') || 'default'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b949e]">Detected Secrets:</span>
                      <span className="font-mono text-[#ffa657]">
                        {validationResult.stats.secrets.join(', ') || 'none'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Bottom Status Bar */}
        <div className="px-4 py-1.5 bg-[#161b22]/90 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#8b949e] shrink-0 font-mono">
          <div className="flex items-center gap-2.5">
            <span>
              Ln <strong className="text-[#f0f6fc]">{cursorPos.line}</strong>, Col{' '}
              <strong className="text-[#f0f6fc]">{cursorPos.col}</strong>
            </span>
            <span>•</span>
            <span>{lines.length} lines</span>
            <span className="hidden md:inline text-[#484f58]">•</span>
            <span className="hidden md:inline text-[#6e7681]">Tab/Enter to autocomplete</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span>Spaces: 2</span>
            <span>•</span>
            <span>UTF-8</span>
            <span>•</span>
            <span className="text-[#58a6ff]">GitHub Actions YAML</span>
          </div>
        </div>
      </div>

      {/* Commit to GitHub Modal */}
      <CommitToGitHubModal
        isOpen={commitModalOpen}
        onClose={() => setCommitModalOpen(false)}
        yaml={manualYaml || visualYaml}
        defaultFilename={state.global.filename}
      />
    </>
  );
};
