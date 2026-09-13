import { MarketplaceAction } from '../types/workflow';

export const MARKETPLACE_ACTIONS: MarketplaceAction[] = [
  // --- Notifications & Alerts ---
  {
    id: 'slack-notify',
    name: 'Slack Notification',
    category: 'notifications',
    description: 'Post rich status cards to a Slack channel with build status, author, and commit URL.',
    uses: '8398a7/action-slack@v3',
    with: {
      status: '${{ job.status }}',
      fields: 'repo,message,commit,author,action,eventName,ref,workflow',
    },
    env: [
      { key: 'SLACK_WEBHOOK_URL', value: '${{ secrets.SLACK_WEBHOOK_URL }}' },
    ],
    ifCondition: 'always()',
    requiredSecrets: [
      {
        name: 'SLACK_WEBHOOK_URL',
        description: 'Incoming Webhook URL from your Slack app settings.',
        target: 'General',
      },
    ],
    badge: 'Popular',
    documentationUrl: 'https://github.com/8398a7/action-slack',
  },
  {
    id: 'discord-notify',
    name: 'Discord Webhook Alert',
    category: 'notifications',
    description: 'Send embedded pipeline alerts and build status updates to any Discord server channel.',
    uses: 'Ilshidur/action-discord@master',
    env: [
      { key: 'DISCORD_WEBHOOK', value: '${{ secrets.DISCORD_WEBHOOK }}' },
    ],
    with: {
      args: 'CI Pipeline for {{ EVENT_PAYLOAD.repository.full_name }} completed with status {{ JOB_STATUS }}.',
    },
    ifCondition: 'always()',
    requiredSecrets: [
      {
        name: 'DISCORD_WEBHOOK',
        description: 'Webhook URL generated in your Discord channel integration settings.',
        target: 'General',
      },
    ],
    badge: 'Trending',
    documentationUrl: 'https://github.com/Ilshidur/action-discord',
  },
  {
    id: 'teams-notify',
    name: 'Microsoft Teams Alert',
    category: 'notifications',
    description: 'Notify Microsoft Teams channels on build failure or successful deployment.',
    uses: 'simbo/teams-notify@v1',
    with: {
      webhook_url: '${{ secrets.TEAMS_WEBHOOK_URL }}',
      title: 'GitHub Actions Build Alert',
      message: 'Workflow ${{ github.workflow }} finished on ${{ github.ref_name }}.',
    },
    ifCondition: 'always()',
    requiredSecrets: [
      {
        name: 'TEAMS_WEBHOOK_URL',
        description: 'Office 365 Connector Incoming Webhook URL.',
        target: 'General',
      },
    ],
    documentationUrl: 'https://github.com/simbo/teams-notify',
  },

  // --- Code Quality & Coverage ---
  {
    id: 'codecov-upload',
    name: 'Codecov Test Coverage',
    category: 'quality',
    description: 'Upload unit test coverage reports directly to Codecov for pull request status checks.',
    uses: 'codecov/codecov-action@v4',
    with: {
      token: '${{ secrets.CODECOV_TOKEN }}',
      fail_ci_if_error: 'false',
      verbose: 'true',
    },
    env: [
      { key: 'CODECOV_TOKEN', value: '${{ secrets.CODECOV_TOKEN }}' },
    ],
    requiredSecrets: [
      {
        name: 'CODECOV_TOKEN',
        description: 'Repository upload token from your Codecov project dashboard.',
        target: 'General',
      },
    ],
    badge: 'Verified',
    documentationUrl: 'https://github.com/codecov/codecov-action',
  },
  {
    id: 'sonarcloud-scan',
    name: 'SonarCloud Code Analysis',
    category: 'quality',
    description: 'Static analysis and quality gates for bugs, security vulnerabilities, and code smells.',
    uses: 'SonarSource/sonarcloud-github-action@master',
    env: [
      { key: 'GITHUB_TOKEN', value: '${{ secrets.GITHUB_TOKEN }}' },
      { key: 'SONAR_TOKEN', value: '${{ secrets.SONAR_TOKEN }}' },
    ],
    requiredSecrets: [
      {
        name: 'SONAR_TOKEN',
        description: 'Authentication token generated in SonarCloud Security settings.',
        target: 'General',
      },
    ],
    badge: 'Enterprise',
    documentationUrl: 'https://github.com/SonarSource/sonarcloud-github-action',
  },
  {
    id: 'super-linter',
    name: 'GitHub Super-Linter',
    category: 'quality',
    description: 'Comprehensive linter suite validating 50+ languages, syntax, markdown, and config files.',
    uses: 'super-linter/super-linter@v5',
    env: [
      { key: 'DEFAULT_BRANCH', value: 'main' },
      { key: 'GITHUB_TOKEN', value: '${{ secrets.GITHUB_TOKEN }}' },
      { key: 'VALIDATE_ALL_CODEBASE', value: 'false' },
    ],
    documentationUrl: 'https://github.com/super-linter/super-linter',
  },

  // --- Security & Scanners ---
  {
    id: 'snyk-security',
    name: 'Snyk Vulnerability Scanner',
    category: 'security',
    description: 'Scan dependencies and open-source packages for known CVEs and license compliance.',
    uses: 'snyk/actions/node@master',
    env: [
      { key: 'SNYK_TOKEN', value: '${{ secrets.SNYK_TOKEN }}' },
    ],
    with: {
      args: '--severity-threshold=high',
    },
    requiredSecrets: [
      {
        name: 'SNYK_TOKEN',
        description: 'Snyk API token from Account Settings > Auth Token.',
        target: 'General',
      },
    ],
    badge: 'Security',
    documentationUrl: 'https://github.com/snyk/actions',
  },
  {
    id: 'trivy-scan',
    name: 'Aqua Trivy Container Scanner',
    category: 'security',
    description: 'Scan container images, file systems, and Git repositories for vulnerabilities and misconfigs.',
    uses: 'aquasecurity/trivy-action@master',
    with: {
      scan_type: 'fs',
      ignore_unfixed: 'true',
      format: 'table',
      severity: 'CRITICAL,HIGH',
    },
    badge: 'Security',
    documentationUrl: 'https://github.com/aquasecurity/trivy-action',
  },
  {
    id: 'trufflehog-secrets',
    name: 'TruffleHog Secret Detector',
    category: 'security',
    description: 'Find leaked secrets, API keys, and credentials accidentally committed to git history.',
    uses: 'trufflesecurity/trufflehog@main',
    with: {
      extra_args: '--only-verified',
    },
    badge: 'Security',
    documentationUrl: 'https://github.com/trufflesecurity/trufflehog',
  },

  // --- Cloud & DevOps Infrastructure ---
  {
    id: 'setup-terraform',
    name: 'HashiCorp Terraform CLI',
    category: 'cloud',
    description: 'Set up Terraform CLI environment with caching and cloud credentials.',
    uses: 'hashicorp/setup-terraform@v3',
    with: {
      terraform_version: '1.7.0',
    },
    badge: 'DevOps',
    documentationUrl: 'https://github.com/hashicorp/setup-terraform',
  },
  {
    id: 'setup-kubectl',
    name: 'Kubernetes kubectl CLI',
    category: 'cloud',
    description: 'Install and configure kubectl CLI to interact with Kubernetes clusters (EKS/GKE/AKS).',
    uses: 'azure/setup-kubectl@v4',
    with: {
      version: 'v1.29.0',
    },
    badge: 'DevOps',
    documentationUrl: 'https://github.com/azure/setup-kubectl',
  },
  {
    id: 'setup-helm',
    name: 'Helm Kubernetes Manager',
    category: 'cloud',
    description: 'Install Helm package manager to deploy containerized applications to Kubernetes.',
    uses: 'azure/setup-helm@v4',
    with: {
      version: 'v3.14.0',
    },
    documentationUrl: 'https://github.com/azure/setup-helm',
  },

  // --- Release & Publishing ---
  {
    id: 'create-release',
    name: 'Create GitHub Release',
    category: 'releases',
    description: 'Automatically publish GitHub release with release notes and downloadable binary assets.',
    uses: 'softprops/action-gh-release@v2',
    with: {
      files: 'dist/**/*',
      generate_release_notes: 'true',
    },
    env: [
      { key: 'GITHUB_TOKEN', value: '${{ secrets.GITHUB_TOKEN }}' },
    ],
    ifCondition: "startsWith(github.ref, 'refs/tags/')",
    badge: 'Release',
    documentationUrl: 'https://github.com/softprops/action-gh-release',
  },
  {
    id: 'release-drafter',
    name: 'Release Drafter',
    category: 'releases',
    description: 'Drafts your next release notes as pull requests are merged into main.',
    uses: 'release-drafter/release-drafter@v6',
    env: [
      { key: 'GITHUB_TOKEN', value: '${{ secrets.GITHUB_TOKEN }}' },
    ],
    documentationUrl: 'https://github.com/release-drafter/release-drafter',
  },
];
