'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { RunnerOS } from '../../types/workflow';
import {
  Layers,
  Sparkles,
  Check,
  Plus,
  X,
  Sliders,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import { UbuntuIcon, WindowsIcon, AppleIcon } from '../icons/BrandIcons';

export const MatrixBuilderSection: React.FC = () => {
  const { state, updateMatrix } = useWorkflow();
  const { matrix, language } = state;

  const [newVersionInput, setNewVersionInput] = useState('');

  const osOptions: { id: RunnerOS; label: string; icon: React.ReactNode }[] = [
    { id: 'ubuntu-latest', label: 'Ubuntu Linux', icon: <UbuntuIcon className="w-4 h-4" /> },
    { id: 'windows-latest', label: 'Windows Server', icon: <WindowsIcon className="w-4 h-4" /> },
    { id: 'macos-latest', label: 'macOS Sonoma', icon: <AppleIcon className="w-4 h-4" /> },
  ];

  const toggleOS = (os: RunnerOS) => {
    const current = matrix.os || ['ubuntu-latest'];
    let next: RunnerOS[];
    if (current.includes(os)) {
      if (current.length === 1) return; // Must have at least 1 OS
      next = current.filter((o) => o !== os);
    } else {
      next = [...current, os];
    }
    updateMatrix({ os: next });
  };

  const addVersion = (ver: string) => {
    const clean = ver.trim();
    if (!clean) return;
    const current = matrix.versions || [];
    if (!current.includes(clean)) {
      updateMatrix({ versions: [...current, clean] });
    }
    setNewVersionInput('');
  };

  const removeVersion = (ver: string) => {
    const current = matrix.versions || [];
    updateMatrix({ versions: current.filter((v) => v !== ver) });
  };

  // Quick version suggestions based on active language
  const suggestedVersions = React.useMemo(() => {
    switch (language.type) {
      case 'node':
        return ['18.x', '20.x', '22.x'];
      case 'python':
        return ['3.10', '3.11', '3.12'];
      case 'go':
        return ['1.21.x', '1.22.x'];
      case 'java':
        return ['17', '21'];
      case 'rust':
        return ['stable', 'beta', 'nightly'];
      case 'php':
        return ['8.1', '8.2', '8.3'];
      case 'dotnet':
        return ['7.0.x', '8.0.x'];
      case 'ruby':
        return ['3.1', '3.2', '3.3'];
      default:
        return ['1.0', '2.0'];
    }
  }, [language.type]);

  const totalCombinations =
    (matrix.os?.length || 1) * Math.max(1, matrix.versions?.length || 1);

  return (
    <div className="space-y-4 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl p-5 shadow-lg">
      {/* Section Header with Master Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#a371f7]/15 border border-[#a371f7]/30 text-[#a371f7] shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#f0f6fc]">Matrix Testing Strategy</h3>
              {matrix.enabled && (
                <span className="px-2 py-0.5 rounded-full bg-[#a371f7]/20 border border-[#a371f7]/40 text-[#d2a8ff] text-[10px] font-semibold">
                  {totalCombinations} Parallel Jobs
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#8b949e]">
              Test code across multiple Operating Systems and language runtimes simultaneously.
            </p>
          </div>
        </div>

        {/* Master Switch Toggle */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={matrix.enabled}
            onChange={(e) => {
              const enabled = e.target.checked;
              updateMatrix({
                enabled,
                os: matrix.os?.length ? matrix.os : ['ubuntu-latest', 'windows-latest'],
                versions: matrix.versions?.length ? matrix.versions : suggestedVersions.slice(0, 2),
              });
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a371f7]" />
        </label>
      </div>

      {matrix.enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 pt-2 border-t border-white/[0.08]"
        >
          {/* 1. Multi-OS Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#c9d1d9] flex items-center justify-between">
              <span>Target Operating Systems:</span>
              <span className="text-[10px] text-[#8b949e]">Select 1 or more runners</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {osOptions.map((opt) => {
                const isSelected = (matrix.os || []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleOS(opt.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#a371f7]/15 border-[#a371f7] text-[#f0f6fc] shadow-sm ring-1 ring-[#a371f7]/30'
                        : 'bg-[#0d1117]/60 hover:bg-[#0d1117] border-white/[0.08] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#a371f7]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Version Dimensions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#c9d1d9] flex items-center justify-between">
              <span>Runtime Versions ({language.type.toUpperCase()}):</span>
              <span className="text-[10px] text-[#8b949e]">Multiple versions will run in parallel</span>
            </label>

            {/* Quick Version Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-[#8b949e]">Suggested:</span>
              {suggestedVersions.map((v) => {
                const isAdded = (matrix.versions || []).includes(v);
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => (isAdded ? removeVersion(v) : addVersion(v))}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                      isAdded
                        ? 'bg-[#a371f7]/25 border border-[#a371f7]/60 text-[#d2a8ff]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    {isAdded ? `✓ ${v}` : `+ ${v}`}
                  </button>
                );
              })}
            </div>

            {/* Selected Version Badges */}
            <div className="flex items-center gap-1.5 flex-wrap p-2.5 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] min-h-[44px]">
              {(matrix.versions || []).map((v) => (
                <span
                  key={v}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#a371f7]/20 border border-[#a371f7]/40 text-xs font-mono text-[#f0f6fc]"
                >
                  <span>{v}</span>
                  <button
                    type="button"
                    onClick={() => removeVersion(v)}
                    className="text-[#8b949e] hover:text-[#f85149] p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Custom Version Input */}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newVersionInput}
                  onChange={(e) => setNewVersionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addVersion(newVersionInput);
                    }
                  }}
                  placeholder="Custom version..."
                  className="px-2 py-1 text-xs bg-transparent text-[#f0f6fc] placeholder-[#484f58] focus:outline-none w-28"
                />
                {newVersionInput.trim() && (
                  <button
                    type="button"
                    onClick={() => addVersion(newVersionInput)}
                    className="p-1 rounded-md bg-[#a371f7] text-white hover:bg-[#8957e5]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. Advanced Matrix Controls (Fail-Fast & Max-Parallel) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Fail-Fast Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d1117]/60 border border-white/[0.06]">
              <div>
                <div className="text-xs font-semibold text-[#f0f6fc]">fail-fast: false</div>
                <div className="text-[10px] text-[#8b949e]">
                  Allow all matrix jobs to run even if one fails
                </div>
              </div>
              <input
                type="checkbox"
                checked={!matrix.failFast}
                onChange={(e) => updateMatrix({ failFast: !e.target.checked })}
                className="w-4 h-4 rounded bg-white/[0.08] border-white/[0.1] text-[#a371f7] focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Max Parallel Slider */}
            <div className="p-3 rounded-xl bg-[#0d1117]/60 border border-white/[0.06] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#f0f6fc]">max-parallel:</span>
                <span className="font-mono text-[#a371f7] font-bold">
                  {matrix.maxParallel || 4} concurrent
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={16}
                value={matrix.maxParallel || 4}
                onChange={(e) => updateMatrix({ maxParallel: Number(e.target.value) })}
                className="w-full accent-[#a371f7] cursor-pointer"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
