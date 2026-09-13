'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { useToast } from '../../context/ToastContext';
import { STEP_TEMPLATES } from '../../utils/presets';
import { StepConfig } from '../../types/workflow';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Terminal,
  Layers,
  Sparkles,
  Key,
  Sliders,
  Check,
  X,
  Store,
  ChevronsUpDown,
} from 'lucide-react';
import { MarketplaceModal } from './MarketplaceModal';
import {
  SlackIcon,
  DockerIcon,
  GitHubIcon,
  BeakerIcon,
  TerminalBashIcon,
  CodecovIcon,
  TrivyIcon,
} from '../icons/BrandIcons';

export const StepsBuilderSection: React.FC = () => {
  const {
    state,
    addStep,
    updateStep,
    removeStep,
    duplicateStep,
    moveStep,
    reorderSteps,
  } = useWorkflow();

  const { showToast } = useToast();
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [marketplaceModalOpen, setMarketplaceModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allCollapsed = state.steps.every((s) => expandedSteps[s.id] === false);

  const toggleCollapseAll = () => {
    const next: Record<string, boolean> = {};
    const targetState = allCollapsed; // if all collapsed, expand all (true); else collapse all (false)
    state.steps.forEach((s) => {
      next[s.id] = targetState;
    });
    setExpandedSteps(next);
  };

  const getStepIcon = (step: { name?: string; uses?: string; run?: string }) => {
    const str = `${step.name || ''} ${step.uses || ''} ${step.run || ''}`.toLowerCase();
    if (str.includes('slack')) return <SlackIcon className="w-4 h-4 shrink-0" />;
    if (str.includes('docker')) return <DockerIcon className="w-4 h-4 shrink-0" />;
    if (str.includes('codecov')) return <CodecovIcon className="w-4 h-4 shrink-0" />;
    if (str.includes('trivy') || str.includes('security')) return <TrivyIcon className="w-4 h-4 shrink-0" />;
    if (str.includes('artifact') || str.includes('checkout') || str.includes('actions/')) {
      return <GitHubIcon className="w-4 h-4 shrink-0 text-[#f0f6fc]" />;
    }
    if (str.includes('test') || str.includes('jest') || str.includes('pytest') || str.includes('coverage')) {
      return <BeakerIcon className="w-4 h-4 shrink-0" />;
    }
    return <TerminalBashIcon className="w-4 h-4 shrink-0" />;
  };

  // Close template modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && templateModalOpen) {
        setTemplateModalOpen(false);
      }
    };
    if (templateModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [templateModalOpen]);

  const toggleExpand = (id: string) => {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderSteps(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const addEnvVar = (stepId: string) => {
    const step = state.steps.find((s) => s.id === stepId);
    if (!step) return;
    const newEnv = [...step.env, { key: '', value: '' }];
    updateStep(stepId, { env: newEnv });
  };

  const updateEnvVar = (stepId: string, envIndex: number, field: 'key' | 'value', value: string) => {
    const step = state.steps.find((s) => s.id === stepId);
    if (!step) return;
    const newEnv = [...step.env];
    newEnv[envIndex] = { ...newEnv[envIndex], [field]: value };
    updateStep(stepId, { env: newEnv });
  };

  const removeEnvVar = (stepId: string, envIndex: number) => {
    const step = state.steps.find((s) => s.id === stepId);
    if (!step) return;
    const newEnv = step.env.filter((_, i) => i !== envIndex);
    updateStep(stepId, { env: newEnv });
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs font-semibold text-[#f0f6fc] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#3fb950]" />
              Pipeline Steps Sequence ({state.steps.length})
            </span>
            <p className="text-[11px] text-[#8b949e]">
              Executed sequentially. Drag handle or click arrows to reorder.
            </p>
          </div>

          {state.steps.length > 1 && (
            <button
              type="button"
              onClick={toggleCollapseAll}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#8b949e] hover:text-[#58a6ff] bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all ml-auto sm:ml-0"
              title={allCollapsed ? 'Expand all steps' : 'Collapse all steps'}
            >
              <ChevronsUpDown className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>{allCollapsed ? 'Expand All' : 'Collapse All'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Marketplace & Notifications Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => setMarketplaceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 hover:border-[#58a6ff]/60 backdrop-blur-md shadow-sm transition-all"
          >
            <Store className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>Marketplace</span>
          </motion.button>

          {/* Templates Library Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => setTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#ffa657] border border-white/[0.08] hover:border-[#f0883e]/50 backdrop-blur-md shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset Library</span>
          </motion.button>

          {/* Add Custom Step Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => {
              addStep();
              showToast({
                type: 'info',
                title: 'Custom Step Added',
                description: 'New blank step appended to the workflow',
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg shadow-green-950/40 backdrop-blur-md transition-all ring-1 ring-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </motion.button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {state.steps.map((step, index) => {
            const isExpanded = expandedSteps[step.id] !== false; // default open
            const isDragging = draggedIndex === index;
            const isDropTarget = draggedIndex !== null && dragOverIndex === index && draggedIndex !== index;

            return (
              <React.Fragment key={step.id}>
                {isDropTarget && dragOverIndex <= index && (
                  <div className="h-1 bg-[#58a6ff] rounded-full shadow-[0_0_12px_#388bfd] my-1 animate-pulse transition-all" />
                )}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`rounded-2xl border transition-all backdrop-blur-xl ${
                    isDragging
                      ? 'opacity-40 border-dashed border-[#58a6ff] scale-[0.99]'
                      : 'bg-[#161b22]/60 border-white/[0.08] hover:border-[#58a6ff]/40 hover:bg-[#161b22]/80 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                  }`}
                >
                  {/* Step Card Header */}
                  <div className="flex items-center justify-between p-3 gap-2 select-none">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* Drag Handle */}
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        className="cursor-grab active:cursor-grabbing text-[#6e7681] hover:text-[#58a6ff] p-1 rounded hover:bg-[#21262d] transition-colors"
                        title="Drag handle to reorder this step"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                    {/* Step Index Badge & Icon */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#21262d] text-[10px] font-mono font-bold text-[#8b949e]">
                        {index + 1}
                      </span>
                      <div className="p-1.5 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] shadow-inner flex items-center justify-center">
                        {getStepIcon(step)}
                      </div>
                    </div>

                    {/* Step Name (inline editable or title) */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(step.id)}
                      className="flex items-center gap-1.5 text-left flex-1 min-w-0 font-medium text-xs text-[#f0f6fc] hover:text-[#58a6ff]"
                    >
                      <span className="truncate">{step.name || 'Unnamed Step'}</span>
                      {step.uses && (
                        <span className="px-1.5 py-0.2 rounded bg-[#388bfd1a] text-[#58a6ff] text-[10px] font-mono truncate hidden sm:inline">
                          {step.uses.split('@')[0]}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Step Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === state.steps.length - 1}
                      className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        duplicateStep(step.id);
                        showToast({
                          type: 'info',
                          title: 'Step Duplicated',
                          description: `Created clone of "${step.name || 'Step'}"`,
                        });
                      }}
                      className="p-1 rounded text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d]"
                      title="Duplicate step"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeStep(step.id);
                        showToast({
                          type: 'warning',
                          title: 'Step Removed',
                          description: `Deleted "${step.name || 'Step'}" from pipeline`,
                        });
                      }}
                      className="p-1 rounded text-[#8b949e] hover:text-[#f85149] hover:bg-[#21262d]"
                      title="Delete step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(step.id)}
                      className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Step Expanded Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-white/[0.08] space-y-3 mt-1">
                        {/* Step Name Input */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#8b949e] mb-1.5">
                            Step Name
                          </label>
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => updateStep(step.id, { name: e.target.value })}
                            placeholder="e.g. Run Unit Tests"
                            className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 backdrop-blur-md transition-all"
                          />
                        </div>

                        {/* Mode: Run Command or Uses Action */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-semibold text-[#8b949e]">
                              {step.uses ? 'Action to Use (uses:)' : 'Shell Command (run:)'}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                if (step.uses) {
                                  updateStep(step.id, { uses: undefined, run: 'npm test' });
                                } else {
                                  updateStep(step.id, { uses: 'actions/upload-artifact@v4', run: undefined });
                                }
                              }}
                              className="text-[10px] text-[#58a6ff] hover:underline"
                            >
                              Switch to {step.uses ? 'Run Command' : 'uses: Action'}
                            </button>
                          </div>

                          {step.uses ? (
                            <input
                              type="text"
                              value={step.uses}
                              onChange={(e) => updateStep(step.id, { uses: e.target.value })}
                              placeholder="e.g. actions/upload-artifact@v4"
                              className="w-full px-3 py-2 text-xs font-mono bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#79c0ff] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 backdrop-blur-md transition-all"
                            />
                          ) : (
                            <textarea
                              value={step.run || ''}
                              onChange={(e) => updateStep(step.id, { run: e.target.value })}
                              placeholder="npm run test&#10;npm run build"
                              rows={3}
                              className="w-full px-3 py-2 text-xs font-mono bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 backdrop-blur-md transition-all"
                            />
                          )}
                        </div>

                        {/* Environment Variables Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-semibold text-[#8b949e] flex items-center gap-1.5">
                              <Key className="w-3.5 h-3.5 text-[#f0883e]" />
                              Environment Variables (env:)
                            </label>
                            <button
                              type="button"
                              onClick={() => addEnvVar(step.id)}
                              className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-0.5"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              Add Env Var
                            </button>
                          </div>

                          {step.env.length > 0 && (
                            <div className="space-y-2 bg-[#0d1117]/50 p-2.5 rounded-xl border border-white/[0.08] backdrop-blur-md">
                              {step.env.map((env, envIdx) => (
                                <div key={envIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={env.key}
                                    onChange={(e) =>
                                      updateEnvVar(step.id, envIdx, 'key', e.target.value)
                                    }
                                    placeholder="KEY"
                                    className="w-1/3 px-2.5 py-1.5 text-xs font-mono bg-[#161b22]/70 border border-white/[0.08] rounded-lg text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                                  />
                                  <span className="text-[#6e7681] text-xs">:</span>
                                  <input
                                    type="text"
                                    value={env.value}
                                    onChange={(e) =>
                                      updateEnvVar(step.id, envIdx, 'value', e.target.value)
                                    }
                                    placeholder="value or ${{ secrets.TOKEN }}"
                                    className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-[#161b22]/70 border border-white/[0.08] rounded-lg text-[#79c0ff] focus:outline-none focus:border-[#58a6ff]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeEnvVar(step.id, envIdx)}
                                    className="text-[#8b949e] hover:text-[#f85149] p-1 rounded hover:bg-white/[0.05] transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Advanced Options (Conditional if:, Working Directory) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-[10px] text-[#8b949e] block mb-1">
                              Conditional (if:)
                            </span>
                            <input
                              type="text"
                              value={step.ifCondition || ''}
                              onChange={(e) => updateStep(step.id, { ifCondition: e.target.value })}
                              placeholder="e.g. success() && github.ref == 'refs/heads/main'"
                              className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-[#0d1117]/60 border border-white/[0.08] rounded-lg text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-[#8b949e] block mb-1">
                              Working Directory
                            </span>
                            <input
                              type="text"
                              value={step.workingDirectory || ''}
                              onChange={(e) => updateStep(step.id, { workingDirectory: e.target.value })}
                              placeholder="./backend"
                              className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-[#0d1117]/60 border border-white/[0.08] rounded-lg text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {isDropTarget && dragOverIndex > index && (
                <div className="h-1 bg-[#58a6ff] rounded-full shadow-[0_0_12px_#388bfd] my-1 animate-pulse transition-all" />
              )}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
      </div>

      {/* Preset Library Modal via Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {templateModalOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] cursor-pointer"
                  onClick={() => setTemplateModalOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: '-46%', x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.95, y: '-46%', x: '-50%' }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed top-1/2 left-1/2 w-full max-w-xl bg-[#161b22]/90 border border-white/[0.12] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl z-[1000] p-6 space-y-4 max-h-[85vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#f0883e]/15 border border-[#f0883e]/30 shadow-inner">
                        <Sparkles className="w-5 h-5 text-[#f0883e]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#f0f6fc]">
                          Step Preset Library
                        </h3>
                        <p className="text-[11px] text-[#8b949e]">Preconfigured industry-standard CI/CD tasks</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTemplateModalOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {STEP_TEMPLATES.map((tmpl, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#0d1117]/60 border border-white/[0.08] hover:border-[#58a6ff]/50 hover:bg-[#1f6feb]/10 transition-all flex items-center justify-between gap-3 group backdrop-blur-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-[#161b22]/80 border border-white/[0.08] shadow-inner shrink-0">
                            {getStepIcon(tmpl)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                                {tmpl.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[#8b949e] border border-white/[0.06] font-medium">
                                {tmpl.category}
                              </span>
                            </div>
                            <code className="text-[11px] text-[#8b949e] truncate block mt-1 font-mono">
                              {tmpl.uses || tmpl.run}
                            </code>
                          </div>
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            addStep(tmpl);
                            setTemplateModalOpen(false);
                            showToast({
                              type: 'info',
                              title: `Added Step: ${tmpl.name}`,
                              description: tmpl.uses ? `Uses action: ${tmpl.uses}` : `Runs command: ${tmpl.run}`,
                            });
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white shadow-sm shadow-green-950/30 transition-all shrink-0"
                        >
                          + Insert
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Marketplace Modal */}
      <MarketplaceModal
        isOpen={marketplaceModalOpen}
        onClose={() => setMarketplaceModalOpen(false)}
      />
    </div>
  );
};
