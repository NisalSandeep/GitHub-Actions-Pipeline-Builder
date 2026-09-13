'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { KeyRound, Copy, Check, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SecretsInspector: React.FC = () => {
  const { requiredSecrets } = useWorkflow();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySecretKey = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedKey(name);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (requiredSecrets.length === 0) {
    return (
      <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#238636]/20 border border-[#238636]/40 flex items-center justify-center mx-auto text-[#3fb950]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#f0f6fc]">No Custom Secrets Required</h3>
        <p className="text-xs text-[#8b949e] max-w-sm mx-auto">
          The current workflow runs using default repository permissions and public package registries.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-5 space-y-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#58a6ff]" />
          <h3 className="text-xs font-bold text-[#f0f6fc]">
            Required GitHub Secrets ({requiredSecrets.length})
          </h3>
        </div>
        <span className="text-[11px] text-[#8b949e]">
          Configure in GitHub Repo: <strong>Settings &gt; Secrets and variables &gt; Actions</strong>
        </span>
      </div>

      <div className="space-y-3">
        {requiredSecrets.map((secret) => {
          const isCopied = copiedKey === secret.name;
          return (
            <div
              key={secret.name}
              className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#7ee787] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                    {secret.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#21262d] text-[#8b949e]">
                    {secret.target}
                  </span>
                </div>
                <p className="text-[11px] text-[#8b949e]">{secret.description}</p>
                {secret.recommendedValue && (
                  <div className="text-[10px] text-[#6e7681]">
                    Example: <code className="text-[#a5d6ff]">{secret.recommendedValue}</code>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => copySecretKey(secret.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 ${
                  isCopied
                    ? 'bg-[#238636] border-[#2ea043] text-white'
                    : 'bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-[#c9d1d9]'
                }`}
                title="Copy secret name to clipboard"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Name</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-[#161b22]/70 border border-[#30363d] flex items-start gap-2.5 text-xs text-[#8b949e]">
        <ShieldAlert className="w-4 h-4 text-[#f0883e] shrink-0 mt-0.5" />
        <div>
          GitHub Secrets are encrypted at rest and never exposed in workflow console logs. Ensure users with repository write access have appropriate secret management permissions.
        </div>
      </div>
    </div>
  );
};
