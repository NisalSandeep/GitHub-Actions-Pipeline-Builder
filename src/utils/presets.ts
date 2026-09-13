import { WorkflowPreset, WorkflowState, StepTemplate } from '../types/workflow';

export const DEFAULT_WORKFLOW_STATE: WorkflowState = {
  global: {
    workflowName: 'Node.js CI/CD',
    filename: 'ci.yml',
    runsOn: 'ubuntu-latest',
    triggers: {
      push: {
        enabled: true,
        branches: ['main'],
        tags: [],
      },
      pull_request: {
        enabled: true,
        branches: ['main'],
      },
      schedule: {
        enabled: false,
        cron: '0 0 * * 0',
      },
      workflow_dispatch: {
        enabled: true,
      },
    },
    concurrency: {
      enabled: true,
      group: '${{ github.workflow }}-${{ github.ref }}',
      cancelInProgress: true,
    },
    permissions: {
      enabled: false,
      contents: 'read',
      pullRequests: 'none',
      idToken: 'none',
    },
  },
  language: {
    type: 'node',
    node: {
      versions: ['18.x', '20.x', '22.x'],
      useMatrix: true,
      packageManager: 'npm',
    },
    python: {
      versions: ['3.10', '3.11', '3.12'],
      useMatrix: true,
      packageManager: 'pip',
    },
    go: {
      versions: ['1.21.x', '1.22.x'],
      useMatrix: true,
    },
    java: {
      versions: ['17', '21'],
      useMatrix: true,
      distribution: 'temurin',
      buildTool: 'maven',
    },
    rust: {
      toolchains: ['stable', 'beta'],
      useMatrix: false,
      components: ['clippy', 'rustfmt'],
    },
    php: {
      versions: ['8.2', '8.3'],
      useMatrix: true,
      extensions: ['mbstring', 'xml', 'curl', 'pdo_sqlite'],
      coverage: 'none',
    },
    dotnet: {
      versions: ['8.0.x'],
      useMatrix: false,
    },
    ruby: {
      versions: ['3.2', '3.3'],
      useMatrix: true,
      bundlerCache: true,
    },
    flutter: {
      channel: 'stable',
      version: '',
      cache: true,
    },
  },
  caching: {
    enabled: true,
    customPaths: '',
    cacheKeyPrefix: 'deps',
  },
  steps: [
    {
      id: 'step-1',
      name: 'Install dependencies',
      run: 'npm ci',
      env: [],
    },
    {
      id: 'step-2',
      name: 'Run Linting & Code Checks',
      run: 'npm run lint',
      env: [],
    },
    {
      id: 'step-3',
      name: 'Run Unit & Integration Tests',
      run: 'npm test',
      env: [
        { key: 'CI', value: 'true' },
        { key: 'NODE_ENV', value: 'test' },
      ],
    },
    {
      id: 'step-4',
      name: 'Build Production Assets',
      run: 'npm run build',
      env: [],
    },
  ],
  deployment: {
    enabled: false,
    target: 'none',
    docker: {
      registry: 'dockerhub',
      imageName: 'myusername/app',
      tags: 'latest,${{ github.sha }}',
      dockerfile: './Dockerfile',
      context: '.',
    },
    aws: {
      service: 's3',
      region: 'us-east-1',
      s3Bucket: 'my-production-app-bucket',
      s3SourceDir: './dist',
      ecsCluster: 'production-cluster',
      ecsService: 'frontend-service',
      lambdaFunctionName: 'api-serverless-function',
    },
    vercel: {
      environment: 'production',
      projectArgs: '',
    },
    githubPages: {
      path: './dist',
    },
  },
};

export const WORKFLOW_PRESETS: WorkflowPreset[] = [
  {
    id: 'node-docker',
    name: 'Node.js + Docker Hub',
    badge: 'Docker & Node',
    description: 'Full-stack Node.js matrix test & multi-job Docker container build and push to Docker Hub.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: 'Node.js Build & Docker Publish',
        filename: 'docker-publish.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'node',
        node: {
          versions: ['20.x'],
          useMatrix: false,
          packageManager: 'npm',
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Install dependencies',
          run: 'npm ci',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Run Tests',
          run: 'npm test',
          env: [{ key: 'CI', value: 'true' }],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: true,
        target: 'docker',
        docker: {
          registry: 'dockerhub',
          imageName: 'ghcr.io/org/web-service',
          tags: 'latest,${{ github.sha }}',
          dockerfile: './Dockerfile',
          context: '.',
        },
      },
    },
  },
  {
    id: 'python-aws',
    name: 'Python + AWS Deployment',
    badge: 'AWS & Python',
    description: 'Python multi-version test suite with pip caching and automatic AWS Lambda deployment.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: 'Python CI & AWS Deploy',
        filename: 'aws-deploy.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'python',
        python: {
          versions: ['3.11', '3.12'],
          useMatrix: true,
          packageManager: 'pip',
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Install dependencies',
          run: 'python -m pip install --upgrade pip\npip install -r requirements.txt\npip install pytest flake8',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Run Flake8 Linter',
          run: 'flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics',
          env: [],
        },
        {
          id: 'step-3',
          name: 'Run Pytest Test Suite',
          run: 'pytest tests/ -v --cov=app',
          env: [{ key: 'ENVIRONMENT', value: 'testing' }],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: true,
        target: 'aws',
        aws: {
          service: 'lambda',
          region: 'us-east-1',
          s3Bucket: 'my-artifacts-bucket',
          s3SourceDir: './dist',
          ecsCluster: 'main-cluster',
          ecsService: 'backend-api',
          lambdaFunctionName: 'fastapi-backend-handler',
        },
      },
    },
  },
  {
    id: 'nextjs-vercel',
    name: 'Next.js + Vercel CD',
    badge: 'Vercel & Next.js',
    description: 'Next.js automated build, test, and production deployment pipeline on Vercel.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: 'Next.js Continuous Delivery',
        filename: 'vercel-deploy.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'node',
        node: {
          versions: ['20.x'],
          useMatrix: false,
          packageManager: 'npm',
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Install dependencies',
          run: 'npm ci',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Run Linter & TypeScript Check',
          run: 'npm run lint',
          env: [],
        },
        {
          id: 'step-3',
          name: 'Build Next.js Application',
          run: 'npm run build',
          env: [{ key: 'NODE_ENV', value: 'production' }],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: true,
        target: 'vercel',
        vercel: {
          environment: 'production',
          projectArgs: '',
        },
      },
    },
  },
  {
    id: 'go-ci',
    name: 'Go Microservice CI',
    badge: 'Golang CI',
    description: 'Go multi-version matrix build, race detector tests, vet, and static compilation.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: 'Go Microservice CI',
        filename: 'go-ci.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'go',
        go: {
          versions: ['1.21.x', '1.22.x'],
          useMatrix: true,
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Download Go Modules',
          run: 'go mod download',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Run Go Vet',
          run: 'go vet ./...',
          env: [],
        },
        {
          id: 'step-3',
          name: 'Run Unit Tests with Race Detection',
          run: 'go test -v -race -coverprofile=coverage.txt -covermode=atomic ./...',
          env: [],
        },
        {
          id: 'step-4',
          name: 'Build Binary',
          run: 'CGO_ENABLED=0 go build -v -o bin/server ./cmd/...',
          env: [],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: false,
        target: 'none',
      },
    },
  },
  {
    id: 'rust-ci',
    name: 'Rust Binary & Library CI',
    badge: 'Rust Cargo',
    description: 'Rust toolchain setup, cargo clippy linting, formatting checks, and test runner.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: 'Rust Quality & Build',
        filename: 'rust.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'rust',
        rust: {
          toolchains: ['stable'],
          useMatrix: false,
          components: ['clippy', 'rustfmt'],
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Check formatting',
          run: 'cargo fmt --all -- --check',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Run Clippy Lints',
          run: 'cargo clippy -- -D warnings',
          env: [],
        },
        {
          id: 'step-3',
          name: 'Run Cargo Tests',
          run: 'cargo test --all-targets --all-features',
          env: [{ key: 'RUST_BACKTRACE', value: '1' }],
        },
        {
          id: 'step-4',
          name: 'Build Release Binary',
          run: 'cargo build --release --locked',
          env: [],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: false,
        target: 'none',
      },
    },
  },
  {
    id: 'php-laravel',
    name: 'PHP + Laravel CI',
    badge: 'Laravel PHP',
    description: 'PHP 8.2 & 8.3 matrix test suite with Composer caching, Laravel environment setup, and PHPUnit.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: 'Laravel Continuous Integration',
        filename: 'laravel.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'php',
        php: {
          versions: ['8.2', '8.3'],
          useMatrix: true,
          extensions: ['mbstring', 'xml', 'curl', 'pdo_sqlite'],
          coverage: 'none',
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Copy Environment File',
          run: 'cp .env.example .env',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Install Composer Dependencies',
          run: 'composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist',
          env: [],
        },
        {
          id: 'step-3',
          name: 'Generate Application Encryption Key',
          run: 'php artisan key:generate',
          env: [],
        },
        {
          id: 'step-4',
          name: 'Execute Tests via PHPUnit',
          run: 'vendor/bin/phpunit',
          env: [{ key: 'DB_CONNECTION', value: 'sqlite' }, { key: 'DB_DATABASE', value: ':memory:' }],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: false,
        target: 'none',
      },
    },
  },
  {
    id: 'dotnet-ci',
    name: '.NET / C# Solution CI',
    badge: '.NET 8 / 9',
    description: 'Modern .NET SDK setup, NuGet package restore, Release configuration compilation, and VSTest/xUnit execution.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: '.NET Test and Build',
        filename: 'dotnet.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'dotnet',
        dotnet: {
          versions: ['8.0.x'],
          useMatrix: false,
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Restore NuGet Dependencies',
          run: 'dotnet restore',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Build Solution (Release)',
          run: 'dotnet build --no-restore --configuration Release',
          env: [],
        },
        {
          id: 'step-3',
          name: 'Run Unit and Integration Tests',
          run: 'dotnet test --no-build --verbosity normal --configuration Release',
          env: [],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: false,
        target: 'none',
      },
    },
  },
  {
    id: 'ruby-rails',
    name: 'Ruby on Rails CI',
    badge: 'Rails Ruby',
    description: 'Ruby 3.2 & 3.3 matrix testing with Bundler caching, RuboCop code style audit, and RSpec test execution.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: 'Ruby on Rails Test Suite',
        filename: 'rails.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'ruby',
        ruby: {
          versions: ['3.2', '3.3'],
          useMatrix: true,
          bundlerCache: true,
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Install Bundler Dependencies',
          run: 'bundle install --jobs 4 --retry 3',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Run RuboCop Linter',
          run: 'bundle exec rubocop',
          env: [],
        },
        {
          id: 'step-3',
          name: 'Run RSpec Test Suite',
          run: 'bundle exec rspec',
          env: [{ key: 'RAILS_ENV', value: 'test' }],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: false,
        target: 'none',
      },
    },
  },
  {
    id: 'flutter-ci',
    name: 'Flutter & Dart CI',
    badge: 'Flutter App',
    description: 'Cross-platform Flutter SDK setup on the stable channel with dependency caching, code formatting, linter, and unit test runner.',
    state: {
      global: {
        ...DEFAULT_WORKFLOW_STATE.global,
        workflowName: 'Flutter App Quality & Test',
        filename: 'flutter.yml',
      },
      language: {
        ...DEFAULT_WORKFLOW_STATE.language,
        type: 'flutter',
        flutter: {
          channel: 'stable',
          version: '',
          cache: true,
        },
      },
      steps: [
        {
          id: 'step-1',
          name: 'Install Flutter Packages',
          run: 'flutter pub get',
          env: [],
        },
        {
          id: 'step-2',
          name: 'Verify Dart Code Formatting',
          run: 'dart format --output=none --set-exit-if-changed .',
          env: [],
        },
        {
          id: 'step-3',
          name: 'Analyze Code with Flutter Analyzer',
          run: 'flutter analyze',
          env: [],
        },
        {
          id: 'step-4',
          name: 'Run Flutter Test Suite',
          run: 'flutter test --coverage',
          env: [],
        },
      ],
      deployment: {
        ...DEFAULT_WORKFLOW_STATE.deployment,
        enabled: false,
        target: 'none',
      },
    },
  },
];

export const STEP_TEMPLATES: StepTemplate[] = [
  {
    name: 'Run Unit Tests (npm test)',
    run: 'npm test',
    category: 'Testing',
    env: [{ key: 'CI', value: 'true' }],
  },
  {
    name: 'Run ESLint / Code Quality',
    run: 'npx eslint . --ext .js,.jsx,.ts,.tsx',
    category: 'Linting',
    env: [],
  },
  {
    name: 'Run PHPUnit Test Suite',
    run: 'vendor/bin/phpunit',
    category: 'Testing',
    env: [{ key: 'APP_ENV', value: 'testing' }],
  },
  {
    name: 'Run .NET Test Suite',
    run: 'dotnet test --no-build --verbosity normal --configuration Release',
    category: 'Testing',
    env: [],
  },
  {
    name: 'Run RSpec Test Suite',
    run: 'bundle exec rspec',
    category: 'Testing',
    env: [{ key: 'RAILS_ENV', value: 'test' }],
  },
  {
    name: 'Run Flutter Test Suite',
    run: 'flutter test --coverage',
    category: 'Testing',
    env: [],
  },
  {
    name: 'Upload Code Coverage (Codecov)',
    uses: 'codecov/codecov-action@v4',
    category: 'Testing',
    with: {
      token: '${{ secrets.CODECOV_TOKEN }}',
      slug: '${{ github.repository }}',
    },
    env: [],
  },
  {
    name: 'Security Scan with Trivy',
    uses: 'aquasecurity/trivy-action@master',
    category: 'Security',
    with: {
      'scan-type': 'fs',
      'ignore-unfixed': 'true',
      format: 'table',
      severity: 'CRITICAL,HIGH',
    },
    env: [],
  },
  {
    name: 'Build Production Distribution',
    run: 'npm run build',
    category: 'Build',
    env: [{ key: 'NODE_ENV', value: 'production' }],
  },
  {
    name: 'Upload Artifact to GitHub',
    uses: 'actions/upload-artifact@v4',
    category: 'Artifacts',
    with: {
      name: 'build-output',
      path: './dist',
    },
    env: [],
  },
  {
    name: 'Slack Deployment Notification',
    uses: 'slackapi/slack-github-action@v1.26.0',
    category: 'Notifications',
    with: {
      'payload': '{"text": "Deployment completed successfully for ${{ github.repository }}"}',
    },
    env: [{ key: 'SLACK_WEBHOOK_URL', value: '${{ secrets.SLACK_WEBHOOK_URL }}' }],
  },
];
