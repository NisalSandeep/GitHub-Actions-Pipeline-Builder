'use client';

import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
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
} from 'lucide-react';

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

  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderSteps(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
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
        <div>
          <span className="text-xs font-semibold text-[#f0f6fc] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#3fb950]" />
            Pipeline Steps Sequence
          </span>
          <p className="text-[11px] text-[#8b949e]">
            Executed in sequential order. Drag handle or click arrows to reorder.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Templates Library Button */}
          <button
            type="button"
            onClick={() => setTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#f0883e] border border-[#30363d] hover:border-[#f0883e]/50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset Library</span>
          </button>

          {/* Add Custom Step Button */}
          <button
            type="button"
            onClick={() => addStep()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {state.steps.map((step, index) => {
          const isExpanded = expandedSteps[step.id] !== false; // default open
          const isDragging = draggedIndex === index;

          return (
            <div
              key={step.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`rounded-xl border transition-all ${
                isDragging
                  ? 'opacity-40 border-dashed border-[#58a6ff]'
                  : 'bg-[#161b22] border-[#30363d] hover:border-[#484f58]'
              }`}
            >
              {/* Step Card Header */}
              <div className="flex items-center justify-between p-3 gap-2 select-none">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Drag Handle */}
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    className="cursor-grab active:cursor-grabbing text-[#6e7681] hover:text-[#58a6ff] p-1 rounded hover:bg-[#21262d] transition-colors"
                    title="Drag handle to reorder this step"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Step Index Badge */}
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#21262d] text-[10px] font-mono font-bold text-[#8b949e]">
                    {index + 1}
                  </span>

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
                    onClick={() => duplicateStep(step.id)}
                    className="p-1 rounded text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d]"
                    title="Duplicate step"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
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
              {isExpanded && (
                <div className="p-3.5 pt-0 border-t border-[#21262d] space-y-3 mt-1 animate-fade-in">
                  {/* Step Name Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8b949e] mb-1">
                      Step Name
                    </label>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateStep(step.id, { name: e.target.value })}
                      placeholder="e.g. Run Unit Tests"
                      className="w-full px-2.5 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
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
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#0d1117] border border-[#30363d] rounded-lg text-[#79c0ff] focus:outline-none focus:border-[#58a6ff]"
                      />
                    ) : (
                      <textarea
                        value={step.run || ''}
                        onChange={(e) => updateStep(step.id, { run: e.target.value })}
                        placeholder="npm run test&#10;npm run build"
                        rows={3}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                      />
                    )}
                  </div>

                  {/* Environment Variables Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-[#8b949e] flex items-center gap-1">
                        <Key className="w-3 h-3 text-[#f0883e]" />
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
                      <div className="space-y-1.5 bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">
                        {step.env.map((env, envIdx) => (
                          <div key={envIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={env.key}
                              onChange={(e) =>
                                updateEnvVar(step.id, envIdx, 'key', e.target.value)
                              }
                              placeholder="KEY"
                              className="w-1/3 px-2 py-1 text-xs font-mono bg-[#161b22] border border-[#30363d] rounded text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                            />
                            <span className="text-[#6e7681] text-xs">:</span>
                            <input
                              type="text"
                              value={env.value}
                              onChange={(e) =>
                                updateEnvVar(step.id, envIdx, 'value', e.target.value)
                              }
                              placeholder="value or ${{ secrets.TOKEN }}"
                              className="flex-1 px-2 py-1 text-xs font-mono bg-[#161b22] border border-[#30363d] rounded text-[#79c0ff] focus:outline-none focus:border-[#58a6ff]"
                            />
                            <button
                              type="button"
                              onClick={() => removeEnvVar(step.id, envIdx)}
                              className="text-[#8b949e] hover:text-[#f85149] p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Advanced Options (Conditional if:, Working Directory) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-[#8b949e] block mb-1">
                        Conditional (if:)
                      </span>
                      <input
                        type="text"
                        value={step.ifCondition || ''}
                        onChange={(e) => updateStep(step.id, { ifCondition: e.target.value })}
                        placeholder="e.g. success() && github.ref == 'refs/heads/main'"
                        className="w-full px-2 py-1 text-[11px] font-mono bg-[#0d1117] border border-[#30363d] rounded text-[#c9d1d9] focus:outline-none"
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
                        className="w-full px-2 py-1 text-[11px] font-mono bg-[#0d1117] border border-[#30363d] rounded text-[#c9d1d9] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preset Library Modal */}
      {templateModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setTemplateModalOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl z-50 p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f0883e]" />
                <h3 className="text-sm font-bold text-[#f0f6fc]">
                  Step Preset Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTemplateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#21262d] text-[#8b949e] hover:text-[#f0f6fc]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {STEP_TEMPLATES.map((tmpl, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff]">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e]">
                        {tmpl.category}
                      </span>
                    </div>
                    <code className="text-[11px] text-[#8b949e] truncate block mt-0.5">
                      {tmpl.uses || tmpl.run}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addStep(tmpl);
                      setTemplateModalOpen(false);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#21262d] hover:bg-[#238636] text-[#f0f6fc] hover:text-white transition-all shrink-0"
                  >
                    + Insert
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
