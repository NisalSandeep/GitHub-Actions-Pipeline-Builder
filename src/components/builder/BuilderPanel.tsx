'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { GlobalSettingsSection } from './GlobalSettingsSection';
import { LanguageSection } from './LanguageSection';
import { CacheSection } from './CacheSection';
import { StepsBuilderSection } from './StepsBuilderSection';
import { DeploymentSection } from './DeploymentSection';
import {
  Globe,
  HardDrive,
  Terminal,
  Rocket,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  NodeIcon,
  PythonIcon,
  GoIcon,
  JavaIcon,
  RustIcon,
  TerminalBashIcon,
  DockerIcon,
  AwsIcon,
  VercelIcon,
  GitHubIcon,
  UbuntuIcon,
  WindowsIcon,
  AppleIcon,
  BeakerIcon,
} from '../icons/BrandIcons';

interface AccordionSectionProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  subtitle,
  icon,
  badge,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#21262d]/70 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-[#21262d] border border-[#30363d] text-[#58a6ff] shrink-0 flex items-center justify-center">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-[#f0f6fc] tracking-tight">{title}</h2>
              {badge}
            </div>
            <p className="text-[11px] text-[#8b949e] truncate">{subtitle}</p>
          </div>
        </div>

        <div className="text-[#8b949e] p-1 rounded-md hover:text-[#f0f6fc]">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-3 border-t border-[#30363d]/60 bg-[#161b22]/50 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export const BuilderPanel: React.FC = () => {
  const { state } = useWorkflow();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    global: true,
    language: true,
    cache: false,
    steps: true,
    deployment: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    setOpenSections({
      global: true,
      language: true,
      cache: true,
      steps: true,
      deployment: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      global: false,
      language: false,
      cache: false,
      steps: false,
      deployment: false,
    });
  };

  const getLanguageHeaderIcon = () => {
    switch (state.language.type) {
      case 'node':
        return <NodeIcon className="w-4 h-4" />;
      case 'python':
        return <PythonIcon className="w-4 h-4" />;
      case 'go':
        return <GoIcon className="w-4 h-4" />;
      case 'java':
        return <JavaIcon className="w-4 h-4" />;
      case 'rust':
        return <RustIcon className="w-4 h-4" />;
      default:
        return <TerminalBashIcon className="w-4 h-4" />;
    }
  };

  const getDeploymentHeaderIcon = () => {
    switch (state.deployment.target) {
      case 'docker':
        return <DockerIcon className="w-4 h-4" />;
      case 'aws':
        return <AwsIcon className="w-4 h-4" />;
      case 'vercel':
        return <VercelIcon className="w-4 h-4" />;
      case 'github_pages':
        return <GitHubIcon className="w-4 h-4 text-white" />;
      default:
        return <BeakerIcon className="w-4 h-4" />;
    }
  };

  const getRunnerIcon = () => {
    switch (state.global.runsOn) {
      case 'ubuntu-latest':
        return <UbuntuIcon className="w-3.5 h-3.5" />;
      case 'windows-latest':
        return <WindowsIcon className="w-3.5 h-3.5" />;
      case 'macos-latest':
        return <AppleIcon className="w-3.5 h-3.5" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-[#58a6ff]" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Panel Top Controller */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">
          Configuration Pipeline
        </span>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={expandAll}
            className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
          >
            Expand All
          </button>
          <span className="text-[#30363d]">•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 1. Global Settings */}
      <AccordionSection
        id="global"
        title="1. Global Settings & Triggers"
        subtitle="Name, triggers (push, PR, cron), and runner VM environment"
        icon={<Globe className="w-4 h-4 text-[#58a6ff]" />}
        badge={
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#388bfd1a] text-[#58a6ff] text-[10px] font-mono">
            {getRunnerIcon()}
            <span>{state.global.runsOn}</span>
          </span>
        }
        isOpen={!!openSections.global}
        onToggle={() => toggleSection('global')}
      >
        <GlobalSettingsSection />
      </AccordionSection>

      {/* 2. Language Selection */}
      <AccordionSection
        id="language"
        title="2. Build Engine & Language"
        subtitle="Runtime selection, version matrices, and package managers"
        icon={getLanguageHeaderIcon()}
        badge={
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] text-[10px] uppercase font-semibold">
            {getLanguageHeaderIcon()}
            <span>{state.language.type}</span>
          </span>
        }
        isOpen={!!openSections.language}
        onToggle={() => toggleSection('language')}
      >
        <LanguageSection />
      </AccordionSection>

      {/* 3. Cache & Dependencies */}
      <AccordionSection
        id="cache"
        title="3. Dependency & Cache Management"
        subtitle="Accelerate builds by caching npm, pip, go, or cargo artifacts"
        icon={<HardDrive className="w-4 h-4 text-[#d29922]" />}
        badge={
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
              state.caching.enabled
                ? 'bg-[#238636]/20 text-[#3fb950]'
                : 'bg-[#21262d] text-[#8b949e]'
            }`}
          >
            {state.caching.enabled ? 'Enabled' : 'Disabled'}
          </span>
        }
        isOpen={!!openSections.cache}
        onToggle={() => toggleSection('cache')}
      >
        <CacheSection />
      </AccordionSection>

      {/* 4. Custom Steps Builder */}
      <AccordionSection
        id="steps"
        title="4. Custom Steps Builder"
        subtitle="Order of commands, tests, linters, and environment variables"
        icon={<Terminal className="w-4 h-4 text-[#a371f7]" />}
        badge={
          <span className="px-1.5 py-0.2 rounded bg-[#a371f7]/20 text-[#d2a8ff] text-[10px] font-semibold">
            {state.steps.length} {state.steps.length === 1 ? 'Step' : 'Steps'}
          </span>
        }
        isOpen={!!openSections.steps}
        onToggle={() => toggleSection('steps')}
      >
        <StepsBuilderSection />
      </AccordionSection>

      {/* 5. Deployment & Publishing */}
      <AccordionSection
        id="deployment"
        title="5. Deployment & Multi-Job Publishing"
        subtitle="Docker Hub, AWS (ECS/S3/Lambda), Vercel, and GitHub Pages"
        icon={getDeploymentHeaderIcon()}
        badge={
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              state.deployment.enabled
                ? 'bg-[#f0883e]/20 text-[#ffa657]'
                : 'bg-[#21262d] text-[#8b949e]'
            }`}
          >
            {getDeploymentHeaderIcon()}
            <span>{state.deployment.enabled ? state.deployment.target.toUpperCase() : 'None'}</span>
          </span>
        }
        isOpen={!!openSections.deployment}
        onToggle={() => toggleSection('deployment')}
      >
        <DeploymentSection />
      </AccordionSection>
    </div>
  );
};
