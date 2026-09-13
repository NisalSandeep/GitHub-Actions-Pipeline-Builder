'use client';

import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
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
} from '../icons/BrandIcons';

export const PipelineDiagram: React.FC = () => {
  const { state } = useWorkflow();
  const { global, language, steps, deployment, caching } = state;

  const isMultiJob = deployment.enabled && deployment.target !== 'none';

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
    <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-5 space-y-6 shadow-2xl overflow-x-auto">
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#a371f7]" />
          <h3 className="text-xs font-bold text-[#f0f6fc]">Visual Pipeline Architecture (DAG)</h3>
        </div>
        <span className="text-[11px] text-[#8b949e]">
          {isMultiJob ? 'Multi-Stage Interdependent Pipeline' : 'Single-Stage CI Pipeline'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4 min-w-[500px]">
        {/* Stage 1: Triggers */}
        <div className="flex-1 rounded-xl bg-[#161b22] border border-[#30363d] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#f0f6fc] flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-[#3fb950]" />
                Trigger Events
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e]">
                on:
              </span>
            </div>

            <div className="space-y-2">
              {global.triggers.push.enabled && (
                <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-[#3fb950] flex items-center gap-1">
                    <GitCommit className="w-3 h-3" />
                    Push Event
                  </div>
                  <div className="text-[10px] text-[#8b949e] font-mono">
                    branches: [{global.triggers.push.branches.join(', ') || 'all'}]
                  </div>
                </div>
              )}

              {global.triggers.pull_request.enabled && (
                <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-[#58a6ff] flex items-center gap-1">
                    <GitPullRequest className="w-3 h-3" />
                    Pull Request
                  </div>
                  <div className="text-[10px] text-[#8b949e] font-mono">
                    target: [{global.triggers.pull_request.branches.join(', ') || 'main'}]
                  </div>
                </div>
              )}

              {global.triggers.schedule.enabled && (
                <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-[#d29922] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Cron Schedule
                  </div>
                  <div className="text-[10px] text-[#8b949e] font-mono">
                    {global.triggers.schedule.cron}
                  </div>
                </div>
              )}

              {global.triggers.workflow_dispatch.enabled && (
                <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-[#a371f7] flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" />
                    Manual Dispatch
                  </div>
                  <div className="text-[10px] text-[#8b949e]">GitHub Actions UI Button</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#21262d] text-[10px] text-[#8b949e] flex items-center justify-between">
            <span className="flex items-center gap-1">Runner OS</span>
            <span className="font-mono text-[#c9d1d9] flex items-center gap-1">
              {getRunnerIcon()}
              {global.runsOn}
            </span>
          </div>
        </div>

        {/* Transition Arrow 1 */}
        <div className="hidden lg:flex items-center justify-center text-[#58a6ff]">
          <ArrowRight className="w-6 h-6 animate-pulse" />
        </div>

        {/* Stage 2: Build & Test Job */}
        <div className="flex-1 rounded-xl bg-[#161b22] border border-[#30363d] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#f0f6fc] flex items-center gap-1.5">
                {getLanguageIcon()}
                Job: build
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#388bfd1a] text-[#58a6ff] border border-[#388bfd33] flex items-center gap-1">
                {language.type.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 p-1.5 rounded bg-[#0d1117] text-[11px] text-[#c9d1d9]">
                <CheckCircle2 className="w-3 h-3 text-[#3fb950] shrink-0" />
                <span>actions/checkout@v4</span>
              </div>

              {language.type !== 'none' && (
                <div className="flex items-center gap-2 p-1.5 rounded bg-[#0d1117] text-[11px] text-[#c9d1d9]">
                  <CheckCircle2 className="w-3 h-3 text-[#3fb950] shrink-0" />
                  <span>Setup {language.type} runtime</span>
                </div>
              )}

              {caching.enabled && (
                <div className="flex items-center gap-2 p-1.5 rounded bg-[#0d1117] text-[11px] text-[#c9d1d9]">
                  <HardDrive className="w-3 h-3 text-[#d29922] shrink-0" />
                  <span>Dependency cache lookup</span>
                </div>
              )}

              {steps.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-1.5 rounded bg-[#0d1117] text-[11px] text-[#c9d1d9]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#21262d] text-[9px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="truncate">{s.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isMultiJob && (
            <div className="mt-4 pt-3 border-t border-[#21262d] text-[10px] text-[#79c0ff] flex items-center justify-between">
              <span>Artifact output:</span>
              <span className="font-mono">actions/upload-artifact</span>
            </div>
          )}
        </div>

        {/* Stage 3: Deployment Job (if active) */}
        {isMultiJob && (
          <>
            <div className="hidden lg:flex items-center justify-center text-[#f0883e]">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            <div className="flex-1 rounded-xl bg-[#161b22] border border-[#f0883e]/40 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#f0f6fc] flex items-center gap-1.5">
                    {getDeploymentIcon()}
                    Job: deploy
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0883e]/20 text-[#ffa657] border border-[#f0883e]/40">
                    needs: [build]
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                    <div className="text-xs font-semibold text-[#f0f6fc] flex items-center gap-1.5">
                      {getDeploymentIcon()}
                      Target: {deployment.target.toUpperCase()}
                    </div>
                    <p className="text-[10px] text-[#8b949e]">
                      Waits for the build job to complete successfully before initiating deployment.
                    </p>
                  </div>

                  {deployment.target === 'docker' && (
                    <div className="text-[11px] text-[#c9d1d9] space-y-1 bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">
                      <div>• Set up Docker Buildx</div>
                      <div>• Authenticate Docker Hub</div>
                      <div>• Build & Push: <code className="text-[#79c0ff]">{deployment.docker.imageName}</code></div>
                    </div>
                  )}

                  {deployment.target === 'aws' && (
                    <div className="text-[11px] text-[#c9d1d9] space-y-1 bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">
                      <div>• Configure AWS credentials</div>
                      <div>• Deploy target: <span className="text-[#f0883e]">{deployment.aws.service}</span> ({deployment.aws.region})</div>
                    </div>
                  )}

                  {deployment.target === 'vercel' && (
                    <div className="text-[11px] text-[#c9d1d9] space-y-1 bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">
                      <div>• Authenticate Vercel Token</div>
                      <div>• Deploy target: <span className="text-[#3fb950]">{deployment.vercel.environment}</span></div>
                    </div>
                  )}

                  {deployment.target === 'github_pages' && (
                    <div className="text-[11px] text-[#c9d1d9] space-y-1 bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">
                      <div>• Configure Pages environment</div>
                      <div>• Deploy Static Artifacts</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#21262d] text-[10px] text-[#3fb950] flex items-center justify-between">
                <span>Status</span>
                <span>Automated Deployment Gate</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
