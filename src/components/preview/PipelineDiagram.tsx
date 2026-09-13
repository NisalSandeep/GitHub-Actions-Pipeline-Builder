'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import confetti from 'canvas-confetti';
import {
  GitCommit,
  GitPullRequest,
  Clock,
  PlayCircle,
  Server,
  Layers,
  Rocket,
  CheckCircle2,
  ArrowRight,
  HardDrive,
  Cpu,
  Package,
  Play,
  RotateCcw,
  Loader2,
  Zap,
  Sparkles,
  ShieldCheck,
  Check,
  Flame,
  Activity,
  Workflow,
} from 'lucide-react';
import {
  NodeIcon,
  PythonIcon,
  GoIcon,
  JavaIcon,
  RustIcon,
  PhpIcon,
  DotnetIcon,
  RubyIcon,
  FlutterIcon,
  TerminalBashIcon,
  DockerIcon,
  AwsIcon,
  VercelIcon,
  GitHubIcon,
  UbuntuIcon,
  WindowsIcon,
  AppleIcon,
} from '../icons/BrandIcons';

type SimulationState = 'idle' | 'triggering' | 'building' | 'deploying' | 'succeeded';

export const PipelineDiagram: React.FC = () => {
  const { state } = useWorkflow();
  const { global, language, steps, deployment, caching } = state;

  const isMultiJob = deployment.enabled && deployment.target !== 'none';

  // Simulation state
  const [simState, setSimState] = useState<SimulationState>('idle');
  const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  const addTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  // Total build steps count
  const allBuildSteps = [
    { id: 'checkout', name: 'actions/checkout@v4', type: 'action' },
    ...(language.type !== 'none'
      ? [{ id: 'runtime', name: `Setup ${language.type} runtime`, type: 'action' }]
      : []),
    ...(caching.enabled
      ? [{ id: 'cache', name: 'Dependency cache lookup', type: 'cache' }]
      : []),
    ...steps.map((s, idx) => ({ id: s.id, name: s.name || `Step ${idx + 1}`, type: 'step' })),
  ];

  // Stop all timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const startTimeRef = useRef<number>(0);

  // Run Pipeline Simulation
  const handleStartSimulation = () => {
    clearAllTimers();
    setSimState('triggering');
    setActiveStepIdx(-1);
    setElapsedTime(0);

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(parseFloat(((Date.now() - startTimeRef.current) / 1000).toFixed(1)));
    }, 100);

    // Stage 1: Trigger Phase (700ms)
    addTimeout(() => {
      setSimState('building');
      setActiveStepIdx(0);

      // Sequence through build steps
      const totalSteps = allBuildSteps.length;
      const stepDuration = Math.max(250, Math.min(450, 1600 / totalSteps));

      allBuildSteps.forEach((_, idx) => {
        addTimeout(() => {
          setActiveStepIdx(idx);
        }, idx * stepDuration);
      });

      // After all build steps complete
      const buildDuration = totalSteps * stepDuration + 200;
      addTimeout(() => {
        if (isMultiJob) {
          // Stage 3: Deployment Phase
          setSimState('deploying');
          addTimeout(() => {
            finishSimulation();
          }, 900);
        } else {
          finishSimulation();
        }
      }, buildDuration);
    }, 700);
  };

  const finishSimulation = () => {
    clearAllTimers();
    setSimState('succeeded');
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#2ea043', '#58a6ff', '#a371f7', '#f0883e'],
    });
  };

  const handleResetSimulation = () => {
    clearAllTimers();
    setSimState('idle');
    setActiveStepIdx(-1);
    setElapsedTime(0);
  };

  const getLanguageIcon = () => {
    switch (language.type) {
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
      case 'php':
        return <PhpIcon className="w-4 h-4" />;
      case 'dotnet':
        return <DotnetIcon className="w-4 h-4" />;
      case 'ruby':
        return <RubyIcon className="w-4 h-4" />;
      case 'flutter':
        return <FlutterIcon className="w-4 h-4" />;
      default:
        return <TerminalBashIcon className="w-4 h-4" />;
    }
  };

  const getDeploymentIcon = () => {
    switch (deployment.target) {
      case 'docker':
        return <DockerIcon className="w-4 h-4" />;
      case 'aws':
        return <AwsIcon className="w-4 h-4" />;
      case 'vercel':
        return <VercelIcon className="w-4 h-4" />;
      case 'github_pages':
        return <GitHubIcon className="w-4 h-4 text-white" />;
      default:
        return <Rocket className="w-4 h-4 text-[#f0883e]" />;
    }
  };

  const getRunnerIcon = () => {
    switch (global.runsOn) {
      case 'ubuntu-latest':
        return <UbuntuIcon className="w-3.5 h-3.5" />;
      case 'windows-latest':
        return <WindowsIcon className="w-3.5 h-3.5" />;
      case 'macos-latest':
        return <AppleIcon className="w-3.5 h-3.5" />;
      default:
        return <Server className="w-3.5 h-3.5 text-[#58a6ff]" />;
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#0d1117]/85 backdrop-blur-2xl p-5 space-y-5 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden relative">
      {/* Background Animated Ambient Glow */}
      <div
        className={`absolute -top-24 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-700 -z-10 ${
          simState === 'triggering'
            ? 'bg-[#238636]/20'
            : simState === 'building'
            ? 'bg-[#388bfd]/25'
            : simState === 'deploying'
            ? 'bg-[#f0883e]/25'
            : simState === 'succeeded'
            ? 'bg-[#2ea043]/30'
            : 'bg-[#58a6ff]/10'
        }`}
      />

      {/* Top Header & Simulation Controls Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#a371f7]/15 border border-[#a371f7]/30 text-[#a371f7] shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#f0f6fc]">Visual Pipeline Architecture (DAG)</h3>
              {simState === 'succeeded' && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-2 py-0.5 rounded-full bg-[#238636]/25 border border-[#2ea043]/50 text-[#3fb950] text-[10px] font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-[#3fb950]" />
                  Success in {elapsedTime}s
                </motion.span>
              )}
            </div>
            <p className="text-[11px] text-[#8b949e]">
              {isMultiJob ? 'Multi-Stage Interdependent Pipeline' : 'Single-Stage CI Pipeline'} • Animated execution flow
            </p>
          </div>
        </div>

        {/* Simulation Control Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {simState === 'idle' && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white text-xs font-semibold shadow-md shadow-green-950/40 border border-white/20 backdrop-blur-md transition-all whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>Simulate Run</span>
            </motion.button>
          )}

          {(simState === 'triggering' || simState === 'building' || simState === 'deploying') && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#388bfd]/15 border border-[#388bfd]/40 text-[#79c0ff] text-xs font-semibold shadow-sm backdrop-blur-md">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#58a6ff]" />
              <span className="capitalize">
                {simState === 'triggering'
                  ? 'Triggering Event...'
                  : simState === 'building'
                  ? 'Executing Build & Test...'
                  : 'Deploying Service...'}
              </span>
              <span className="font-mono text-[11px] text-[#8b949e] ml-1">({elapsedTime}s)</span>
            </div>
          )}

          {simState === 'succeeded' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#238636]/20 border border-[#238636]/50 text-[#3fb950] text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                <span>Workflow Passed</span>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStartSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f0f6fc] border border-white/[0.09] text-xs font-semibold transition-all"
                title="Re-run simulation"
              >
                <RotateCcw className="w-3 h-3 text-[#58a6ff]" />
                <span>Replay</span>
              </motion.button>
              <button
                type="button"
                onClick={handleResetSimulation}
                className="text-[11px] text-[#8b949e] hover:text-[#f0f6fc] px-1"
                title="Reset to idle"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main DAG Stages Layout with Animated Connectors */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3 min-w-[520px] overflow-x-auto pb-2">
        {/* Stage 1: Trigger Events */}
        <motion.div
          animate={
            simState === 'triggering'
              ? {
                  scale: [1, 1.02, 1],
                  borderColor: ['rgba(46,160,67,0.3)', 'rgba(46,160,67,0.9)', 'rgba(46,160,67,0.4)'],
                  boxShadow: [
                    '0 0 0px rgba(46,160,67,0)',
                    '0 0 20px rgba(46,160,67,0.35)',
                    '0 0 5px rgba(46,160,67,0.1)',
                  ],
                }
              : {}
          }
          transition={{ duration: 0.7 }}
          className={`flex-1 rounded-2xl border backdrop-blur-xl p-4 flex flex-col justify-between transition-all duration-300 ${
            simState === 'triggering'
              ? 'bg-[#161b22]/90 border-[#2ea043]/70 ring-1 ring-[#2ea043]/40 shadow-lg shadow-green-950/30'
              : simState === 'building' || simState === 'deploying' || simState === 'succeeded'
              ? 'bg-[#161b22]/70 border-[#2ea043]/40'
              : 'bg-[#161b22]/70 border-white/[0.08]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#f0f6fc] flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      simState === 'triggering' ? 'bg-[#3fb950]' : 'bg-[#58a6ff]'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      simState === 'triggering' ? 'bg-[#3fb950]' : 'bg-[#58a6ff]'
                    }`}
                  />
                </span>
                <GitCommit className="w-3.5 h-3.5 text-[#3fb950]" />
                Trigger Events
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#8b949e] border border-white/[0.08] font-mono">
                on:
              </span>
            </div>

            <div className="space-y-2">
              {global.triggers.push.enabled && (
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className={`p-2.5 rounded-xl border backdrop-blur-md text-xs space-y-1 transition-all ${
                    simState === 'triggering'
                      ? 'bg-[#238636]/20 border-[#2ea043]/50 text-white'
                      : 'bg-[#0d1117]/70 border-white/[0.07]'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-[#3fb950] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <GitCommit className="w-3 h-3" />
                      Push Event
                    </span>
                    {simState === 'triggering' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#238636] text-white font-bold animate-pulse">
                        Fired
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#8b949e] font-mono">
                    branches: [{global.triggers.push.branches.join(', ') || 'all'}]
                  </div>
                </motion.div>
              )}

              {global.triggers.pull_request.enabled && (
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-2.5 rounded-xl bg-[#0d1117]/70 border border-white/[0.07] backdrop-blur-md text-xs space-y-1"
                >
                  <div className="text-[11px] font-semibold text-[#58a6ff] flex items-center gap-1">
                    <GitPullRequest className="w-3 h-3" />
                    Pull Request
                  </div>
                  <div className="text-[10px] text-[#8b949e] font-mono">
                    target: [{global.triggers.pull_request.branches.join(', ') || 'main'}]
                  </div>
                </motion.div>
              )}

              {global.triggers.schedule.enabled && (
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-2.5 rounded-xl bg-[#0d1117]/70 border border-white/[0.07] backdrop-blur-md text-xs space-y-1"
                >
                  <div className="text-[11px] font-semibold text-[#d29922] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Cron Schedule
                  </div>
                  <div className="text-[10px] text-[#8b949e] font-mono">
                    {global.triggers.schedule.cron}
                  </div>
                </motion.div>
              )}

              {global.triggers.workflow_dispatch.enabled && (
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="p-2.5 rounded-xl bg-[#0d1117]/70 border border-white/[0.07] backdrop-blur-md text-xs space-y-1"
                >
                  <div className="text-[11px] font-semibold text-[#a371f7] flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" />
                    Manual Dispatch
                  </div>
                  <div className="text-[10px] text-[#8b949e]">GitHub Actions UI Button</div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] text-[10px] text-[#8b949e] flex items-center justify-between">
            <span className="flex items-center gap-1">Runner OS</span>
            <span className="font-mono text-[#c9d1d9] flex items-center gap-1">
              {getRunnerIcon()}
              {global.runsOn}
            </span>
          </div>
        </motion.div>

        {/* Animated Connector 1: Triggers -> Build */}
        <div className="hidden lg:flex flex-col items-center justify-center px-1 shrink-0 relative w-12">
          {/* Conduit track */}
          <div className="relative w-full h-[2px] bg-white/[0.1] rounded-full overflow-hidden">
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                simState === 'triggering' || simState === 'building' ? 'opacity-100' : 'opacity-40'
              } bg-[#58a6ff]`}
            />
            {/* Moving Light Beam */}
            <motion.div
              className="absolute top-0 bottom-0 w-8 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #58a6ff, #ffffff, #58a6ff, transparent)',
                boxShadow: '0 0 10px #58a6ff',
              }}
              animate={{
                x: [-30, 50],
              }}
              transition={{
                duration: simState === 'triggering' ? 0.6 : 1.6,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Central Arrow Pulse Node */}
          <motion.div
            animate={
              simState === 'triggering'
                ? { scale: [1, 1.3, 1], boxShadow: ['0 0 0px #58a6ff', '0 0 14px #58a6ff', '0 0 0px #58a6ff'] }
                : {}
            }
            transition={{ duration: 0.6, repeat: simState === 'triggering' ? Infinity : 0 }}
            className={`mt-2 p-1 rounded-full border shadow-sm transition-all ${
              simState === 'triggering' || simState === 'building'
                ? 'bg-[#58a6ff]/20 border-[#58a6ff] text-[#58a6ff]'
                : 'bg-[#161b22] border-white/[0.08] text-[#8b949e]'
            }`}
          >
            <ArrowRight className="w-3 h-3" />
          </motion.div>
        </div>

        {/* Stage 2: Build & Test Job */}
        <motion.div
          animate={
            simState === 'building'
              ? {
                  scale: [1, 1.015, 1],
                  borderColor: ['rgba(56,139,253,0.3)', 'rgba(56,139,253,0.9)', 'rgba(56,139,253,0.5)'],
                  boxShadow: [
                    '0 0 0px rgba(56,139,253,0)',
                    '0 0 24px rgba(56,139,253,0.3)',
                    '0 0 8px rgba(56,139,253,0.15)',
                  ],
                }
              : {}
          }
          transition={{ duration: 1.2, repeat: simState === 'building' ? Infinity : 0 }}
          className={`flex-1 rounded-2xl border backdrop-blur-xl p-4 flex flex-col justify-between transition-all duration-300 relative ${
            simState === 'building'
              ? 'bg-[#161b22]/90 border-[#58a6ff] ring-1 ring-[#58a6ff]/40 shadow-xl shadow-blue-950/30'
              : simState === 'deploying' || simState === 'succeeded'
              ? 'bg-[#161b22]/70 border-[#2ea043]/40'
              : 'bg-[#161b22]/70 border-white/[0.08]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#f0f6fc] flex items-center gap-1.5">
                {getLanguageIcon()}
                <span>Job: build</span>
                {simState === 'building' && (
                  <Loader2 className="w-3 h-3 animate-spin text-[#58a6ff] ml-1" />
                )}
                {(simState === 'deploying' || simState === 'succeeded') && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] ml-1" />
                )}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#388bfd]/15 text-[#58a6ff] border border-[#388bfd]/30 flex items-center gap-1">
                {language.type.toUpperCase()}
              </span>
            </div>

            {/* Sequential Steps List with Animated Checkmarks */}
            <div className="space-y-1.5 text-xs">
              {allBuildSteps.map((step, idx) => {
                const isCurrent = simState === 'building' && activeStepIdx === idx;
                const isPassed =
                  simState === 'deploying' ||
                  simState === 'succeeded' ||
                  (simState === 'building' && activeStepIdx > idx);

                return (
                  <motion.div
                    key={step.id}
                    whileHover={{ scale: 1.015, x: 2 }}
                    className={`flex items-center justify-between p-2 rounded-xl border text-[11px] transition-all ${
                      isCurrent
                        ? 'bg-[#388bfd]/20 border-[#58a6ff] text-white shadow-sm ring-1 ring-[#58a6ff]/30'
                        : isPassed
                        ? 'bg-[#238636]/10 border-[#238636]/30 text-[#c9d1d9]'
                        : 'bg-[#0d1117]/70 border-white/[0.06] text-[#8b949e]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isCurrent ? (
                        <Loader2 className="w-3 h-3 animate-spin text-[#58a6ff] shrink-0" />
                      ) : isPassed ? (
                        <Check className="w-3 h-3 text-[#3fb950] shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full bg-white/[0.06] text-[9px] flex items-center justify-center font-mono shrink-0">
                          {idx + 1}
                        </span>
                      )}
                      <span className={`truncate ${isPassed ? 'text-[#f0f6fc]' : ''}`}>
                        {step.name}
                      </span>
                    </div>

                    {isCurrent && (
                      <span className="text-[9px] font-mono text-[#79c0ff] animate-pulse shrink-0">
                        running...
                      </span>
                    )}
                    {isPassed && (
                      <span className="text-[9px] font-mono text-[#3fb950] shrink-0">done</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {isMultiJob && (
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-[10px] text-[#79c0ff] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3 text-[#a371f7]" />
                Artifact Output:
              </span>
              <span className="font-mono text-[#c9d1d9]">actions/upload-artifact</span>
            </div>
          )}
        </motion.div>

        {/* Stage 3: Deployment Job (if multi-job active) */}
        {isMultiJob && (
          <>
            {/* Animated Connector 2: Build -> Deploy */}
            <div className="hidden lg:flex flex-col items-center justify-center px-1 shrink-0 relative w-12">
              {/* Conduit Track */}
              <div className="relative w-full h-[2px] bg-white/[0.1] rounded-full overflow-hidden">
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    simState === 'deploying' ? 'opacity-100' : 'opacity-40'
                  } bg-[#f0883e]`}
                />
                {/* Moving Light Beam */}
                <motion.div
                  className="absolute top-0 bottom-0 w-8 rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, #f0883e, #ffffff, #f0883e, transparent)',
                    boxShadow: '0 0 10px #f0883e',
                  }}
                  animate={{
                    x: [-30, 50],
                  }}
                  transition={{
                    duration: simState === 'deploying' ? 0.6 : 1.6,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>

              {/* Central Arrow Pulse Node */}
              <motion.div
                animate={
                  simState === 'deploying'
                    ? {
                        scale: [1, 1.3, 1],
                        boxShadow: ['0 0 0px #f0883e', '0 0 14px #f0883e', '0 0 0px #f0883e'],
                      }
                    : {}
                }
                transition={{ duration: 0.6, repeat: simState === 'deploying' ? Infinity : 0 }}
                className={`mt-2 p-1 rounded-full border shadow-sm transition-all ${
                  simState === 'deploying'
                    ? 'bg-[#f0883e]/20 border-[#f0883e] text-[#f0883e]'
                    : simState === 'succeeded'
                    ? 'bg-[#238636]/20 border-[#238636] text-[#3fb950]'
                    : 'bg-[#161b22] border-white/[0.08] text-[#8b949e]'
                }`}
              >
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            </div>

            {/* Stage 3 Card */}
            <motion.div
              animate={
                simState === 'deploying'
                  ? {
                      scale: [1, 1.02, 1],
                      borderColor: ['rgba(240,136,62,0.4)', 'rgba(240,136,62,1)', 'rgba(240,136,62,0.5)'],
                      boxShadow: [
                        '0 0 0px rgba(240,136,62,0)',
                        '0 0 24px rgba(240,136,62,0.4)',
                        '0 0 8px rgba(240,136,62,0.2)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1, repeat: simState === 'deploying' ? Infinity : 0 }}
              className={`flex-1 rounded-2xl border backdrop-blur-xl p-4 flex flex-col justify-between transition-all duration-300 ${
                simState === 'deploying'
                  ? 'bg-[#161b22]/95 border-[#f0883e] ring-1 ring-[#f0883e]/50 shadow-xl shadow-orange-950/40'
                  : simState === 'succeeded'
                  ? 'bg-[#161b22]/80 border-[#2ea043]/50 shadow-lg shadow-green-950/20'
                  : 'bg-[#161b22]/70 border-white/[0.08]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#f0f6fc] flex items-center gap-1.5">
                    {getDeploymentIcon()}
                    <span>Job: deploy</span>
                    {simState === 'deploying' && (
                      <Loader2 className="w-3 h-3 animate-spin text-[#f0883e] ml-1" />
                    )}
                    {simState === 'succeeded' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] ml-1" />
                    )}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0883e]/20 text-[#ffa657] border border-[#f0883e]/40 font-mono">
                    needs: [build]
                  </span>
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-2.5 rounded-xl border transition-all ${
                      simState === 'deploying'
                        ? 'bg-[#f0883e]/15 border-[#f0883e]/50 text-white'
                        : 'bg-[#0d1117]/80 border-white/[0.07]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#f0f6fc] flex items-center gap-1.5">
                      {getDeploymentIcon()}
                      Target: {deployment.target.toUpperCase()}
                    </div>
                    <p className="text-[10px] text-[#8b949e] mt-0.5">
                      Waits for the build job to complete successfully before initiating deployment.
                    </p>
                  </div>

                  {deployment.target === 'docker' && (
                    <div className="text-[11px] text-[#c9d1d9] space-y-1 bg-[#0d1117]/70 p-2.5 rounded-xl border border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Set up Docker Buildx
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Authenticate Docker Hub
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Build & Push Image
                      </div>
                    </div>
                  )}

                  {deployment.target === 'aws' && (
                    <div className="text-[11px] text-[#c9d1d9] space-y-1 bg-[#0d1117]/70 p-2.5 rounded-xl border border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Configure AWS Credentials
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Deploy to{' '}
                        <span className="text-[#f0883e] font-semibold">{deployment.aws.service}</span>
                      </div>
                    </div>
                  )}

                  {deployment.target === 'vercel' && (
                    <div className="text-[11px] text-[#c9d1d9] space-y-1 bg-[#0d1117]/70 p-2.5 rounded-xl border border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Authenticate Vercel Token
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Deploy {deployment.vercel.environment}
                      </div>
                    </div>
                  )}

                  {deployment.target === 'github_pages' && (
                    <div className="text-[11px] text-[#c9d1d9] space-y-1 bg-[#0d1117]/70 p-2.5 rounded-xl border border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Configure Pages Environment
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3fb950]" /> Deploy Static Artifacts
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] text-[10px] text-[#3fb950] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#3fb950]" />
                  Deployment Gate:
                </span>
                <span className="font-mono">
                  {simState === 'succeeded' ? 'Deployed Successfully' : 'Automated Gate'}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
