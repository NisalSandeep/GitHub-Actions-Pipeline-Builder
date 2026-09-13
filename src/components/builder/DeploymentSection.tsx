'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { useToast } from '../../context/ToastContext';
import { DeploymentTarget, AwsService } from '../../types/workflow';
import {
  Rocket,
  Layers,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import {
  DockerIcon,
  AwsIcon,
  VercelIcon,
  GitHubIcon,
  BeakerIcon,
} from '../icons/BrandIcons';

interface DeploymentOption {
  target: DeploymentTarget;
  name: string;
  badge: string;
  icon: React.ReactNode;
  desc: string;
  secrets: string[];
}

const TARGETS: DeploymentOption[] = [
  {
    target: 'none',
    name: 'None (CI Only)',
    badge: 'Single Job',
    icon: <BeakerIcon className="w-8 h-8" />,
    desc: 'Build, lint, and test suite only without external deployment.',
    secrets: [],
  },
  {
    target: 'docker',
    name: 'Docker Hub / Registry',
    badge: 'Multi-Job Container',
    icon: <DockerIcon className="w-8 h-8" />,
    desc: 'Multi-platform Docker build, cache & push to Docker Hub / GHCR.',
    secrets: ['DOCKERHUB_USERNAME', 'DOCKERHUB_TOKEN'],
  },
  {
    target: 'aws',
    name: 'Amazon Web Services',
    badge: 'Cloud Infrastructure',
    icon: <AwsIcon className="w-8 h-8" />,
    desc: 'Deploy to AWS S3, Elastic Container Service (ECS), or AWS Lambda.',
    secrets: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'],
  },
  {
    target: 'vercel',
    name: 'Vercel Deployment',
    badge: 'Edge Hosting',
    icon: <VercelIcon className="w-8 h-8" />,
    desc: 'Automated frontend & serverless deployment with preview URLs.',
    secrets: ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID'],
  },
  {
    target: 'github_pages',
    name: 'GitHub Pages',
    badge: 'Static Sites',
    icon: <GitHubIcon className="w-8 h-8" />,
    desc: 'Official GitHub Pages deploy action with id-token permissions.',
    secrets: [],
  },
];

export const DeploymentSection: React.FC = () => {
  const {
    state,
    updateDeployment,
    updateDockerDeployment,
    updateAwsDeployment,
    updateVercelDeployment,
    updateGitHubPagesDeployment,
  } = useWorkflow();

  const { showToast } = useToast();

  const handleSelectTarget = (target: DeploymentTarget) => {
    const opt = TARGETS.find((t) => t.target === target);
    updateDeployment({
      enabled: target !== 'none',
      target,
    });
    showToast({
      type: target === 'none' ? 'info' : 'success',
      title: `Deployment: ${opt?.name || target}`,
      description: opt?.desc || '',
    });
  };

  const currentTarget = TARGETS.find((t) => t.target === state.deployment.target) || TARGETS[0];

  return (
    <div className="space-y-6">
      {/* Target Selector Grid */}
      <div>
        <label className="block text-xs font-semibold text-[#f0f6fc] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-[#f0883e]" />
            Select Deployment Destination
          </span>
          {state.deployment.enabled && (
            <span className="text-[11px] text-[#3fb950] font-medium flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#a371f7]" />
              Multi-Job Pipeline (<code className="text-[#79c0ff]">needs: build</code>) Active
            </span>
          )}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TARGETS.map((t) => {
            const isSelected = state.deployment.target === t.target;
            return (
              <motion.button
                key={t.target}
                type="button"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => handleSelectTarget(t.target)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1f6feb]/20 border-[#58a6ff] shadow-[0_0_24px_rgba(56,139,253,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] ring-1 ring-[#58a6ff]/50 backdrop-blur-xl'
                    : 'bg-[#161b22]/60 border-white/[0.08] hover:border-[#58a6ff]/40 hover:bg-[#21262d]/70 backdrop-blur-xl shadow-sm hover:shadow-[0_8px_22px_rgba(0,0,0,0.35)]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2.5">
                  <div className="p-2 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] shadow-inner">
                    {t.icon}
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#58a6ff]" />}
                </div>
                <div className="text-xs font-bold text-[#f0f6fc]">{t.name}</div>
                <div className="text-[11px] text-[#8b949e] line-clamp-2 mt-1 leading-relaxed">{t.desc}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Target Specific Dynamic Forms with AnimatePresence */}
      <AnimatePresence mode="wait">
        {state.deployment.enabled && state.deployment.target !== 'none' && (
          <motion.div
            key={state.deployment.target}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="space-y-4"
          >
            {/* Secrets Alert Box */}
            {currentTarget.secrets.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#388bfd]/10 border border-[#388bfd]/30 backdrop-blur-xl flex items-start gap-3 shadow-sm">
                <KeyRound className="w-5 h-5 text-[#58a6ff] shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#f0f6fc]">
                      Required GitHub Repository Secrets
                    </h4>
                    <span className="text-[10px] text-[#79c0ff] bg-[#388bfd]/20 px-2.5 py-0.5 rounded-full border border-[#388bfd]/40 font-medium">
                      Repo Settings &gt; Secrets &gt; Actions
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8b949e]">
                    To execute this deployment safely, add the following encrypted secrets to your repository:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentTarget.secrets.map((sec) => (
                      <code
                        key={sec}
                        className="px-2.5 py-0.5 rounded-lg bg-[#0d1117]/80 border border-white/[0.08] font-mono text-[11px] text-[#7ee787]"
                      >
                        {sec}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Docker Hub Form */}
          {state.deployment.target === 'docker' && (
            <div className="p-5 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] shadow-inner">
                  <DockerIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f0f6fc]">Docker Image & Build Configuration</h4>
                  <p className="text-[11px] text-[#8b949e]">
                    Auto-injected: <code className="text-[#79c0ff]">docker/setup-buildx-action@v3</code> &amp; <code className="text-[#79c0ff]">docker/build-push-action@v5</code>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    Docker Image Name / Repository
                  </label>
                  <input
                    type="text"
                    value={state.deployment.docker.imageName}
                    onChange={(e) => updateDockerDeployment({ imageName: e.target.value })}
                    placeholder="e.g. dockerhub-username/my-app"
                    className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                  />
                  <span className="text-[10px] text-[#8b949e] mt-1 block">Format: username/image or registry/image</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={state.deployment.docker.tags}
                    onChange={(e) => updateDockerDeployment({ tags: e.target.value })}
                    placeholder="latest,${{ github.sha }}"
                    className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                  />
                  <span className="text-[10px] text-[#8b949e] mt-1 block">e.g. latest,${`{{ github.sha }}`}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    Dockerfile Path
                  </label>
                  <input
                    type="text"
                    value={state.deployment.docker.dockerfile}
                    onChange={(e) => updateDockerDeployment({ dockerfile: e.target.value })}
                    placeholder="./Dockerfile"
                    className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    Build Context Directory
                  </label>
                  <input
                    type="text"
                    value={state.deployment.docker.context}
                    onChange={(e) => updateDockerDeployment({ context: e.target.value })}
                    placeholder="."
                    className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AWS Form */}
          {state.deployment.target === 'aws' && (
            <div className="p-5 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] shadow-inner">
                  <AwsIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f0f6fc]">AWS Deployment Engine</h4>
                  <p className="text-[11px] text-[#8b949e]">
                    Auto-injected: <code className="text-[#79c0ff]">aws-actions/configure-aws-credentials@v4</code>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    AWS Target Service
                  </label>
                  <select
                    value={state.deployment.aws.service}
                    onChange={(e) => updateAwsDeployment({ service: e.target.value as AwsService })}
                    className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                  >
                    <option value="s3">Amazon S3 Bucket (Static Web / SPA)</option>
                    <option value="ecs">Amazon ECS (Elastic Container Service)</option>
                    <option value="lambda">AWS Lambda (Serverless Function)</option>
                    <option value="elastic_beanstalk">AWS Elastic Beanstalk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    AWS Region
                  </label>
                  <input
                    type="text"
                    value={state.deployment.aws.region}
                    onChange={(e) => updateAwsDeployment({ region: e.target.value })}
                    placeholder="us-east-1"
                    className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                  />
                </div>

                {state.deployment.aws.service === 's3' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                        S3 Bucket Name
                      </label>
                      <input
                        type="text"
                        value={state.deployment.aws.s3Bucket}
                        onChange={(e) => updateAwsDeployment({ s3Bucket: e.target.value })}
                        placeholder="my-production-app-bucket"
                        className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                        Source Artifact Directory
                      </label>
                      <input
                        type="text"
                        value={state.deployment.aws.s3SourceDir}
                        onChange={(e) => updateAwsDeployment({ s3SourceDir: e.target.value })}
                        placeholder="./dist"
                        className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                      />
                    </div>
                  </>
                )}

                {state.deployment.aws.service === 'ecs' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                        ECS Cluster Name
                      </label>
                      <input
                        type="text"
                        value={state.deployment.aws.ecsCluster}
                        onChange={(e) => updateAwsDeployment({ ecsCluster: e.target.value })}
                        placeholder="production-cluster"
                        className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                        ECS Service Name
                      </label>
                      <input
                        type="text"
                        value={state.deployment.aws.ecsService}
                        onChange={(e) => updateAwsDeployment({ ecsService: e.target.value })}
                        placeholder="frontend-service"
                        className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                      />
                    </div>
                  </>
                )}

                {state.deployment.aws.service === 'lambda' && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                      Lambda Function Name
                    </label>
                    <input
                      type="text"
                      value={state.deployment.aws.lambdaFunctionName}
                      onChange={(e) => updateAwsDeployment({ lambdaFunctionName: e.target.value })}
                      placeholder="fastapi-backend-handler"
                      className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vercel Form */}
          {state.deployment.target === 'vercel' && (
            <div className="p-5 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] shadow-inner">
                  <VercelIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f0f6fc]">Vercel Deployment Parameters</h4>
                  <p className="text-[11px] text-[#8b949e]">
                    Auto-injected: <code className="text-[#79c0ff]">amondnet/vercel-action@v25</code>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    Deployment Environment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateVercelDeployment({ environment: 'production' })}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        state.deployment.vercel.environment === 'production'
                          ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950] shadow-sm'
                          : 'bg-[#0d1117]/60 border-white/[0.08] text-[#8b949e] hover:text-[#f0f6fc]'
                      }`}
                    >
                      Production (--prod)
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateVercelDeployment({ environment: 'preview' })}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        state.deployment.vercel.environment === 'preview'
                          ? 'bg-[#388bfd]/20 border-[#388bfd] text-[#58a6ff] shadow-sm'
                          : 'bg-[#0d1117]/60 border-white/[0.08] text-[#8b949e] hover:text-[#f0f6fc]'
                      }`}
                    >
                      Preview Deploy
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                    Custom CLI Arguments (Optional)
                  </label>
                  <input
                    type="text"
                    value={state.deployment.vercel.projectArgs}
                    onChange={(e) => updateVercelDeployment({ projectArgs: e.target.value })}
                    placeholder="e.g. --build-env KEY=VAL"
                    className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* GitHub Pages Form */}
          {state.deployment.target === 'github_pages' && (
            <div className="p-5 rounded-2xl bg-[#161b22]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-[#0d1117]/80 border border-white/[0.08] shadow-inner">
                  <GitHubIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f0f6fc]">GitHub Pages Configuration</h4>
                  <p className="text-[11px] text-[#8b949e]">
                    Auto-configured with <code className="text-[#79c0ff]">id-token: write</code> permissions and environment binding.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
                  Static Artifact Directory Path
                </label>
                <input
                  type="text"
                  value={state.deployment.githubPages.path}
                  onChange={(e) => updateGitHubPagesDeployment({ path: e.target.value })}
                  placeholder="./out or ./dist"
                  className="w-full px-3 py-2 text-xs bg-[#0d1117]/60 border border-white/[0.09] rounded-xl text-[#f0f6fc] font-mono focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/30 transition-all backdrop-blur-md"
                />
              </div>
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
