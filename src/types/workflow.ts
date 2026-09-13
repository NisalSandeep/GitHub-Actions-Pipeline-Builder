export type RunnerOS = 'ubuntu-latest' | 'windows-latest' | 'macos-latest' | 'self-hosted';

export type LanguageType = 'node' | 'python' | 'go' | 'java' | 'rust' | 'none';

export type DeploymentTarget = 'none' | 'docker' | 'aws' | 'vercel' | 'github_pages';

export type AwsService = 's3' | 'ecs' | 'lambda' | 'elastic_beanstalk';

export interface EnvVar {
  key: string;
  value: string;
}

export interface StepConfig {
  id: string;
  name: string;
  run?: string;
  uses?: string;
  with?: Record<string, string>;
  env: EnvVar[];
  ifCondition?: string;
  workingDirectory?: string;
  continueOnError?: boolean;
}

export interface StepTemplate {
  name: string;
  category: string;
  run?: string;
  uses?: string;
  with?: Record<string, string>;
  env: EnvVar[];
}

export interface GlobalConfig {
  workflowName: string;
  filename: string;
  runsOn: RunnerOS;
  triggers: {
    push: {
      enabled: boolean;
      branches: string[];
      tags: string[];
    };
    pull_request: {
      enabled: boolean;
      branches: string[];
    };
    schedule: {
      enabled: boolean;
      cron: string;
    };
    workflow_dispatch: {
      enabled: boolean;
    };
  };
  concurrency: {
    enabled: boolean;
    group: string;
    cancelInProgress: boolean;
  };
  permissions: {
    enabled: boolean;
    contents: 'read' | 'write' | 'none';
    pullRequests: 'read' | 'write' | 'none';
    idToken: 'read' | 'write' | 'none';
  };
}

export interface NodeConfig {
  versions: string[];
  useMatrix: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
}

export interface PythonConfig {
  versions: string[];
  useMatrix: boolean;
  packageManager: 'pip' | 'poetry' | 'uv' | 'pipenv';
}

export interface GoConfig {
  versions: string[];
  useMatrix: boolean;
}

export interface JavaConfig {
  versions: string[];
  useMatrix: boolean;
  distribution: 'temurin' | 'zulu' | 'corretto' | 'adopt';
  buildTool: 'maven' | 'gradle';
}

export interface RustConfig {
  toolchains: string[];
  useMatrix: boolean;
  components: string[];
}

export interface LanguageConfig {
  type: LanguageType;
  node: NodeConfig;
  python: PythonConfig;
  go: GoConfig;
  java: JavaConfig;
  rust: RustConfig;
}

export interface CachingConfig {
  enabled: boolean;
  customPaths: string;
  cacheKeyPrefix: string;
}

export interface DockerDeploymentConfig {
  registry: 'dockerhub' | 'ghcr';
  imageName: string;
  tags: string;
  dockerfile: string;
  context: string;
}

export interface AwsDeploymentConfig {
  service: AwsService;
  region: string;
  s3Bucket: string;
  s3SourceDir: string;
  ecsCluster: string;
  ecsService: string;
  lambdaFunctionName: string;
}

export interface VercelDeploymentConfig {
  environment: 'production' | 'preview';
  projectArgs: string;
}

export interface GitHubPagesDeploymentConfig {
  path: string;
}

export interface DeploymentConfig {
  enabled: boolean;
  target: DeploymentTarget;
  docker: DockerDeploymentConfig;
  aws: AwsDeploymentConfig;
  vercel: VercelDeploymentConfig;
  githubPages: GitHubPagesDeploymentConfig;
}

export interface WorkflowState {
  global: GlobalConfig;
  language: LanguageConfig;
  caching: CachingConfig;
  steps: StepConfig[];
  deployment: DeploymentConfig;
}

export interface RequiredSecret {
  name: string;
  description: string;
  recommendedValue?: string;
  target: 'Docker Hub' | 'AWS' | 'Vercel' | 'GitHub' | 'General';
}

export interface WorkflowPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  state: Partial<WorkflowState>;
}
