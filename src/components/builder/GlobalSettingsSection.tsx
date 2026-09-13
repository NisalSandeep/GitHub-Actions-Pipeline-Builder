'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { RunnerOS } from '../../types/workflow';
import {
  Settings2,
  GitCommit,
  GitPullRequest,
  Clock,
  PlayCircle,
  Server,
  Shield,
  Layers,
  Plus,
  X,
  HelpCircle,
  FileUp,
  KeyRound,
  Braces,
} from 'lucide-react';
import { UbuntuIcon, WindowsIcon, AppleIcon } from '../icons/BrandIcons';
import { ImportYamlModal } from './ImportYamlModal';

interface RunnerOption {
  id: RunnerOS;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

const RUNNER_OPTIONS: RunnerOption[] = [
  { id: 'ubuntu-latest', name: 'Ubuntu Latest', desc: 'Linux x86_64 (Fastest & Most Popular)', icon: <UbuntuIcon className="w-5 h-5" /> },
  { id: 'windows-latest', name: 'Windows Latest', desc: 'Windows Server 2022', icon: <WindowsIcon className="w-5 h-5" /> },
  { id: 'macos-latest', name: 'macOS Latest', desc: 'Apple Silicon / macOS runner', icon: <AppleIcon className="w-5 h-5" /> },
  { id: 'self-hosted', name: 'Self-Hosted', desc: 'Custom private runner infrastructure', icon: <Server className="w-5 h-5 text-[#58a6ff]" /> },
];

const CRON_PRESETS = [
  { label: 'Daily at 00:00 UTC', cron: '0 0 * * *' },
  { label: 'Weekly (Sun 00:00)', cron: '0 0 * * 0' },
  { label: 'Every 6 Hours', cron: '0 */6 * * *' },
  { label: 'Weekdays at 09:00', cron: '0 9 * * 1-5' },
];

export const GlobalSettingsSection: React.FC = () => {
  const {
    state,
    updateGlobal,
    updateTriggerPush,
    updateTriggerPR,
    updateTriggerSchedule,
    updateTriggerDispatch,
    updateGlobalEnv,
  } = useWorkflow();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [newPushBranch, setNewPushBranch] = useState('');
  const [newPrBranch, setNewPrBranch] = useState('');

  const envVars = state.global.env || [];

  const addEnvVar = (key = '', value = '') => {
    updateGlobalEnv([...envVars, { key, value }]);
  };

  const updateEnvVar = (index: number, key: string, value: string) => {
    const updated = [...envVars];
    updated[index] = { key, value };
    updateGlobalEnv(updated);
  };

  const removeEnvVar = (index: number) => {
    updateGlobalEnv(envVars.filter((_, i) => i !== index));
  };

  const addPushBranch = () => {
    if (newPushBranch.trim() && !state.global.triggers.push.branches.includes(newPushBranch.trim())) {
      updateTriggerPush({
        branches: [...state.global.triggers.push.branches, newPushBranch.trim()],
      });
      setNewPushBranch('');
    }
  };

  const removePushBranch = (branch: string) => {
    updateTriggerPush({
      branches: state.global.triggers.push.branches.filter((b) => b !== branch),
    });
  };

  const addPrBranch = () => {
    if (newPrBranch.trim() && !state.global.triggers.pull_request.branches.includes(newPrBranch.trim())) {
      updateTriggerPR({
        branches: [...state.global.triggers.pull_request.branches, newPrBranch.trim()],
      });
      setNewPrBranch('');
    }
  };

  const removePrBranch = (branch: string) => {
    updateTriggerPR({
      branches: state.global.triggers.pull_request.branches.filter((b) => b !== branch),
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Import Workflow Banner */}
      <div className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#388bfd]/15 via-[#a371f7]/10 to-[#388bfd]/5 border border-[#58a6ff]/30 shadow-md gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#58a6ff]/20 text-[#58a6ff] shrink-0 shadow-sm">
            <FileUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#f0f6fc]">Import Existing Workflow YAML</div>
            <div className="text-[11px] text-[#8b949e]">
              Upload or paste your <code className="text-[#58a6ff]">.github/workflows/*.yml</code> to hydrate the visual builder.
            </div>
          </div>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setImportModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#58a6ff] hover:bg-[#1f6feb] text-white text-xs font-semibold whitespace-nowrap shadow-sm shadow-blue-950/40 transition-all shrink-0"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Import YAML</span>
        </motion.button>
      </div>

      {/* Workflow Identification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-[#58a6ff]" />
            Workflow Name
          </label>
          <input
            type="text"
            value={state.global.workflowName}
            onChange={(e) => updateGlobal({ workflowName: e.target.value })}
            placeholder="e.g. CI/CD Pipeline"
            className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:bg-[#0d1117]/90 transition-all backdrop-blur-md"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-[#a371f7]" />
            Workflow File Path
          </label>
          <div className="flex items-center text-xs text-[#8b949e] bg-[#0d1117]/60 border border-white/[0.09] rounded-xl px-3 py-2 backdrop-blur-md">
            <span className="text-[#6e7681]">.github/workflows/</span>
            <input
              type="text"
              value={state.global.filename}
              onChange={(e) => updateGlobal({ filename: e.target.value })}
              placeholder="main.yml"
              className="bg-transparent text-[#f0f6fc] focus:outline-none flex-1 ml-0.5 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Runner Environment (runs-on) */}
      <div>
        <label className="block text-xs font-semibold text-[#f0f6fc] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-[#3fb950]" />
            Default Runner Environment (<code className="text-[#79c0ff]">runs-on</code>)
          </span>
          <span className="text-[11px] text-[#8b949e]">GitHub-hosted runner VM</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {RUNNER_OPTIONS.map((runner) => {
            const isSelected = state.global.runsOn === runner.id;
            return (
              <motion.button
                key={runner.id}
                type="button"
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.15 }}
                onClick={() => updateGlobal({ runsOn: runner.id })}
                className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-colors ${
                  isSelected
                    ? 'bg-[#1f6feb]/20 border-[#58a6ff] ring-1 ring-[#58a6ff]/50 shadow-[0_0_20px_rgba(56,139,253,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl'
                    : 'bg-[#161b22]/60 border-white/[0.08] hover:border-[#58a6ff]/40 hover:bg-[#21262d]/70 backdrop-blur-xl shadow-sm'
                }`}
              >
                <div className="p-1.5 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] shrink-0 mt-0.5 shadow-inner">
                  {runner.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#f0f6fc]">{runner.name}</div>
                  <div className="text-[11px] text-[#8b949e] truncate">{runner.desc}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Trigger Events (on:) */}
      <div>
        <label className="block text-xs font-semibold text-[#f0f6fc] mb-2 flex items-center gap-1.5">
          <GitCommit className="w-3.5 h-3.5 text-[#f0883e]" />
          Trigger Events (<code className="text-[#79c0ff]">on:</code>)
        </label>

        <div className="space-y-3 bg-[#0d1117]/65 p-4 rounded-2xl border border-white/[0.08] backdrop-blur-xl shadow-inner">
          {/* Push Trigger */}
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.global.triggers.push.enabled}
                  onChange={(e) => updateTriggerPush({ enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-[#f0f6fc] flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-[#3fb950]" />
                  <span>On Push</span>
                </span>
              </div>
              <span className="text-[11px] text-[#8b949e]">Triggers on commit pushes</span>
            </label>

            {state.global.triggers.push.enabled && (
              <div className="ml-6 space-y-1.5 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {state.global.triggers.push.branches.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#21262d] border border-[#30363d] text-[11px] text-[#c9d1d9]"
                    >
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => removePushBranch(b)}
                        className="text-[#8b949e] hover:text-[#f85149]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={newPushBranch}
                      onChange={(e) => setNewPushBranch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addPushBranch();
                        }
                      }}
                      placeholder="Add branch (e.g. main)..."
                      className="px-2 py-0.5 text-xs bg-[#161b22] border border-[#30363d] rounded text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] w-36"
                    />
                    <button
                      type="button"
                      onClick={addPushBranch}
                      className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]"
                      title="Add branch"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#21262d]" />

          {/* Pull Request Trigger */}
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.global.triggers.pull_request.enabled}
                  onChange={(e) => updateTriggerPR({ enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-[#f0f6fc] flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>On Pull Request</span>
                </span>
              </div>
              <span className="text-[11px] text-[#8b949e]">Triggers on PR open/synchronize</span>
            </label>

            {state.global.triggers.pull_request.enabled && (
              <div className="ml-6 space-y-1.5 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {state.global.triggers.pull_request.branches.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#21262d] border border-[#30363d] text-[11px] text-[#c9d1d9]"
                    >
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => removePrBranch(b)}
                        className="text-[#8b949e] hover:text-[#f85149]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={newPrBranch}
                      onChange={(e) => setNewPrBranch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addPrBranch();
                        }
                      }}
                      placeholder="Target branch (e.g. main)..."
                      className="px-2 py-0.5 text-xs bg-[#161b22] border border-[#30363d] rounded text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] w-36"
                    />
                    <button
                      type="button"
                      onClick={addPrBranch}
                      className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]"
                      title="Add branch"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#21262d]" />

          {/* Schedule / Cron Trigger */}
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.global.triggers.schedule.enabled}
                  onChange={(e) => updateTriggerSchedule({ enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-[#f0f6fc] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d29922]" />
                  <span>Scheduled (Cron)</span>
                </span>
              </div>
              <span className="text-[11px] text-[#8b949e]">Periodic automated runs</span>
            </label>

            {state.global.triggers.schedule.enabled && (
              <div className="ml-6 space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={state.global.triggers.schedule.cron}
                    onChange={(e) => updateTriggerSchedule({ cron: e.target.value })}
                    placeholder="0 0 * * *"
                    className="font-mono text-xs px-2.5 py-1 bg-[#161b22] border border-[#30363d] rounded-md text-[#79c0ff] focus:outline-none focus:border-[#58a6ff] w-36"
                  />
                  <span className="text-[11px] text-[#8b949e]">5-part POSIX cron syntax (UTC)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CRON_PRESETS.map((cp) => (
                    <button
                      key={cp.cron}
                      type="button"
                      onClick={() => updateTriggerSchedule({ cron: cp.cron })}
                      className="px-2 py-0.5 text-[10px] rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d] transition-colors"
                    >
                      {cp.label} ({cp.cron})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#21262d]" />

          {/* Workflow Dispatch Trigger */}
          <div>
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.global.triggers.workflow_dispatch.enabled}
                  onChange={(e) => updateTriggerDispatch(e.target.checked)}
                  className="w-4 h-4 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-[#f0f6fc] flex items-center gap-1.5">
                  <PlayCircle className="w-3.5 h-3.5 text-[#a371f7]" />
                  <span>Manual Trigger (<code className="text-[#79c0ff]">workflow_dispatch</code>)</span>
                </span>
              </div>
              <span className="text-[11px] text-[#8b949e]">Run manually from GitHub UI</span>
            </label>
          </div>
        </div>
      </div>

      {/* Concurrency & Permissions Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Concurrency Card */}
        <div className="p-4 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#f0f6fc] flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={state.global.concurrency.enabled}
                onChange={(e) =>
                  updateGlobal({
                    concurrency: { ...state.global.concurrency, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7] focus:ring-0 cursor-pointer"
              />
              <Layers className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>Concurrency Control</span>
            </label>
          </div>
          <AnimatePresence initial={false}>
            {state.global.concurrency.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2.5 text-xs pt-1.5 overflow-hidden"
              >
                <div>
                  <span className="text-[11px] text-[#8b949e] block mb-1">Group Key:</span>
                  <input
                    type="text"
                    value={state.global.concurrency.group}
                    onChange={(e) =>
                      updateGlobal({
                        concurrency: { ...state.global.concurrency, group: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[11px] font-mono text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] backdrop-blur-md"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={state.global.concurrency.cancelInProgress}
                    onChange={(e) =>
                      updateGlobal({
                        concurrency: {
                          ...state.global.concurrency,
                          cancelInProgress: e.target.checked,
                        },
                      })
                    }
                    className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7]"
                  />
                  <span className="text-[11px] text-[#94a3b8]">Cancel in-progress runs on new commit</span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Permissions Card */}
        <div className="p-4 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#f0f6fc] flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={state.global.permissions.enabled}
                onChange={(e) =>
                  updateGlobal({
                    permissions: { ...state.global.permissions, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7] focus:ring-0 cursor-pointer"
              />
              <Shield className="w-3.5 h-3.5 text-[#3fb950]" />
              <span>Explicit GITHUB_TOKEN Permissions</span>
            </label>
          </div>
          <AnimatePresence initial={false}>
            {state.global.permissions.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-2.5 text-xs pt-1.5 overflow-hidden"
              >
                <div>
                  <span className="text-[11px] text-[#8b949e] block mb-1">contents:</span>
                  <select
                    value={state.global.permissions.contents}
                    onChange={(e) =>
                      updateGlobal({
                        permissions: {
                          ...state.global.permissions,
                          contents: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[11px] text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] backdrop-blur-md"
                  >
                    <option value="read">read</option>
                    <option value="write">write</option>
                    <option value="none">none</option>
                  </select>
                </div>
                <div>
                  <span className="text-[11px] text-[#8b949e] block mb-1">pull-requests:</span>
                  <select
                    value={state.global.permissions.pullRequests}
                    onChange={(e) =>
                      updateGlobal({
                        permissions: {
                          ...state.global.permissions,
                          pullRequests: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[11px] text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] backdrop-blur-md"
                  >
                    <option value="none">none</option>
                    <option value="read">read</option>
                    <option value="write">write</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Workflow Environment Variables (env:) Card */}
      <div className="p-4 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Braces className="w-4 h-4 text-[#58a6ff]" />
            <div>
              <h4 className="text-xs font-bold text-[#f0f6fc]">Workflow-Level Environment Variables (env:)</h4>
              <p className="text-[11px] text-[#8b949e]">Accessible to all jobs, steps, and scripts in this pipeline.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => addEnvVar('', '')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-[#f0f6fc] transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>Add Variable</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-[#8b949e]">Quick Presets:</span>
          {[
            { key: 'NODE_ENV', value: 'production' },
            { key: 'CI', value: 'true' },
            { key: 'ENVIRONMENT', value: 'staging' },
          ].map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => {
                if (!envVars.some((e) => e.key === preset.key)) {
                  addEnvVar(preset.key, preset.value);
                }
              }}
              className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-[10px] font-mono text-[#8b949e] hover:text-[#58a6ff]"
            >
              + {preset.key}: {preset.value}
            </button>
          ))}
        </div>

        {/* Variables List */}
        {envVars.length > 0 ? (
          <div className="space-y-2 pt-1">
            {envVars.map((env, idx) => (
              <div key={`env-${idx}`} className="flex items-center gap-2">
                <input
                  type="text"
                  value={env.key}
                  onChange={(e) => updateEnvVar(idx, e.target.value, env.value)}
                  placeholder="KEY (e.g. API_URL)"
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#0d1117]/80 border border-white/[0.08] rounded-xl text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]"
                />
                <span className="text-[#6e7681] text-xs font-mono">=</span>
                <input
                  type="text"
                  value={env.value}
                  onChange={(e) => updateEnvVar(idx, env.key, e.target.value)}
                  placeholder="VALUE (or ${{ secrets.KEY }})"
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#0d1117]/80 border border-white/[0.08] rounded-xl text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]"
                />
                <button
                  type="button"
                  onClick={() => removeEnvVar(idx)}
                  className="p-1.5 rounded-lg text-[#8b949e] hover:text-[#ff7b72] hover:bg-white/[0.06] transition-colors"
                  title="Remove variable"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-[#6e7681] italic py-1">
            No global environment variables set. Click "Add Variable" or select a preset above.
          </div>
        )}
      </div>

      {/* Import YAML Modal */}
      <ImportYamlModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} />
    </div>
  );
};
