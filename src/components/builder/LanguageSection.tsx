'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { LanguageType } from '../../types/workflow';
import {
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  NodeIcon,
  PythonIcon,
  GoIcon,
  JavaIcon,
  RustIcon,
  TerminalBashIcon,
  NpmIcon,
  YarnIcon,
  PnpmIcon,
  BunIcon,
} from '../icons/BrandIcons';

interface LanguageOption {
  type: LanguageType;
  name: string;
  badge: string;
  icon: React.ReactNode;
  desc: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    type: 'node',
    name: 'Node.js',
    badge: 'JavaScript / TypeScript',
    icon: <NodeIcon className="w-8 h-8" />,
    desc: 'npm, yarn, pnpm, bun runtime',
  },
  {
    type: 'python',
    name: 'Python',
    badge: 'PyPI Ecosystem',
    icon: <PythonIcon className="w-8 h-8" />,
    desc: 'pip, poetry, uv, pipenv',
  },
  {
    type: 'go',
    name: 'Go (Golang)',
    badge: 'Fast & Concurrent',
    icon: <GoIcon className="w-8 h-8" />,
    desc: 'Native Go compiler & modules',
  },
  {
    type: 'java',
    name: 'Java (JDK)',
    badge: 'JVM Ecosystem',
    icon: <JavaIcon className="w-8 h-8" />,
    desc: 'Maven, Gradle, Temurin, Zulu',
  },
  {
    type: 'rust',
    name: 'Rust (Cargo)',
    badge: 'Zero-Cost Abstractions',
    icon: <RustIcon className="w-8 h-8" />,
    desc: 'Cargo, Clippy, rustfmt',
  },
  {
    type: 'none',
    name: 'Generic / Shell',
    badge: 'Custom Environment',
    icon: <TerminalBashIcon className="w-8 h-8" />,
    desc: 'Pure Bash / Docker only',
  },
];

const NODE_STANDARD_VERSIONS = ['18.x', '20.x', '22.x'];
const PYTHON_STANDARD_VERSIONS = ['3.10', '3.11', '3.12', '3.13'];
const GO_STANDARD_VERSIONS = ['1.21.x', '1.22.x', '1.23.x'];
const JAVA_STANDARD_VERSIONS = ['17', '21', '22'];
const RUST_STANDARD_TOOLCHAINS = ['stable', 'beta', 'nightly'];

export const LanguageSection: React.FC = () => {
  const {
    state,
    updateLanguageType,
    updateLanguageNode,
    updateLanguagePython,
    updateLanguageGo,
    updateLanguageJava,
    updateLanguageRust,
  } = useWorkflow();

  const toggleNodeVersion = (ver: string) => {
    const current = state.language.node.versions;
    if (current.includes(ver)) {
      if (current.length > 1) {
        updateLanguageNode({ versions: current.filter((v) => v !== ver) });
      }
    } else {
      updateLanguageNode({ versions: [...current, ver] });
    }
  };

  const togglePythonVersion = (ver: string) => {
    const current = state.language.python.versions;
    if (current.includes(ver)) {
      if (current.length > 1) {
        updateLanguagePython({ versions: current.filter((v) => v !== ver) });
      }
    } else {
      updateLanguagePython({ versions: [...current, ver] });
    }
  };

  const toggleGoVersion = (ver: string) => {
    const current = state.language.go.versions;
    if (current.includes(ver)) {
      if (current.length > 1) {
        updateLanguageGo({ versions: current.filter((v) => v !== ver) });
      }
    } else {
      updateLanguageGo({ versions: [...current, ver] });
    }
  };

  const toggleJavaVersion = (ver: string) => {
    const current = state.language.java.versions;
    if (current.includes(ver)) {
      if (current.length > 1) {
        updateLanguageJava({ versions: current.filter((v) => v !== ver) });
      }
    } else {
      updateLanguageJava({ versions: [...current, ver] });
    }
  };

  const toggleRustToolchain = (tc: string) => {
    const current = state.language.rust.toolchains;
    if (current.includes(tc)) {
      if (current.length > 1) {
        updateLanguageRust({ toolchains: current.filter((t) => t !== tc) });
      }
    } else {
      updateLanguageRust({ toolchains: [...current, tc] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Visual Grid */}
      <div>
        <label className="block text-xs font-semibold text-[#f0f6fc] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
            Select Primary Runtime / Language
          </span>
          <span className="text-[11px] text-[#8b949e]">Auto-injects official setup action</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {LANGUAGES.map((lang) => {
            const isSelected = state.language.type === lang.type;
            return (
              <button
                key={lang.type}
                type="button"
                onClick={() => updateLanguageType(lang.type)}
                className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1f6feb]/15 border-[#388bfd] shadow-lg shadow-blue-500/10 ring-1 ring-[#388bfd]'
                    : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]/50 hover:bg-[#21262d]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="p-1 rounded-lg bg-[#0d1117]/80 border border-[#30363d]/50">
                    {lang.icon}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#388bfd]" />
                  )}
                </div>
                <div className="text-xs font-bold text-[#f0f6fc]">{lang.name}</div>
                <div className="text-[10px] text-[#8b949e] truncate w-full">{lang.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Language Specific Configuration */}
      {state.language.type !== 'none' && (
        <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-4 animate-fade-in">
          {/* Node.js Configuration */}
          {state.language.type === 'node' && (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-2.5">
                  <NodeIcon className="w-6 h-6" />
                  <div>
                    <h4 className="text-xs font-bold text-[#f0f6fc]">Node.js Environment Setup</h4>
                    <p className="text-[11px] text-[#8b949e]">
                      Injected action: <code className="text-[#79c0ff]">actions/setup-node@v4</code>
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={state.language.node.useMatrix}
                    onChange={(e) => updateLanguageNode({ useMatrix: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7]"
                  />
                  <span className="text-xs text-[#c9d1d9] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#a371f7]" />
                    Matrix Build
                  </span>
                </label>
              </div>

              {/* Version Matrix Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                  Target Node Versions {state.language.node.useMatrix ? '(Matrix Array)' : '(Single Target)'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {NODE_STANDARD_VERSIONS.map((ver) => {
                    const isChecked = state.language.node.versions.includes(ver);
                    return (
                      <button
                        key={ver}
                        type="button"
                        onClick={() => toggleNodeVersion(ver)}
                        className={`px-3 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]'
                            : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                        }`}
                      >
                        {ver} {isChecked && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Package Manager Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                  Package Manager
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['npm', 'yarn', 'pnpm', 'bun'] as const).map((pm) => {
                    const getPmIcon = () => {
                      switch (pm) {
                        case 'npm':
                          return <NpmIcon className="w-4 h-4 shrink-0" />;
                        case 'yarn':
                          return <YarnIcon className="w-4 h-4 shrink-0" />;
                        case 'pnpm':
                          return <PnpmIcon className="w-4 h-4 shrink-0" />;
                        case 'bun':
                          return <BunIcon className="w-4 h-4 shrink-0" />;
                      }
                    };
                    return (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => updateLanguageNode({ packageManager: pm })}
                        className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                          state.language.node.packageManager === pm
                            ? 'bg-[#388bfd1a] border-[#388bfd] text-[#58a6ff]'
                            : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                        }`}
                      >
                        {getPmIcon()}
                        <span>{pm}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Python Configuration */}
          {state.language.type === 'python' && (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-2.5">
                  <PythonIcon className="w-6 h-6" />
                  <div>
                    <h4 className="text-xs font-bold text-[#f0f6fc]">Python Environment Setup</h4>
                    <p className="text-[11px] text-[#8b949e]">
                      Injected action: <code className="text-[#79c0ff]">actions/setup-python@v5</code>
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={state.language.python.useMatrix}
                    onChange={(e) => updateLanguagePython({ useMatrix: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7]"
                  />
                  <span className="text-xs text-[#c9d1d9] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#a371f7]" />
                    Matrix Build
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                  Target Python Versions
                </label>
                <div className="flex flex-wrap gap-2">
                  {PYTHON_STANDARD_VERSIONS.map((ver) => {
                    const isChecked = state.language.python.versions.includes(ver);
                    return (
                      <button
                        key={ver}
                        type="button"
                        onClick={() => togglePythonVersion(ver)}
                        className={`px-3 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]'
                            : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                        }`}
                      >
                        {ver} {isChecked && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                  Dependency Management Tool
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['pip', 'poetry', 'uv', 'pipenv'] as const).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => updateLanguagePython({ packageManager: pm })}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                        state.language.python.packageManager === pm
                          ? 'bg-[#388bfd1a] border-[#388bfd] text-[#58a6ff]'
                          : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Go Configuration */}
          {state.language.type === 'go' && (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-2.5">
                  <GoIcon className="w-6 h-6" />
                  <div>
                    <h4 className="text-xs font-bold text-[#f0f6fc]">Go Runtime Setup</h4>
                    <p className="text-[11px] text-[#8b949e]">
                      Injected action: <code className="text-[#79c0ff]">actions/setup-go@v5</code>
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={state.language.go.useMatrix}
                    onChange={(e) => updateLanguageGo({ useMatrix: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7]"
                  />
                  <span className="text-xs text-[#c9d1d9] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#a371f7]" />
                    Matrix Build
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                  Target Go Versions
                </label>
                <div className="flex flex-wrap gap-2">
                  {GO_STANDARD_VERSIONS.map((ver) => {
                    const isChecked = state.language.go.versions.includes(ver);
                    return (
                      <button
                        key={ver}
                        type="button"
                        onClick={() => toggleGoVersion(ver)}
                        className={`px-3 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]'
                            : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                        }`}
                      >
                        {ver} {isChecked && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Java Configuration */}
          {state.language.type === 'java' && (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-2.5">
                  <JavaIcon className="w-6 h-6" />
                  <div>
                    <h4 className="text-xs font-bold text-[#f0f6fc]">Java JDK Setup</h4>
                    <p className="text-[11px] text-[#8b949e]">
                      Injected action: <code className="text-[#79c0ff]">actions/setup-java@v4</code>
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={state.language.java.useMatrix}
                    onChange={(e) => updateLanguageJava({ useMatrix: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#161b22] text-[#2f81f7]"
                  />
                  <span className="text-xs text-[#c9d1d9] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#a371f7]" />
                    Matrix Build
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                    JDK Version
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {JAVA_STANDARD_VERSIONS.map((ver) => {
                      const isChecked = state.language.java.versions.includes(ver);
                      return (
                        <button
                          key={ver}
                          type="button"
                          onClick={() => toggleJavaVersion(ver)}
                          className={`px-3 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                            isChecked
                              ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]'
                              : 'bg-[#161b22] border-[#30363d] text-[#8b949e]'
                          }`}
                        >
                          JDK {ver} {isChecked && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                    JDK Vendor / Distribution
                  </label>
                  <select
                    value={state.language.java.distribution}
                    onChange={(e) => updateLanguageJava({ distribution: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs bg-[#161b22] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none"
                  >
                    <option value="temurin">Eclipse Temurin (Adoptium)</option>
                    <option value="zulu">Azul Zulu</option>
                    <option value="corretto">Amazon Corretto</option>
                    <option value="adopt">AdoptOpenJDK</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Rust Configuration */}
          {state.language.type === 'rust' && (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-2.5">
                  <RustIcon className="w-6 h-6" />
                  <div>
                    <h4 className="text-xs font-bold text-[#f0f6fc]">Rust Toolchain Setup</h4>
                    <p className="text-[11px] text-[#8b949e]">
                      Injected action: <code className="text-[#79c0ff]">dtolnay/rust-toolchain@master</code>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                  Rust Toolchain Channels
                </label>
                <div className="flex flex-wrap gap-2">
                  {RUST_STANDARD_TOOLCHAINS.map((tc) => {
                    const isChecked = state.language.rust.toolchains.includes(tc);
                    return (
                      <button
                        key={tc}
                        type="button"
                        onClick={() => toggleRustToolchain(tc)}
                        className={`px-3 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]'
                            : 'bg-[#161b22] border-[#30363d] text-[#8b949e]'
                        }`}
                      >
                        {tc} {isChecked && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
