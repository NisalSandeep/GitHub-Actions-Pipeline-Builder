'use client';

import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { HardDrive, Zap, Info, ShieldCheck } from 'lucide-react';

export const CacheSection: React.FC = () => {
  const { state, updateCaching } = useWorkflow();

  const getLanguageCacheExplanation = () => {
    switch (state.language.type) {
      case 'node':
        return `Automatically configures official ${state.language.node.packageManager} lockfile caching via actions/setup-node@v4.`;
      case 'python':
        return `Automatically configures ${state.language.python.packageManager} package caching via actions/setup-python@v5.`;
      case 'go':
        return 'Enables built-in Go build and module cache via actions/setup-go@v5.';
      case 'java':
        return `Configures ${state.language.java.buildTool} dependency caching via actions/setup-java@v4.`;
      case 'rust':
        return 'Injects actions/cache@v4 targeting ~/.cargo/registry, ~/.cargo/git, and target/ directories.';
      default:
        return 'Enables custom directory caching across pipeline workflow runs.';
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Cache Switch */}
      <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#388bfd1a] border border-[#388bfd33]">
            <HardDrive className="w-5 h-5 text-[#58a6ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#f0f6fc]">Enable Dependency Caching</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                Speed Boost (Up to 5x)
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              Reuse downloaded package dependencies and compiler artifacts between pipeline runs.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={state.caching.enabled}
            onChange={(e) => updateCaching({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#238636]"></div>
        </label>
      </div>

      {state.caching.enabled && (
        <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-4 animate-fade-in">
          <div className="flex items-start gap-2 text-xs text-[#8b949e] bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
            <Zap className="w-4 h-4 text-[#f0883e] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#f0f6fc]">Auto-Optimized Strategy: </span>
              {getLanguageCacheExplanation()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                Cache Key Prefix
              </label>
              <input
                type="text"
                value={state.caching.cacheKeyPrefix}
                onChange={(e) => updateCaching({ cacheKeyPrefix: e.target.value })}
                placeholder="deps"
                className="w-full px-3 py-1.5 text-xs bg-[#161b22] border border-[#30363d] rounded-lg text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff]"
              />
              <span className="text-[10px] text-[#8b949e]">Prefix used for {'${{ runner.os }}'}-key hash</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                Custom Cache Paths (Optional)
              </label>
              <textarea
                value={state.caching.customPaths}
                onChange={(e) => updateCaching({ customPaths: e.target.value })}
                placeholder=".next/cache&#10;~/.cache/pip"
                rows={2}
                className="w-full px-3 py-1.5 text-xs bg-[#161b22] border border-[#30363d] rounded-lg text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff]"
              />
              <span className="text-[10px] text-[#8b949e]">One path per line (e.g. .next/cache)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
