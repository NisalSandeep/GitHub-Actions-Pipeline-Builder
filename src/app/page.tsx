'use client';

import React from 'react';
import { WorkflowProvider } from '../context/WorkflowContext';
import { Header } from '../components/Header';
import { BuilderPanel } from '../components/builder/BuilderPanel';
import { OutputPanel } from '../components/preview/OutputPanel';

export default function Home() {
  return (
    <WorkflowProvider>
      <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col selection:bg-[#2f81f7] selection:text-white">
        {/* Global Navigation Header */}
        <Header />

        {/* Main Split-Screen Workspace */}
        <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Panel: The Visual Builder (Scrollable) */}
            <section className="lg:col-span-6 xl:col-span-6 w-full">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#58a6ff] animate-pulse" />
                  <h2 className="text-sm font-bold text-[#f0f6fc] tracking-tight">
                    Visual Workflow Builder
                  </h2>
                </div>
                <p className="text-xs text-[#8b949e] mt-0.5">
                  Configure triggers, build engines, caching strategies, and multi-job deployment targets.
                </p>
              </div>

              <BuilderPanel />
            </section>

            {/* Right Panel: The Live Output (Sticky Desktop, Stacked Mobile) */}
            <section className="lg:col-span-6 xl:col-span-6 w-full">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3fb950]" />
                  <h2 className="text-sm font-bold text-[#f0f6fc] tracking-tight">
                    Live Production Output
                  </h2>
                </div>
                <p className="text-xs text-[#8b949e] mt-0.5">
                  Real-time generated YAML, visual pipeline topology graph, and required secrets checklist.
                </p>
              </div>

              <OutputPanel />
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-[#30363d]/50 bg-[#161b22]/50 py-4 px-4 text-center text-xs text-[#8b949e]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              GitHub Actions Workflow Generator • Built for production CI/CD pipelines
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#3fb950] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
                Valid YAML Engine
              </span>
              <span>•</span>
              <a
                href="https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#58a6ff] transition-colors"
              >
                Workflow Syntax Docs
              </a>
            </div>
          </div>
        </footer>
      </div>
    </WorkflowProvider>
  );
}
