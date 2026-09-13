'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { YamlPreview } from './YamlPreview';
import { PipelineDiagram } from './PipelineDiagram';
import { SecretsInspector } from './SecretsInspector';
import { FileCode, Layers, KeyRound, CheckCircle2 } from 'lucide-react';

type OutputTab = 'yaml' | 'diagram' | 'secrets';

export const OutputPanel: React.FC = () => {
  const { requiredSecrets } = useWorkflow();
  const [activeTab, setActiveTab] = useState<OutputTab>('yaml');

  const tabs: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
    { id: 'yaml', label: 'YAML Preview', icon: <FileCode className="w-3.5 h-3.5 text-[#58a6ff]" /> },
    { id: 'diagram', label: 'Visual Pipeline', icon: <Layers className="w-3.5 h-3.5 text-[#a371f7]" /> },
    { id: 'secrets', label: 'Secrets', icon: <KeyRound className="w-3.5 h-3.5 text-[#f0883e]" /> },
  ];

  return (
    <div className="sticky top-20 flex flex-col space-y-3">
      {/* Output Navigation Tabs & Validation Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161b22]/95 border border-[#30363d] backdrop-blur-md shadow-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 z-10 ${
                  isActive ? 'text-[#f0f6fc]' : 'text-[#94a3b8] hover:text-[#f0f6fc]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeOutputTabPill"
                    className="absolute inset-0 rounded-lg bg-[#21262d] border border-[#30363d] shadow-sm -z-10"
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
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#3fb950] font-semibold bg-[#238636]/15 px-3 py-1.5 rounded-full border border-[#238636]/40 shadow-sm shadow-green-950/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
          <span>Valid Workflow</span>
        </div>
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
            {activeTab === 'yaml' && <YamlPreview />}
            {activeTab === 'diagram' && <PipelineDiagram />}
            {activeTab === 'secrets' && <SecretsInspector />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
