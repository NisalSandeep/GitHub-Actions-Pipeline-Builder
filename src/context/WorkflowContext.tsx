'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  WorkflowState,
  GlobalConfig,
  LanguageType,
  NodeConfig,
  PythonConfig,
  GoConfig,
  JavaConfig,
  RustConfig,
  PhpConfig,
  DotnetConfig,
  RubyConfig,
  FlutterConfig,
  CachingConfig,
  StepConfig,
  DeploymentConfig,
  DockerDeploymentConfig,
  AwsDeploymentConfig,
  VercelDeploymentConfig,
  GitHubPagesDeploymentConfig,
  RequiredSecret,
} from '../types/workflow';
import { DEFAULT_WORKFLOW_STATE, WORKFLOW_PRESETS } from '../utils/presets';
import { generateYaml, getRequiredSecrets } from '../utils/yamlGenerator';

interface WorkflowContextType {
  state: WorkflowState;
  yaml: string;
  requiredSecrets: RequiredSecret[];
  updateGlobal: (partial: Partial<GlobalConfig>) => void;
  updateTriggerPush: (partial: Partial<GlobalConfig['triggers']['push']>) => void;
  updateTriggerPR: (partial: Partial<GlobalConfig['triggers']['pull_request']>) => void;
  updateTriggerSchedule: (partial: Partial<GlobalConfig['triggers']['schedule']>) => void;
  updateTriggerDispatch: (enabled: boolean) => void;
  updateLanguageType: (type: LanguageType) => void;
  updateLanguageNode: (partial: Partial<NodeConfig>) => void;
  updateLanguagePython: (partial: Partial<PythonConfig>) => void;
  updateLanguageGo: (partial: Partial<GoConfig>) => void;
  updateLanguageJava: (partial: Partial<JavaConfig>) => void;
  updateLanguageRust: (partial: Partial<RustConfig>) => void;
  updateLanguagePhp: (partial: Partial<PhpConfig>) => void;
  updateLanguageDotnet: (partial: Partial<DotnetConfig>) => void;
  updateLanguageRuby: (partial: Partial<RubyConfig>) => void;
  updateLanguageFlutter: (partial: Partial<FlutterConfig>) => void;
  updateCaching: (partial: Partial<CachingConfig>) => void;
  addStep: (stepTemplate?: Partial<StepConfig>) => void;
  updateStep: (id: string, partial: Partial<StepConfig>) => void;
  removeStep: (id: string) => void;
  duplicateStep: (id: string) => void;
  moveStep: (index: number, direction: 'up' | 'down') => void;
  reorderSteps: (startIndex: number, endIndex: number) => void;
  updateDeployment: (partial: Partial<DeploymentConfig>) => void;
  updateDockerDeployment: (partial: Partial<DockerDeploymentConfig>) => void;
  updateAwsDeployment: (partial: Partial<AwsDeploymentConfig>) => void;
  updateVercelDeployment: (partial: Partial<VercelDeploymentConfig>) => void;
  updateGitHubPagesDeployment: (partial: Partial<GitHubPagesDeploymentConfig>) => void;
  loadPreset: (presetId: string) => void;
  resetWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WorkflowState>(DEFAULT_WORKFLOW_STATE);

  const yaml = useMemo(() => generateYaml(state), [state]);
  const requiredSecrets = useMemo(() => getRequiredSecrets(state), [state]);

  const updateGlobal = useCallback((partial: Partial<GlobalConfig>) => {
    setState((prev) => ({
      ...prev,
      global: { ...prev.global, ...partial },
    }));
  }, []);

  const updateTriggerPush = useCallback((partial: Partial<GlobalConfig['triggers']['push']>) => {
    setState((prev) => ({
      ...prev,
      global: {
        ...prev.global,
        triggers: {
          ...prev.global.triggers,
          push: { ...prev.global.triggers.push, ...partial },
        },
      },
    }));
  }, []);

  const updateTriggerPR = useCallback((partial: Partial<GlobalConfig['triggers']['pull_request']>) => {
    setState((prev) => ({
      ...prev,
      global: {
        ...prev.global,
        triggers: {
          ...prev.global.triggers,
          pull_request: { ...prev.global.triggers.pull_request, ...partial },
        },
      },
    }));
  }, []);

  const updateTriggerSchedule = useCallback((partial: Partial<GlobalConfig['triggers']['schedule']>) => {
    setState((prev) => ({
      ...prev,
      global: {
        ...prev.global,
        triggers: {
          ...prev.global.triggers,
          schedule: { ...prev.global.triggers.schedule, ...partial },
        },
      },
    }));
  }, []);

  const updateTriggerDispatch = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      global: {
        ...prev.global,
        triggers: {
          ...prev.global.triggers,
          workflow_dispatch: { enabled },
        },
      },
    }));
  }, []);

  const updateLanguageType = useCallback((type: LanguageType) => {
    setState((prev) => {
      // Intelligently adapt steps based on language
      let defaultSteps = prev.steps;
      if (type === 'node') {
        defaultSteps = [
          { id: 'step-node-1', name: 'Install dependencies', run: 'npm ci', env: [] },
          { id: 'step-node-2', name: 'Run tests', run: 'npm test', env: [{ key: 'CI', value: 'true' }] },
          { id: 'step-node-3', name: 'Build project', run: 'npm run build', env: [] },
        ];
      } else if (type === 'python') {
        defaultSteps = [
          { id: 'step-py-1', name: 'Install dependencies', run: 'python -m pip install --upgrade pip\npip install -r requirements.txt', env: [] },
          { id: 'step-py-2', name: 'Run tests with pytest', run: 'pytest tests/', env: [] },
        ];
      } else if (type === 'go') {
        defaultSteps = [
          { id: 'step-go-1', name: 'Download dependencies', run: 'go mod download', env: [] },
          { id: 'step-go-2', name: 'Run tests', run: 'go test -v ./...', env: [] },
          { id: 'step-go-3', name: 'Build binary', run: 'go build -v ./...', env: [] },
        ];
      } else if (type === 'java') {
        defaultSteps = [
          { id: 'step-java-1', name: 'Grant execute permission for gradlew/mvnw', run: 'chmod +x gradlew || true', env: [] },
          { id: 'step-java-2', name: 'Build with Maven or Gradle', run: './mvnw clean package || ./gradlew build', env: [] },
        ];
      } else if (type === 'rust') {
        defaultSteps = [
          { id: 'step-rs-1', name: 'Check code formatting', run: 'cargo fmt --all -- --check', env: [] },
          { id: 'step-rs-2', name: 'Run Clippy linter', run: 'cargo clippy -- -D warnings', env: [] },
          { id: 'step-rs-3', name: 'Run tests', run: 'cargo test --verbose', env: [] },
        ];
      } else if (type === 'php') {
        defaultSteps = [
          { id: 'step-php-1', name: 'Install Composer dependencies', run: 'composer install --prefer-dist --no-progress', env: [] },
          { id: 'step-php-2', name: 'Run PHPUnit tests', run: 'vendor/bin/phpunit', env: [] },
        ];
      } else if (type === 'dotnet') {
        defaultSteps = [
          { id: 'step-dotnet-1', name: 'Restore dependencies', run: 'dotnet restore', env: [] },
          { id: 'step-dotnet-2', name: 'Build solution', run: 'dotnet build --no-restore --configuration Release', env: [] },
          { id: 'step-dotnet-3', name: 'Run tests', run: 'dotnet test --no-build --verbosity normal --configuration Release', env: [] },
        ];
      } else if (type === 'ruby') {
        defaultSteps = [
          { id: 'step-ruby-1', name: 'Install gems', run: 'bundle install --jobs 4 --retry 3', env: [] },
          { id: 'step-ruby-2', name: 'Run RuboCop', run: 'bundle exec rubocop', env: [] },
          { id: 'step-ruby-3', name: 'Run RSpec tests', run: 'bundle exec rspec', env: [] },
        ];
      } else if (type === 'flutter') {
        defaultSteps = [
          { id: 'step-flutter-1', name: 'Install dependencies', run: 'flutter pub get', env: [] },
          { id: 'step-flutter-2', name: 'Analyze code', run: 'flutter analyze', env: [] },
          { id: 'step-flutter-3', name: 'Run Flutter tests', run: 'flutter test --coverage', env: [] },
        ];
      }

      return {
        ...prev,
        language: { ...prev.language, type },
        steps: defaultSteps,
      };
    });
  }, []);

  const updateLanguageNode = useCallback((partial: Partial<NodeConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        node: { ...prev.language.node, ...partial },
      },
    }));
  }, []);

  const updateLanguagePython = useCallback((partial: Partial<PythonConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        python: { ...prev.language.python, ...partial },
      },
    }));
  }, []);

  const updateLanguageGo = useCallback((partial: Partial<GoConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        go: { ...prev.language.go, ...partial },
      },
    }));
  }, []);

  const updateLanguageJava = useCallback((partial: Partial<JavaConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        java: { ...prev.language.java, ...partial },
      },
    }));
  }, []);

  const updateLanguageRust = useCallback((partial: Partial<RustConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        rust: { ...prev.language.rust, ...partial },
      },
    }));
  }, []);

  const updateLanguagePhp = useCallback((partial: Partial<PhpConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        php: { ...prev.language.php, ...partial },
      },
    }));
  }, []);

  const updateLanguageDotnet = useCallback((partial: Partial<DotnetConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        dotnet: { ...prev.language.dotnet, ...partial },
      },
    }));
  }, []);

  const updateLanguageRuby = useCallback((partial: Partial<RubyConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        ruby: { ...prev.language.ruby, ...partial },
      },
    }));
  }, []);

  const updateLanguageFlutter = useCallback((partial: Partial<FlutterConfig>) => {
    setState((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        flutter: { ...prev.language.flutter, ...partial },
      },
    }));
  }, []);

  const updateCaching = useCallback((partial: Partial<CachingConfig>) => {
    setState((prev) => ({
      ...prev,
      caching: { ...prev.caching, ...partial },
    }));
  }, []);

  const addStep = useCallback((stepTemplate?: Partial<StepConfig>) => {
    const newStep: StepConfig = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: stepTemplate?.name || 'New Custom Step',
      run: stepTemplate?.run || 'echo "Running step..."',
      uses: stepTemplate?.uses || '',
      with: stepTemplate?.with || {},
      env: stepTemplate?.env || [],
      ifCondition: stepTemplate?.ifCondition || '',
      workingDirectory: stepTemplate?.workingDirectory || '',
      continueOnError: stepTemplate?.continueOnError || false,
    };
    setState((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  }, []);

  const updateStep = useCallback((id: string, partial: Partial<StepConfig>) => {
    setState((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    }));
  }, []);

  const removeStep = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== id),
    }));
  }, []);

  const duplicateStep = useCallback((id: string) => {
    setState((prev) => {
      const index = prev.steps.findIndex((s) => s.id === id);
      if (index === -1) return prev;
      const target = prev.steps[index];
      const clone: StepConfig = {
        ...target,
        id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `${target.name} (Copy)`,
      };
      const updated = [...prev.steps];
      updated.splice(index + 1, 0, clone);
      return { ...prev, steps: updated };
    });
  }, []);

  const moveStep = useCallback((index: number, direction: 'up' | 'down') => {
    setState((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.steps.length) return prev;
      const updated = [...prev.steps];
      const [removed] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, removed);
      return { ...prev, steps: updated };
    });
  }, []);

  const reorderSteps = useCallback((startIndex: number, endIndex: number) => {
    setState((prev) => {
      const updated = [...prev.steps];
      const [removed] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, removed);
      return { ...prev, steps: updated };
    });
  }, []);

  const updateDeployment = useCallback((partial: Partial<DeploymentConfig>) => {
    setState((prev) => ({
      ...prev,
      deployment: { ...prev.deployment, ...partial },
    }));
  }, []);

  const updateDockerDeployment = useCallback((partial: Partial<DockerDeploymentConfig>) => {
    setState((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        docker: { ...prev.deployment.docker, ...partial },
      },
    }));
  }, []);

  const updateAwsDeployment = useCallback((partial: Partial<AwsDeploymentConfig>) => {
    setState((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        aws: { ...prev.deployment.aws, ...partial },
      },
    }));
  }, []);

  const updateVercelDeployment = useCallback((partial: Partial<VercelDeploymentConfig>) => {
    setState((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        vercel: { ...prev.deployment.vercel, ...partial },
      },
    }));
  }, []);

  const updateGitHubPagesDeployment = useCallback((partial: Partial<GitHubPagesDeploymentConfig>) => {
    setState((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        githubPages: { ...prev.deployment.githubPages, ...partial },
      },
    }));
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = WORKFLOW_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setState((prev) => ({
      ...prev,
      ...preset.state,
      global: { ...prev.global, ...preset.state.global },
      language: { ...prev.language, ...preset.state.language },
      caching: { ...prev.caching, ...preset.state.caching },
      steps: preset.state.steps ? [...preset.state.steps] : prev.steps,
      deployment: { ...prev.deployment, ...preset.state.deployment },
    }));
  }, []);

  const resetWorkflow = useCallback(() => {
    setState(DEFAULT_WORKFLOW_STATE);
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        state,
        yaml,
        requiredSecrets,
        updateGlobal,
        updateTriggerPush,
        updateTriggerPR,
        updateTriggerSchedule,
        updateTriggerDispatch,
        updateLanguageType,
        updateLanguageNode,
        updateLanguagePython,
        updateLanguageGo,
        updateLanguageJava,
        updateLanguageRust,
        updateLanguagePhp,
        updateLanguageDotnet,
        updateLanguageRuby,
        updateLanguageFlutter,
        updateCaching,
        addStep,
        updateStep,
        removeStep,
        duplicateStep,
        moveStep,
        reorderSteps,
        updateDeployment,
        updateDockerDeployment,
        updateAwsDeployment,
        updateVercelDeployment,
        updateGitHubPagesDeployment,
        loadPreset,
        resetWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
