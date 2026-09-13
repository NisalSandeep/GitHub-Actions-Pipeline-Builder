'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
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
} from 'lucide-react';
import {
  NodeIcon,
  PythonIcon,
  GoIcon,
  RustIcon,
  VercelIcon,
  DockerIcon,
  AwsIcon,
} from './icons/BrandIcons';

export const Header: React.FC = () => {
  const { state, requiredSecrets, loadPreset, resetWorkflow } = useWorkflow();
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
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
      default:
        return <Sparkles className="w-5 h-5 text-[#f0883e] shrink-0" />;
    }
  };

  const handleReset = () => {
    if (confirm('Reset workflow configuration to default Node.js CI?')) {
      resetWorkflow();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#30363d] bg-[#161b22]/95 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#2f81f7] to-[#1f6feb] text-white shadow-lg shadow-blue-500/20">
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#238636] ring-2 ring-[#0d1117]">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#f0f6fc] tracking-tight">
                GitHub Actions Pipeline Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                v2.0
              </span>
            </div>
            <p className="text-xs text-[#8b949e] hidden sm:block">
              Visual workflow architect with multi-job deployment orchestration
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="hidden xl:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-[#8b949e]">
            <GitBranch className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>Triggers: <strong className="text-[#f0f6fc]">{triggersCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-[#8b949e]">
            <Layers className="w-3.5 h-3.5 text-[#a371f7]" />
            <span>Jobs: <strong className="text-[#f0f6fc]">{jobsCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-[#8b949e]">
            <FileCode2 className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>Steps: <strong className="text-[#f0f6fc]">{state.steps.length}</strong></span>
          </div>
          {requiredSecrets.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#388bfd1a] border border-[#388bfd4d] text-[#79c0ff]">
              <KeyRound className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>Secrets: <strong className="text-white">{requiredSecrets.length}</strong></span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] text-xs font-medium border border-[#30363d] transition-all hover:border-[#58a6ff]"
              title="Load standard production workflow templates"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f0883e]" />
              <span>Templates</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
            </button>

            {presetDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setPresetDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#1f242c] border border-[#30363d] shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider border-b border-[#30363d]/50">
                    Production Starter Templates
                  </div>
                  <div className="py-1 space-y-1 max-h-84 overflow-y-auto">
                    {WORKFLOW_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          loadPreset(preset.id);
                          setPresetDropdownOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#21262d] border border-transparent hover:border-[#30363d] transition-colors group flex items-start gap-2.5"
                      >
                        <div className="p-1 rounded bg-[#0d1117] border border-[#30363d] mt-0.5">
                          {getPresetIcon(preset.id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff]">
                              {preset.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#30363d] text-[#8b949e]">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8b949e] line-clamp-2 mt-0.5">
                            {preset.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              resetSuccess
                ? 'bg-[#238636] border-[#2ea043] text-white'
                : 'bg-[#21262d] hover:bg-[#b62324]/20 hover:border-[#f85149]/50 hover:text-[#f85149] text-[#8b949e] border-[#30363d]'
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
          </button>

          {/* Documentation Link */}
          <a
            href="https://docs.github.com/en/actions"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] text-xs font-medium border border-[#30363d] transition-all"
          >
            <span>Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
