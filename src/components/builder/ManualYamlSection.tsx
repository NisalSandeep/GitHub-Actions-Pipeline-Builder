'use client';

import React from 'react';
import { ManualYamlEditor } from '../manual/ManualYamlEditor';
import { Sparkles, Code2, ShieldCheck, Zap } from 'lucide-react';

export const ManualYamlSection: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Intro Feature Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#388bfd]/10 via-[#a371f7]/10 to-[#238636]/10 border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#388bfd]/20 border border-[#388bfd]/40 text-[#58a6ff] shrink-0 mt-0.5">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-[#f0f6fc] flex items-center gap-2">
              <span>Direct GitHub Actions Code Editor</span>
              <span className="px-2 py-0.5 rounded-full bg-[#58a6ff]/20 text-[#79c0ff] border border-[#58a6ff]/40 text-[10px] font-semibold">
                Live Linter &amp; Autocomplete
              </span>
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Write, paste, or fine-tune your workflow YAML directly. Features real-time schema validation,
              instant syntax error jump, inline keyword suggestions, and automatic secret detection.
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/[0.08] text-[11px]">
          <div className="flex items-center gap-1.5 text-[#c9d1d9]">
            <Sparkles className="w-3.5 h-3.5 text-[#f0883e]" />
            <span>Inline autocompletions</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c9d1d9]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>GitHub Actions linter</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c9d1d9]">
            <Zap className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>1-click snippet chips</span>
          </div>
        </div>
      </div>

      {/* Embedded Manual YAML Editor */}
      <ManualYamlEditor embeddedInBuilder={true} />
    </div>
  );
};
