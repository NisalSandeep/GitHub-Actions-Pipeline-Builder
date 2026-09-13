import { WorkflowState, RequiredSecret } from '../types/workflow';

/**
 * Pure utility function to convert the WorkflowState into pristine, valid GitHub Actions YAML.
 */
export function generateYaml(state: WorkflowState): string {
  const lines: string[] = [];
  const { global, language, caching, steps, deployment } = state;

  // Workflow Header
  lines.push(`name: ${global.workflowName || 'CI/CD Pipeline'}`);
  lines.push('');

  // Triggers (on)
  lines.push('on:');
  let hasTrigger = false;

  if (global.triggers.push.enabled) {
    hasTrigger = true;
    lines.push('  push:');
    if (global.triggers.push.branches.length > 0) {
      lines.push('    branches:');
      global.triggers.push.branches.forEach((b) => lines.push(`      - '${b.trim()}'`));
    }
    if (global.triggers.push.tags.length > 0) {
      lines.push('    tags:');
      global.triggers.push.tags.forEach((t) => lines.push(`      - '${t.trim()}'`));
    }
  }

  if (global.triggers.pull_request.enabled) {
    hasTrigger = true;
    lines.push('  pull_request:');
    if (global.triggers.pull_request.branches.length > 0) {
      lines.push('    branches:');
      global.triggers.pull_request.branches.forEach((b) => lines.push(`      - '${b.trim()}'`));
    }
  }

  if (global.triggers.schedule.enabled && global.triggers.schedule.cron.trim()) {
    hasTrigger = true;
    lines.push('  schedule:');
    lines.push(`    - cron: '${global.triggers.schedule.cron.trim()}'`);
  }

  if (global.triggers.workflow_dispatch.enabled) {
    hasTrigger = true;
    lines.push('  workflow_dispatch:');
  }

  if (!hasTrigger) {
    lines.push('  push:');
    lines.push("    branches: [ 'main' ]");
  }

  lines.push('');

  // Permissions
  if (global.permissions.enabled) {
    lines.push('permissions:');
    if (deployment.enabled && deployment.target === 'github_pages') {
      lines.push('  contents: read');
      lines.push('  pages: write');
      lines.push('  id-token: write');
    } else {
      if (global.permissions.contents !== 'none') {
        lines.push(`  contents: ${global.permissions.contents}`);
      }
      if (global.permissions.pullRequests !== 'none') {
        lines.push(`  pull-requests: ${global.permissions.pullRequests}`);
      }
      if (global.permissions.idToken !== 'none') {
        lines.push(`  id-token: ${global.permissions.idToken}`);
      }
    }
    lines.push('');
  } else if (deployment.enabled && deployment.target === 'github_pages') {
    lines.push('permissions:');
    lines.push('  contents: read');
    lines.push('  pages: write');
    lines.push('  id-token: write');
    lines.push('');
  }

  // Concurrency
  if (global.concurrency.enabled) {
    lines.push('concurrency:');
    lines.push(`  group: ${global.concurrency.group || '${{ github.workflow }}-${{ github.ref }}'}`);
    lines.push(`  cancel-in-progress: ${global.concurrency.cancelInProgress}`);
    lines.push('');
  }

  // Jobs section
  lines.push('jobs:');

  const isMultiJob = deployment.enabled && deployment.target !== 'none';

  // Job 1: Build / Test
  lines.push('  build:');
  lines.push(`    name: ${isMultiJob ? 'Build & Test' : 'Build, Test & Package'}`);
  lines.push(`    runs-on: ${global.runsOn}`);

  // Build Matrix Strategy if applicable
  const matrix = getMatrixStrategy(language);
  if (matrix) {
    lines.push('    strategy:');
    lines.push('      matrix:');
    for (const [key, values] of Object.entries(matrix)) {
      lines.push(`        ${key}:`);
      values.forEach((v) => lines.push(`          - '${v}'`));
    }
  }

  lines.push('    steps:');
  lines.push('      - name: Checkout repository');
  lines.push('        uses: actions/checkout@v4');

  // Inject Language Setup Action
  const langSteps = getLanguageSetupSteps(language, caching);
  langSteps.forEach((step) => {
    lines.push(step);
  });

  // Inject Custom Steps
  if (steps.length > 0) {
    steps.forEach((step) => {
      lines.push(formatStep(step, '      '));
    });
  } else {
    // Default fallback step if none specified
    lines.push('      - name: Run checks and build');
    lines.push('        run: echo "Build completed successfully!"');
  }

  // If multi-job, upload artifacts for deployment job
  if (isMultiJob && deployment.target !== 'docker') {
    lines.push('');
    lines.push('      - name: Upload build artifacts');
    lines.push('        uses: actions/upload-artifact@v4');
    lines.push('        with:');
    lines.push("          name: build-artifact");
    lines.push("          path: |");
    lines.push("            ./dist");
    lines.push("            ./build");
    lines.push("            ./out");
    lines.push("          if-no-files-found: ignore");
  }

  // Job 2: Deployment Job (if enabled)
  if (isMultiJob) {
    lines.push('');
    lines.push('  deploy:');
    lines.push(`    name: Deploy to ${getDeploymentTargetName(deployment.target)}`);
    lines.push('    needs: build');
    lines.push(`    runs-on: ${global.runsOn}`);
    if (global.triggers.push.enabled && global.triggers.push.branches.length > 0) {
      lines.push(`    if: github.ref == 'refs/heads/${global.triggers.push.branches[0]}' && github.event_name == 'push'`);
    } else {
      lines.push("    if: github.ref == 'refs/heads/main'");
    }

    if (deployment.target === 'github_pages') {
      lines.push('    environment:');
      lines.push('      name: github-pages');
      lines.push('      url: ${{ steps.deployment.outputs.page_url }}');
    }

    lines.push('    steps:');
    lines.push('      - name: Checkout code');
    lines.push('        uses: actions/checkout@v4');

    if (deployment.target !== 'docker') {
      lines.push('');
      lines.push('      - name: Download build artifacts');
      lines.push('        uses: actions/download-artifact@v4');
      lines.push('        with:');
      lines.push('          name: build-artifact');
      lines.push('          path: ./dist');
    }

    const deploySteps = getDeploymentSteps(deployment);
    deploySteps.forEach((step) => {
      lines.push(step);
    });
  }

  return lines.join('\n');
}

/**
 * Determine matrix strategy based on language configuration
 */
function getMatrixStrategy(language: WorkflowState['language']): Record<string, string[]> | null {
  if (language.type === 'node' && language.node.useMatrix && language.node.versions.length > 1) {
    return { 'node-version': language.node.versions };
  }
  if (language.type === 'python' && language.python.useMatrix && language.python.versions.length > 1) {
    return { 'python-version': language.python.versions };
  }
  if (language.type === 'go' && language.go.useMatrix && language.go.versions.length > 1) {
    return { 'go-version': language.go.versions };
  }
  if (language.type === 'java' && language.java.useMatrix && language.java.versions.length > 1) {
    return { 'java-version': language.java.versions };
  }
  if (language.type === 'rust' && language.rust.useMatrix && language.rust.toolchains.length > 1) {
    return { 'rust-toolchain': language.rust.toolchains };
  }
  return null;
}

/**
 * Generate language setup action blocks with caching
 */
function getLanguageSetupSteps(language: WorkflowState['language'], caching: WorkflowState['caching']): string[] {
  const steps: string[] = [];

  switch (language.type) {
    case 'node': {
      const isMatrix = language.node.useMatrix && language.node.versions.length > 1;
      const versionStr = isMatrix ? '${{ matrix.node-version }}' : (language.node.versions[0] || '20.x');

      steps.push('');
      if (language.node.packageManager === 'pnpm') {
        steps.push('      - name: Install pnpm');
        steps.push('        uses: pnpm/action-setup@v3');
        steps.push('        with:');
        steps.push("          version: 8");
        steps.push('');
      } else if (language.node.packageManager === 'bun') {
        steps.push('      - name: Setup Bun');
        steps.push('        uses: oven-sh/setup-bun@v2');
        steps.push('        with:');
        steps.push("          bun-version: latest");
        steps.push('');
      }

      steps.push(`      - name: Set up Node.js ${versionStr}`);
      steps.push('        uses: actions/setup-node@v4');
      steps.push('        with:');
      steps.push(`          node-version: '${versionStr}'`);
      if (caching.enabled) {
        const cacheTarget = language.node.packageManager === 'npm' ? 'npm' :
                            language.node.packageManager === 'yarn' ? 'yarn' :
                            language.node.packageManager === 'pnpm' ? 'pnpm' : undefined;
        if (cacheTarget) {
          steps.push(`          cache: '${cacheTarget}'`);
        }
      }
      break;
    }

    case 'python': {
      const isMatrix = language.python.useMatrix && language.python.versions.length > 1;
      const versionStr = isMatrix ? '${{ matrix.python-version }}' : (language.python.versions[0] || '3.12');

      steps.push('');
      steps.push(`      - name: Set up Python ${versionStr}`);
      steps.push('        uses: actions/setup-python@v5');
      steps.push('        with:');
      steps.push(`          python-version: '${versionStr}'`);
      if (caching.enabled) {
        const cacheTarget = language.python.packageManager === 'poetry' ? 'poetry' :
                            language.python.packageManager === 'pipenv' ? 'pipenv' : 'pip';
        steps.push(`          cache: '${cacheTarget}'`);
      }
      break;
    }

    case 'go': {
      const isMatrix = language.go.useMatrix && language.go.versions.length > 1;
      const versionStr = isMatrix ? '${{ matrix.go-version }}' : (language.go.versions[0] || '1.22.x');

      steps.push('');
      steps.push(`      - name: Set up Go ${versionStr}`);
      steps.push('        uses: actions/setup-go@v5');
      steps.push('        with:');
      steps.push(`          go-version: '${versionStr}'`);
      if (caching.enabled) {
        steps.push('          cache: true');
      }
      break;
    }

    case 'java': {
      const isMatrix = language.java.useMatrix && language.java.versions.length > 1;
      const versionStr = isMatrix ? '${{ matrix.java-version }}' : (language.java.versions[0] || '21');

      steps.push('');
      steps.push(`      - name: Set up JDK ${versionStr} (${language.java.distribution})`);
      steps.push('        uses: actions/setup-java@v4');
      steps.push('        with:');
      steps.push(`          java-version: '${versionStr}'`);
      steps.push(`          distribution: '${language.java.distribution}'`);
      if (caching.enabled) {
        steps.push(`          cache: '${language.java.buildTool}'`);
      }
      break;
    }

    case 'rust': {
      const isMatrix = language.rust.useMatrix && language.rust.toolchains.length > 1;
      const toolchainStr = isMatrix ? '${{ matrix.rust-toolchain }}' : (language.rust.toolchains[0] || 'stable');

      steps.push('');
      steps.push(`      - name: Set up Rust toolchain (${toolchainStr})`);
      steps.push('        uses: dtolnay/rust-toolchain@master');
      steps.push('        with:');
      steps.push(`          toolchain: ${toolchainStr}`);
      if (language.rust.components.length > 0) {
        steps.push(`          components: ${language.rust.components.join(', ')}`);
      }
      if (caching.enabled) {
        steps.push('');
        steps.push('      - name: Cache cargo registry & target');
        steps.push('        uses: actions/cache@v4');
        steps.push('        with:');
        steps.push('          path: |');
        steps.push('            ~/.cargo/bin/');
        steps.push('            ~/.cargo/registry/index/');
        steps.push('            ~/.cargo/registry/cache/');
        steps.push('            ~/.cargo/git/db/');
        steps.push('            target/');
        steps.push("          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}");
        steps.push('          restore-keys: |');
        steps.push('            ${{ runner.os }}-cargo-');
      }
      break;
    }

    default:
      break;
  }

  // Custom paths caching if user specified
  if (caching.enabled && caching.customPaths.trim() && language.type !== 'rust') {
    steps.push('');
    steps.push('      - name: Cache custom dependencies');
    steps.push('        uses: actions/cache@v4');
    steps.push('        with:');
    steps.push('          path: |');
    caching.customPaths.split('\n').filter(Boolean).forEach((p) => {
      steps.push(`            ${p.trim()}`);
    });
    steps.push(`          key: \${{ runner.os }}-${caching.cacheKeyPrefix || 'cache'}-\${{ hashFiles('**/*') }}`);
    steps.push('          restore-keys: |');
    steps.push(`            \${{ runner.os }}-${caching.cacheKeyPrefix || 'cache'}-`);
  }

  return steps;
}

/**
 * Format a single step into YAML
 */
function formatStep(step: WorkflowState['steps'][0], indent: string): string {
  const lines: string[] = [''];
  lines.push(`${indent}- name: ${step.name}`);

  if (step.ifCondition && step.ifCondition.trim()) {
    lines.push(`${indent}  if: ${step.ifCondition.trim()}`);
  }

  if (step.continueOnError) {
    lines.push(`${indent}  continue-on-error: true`);
  }

  if (step.workingDirectory && step.workingDirectory.trim()) {
    lines.push(`${indent}  working-directory: ${step.workingDirectory.trim()}`);
  }

  if (step.uses && step.uses.trim()) {
    lines.push(`${indent}  uses: ${step.uses.trim()}`);
    if (step.with && Object.keys(step.with).length > 0) {
      lines.push(`${indent}  with:`);
      for (const [k, v] of Object.entries(step.with)) {
        lines.push(`${indent}    ${k}: ${v}`);
      }
    }
  } else if (step.run && step.run.trim()) {
    const runLines = step.run.trim().split('\n');
    if (runLines.length === 1) {
      lines.push(`${indent}  run: ${runLines[0].trim()}`);
    } else {
      lines.push(`${indent}  run: |`);
      runLines.forEach((r) => {
        lines.push(`${indent}    ${r}`);
      });
    }
  }

  if (step.env && step.env.length > 0) {
    const validEnv = step.env.filter((e) => e.key.trim());
    if (validEnv.length > 0) {
      lines.push(`${indent}  env:`);
      validEnv.forEach((e) => {
        lines.push(`${indent}    ${e.key.trim()}: ${e.value.trim()}`);
      });
    }
  }

  return lines.join('\n');
}

/**
 * Get human-readable target name
 */
function getDeploymentTargetName(target: WorkflowState['deployment']['target']): string {
  switch (target) {
    case 'docker':
      return 'Docker Hub / Container Registry';
    case 'aws':
      return 'AWS Services';
    case 'vercel':
      return 'Vercel';
    case 'github_pages':
      return 'GitHub Pages';
    default:
      return 'Production';
  }
}

/**
 * Generate deployment step YAML based on deployment configuration
 */
function getDeploymentSteps(deployment: WorkflowState['deployment']): string[] {
  const steps: string[] = [];

  switch (deployment.target) {
    case 'docker': {
      const { docker } = deployment;
      const imageName = docker.imageName.trim() || 'username/my-image';
      const tags = docker.tags.trim() || 'latest,${{ github.sha }}';

      steps.push('');
      steps.push('      - name: Set up QEMU');
      steps.push('        uses: docker/setup-qemu-action@v3');
      steps.push('');
      steps.push('      - name: Set up Docker Buildx');
      steps.push('        uses: docker/setup-buildx-action@v3');
      steps.push('');
      steps.push('      - name: Log in to Docker Hub');
      steps.push('        uses: docker/login-action@v3');
      steps.push('        with:');
      steps.push('          username: ${{ secrets.DOCKERHUB_USERNAME }}');
      steps.push('          password: ${{ secrets.DOCKERHUB_TOKEN }}');
      steps.push('');
      steps.push('      - name: Build and push Docker image');
      steps.push('        uses: docker/build-push-action@v5');
      steps.push('        with:');
      steps.push(`          context: ${docker.context || '.'}`);
      steps.push(`          file: ${docker.dockerfile || './Dockerfile'}`);
      steps.push('          push: true');
      steps.push(`          tags: |`);
      tags.split(',').forEach((t) => {
        steps.push(`            ${imageName}:${t.trim()}`);
      });
      break;
    }

    case 'aws': {
      const { aws } = deployment;
      const region = aws.region.trim() || 'us-east-1';

      steps.push('');
      steps.push('      - name: Configure AWS credentials');
      steps.push('        uses: aws-actions/configure-aws-credentials@v4');
      steps.push('        with:');
      steps.push('          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}');
      steps.push('          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}');
      steps.push(`          aws-region: ${region}`);

      steps.push('');
      if (aws.service === 's3') {
        const bucket = aws.s3Bucket.trim() || 'my-s3-bucket-name';
        const sourceDir = aws.s3SourceDir.trim() || './dist';
        steps.push('      - name: Deploy to S3 bucket');
        steps.push(`        run: aws s3 sync ${sourceDir} s3://${bucket} --delete`);
      } else if (aws.service === 'ecs') {
        const cluster = aws.ecsCluster.trim() || 'my-ecs-cluster';
        const service = aws.ecsService.trim() || 'my-ecs-service';
        steps.push('      - name: Deploy Amazon ECS Task');
        steps.push(`        run: aws ecs update-service --cluster ${cluster} --service ${service} --force-new-deployment`);
      } else if (aws.service === 'lambda') {
        const func = aws.lambdaFunctionName.trim() || 'my-lambda-function';
        steps.push('      - name: Deploy AWS Lambda Function');
        steps.push('        run: |');
        steps.push('          cd ./dist && zip -r function.zip .');
        steps.push(`          aws lambda update-function-code --function-name ${func} --zip-file fileb://dist/function.zip`);
      } else if (aws.service === 'elastic_beanstalk') {
        steps.push('      - name: Deploy to Elastic Beanstalk');
        steps.push('        run: |');
        steps.push('          pip install awsebcli');
        steps.push('          eb deploy');
      }
      break;
    }

    case 'vercel': {
      const { vercel } = deployment;
      const isProd = vercel.environment === 'production';

      steps.push('');
      steps.push('      - name: Deploy to Vercel');
      steps.push('        uses: amondnet/vercel-action@v25');
      steps.push('        with:');
      steps.push('          vercel-token: ${{ secrets.VERCEL_TOKEN }}');
      steps.push('          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}');
      steps.push('          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}');
      if (isProd) {
        steps.push('          vercel-args: \'--prod\'');
      }
      break;
    }

    case 'github_pages': {
      const path = deployment.githubPages.path.trim() || './dist';
      steps.push('');
      steps.push('      - name: Setup Pages');
      steps.push('        uses: actions/configure-pages@v5');
      steps.push('');
      steps.push('      - name: Upload Pages artifact');
      steps.push('        uses: actions/upload-pages-artifact@v3');
      steps.push('        with:');
      steps.push(`          path: '${path}'`);
      steps.push('');
      steps.push('      - name: Deploy to GitHub Pages');
      steps.push('        id: deployment');
      steps.push('        uses: actions/deploy-pages@v4');
      break;
    }

    default:
      break;
  }

  return steps;
}

/**
 * Live detection of required GitHub Secrets from state
 */
export function getRequiredSecrets(state: WorkflowState): RequiredSecret[] {
  const secrets: RequiredSecret[] = [];
  const { deployment, steps } = state;

  if (deployment.enabled) {
    if (deployment.target === 'docker') {
      secrets.push(
        {
          name: 'DOCKERHUB_USERNAME',
          description: 'Your Docker Hub username or registry user account',
          recommendedValue: 'e.g. your-dockerhub-handle',
          target: 'Docker Hub',
        },
        {
          name: 'DOCKERHUB_TOKEN',
          description: 'Personal Access Token from Docker Hub with Read & Write permissions',
          recommendedValue: 'dckr_pat_...',
          target: 'Docker Hub',
        }
      );
    } else if (deployment.target === 'aws') {
      secrets.push(
        {
          name: 'AWS_ACCESS_KEY_ID',
          description: 'IAM user access key ID with deploy permissions',
          recommendedValue: 'AKIA...',
          target: 'AWS',
        },
        {
          name: 'AWS_SECRET_ACCESS_KEY',
          description: 'IAM user secret access key corresponding to access key ID',
          recommendedValue: 'Secret string',
          target: 'AWS',
        }
      );
    } else if (deployment.target === 'vercel') {
      secrets.push(
        {
          name: 'VERCEL_TOKEN',
          description: 'Personal Access Token from Vercel Account Settings -> Tokens',
          recommendedValue: 'vercel_token_...',
          target: 'Vercel',
        },
        {
          name: 'VERCEL_ORG_ID',
          description: 'Vercel Team or User ID (found in Project Settings or .vercel/project.json)',
          recommendedValue: 'team_...',
          target: 'Vercel',
        },
        {
          name: 'VERCEL_PROJECT_ID',
          description: 'Vercel Project ID (found in Project Settings or .vercel/project.json)',
          recommendedValue: 'prj_...',
          target: 'Vercel',
        }
      );
    }
  }

  // Scan custom steps for any ${{ secrets.SOMETHING }} expressions
  const secretRegex = /\$\{\{\s*secrets\.([A-Za-z0-9_]+)\s*\}\}/g;
  steps.forEach((step) => {
    const content = `${step.run || ''} ${step.uses || ''} ${step.env.map((e) => e.value).join(' ')}`;
    let match;
    while ((match = secretRegex.exec(content)) !== null) {
      const secretName = match[1];
      if (!secrets.some((s) => s.name === secretName)) {
        secrets.push({
          name: secretName,
          description: `Custom secret referenced in step: "${step.name}"`,
          recommendedValue: 'Your secret value',
          target: 'General',
        });
      }
    }
  });

  return secrets;
}
