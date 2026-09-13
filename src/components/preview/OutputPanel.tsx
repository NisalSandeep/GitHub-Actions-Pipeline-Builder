'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { YamlPreview } from './YamlPreview';
import { PipelineDiagram } from './PipelineDiagram';
import { SecretsInspector } from './SecretsInspector';
import { FileCode, Layers, KeyRound, CheckCircle2 } from 'lucide-react';

type OutputTab = 'yaml' | 'diagram' | 'secrets';

export const OutputPanel: React.FC = () => {
  const { requiredSecrets } = useWorkflow();
  const [activeTab, setActiveTab] = useState<OutputTab>('yaml');

  return (
    <div className="sticky top-20 flex flex-col space-y-3">
      {/* Output Navigation Tabs & Validation Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161b22]/95 border border-[#30363d] backdrop-blur-md shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('yaml')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'yaml'
                ? 'bg-[#21262d] text-[#f0f6fc] shadow-sm border border-[#388bfd]/30'
                : 'text-[#94a3b8] hover:text-[#f0f6fc] hover:bg-[#21262d]/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>YAML Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'diagram'
                ? 'bg-[#21262d] text-[#f0f6fc] shadow-sm border border-[#a371f7]/30'
                : 'text-[#94a3b8] hover:text-[#f0f6fc] hover:bg-[#21262d]/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#a371f7]" />
            <span>Visual Pipeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('secrets')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'secrets'
                ? 'bg-[#21262d] text-[#f0f6fc] shadow-sm border border-[#f0883e]/30'
                : 'text-[#94a3b8] hover:text-[#f0f6fc] hover:bg-[#21262d]/50'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#f0883e]" />
            <span>Secrets</span>
            {requiredSecrets.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#f0883e]/20 text-[#ffa657] border border-[#f0883e]/50 text-[10px] flex items-center justify-center font-bold">
                {requiredSecrets.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#3fb950] font-semibold bg-[#238636]/15 px-3 py-1.5 rounded-full border border-[#238636]/40 shadow-sm shadow-green-950/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
          <span>Valid Workflow</span>
        </div>
      </div>

      {/* Active Tab Body */}
      <div>
        {activeTab === 'yaml' && <YamlPreview />}
        {activeTab === 'diagram' && <PipelineDiagram />}
        {activeTab === 'secrets' && <SecretsInspector />}
      </div>
    </div>
  );
};
