import { load } from 'js-yaml';
import {
  WorkflowState,
  RunnerOS,
  LanguageType,
  EnvVar,
  StepConfig,
  DeploymentTarget,
} from '../types/workflow';
import { DEFAULT_WORKFLOW_STATE } from './presets';

export interface ParseResult {
  success: boolean;
  state?: WorkflowState;
  error?: string;
  summary?: {
    workflowName: string;
    triggersCount: number;
    stepsCount: number;
    detectedLanguage: string;
    hasMatrix: boolean;
    hasDeployment: boolean;
  };
}

/**
 * Parses raw GitHub Actions YAML and hydrates a typed WorkflowState for the Visual Builder.
 */
export function parseYamlToWorkflow(yamlText: string): ParseResult {
  try {
    if (!yamlText || !yamlText.trim()) {
      return { success: false, error: 'YAML input is empty.' };
    }

    const doc = load(yamlText) as Record<string, any>;

    if (!doc || typeof doc !== 'object') {
      return { success: false, error: 'Document does not contain a valid YAML object.' };
    }

    // Start from a fresh clone of the default state
    const newState: WorkflowState = JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_STATE));

    // 1. Workflow Name
    if (doc.name && typeof doc.name === 'string') {
      newState.global.workflowName = doc.name;
    }

    // 2. Global Environment Variables (env:)
    if (doc.env && typeof doc.env === 'object') {
      const parsedEnv: EnvVar[] = [];
      for (const [key, value] of Object.entries(doc.env)) {
        parsedEnv.push({ key, value: String(value ?? '') });
      }
      newState.global.env = parsedEnv;
    }

    // 3. Triggers (on:)
    let triggersCount = 0;
    if (doc.on) {
      // Reset default triggers
      newState.global.triggers.push.enabled = false;
      newState.global.triggers.pull_request.enabled = false;
      newState.global.triggers.schedule.enabled = false;
      newState.global.triggers.workflow_dispatch.enabled = false;

      if (typeof doc.on === 'string') {
        if (doc.on === 'push') {
          newState.global.triggers.push.enabled = true;
          triggersCount++;
        } else if (doc.on === 'pull_request') {
          newState.global.triggers.pull_request.enabled = true;
          triggersCount++;
        } else if (doc.on === 'workflow_dispatch') {
          newState.global.triggers.workflow_dispatch.enabled = true;
          triggersCount++;
        }
      } else if (Array.isArray(doc.on)) {
        doc.on.forEach((t: string) => {
          if (t === 'push') {
            newState.global.triggers.push.enabled = true;
            triggersCount++;
          }
          if (t === 'pull_request') {
            newState.global.triggers.pull_request.enabled = true;
            triggersCount++;
          }
          if (t === 'workflow_dispatch') {
            newState.global.triggers.workflow_dispatch.enabled = true;
            triggersCount++;
          }
        });
      } else if (typeof doc.on === 'object') {
        // Push trigger
        if (doc.on.push) {
          newState.global.triggers.push.enabled = true;
          triggersCount++;
          if (Array.isArray(doc.on.push.branches)) {
            newState.global.triggers.push.branches = doc.on.push.branches.map(String);
          }
          if (Array.isArray(doc.on.push.tags)) {
            newState.global.triggers.push.tags = doc.on.push.tags.map(String);
          }
        }
        // Pull Request trigger
        if (doc.on.pull_request) {
          newState.global.triggers.pull_request.enabled = true;
          triggersCount++;
          if (Array.isArray(doc.on.pull_request.branches)) {
            newState.global.triggers.pull_request.branches = doc.on.pull_request.branches.map(String);
          }
        }
        // Schedule trigger
        if (doc.on.schedule && Array.isArray(doc.on.schedule) && doc.on.schedule[0]?.cron) {
          newState.global.triggers.schedule.enabled = true;
          newState.global.triggers.schedule.cron = String(doc.on.schedule[0].cron);
          triggersCount++;
        }
        // Workflow Dispatch trigger
        if (doc.on.workflow_dispatch !== undefined) {
          newState.global.triggers.workflow_dispatch.enabled = true;
          triggersCount++;
        }
      }
    }

    // 4. Permissions (permissions:)
    if (doc.permissions) {
      newState.global.permissions.enabled = true;
      if (typeof doc.permissions === 'object') {
        if (doc.permissions.contents) {
          newState.global.permissions.contents = doc.permissions.contents as any;
        }
        if (doc.permissions['pull-requests']) {
          newState.global.permissions.pullRequests = doc.permissions['pull-requests'] as any;
        }
        if (doc.permissions['id-token']) {
          newState.global.permissions.idToken = doc.permissions['id-token'] as any;
        }
      }
    }

    // 5. Concurrency (concurrency:)
    if (doc.concurrency) {
      newState.global.concurrency.enabled = true;
      if (typeof doc.concurrency === 'string') {
        newState.global.concurrency.group = doc.concurrency;
      } else if (typeof doc.concurrency === 'object') {
        if (doc.concurrency.group) newState.global.concurrency.group = String(doc.concurrency.group);
        if (doc.concurrency['cancel-in-progress'] !== undefined) {
          newState.global.concurrency.cancelInProgress = Boolean(doc.concurrency['cancel-in-progress']);
        }
      }
    }

    // 6. Jobs (jobs:)
    let detectedLanguage: LanguageType = 'none';
    let hasMatrix = false;
    let hasDeployment = false;
    const customSteps: StepConfig[] = [];

    if (doc.jobs && typeof doc.jobs === 'object') {
      const jobKeys = Object.keys(doc.jobs);

      // Find primary build/test job (prefer 'build', 'test', 'ci', or first job)
      const primaryJobKey =
        jobKeys.find((k) => ['build', 'test', 'ci', 'main'].includes(k.toLowerCase())) ||
        jobKeys[0];

      const primaryJob = primaryJobKey ? doc.jobs[primaryJobKey] : null;

      if (primaryJob && typeof primaryJob === 'object') {
        // Runner OS
        if (primaryJob['runs-on']) {
          const runner = String(primaryJob['runs-on']);
          if (['ubuntu-latest', 'windows-latest', 'macos-latest', 'self-hosted'].includes(runner)) {
            newState.global.runsOn = runner as RunnerOS;
          }
        }

        // Matrix Strategy
        if (primaryJob.strategy && primaryJob.strategy.matrix) {
          hasMatrix = true;
          const mat = primaryJob.strategy.matrix;
          newState.matrix.enabled = true;

          // Check OS in matrix
          if (Array.isArray(mat.os)) {
            const parsedOs = mat.os.filter((o: string) =>
              ['ubuntu-latest', 'windows-latest', 'macos-latest', 'self-hosted'].includes(o)
            );
            if (parsedOs.length > 0) newState.matrix.os = parsedOs;
          }

          // Check version matrix keys (node-version, python-version, go-version, etc.)
          const verKey = Object.keys(mat).find((k) => k.toLowerCase().includes('version'));
          if (verKey && Array.isArray(mat[verKey])) {
            newState.matrix.versions = mat[verKey].map(String);
          }

          if (primaryJob.strategy['fail-fast'] !== undefined) {
            newState.matrix.failFast = Boolean(primaryJob.strategy['fail-fast']);
          }
          if (primaryJob.strategy['max-parallel']) {
            newState.matrix.maxParallel = Number(primaryJob.strategy['max-parallel']);
          }
        }

        // Steps Parsing
        if (Array.isArray(primaryJob.steps)) {
          primaryJob.steps.forEach((rawStep: any, idx: number) => {
            if (!rawStep || typeof rawStep !== 'object') return;

            const uses = rawStep.uses ? String(rawStep.uses) : undefined;
            const run = rawStep.run ? String(rawStep.run) : undefined;
            const name = rawStep.name ? String(rawStep.name) : `Step ${idx + 1}`;

            // Check for Language setup actions
            if (uses) {
              if (uses.includes('actions/setup-node')) {
                detectedLanguage = 'node';
                newState.language.type = 'node';
                if (rawStep.with?.['node-version']) {
                  const v = String(rawStep.with['node-version']);
                  if (!newState.language.node.versions.includes(v)) {
                    newState.language.node.versions = [v];
                  }
                }
                return;
              } else if (uses.includes('actions/setup-python')) {
                detectedLanguage = 'python';
                newState.language.type = 'python';
                if (rawStep.with?.['python-version']) {
                  newState.language.python.versions = [String(rawStep.with['python-version'])];
                }
                return;
              } else if (uses.includes('actions/setup-go')) {
                detectedLanguage = 'go';
                newState.language.type = 'go';
                return;
              } else if (uses.includes('actions/setup-java')) {
                detectedLanguage = 'java';
                newState.language.type = 'java';
                return;
              } else if (uses.includes('actions-rust-lang/setup-rust-toolchain')) {
                detectedLanguage = 'rust';
                newState.language.type = 'rust';
                return;
              } else if (uses.includes('shivammathur/setup-php')) {
                detectedLanguage = 'php';
                newState.language.type = 'php';
                return;
              } else if (uses.includes('actions/setup-dotnet')) {
                detectedLanguage = 'dotnet';
                newState.language.type = 'dotnet';
                return;
              } else if (uses.includes('ruby/setup-ruby')) {
                detectedLanguage = 'ruby';
                newState.language.type = 'ruby';
                return;
              } else if (uses.includes('subosito/flutter-action')) {
                detectedLanguage = 'flutter';
                newState.language.type = 'flutter';
                return;
              } else if (uses.includes('actions/checkout')) {
                // Checkout is standard base step
                return;
              } else if (uses.includes('actions/cache')) {
                newState.caching.enabled = true;
                if (rawStep.with?.path) newState.caching.customPaths = String(rawStep.with.path);
                return;
              }
            }

            // Regular custom step
            const stepEnv: EnvVar[] = [];
            if (rawStep.env && typeof rawStep.env === 'object') {
              for (const [k, v] of Object.entries(rawStep.env)) {
                stepEnv.push({ key: k, value: String(v ?? '') });
              }
            }

            customSteps.push({
              id: `imported-step-${idx + 1}`,
              name,
              run,
              uses,
              with: rawStep.with && typeof rawStep.with === 'object' ? rawStep.with : undefined,
              env: stepEnv,
              ifCondition: rawStep.if ? String(rawStep.if) : undefined,
            });
          });
        }
      }

      // Check for Deploy Job (e.g. 'deploy', 'release', 'publish')
      const deployJobKey = jobKeys.find((k) =>
        ['deploy', 'deployment', 'publish', 'release'].includes(k.toLowerCase())
      );

      if (deployJobKey && doc.jobs[deployJobKey]) {
        hasDeployment = true;
        newState.deployment.enabled = true;
        const deployJob = doc.jobs[deployJobKey];

        // GitHub Environment detection
        if (deployJob.environment) {
          newState.deployment.environment.enabled = true;
          if (typeof deployJob.environment === 'string') {
            newState.deployment.environment.name = deployJob.environment;
          } else if (typeof deployJob.environment === 'object') {
            if (deployJob.environment.name) {
              newState.deployment.environment.name = String(deployJob.environment.name);
            }
            if (deployJob.environment.url) {
              newState.deployment.environment.url = String(deployJob.environment.url);
            }
          }
        }

        // Deployment Target detection
        const deploySteps = Array.isArray(deployJob.steps) ? deployJob.steps : [];
        const usesList = deploySteps.map((s: any) => (s?.uses ? String(s.uses) : ''));

        if (usesList.some((u: string) => u.includes('docker/build-push-action'))) {
          newState.deployment.target = 'docker';
        } else if (usesList.some((u: string) => u.includes('aws-actions/'))) {
          newState.deployment.target = 'aws';
        } else if (usesList.some((u: string) => u.includes('vercel'))) {
          newState.deployment.target = 'vercel';
        } else if (usesList.some((u: string) => u.includes('actions/deploy-pages'))) {
          newState.deployment.target = 'github_pages';
        }
      }
    }

    if (customSteps.length > 0) {
      newState.steps = customSteps;
    }

    return {
      success: true,
      state: newState,
      summary: {
        workflowName: newState.global.workflowName,
        triggersCount,
        stepsCount: newState.steps.length,
        detectedLanguage,
        hasMatrix,
        hasDeployment,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to parse YAML. Please check syntax.',
    };
  }
}
