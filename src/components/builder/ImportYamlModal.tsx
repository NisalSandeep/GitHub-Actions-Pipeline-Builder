'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { useToast } from '../../context/ToastContext';
import { parseYamlToWorkflow } from '../../utils/yamlParser';
import confetti from 'canvas-confetti';
import {
  FileUp,
  X,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Sparkles,
  Layers,
  ArrowRight,
  Code2,
  Terminal,
} from 'lucide-react';

interface ImportYamlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportYamlModal: React.FC<ImportYamlModalProps> = ({ isOpen, onClose }) => {
  const { importYamlToVisual } = useWorkflow();
  const { showToast } = useToast();

  const [rawYaml, setRawYaml] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Live preview parsing
  const parseResult = React.useMemo(() => {
    if (!rawYaml.trim()) return null;
    return parseYamlToWorkflow(rawYaml);
  }, [rawYaml]);

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawYaml(content);
      }
    };
    reader.readAsText(file);
  };

  // Execute Import
  const handleImport = () => {
    if (!rawYaml.trim()) return;

    const res = importYamlToVisual(rawYaml);
    if (res.success) {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#2ea043', '#58a6ff', '#a371f7'],
      });
      showToast({
        type: 'success',
        title: 'Workflow Imported to Visual Builder!',
        description: `Loaded "${res.summary?.workflowName || 'Workflow'}" with ${res.summary?.stepsCount || 0} steps.`,
      });
      onClose();
    } else {
      showToast({
        type: 'error',
        title: 'Import Failed',
        description: res.error || 'Invalid GitHub Actions YAML format.',
      });
    }
  };

  // Sample workflow snippets for quick testing
  const loadSample = (sampleType: 'node' | 'python') => {
    if (sampleType === 'node') {
      setRawYaml(`name: Node.js Enterprise CI/CD
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
env:
  NODE_ENV: production
  CI: true
jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Run Tests with Coverage
        run: npm test -- --coverage
`);
    } else {
      setRawYaml(`name: Python API Pipeline
on:
  push:
    branches: [ main ]
env:
  ENVIRONMENT: staging
jobs:
  build:
    name: Test and Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install Poetry
        run: pip install poetry
      - name: Run PyTest
        run: poetry run pytest --verbose
`);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative w-full max-w-2xl rounded-2xl bg-[#161b22]/95 border border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0d1117]/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#58a6ff]/15 border border-[#58a6ff]/30 text-[#58a6ff] shadow-sm">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f0f6fc]">Import Workflow YAML</h3>
                <p className="text-xs text-[#8b949e]">
                  Paste or upload any GitHub Actions YAML to automatically hydrate the Visual Builder.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#8b949e] hover:text-[#f0f6fc] hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                dragOver
                  ? 'border-[#58a6ff] bg-[#388bfd]/10'
                  : 'border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".yml,.yaml,text/yaml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#58a6ff]">
                <FileCode className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold text-[#f0f6fc]">
                Drop your <span className="text-[#58a6ff]">.github/workflows/*.yml</span> file here, or browse
              </div>
              <div className="text-[11px] text-[#8b949e]">
                Supports standard GitHub Actions workflows (CI, multi-job, matrix, deploy)
              </div>
            </div>

            {/* Quick Samples */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#8b949e]">Or paste YAML below, or try a sample:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadSample('node')}
                  className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-[#58a6ff] font-medium"
                >
                  Node.js Sample
                </button>
                <button
                  type="button"
                  onClick={() => loadSample('python')}
                  className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-[#3fb950] font-medium"
                >
                  Python Sample
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative rounded-xl border border-white/[0.08] bg-[#0d1117]/80 overflow-hidden">
              <textarea
                value={rawYaml}
                onChange={(e) => setRawYaml(e.target.value)}
                placeholder="# Paste your GitHub Actions workflow YAML here...
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4"
                rows={10}
                className="w-full p-3.5 bg-transparent font-mono text-xs leading-relaxed text-[#f0f6fc] placeholder-[#484f58] focus:outline-none resize-none selection:bg-[#388bfd]/30"
              />
            </div>

            {/* Live Parsing Feedback */}
            {parseResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                  parseResult.success
                    ? 'bg-[#238636]/10 border-[#2ea043]/40 text-[#3fb950]'
                    : 'bg-[#f85149]/10 border-[#f85149]/40 text-[#ff7b72]'
                }`}
              >
                {parseResult.success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-[#f0f6fc]">
                        Valid GitHub Actions Workflow Detected!
                      </div>
                      <div className="text-[11px] text-[#8b949e] flex flex-wrap items-center gap-2 font-mono">
                        <span>Workflow: <strong>{parseResult.summary?.workflowName}</strong></span>
                        <span>•</span>
                        <span>Triggers: <strong>{parseResult.summary?.triggersCount}</strong></span>
                        <span>•</span>
                        <span>Steps: <strong>{parseResult.summary?.stepsCount}</strong></span>
                        {parseResult.summary?.detectedLanguage !== 'none' && (
                          <>
                            <span>•</span>
                            <span className="uppercase text-[#58a6ff]">Language: {parseResult.summary?.detectedLanguage}</span>
                          </>
                        )}
                        {parseResult.summary?.hasMatrix && (
                          <>
                            <span>•</span>
                            <span className="text-[#a371f7]">Matrix Strategy</span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-[#ff7b72] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-[#f0f6fc]">Syntax / Parsing Error</div>
                      <p className="text-[11px] text-[#8b949e] mt-0.5">{parseResult.error}</p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#0d1117]/60">
            <button
              type="button"
              onClick={() => setRawYaml('')}
              className="text-xs text-[#8b949e] hover:text-[#f0f6fc]"
            >
              Clear
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94a3b8] hover:text-[#f0f6fc] hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImport}
                disabled={!parseResult?.success}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
                  parseResult?.success
                    ? 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-green-950/40 cursor-pointer'
                    : 'bg-white/[0.05] text-[#6e7681] border border-white/[0.06] cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Import to Visual Builder</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
