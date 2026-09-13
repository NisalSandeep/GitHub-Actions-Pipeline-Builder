'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../context/WorkflowContext';
import { useToast } from '../context/ToastContext';
import { WORKFLOW_PRESETS } from '../utils/presets';
import {
  Sparkles,
  RotateCcw,
  GitBranch,
  Layers,
  KeyRound,
  FileCode2,
  ChevronDown,
  ExternalLink,
  Check,
  Upload,
} from 'lucide-react';
import { ImportYamlModal } from './builder/ImportYamlModal';
import {
  NodeIcon,
  PythonIcon,
  GoIcon,
  RustIcon,
  PhpIcon,
  DotnetIcon,
  RubyIcon,
  FlutterIcon,
  VercelIcon,
  DockerIcon,
  AwsIcon,
  GitHubIcon,
} from './icons/BrandIcons';

export const Header: React.FC = () => {
  const { state, requiredSecrets, loadPreset, resetWorkflow } = useWorkflow();
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Close preset dropdown on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPresetDropdownOpen(false);
    };
    if (presetDropdownOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presetDropdownOpen]);

  const triggersCount = [
    state.global.triggers.push.enabled,
    state.global.triggers.pull_request.enabled,
    state.global.triggers.schedule.enabled,
    state.global.triggers.workflow_dispatch.enabled,
  ].filter(Boolean).length;

  const isMultiJob = state.deployment.enabled && state.deployment.target !== 'none';
  const jobsCount = isMultiJob ? 2 : 1;

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'node-docker':
        return <DockerIcon className="w-5 h-5 shrink-0" />;
      case 'python-aws':
        return <AwsIcon className="w-5 h-5 shrink-0" />;
      case 'nextjs-vercel':
        return <VercelIcon className="w-5 h-5 shrink-0" />;
      case 'go-ci':
        return <GoIcon className="w-5 h-5 shrink-0" />;
      case 'rust-ci':
        return <RustIcon className="w-5 h-5 shrink-0" />;
      case 'php-laravel':
        return <PhpIcon className="w-5 h-5 shrink-0" />;
      case 'dotnet-ci':
        return <DotnetIcon className="w-5 h-5 shrink-0" />;
      case 'ruby-rails':
        return <RubyIcon className="w-5 h-5 shrink-0" />;
      case 'flutter-ci':
        return <FlutterIcon className="w-5 h-5 shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#f0883e] shrink-0" />;
    }
  };

  const { showToast } = useToast();

  const handleReset = () => {
    if (confirm('Reset workflow configuration to default Node.js CI?')) {
      resetWorkflow();
      setResetSuccess(true);
      showToast({
        type: 'info',
        title: 'Workflow Reset',
        description: 'Restored the default Node.js CI pipeline template.',
      });
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0d1117]/75 backdrop-blur-2xl px-4 lg:px-8 py-3 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.4),inset_0_-1px_0_rgba(255,255,255,0.03)]">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-b from-[#21262d] to-[#161b22] border border-white/[0.15] shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] p-2 group hover:scale-105 transition-transform">
            <GitHubIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#238636] ring-2 ring-[#0d1117]">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#f0f6fc] tracking-tight">
                GitHub Actions Pipeline Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 shadow-sm shadow-green-950/30">
                v2.0
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] hidden sm:block">
              Visual workflow architect with multi-job deployment orchestration
            </p>
          </div>
        </div>

        {/* Quick Stats Badges with Frosted Glass Pills */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] backdrop-blur-md text-[#94a3b8] shadow-sm transition-all">
            <GitBranch className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>Triggers: <strong className="text-[#f0f6fc]">{triggersCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] backdrop-blur-md text-[#94a3b8] shadow-sm transition-all">
            <Layers className="w-3.5 h-3.5 text-[#a371f7]" />
            <span>Jobs: <strong className="text-[#f0f6fc]">{jobsCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] backdrop-blur-md text-[#94a3b8] shadow-sm transition-all">
            <FileCode2 className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>Steps: <strong className="text-[#f0f6fc]">{state.steps.length}</strong></span>
          </div>
          {requiredSecrets.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#388bfd]/15 border border-[#388bfd]/40 text-[#79c0ff] backdrop-blur-md shadow-sm">
              <KeyRound className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>Secrets: <strong className="text-white">{requiredSecrets.length}</strong></span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Import YAML Button */}
          <motion.button
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 text-[#58a6ff] text-xs font-semibold border border-[#58a6ff]/30 hover:border-[#58a6ff]/60 backdrop-blur-md shadow-sm transition-all"
            title="Import an existing GitHub Actions YAML workflow into the visual builder"
          >
            <Upload className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="hidden sm:inline">Import YAML</span>
            <span className="sm:hidden">Import</span>
          </motion.button>

          {/* Preset Selector Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f0f6fc] text-xs font-semibold border border-white/[0.09] hover:border-[#58a6ff]/50 backdrop-blur-md shadow-sm transition-all"
              title="Load standard production workflow templates"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f0883e]" />
              <span>Templates</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8b949e] transition-transform duration-200 ${presetDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {presetDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setPresetDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#161b22]/90 border border-white/[0.12] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] p-2 z-50"
                  >
                    <div className="px-3 py-2 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider border-b border-white/[0.08]">
                      Production Starter Templates
                    </div>
                    <div className="py-1 space-y-1 max-h-84 overflow-y-auto">
                      {WORKFLOW_PRESETS.map((preset) => (
                        <motion.button
                          key={preset.id}
                          whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.06)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            loadPreset(preset.id);
                            setPresetDropdownOpen(false);
                            showToast({
                              type: 'info',
                              title: `Loaded Template: ${preset.name}`,
                              description: preset.description,
                            });
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-transparent hover:border-white/[0.08] transition-all group flex items-start gap-3"
                        >
                          <div className="p-1.5 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] shadow-inner mt-0.5 shrink-0 flex items-center justify-center">
                            {getPresetIcon(preset.id)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                                {preset.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/[0.06] text-[#8b949e] border border-white/[0.06] font-medium">
                                {preset.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8b949e] line-clamp-2 mt-0.5 leading-relaxed">
                              {preset.description}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              resetSuccess
                ? 'bg-[#238636] border-[#2ea043] text-white shadow-md'
                : 'bg-white/[0.04] hover:bg-red-500/10 hover:border-red-500/40 hover:text-[#ff7b72] text-[#94a3b8] border-white/[0.08] backdrop-blur-md'
            }`}
            title="Reset workflow to default Node.js CI"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" />
                <span>Reset!</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </>
            )}
          </motion.button>

          {/* Documentation Link */}
          <motion.a
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.96 }}
            href="https://docs.github.com/en/actions"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94a3b8] hover:text-[#f0f6fc] text-xs font-semibold border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-md shadow-sm transition-all"
          >
            <span>Docs</span>
            <ExternalLink className="w-3 h-3" />
          </motion.a>
        </div>
      </div>

      {/* Import YAML Modal */}
      <ImportYamlModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
    </header>
  );
};
