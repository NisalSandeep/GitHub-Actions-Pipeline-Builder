'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { YamlPreview } from './YamlPreview';
import { PipelineDiagram } from './PipelineDiagram';
import { SecretsInspector } from './SecretsInspector';
import { ManualYamlEditor } from '../manual/ManualYamlEditor';
import { FileCode, Code2, Layers, KeyRound, CheckCircle2, XCircle } from 'lucide-react';

type OutputTab = 'yaml' | 'editor' | 'diagram' | 'secrets';

export const OutputPanel: React.FC = () => {
  const { requiredSecrets, validationResult } = useWorkflow();
  const [activeTab, setActiveTab] = useState<OutputTab>('yaml');

  const tabs: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
    { id: 'yaml', label: 'YAML Preview', icon: <FileCode className="w-3.5 h-3.5 text-[#58a6ff]" /> },
    { id: 'editor', label: 'Manual Editor', icon: <Code2 className="w-3.5 h-3.5 text-[#388bfd]" /> },
    { id: 'diagram', label: 'Visual Pipeline', icon: <Layers className="w-3.5 h-3.5 text-[#a371f7]" /> },
    { id: 'secrets', label: 'Secrets', icon: <KeyRound className="w-3.5 h-3.5 text-[#f0883e]" /> },
  ];

  return (
    <div className="sticky top-20 flex flex-col space-y-3">
      {/* Output Navigation Tabs & Validation Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-150 z-10 ${
                  isActive ? 'text-[#f0f6fc]' : 'text-[#94a3b8] hover:text-[#f0f6fc] hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeOutputTabPill"
                    className="absolute inset-0 rounded-xl bg-[#21262d]/90 border border-[#388bfd]/50 shadow-md shadow-blue-500/10 -z-10 backdrop-blur-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'secrets' && requiredSecrets.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#f0883e]/20 text-[#ffa657] border border-[#f0883e]/50 text-[10px] flex items-center justify-center font-bold ml-0.5">
                    {requiredSecrets.length}
                  </span>
                )}
                {tab.id === 'editor' && !validationResult.isValid && (
                  <span className="w-2 h-2 rounded-full bg-[#ff7b72] animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Validation Status Pill */}
        {validationResult.isValid ? (
          <div className="flex items-center gap-1.5 text-xs text-[#3fb950] font-semibold bg-[#238636]/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#238636]/40 shadow-sm shadow-green-950/25">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>Valid Workflow</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-[#ff7b72] font-semibold bg-[#f85149]/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#f85149]/40 shadow-sm shadow-red-950/25">
            <XCircle className="w-3.5 h-3.5 text-[#ff7b72]" />
            <span>Line {validationResult.errors[0]?.line || 1} Error</span>
          </div>
        )}
      </div>

      {/* Active Tab Body with Smooth Transition */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {activeTab === 'yaml' && <YamlPreview onSwitchToEditor={() => setActiveTab('editor')} />}
            {activeTab === 'editor' && <ManualYamlEditor embeddedInBuilder={false} />}
            {activeTab === 'diagram' && <PipelineDiagram />}
            {activeTab === 'secrets' && <SecretsInspector />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

