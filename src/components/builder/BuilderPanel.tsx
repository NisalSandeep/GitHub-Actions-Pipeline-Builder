'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Eye,
  Layers,
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

type SectionKey = 'global' | 'language' | 'cache' | 'steps' | 'deployment';

interface SectionMeta {
  id: SectionKey;
  stepNum: number;
  shortTitle: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 25 : -25,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -25 : 25,
    opacity: 0,
    transition: {
      duration: 0.16,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export const BuilderPanel: React.FC = () => {
  const { state } = useWorkflow();

  const [activeSection, setActiveSection] = useState<SectionKey>('global');
  const [direction, setDirection] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'focused' | 'accordion'>('focused');
  const [openAccordion, setOpenAccordion] = useState<SectionKey | null>('global');

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

  const sections: SectionMeta[] = [
    {
      id: 'global',
      stepNum: 1,
      shortTitle: 'Global',
      title: '1. Global Triggers & Runners',
      subtitle: 'Workflow name, triggers (push, PR, cron), and runner VM',
      icon: <Globe className="w-4 h-4 text-[#58a6ff]" />,
    },
    {
      id: 'language',
      stepNum: 2,
      shortTitle: 'Language',
      title: '2. Build Engine & Language',
      subtitle: 'Runtime selection, version matrices, and package managers',
      icon: getLanguageHeaderIcon(),
    },
    {
      id: 'cache',
      stepNum: 3,
      shortTitle: 'Cache',
      title: '3. Dependency & Cache Management',
      subtitle: 'Accelerate CI builds with intelligent dependency caching',
      icon: <HardDrive className="w-4 h-4 text-[#d29922]" />,
    },
    {
      id: 'steps',
      stepNum: 4,
      shortTitle: 'Steps',
      title: '4. Pipeline Steps Sequencer',
      subtitle: 'Command sequence, unit tests, code analysis, and actions',
      icon: <Terminal className="w-4 h-4 text-[#a371f7]" />,
    },
    {
      id: 'deployment',
      stepNum: 5,
      shortTitle: 'Deploy',
      title: '5. Deployment & Multi-Job Publishing',
      subtitle: 'Docker Hub, AWS (ECS/S3/Lambda), Vercel, and GitHub Pages',
      icon: getDeploymentHeaderIcon(),
    },
  ];

  const getSectionBadge = (id: SectionKey) => {
    switch (id) {
      case 'global':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#388bfd1a] text-[#58a6ff] text-[11px] font-mono border border-[#388bfd]/30">
            {getRunnerIcon()}
            <span>{state.global.runsOn.replace('-latest', '')}</span>
          </span>
        );
      case 'language':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] text-[11px] font-semibold border border-[#238636]/40 uppercase">
            {getLanguageHeaderIcon()}
            <span>{state.language.type}</span>
          </span>
        );
      case 'cache':
        return (
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
              state.caching.enabled
                ? 'bg-[#238636]/20 text-[#3fb950] border-[#238636]/40'
                : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
            }`}
          >
            {state.caching.enabled ? 'Cached' : 'Off'}
          </span>
        );
      case 'steps':
        return (
          <span className="px-2 py-0.5 rounded bg-[#a371f7]/20 text-[#d2a8ff] text-[11px] font-semibold border border-[#a371f7]/30">
            {state.steps.length} {state.steps.length === 1 ? 'Step' : 'Steps'}
          </span>
        );
      case 'deployment':
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
              state.deployment.enabled
                ? 'bg-[#f0883e]/20 text-[#ffa657] border-[#f0883e]/40'
                : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
            }`}
          >
            {getDeploymentHeaderIcon()}
            <span>{state.deployment.enabled ? state.deployment.target.toUpperCase() : 'CI Only'}</span>
          </span>
        );
    }
  };

  const renderSectionComponent = (id: SectionKey) => {
    switch (id) {
      case 'global':
        return <GlobalSettingsSection />;
      case 'language':
        return <LanguageSection />;
      case 'cache':
        return <CacheSection />;
      case 'steps':
        return <StepsBuilderSection />;
      case 'deployment':
        return <DeploymentSection />;
    }
  };

  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const currentSection = sections[currentIndex] || sections[0];
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  const navigateToSection = (targetId: SectionKey) => {
    const targetIdx = sections.findIndex((s) => s.id === targetId);
    setDirection(targetIdx > currentIndex ? 1 : -1);
    setActiveSection(targetId);
    setOpenAccordion(targetId);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header Controls: Title & View Mode Switcher */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">
            Visual Architect
          </span>
          <span className="text-[11px] text-[#58a6ff] font-medium bg-[#388bfd]/10 px-2 py-0.5 rounded-full border border-[#388bfd]/25">
            Step {currentIndex + 1} of 5
          </span>
        </div>

        {/* View Mode Toggle: Focus Mode (Single Pane) vs Accordion Mode */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-xs">
          <button
            type="button"
            onClick={() => setViewMode('focused')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              viewMode === 'focused'
                ? 'bg-white/[0.08] text-[#58a6ff] shadow-sm border border-white/[0.1]'
                : 'text-[#8b949e] hover:text-[#f0f6fc]'
            }`}
            title="Focus on one pane side-by-side with YAML preview"
          >
            <Eye className="w-3 h-3" />
            <span>Focus Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('accordion')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              viewMode === 'accordion'
                ? 'bg-white/[0.08] text-[#58a6ff] shadow-sm border border-white/[0.1]'
                : 'text-[#8b949e] hover:text-[#f0f6fc]'
            }`}
            title="Accordion list mode"
          >
            <Layers className="w-3 h-3" />
            <span>Accordion</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation Bar (5 Sections) */}
      <div className="p-1.5 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg grid grid-cols-5 gap-1.5 select-none">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => navigateToSection(sec.id)}
              className={`relative flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-xs font-semibold transition-colors duration-150 z-10 ${
                isActive
                  ? 'text-[#f0f6fc]'
                  : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-white/[0.04]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSectionPill"
                  className="absolute inset-0 rounded-xl bg-[#21262d]/90 border border-[#388bfd]/60 shadow-lg shadow-blue-500/10 -z-10 backdrop-blur-md"
                  transition={{ type: 'spring', stiffness: 480, damping: 34 }}
                />
              )}
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono font-bold shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#58a6ff] text-[#0d1117] shadow-sm shadow-blue-500/30'
                    : 'bg-white/[0.08] text-[#8b949e]'
                }`}
              >
                {sec.stepNum}
              </span>
              <span className="truncate text-[11px]">{sec.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: FOCUS MODE (Shows ONLY the selected pane side-by-side with YAML) */}
      {viewMode === 'focused' && (
        <div className="rounded-2xl border border-white/[0.1] bg-[#161b22]/75 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden transition-all">
          {/* Active Pane Header */}
          <div className="p-4.5 bg-white/[0.02] border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] text-[#58a6ff] shrink-0 shadow-inner">
                {currentSection.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-bold text-[#f0f6fc] tracking-tight">
                    {currentSection.title}
                  </h2>
                  {getSectionBadge(currentSection.id)}
                </div>
                <p className="text-xs text-[#94a3b8] truncate mt-0.5">
                  {currentSection.subtitle}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-[#8b949e] font-mono hidden md:block">
              YAML Preview aligned side-by-side →
            </div>
          </div>

          {/* Active Pane Body with Directional Slide Transition */}
          <div className="p-5 relative min-h-[380px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeSection}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {renderSectionComponent(activeSection)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Stepper Navigation: Previous & Next Section Buttons */}
          <div className="p-3.5 bg-white/[0.015] border-t border-white/[0.08] flex items-center justify-between gap-3">
            {prevSection ? (
              <button
                type="button"
                onClick={() => navigateToSection(prevSection.id)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#f0f6fc] border border-white/[0.09] transition-all hover:border-[#58a6ff]/40 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#8b949e]" />
                <span>Previous: {prevSection.shortTitle}</span>
              </button>
            ) : (
              <div />
            )}

            {nextSection ? (
              <button
                type="button"
                onClick={() => navigateToSection(nextSection.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-xs font-semibold text-white shadow-lg shadow-green-950/40 transition-all active:scale-95 ml-auto ring-1 ring-white/10"
              >
                <span>Next: {nextSection.shortTitle}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            ) : (
              <div className="text-xs text-[#3fb950] font-semibold flex items-center gap-1.5 py-2 px-3 bg-[#238636]/15 rounded-xl border border-[#238636]/40">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pipeline Complete</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: EXCLUSIVE ACCORDION MODE (Clicking a section opens it & collapses others) */}
      {viewMode === 'accordion' && (
        <div className="space-y-3">
          {sections.map((sec) => {
            const isOpen = openAccordion === sec.id;
            return (
              <div
                key={sec.id}
                className={`rounded-2xl border transition-all duration-200 shadow-sm backdrop-blur-xl ${
                  isOpen
                    ? 'border-[#388bfd]/60 bg-[#161b22]/80 shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'border-white/[0.08] bg-[#161b22]/55 hover:bg-[#161b22]/75 hover:border-white/[0.15]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenAccordion(isOpen ? null : sec.id);
                    setActiveSection(sec.id);
                  }}
                  className="w-full px-4.5 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors group rounded-2xl"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] text-[#58a6ff] shrink-0 flex items-center justify-center shadow-inner group-hover:border-[#58a6ff]/40 transition-colors">
                      {sec.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xs font-bold text-[#f0f6fc] tracking-tight group-hover:text-[#58a6ff] transition-colors">
                          {sec.title}
                        </h2>
                        {getSectionBadge(sec.id)}
                      </div>
                      <p className="text-[11px] text-[#94a3b8] truncate mt-0.5">
                        {sec.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-1 rounded-md text-[#94a3b8] group-hover:text-[#f0f6fc] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-4.5 pt-3 border-t border-white/[0.08] bg-white/[0.015]">
                        {renderSectionComponent(sec.id)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
