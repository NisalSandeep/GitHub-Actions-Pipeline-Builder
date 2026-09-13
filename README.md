# GitHub Actions Pipeline Studio 🚀

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.2-EA4C89?style=for-the-badge&logo=framer)](https://motion.dev/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**GitHub Actions Pipeline Studio** is a modern, visual, interactive web application for architecting and generating production-ready GitHub Actions CI/CD workflows (`.github/workflows/*.yml`).

Built with a dark-mode-first aesthetic inspired by GitHub's official developer console, the studio features split-screen visual editing, live syntax-highlighted YAML preview, dynamic DAG pipeline visualization, an automated repository secrets inspector, and official brand vector icons.

---

## ✨ Features

### 🛠️ Visual Workflow Builder (Left Panel)
- **Global Settings**: Configure workflow title, `.github/workflows/` filename, runner environment (`ubuntu-latest`, `windows-latest`, `macos-latest`, `self-hosted`), trigger events (`push`, `pull_request`, schedule cron presets, `workflow_dispatch`), concurrency cancellation, and repository permissions.
- **Multi-Language Runtime Engine**:
  - **Node.js**: Matrix testing across versions (18.x, 20.x, 22.x) with package managers (`npm`, `yarn`, `pnpm`, `bun`).
  - **Python**: Matrix across versions (3.10, 3.11, 3.12, 3.13) with package managers (`pip`, `poetry`, `uv`, `pipenv`).
  - **Go (Golang)**: Compiler setup and matrix builds (`1.21.x`, `1.22.x`, `1.23.x`).
  - **Java (JDK)**: Distributions (`temurin`, `zulu`, `corretto`, `liberica`) and build tools (`maven`, `gradle`).
  - **Rust**: Toolchain selection (`stable`, `beta`, `nightly`) and components (`clippy`, `rustfmt`).
  - **Generic / Shell**: Custom command-line and container environments.
- **Smart Dependency Caching**: Language-aware dependency caching toggles and custom path overrides.
- **Drag-and-Drop Steps Sequencer**:
  - Reorder pipeline steps via isolated grip handles without text selection interference.
  - Step duplicate, delete, and move up/down controls.
  - Custom environment variables key-value editor (`env: [KEY: VALUE]`).
  - Conditional execution (`if:`) and custom working directory support.
- **Step Preset Library**: 1-click insertion of verified steps:
  - Unit tests & code coverage (`codecov/codecov-action@v4`)
  - Code linting & static analysis
  - Container vulnerability scanning (`aquasecurity/trivy-action`)
  - Artifact upload & download (`actions/upload-artifact@v4`)
  - Slack deployment notifications (`slackapi/slack-github-action@v1`)
- **Multi-Job Deployment Orchestration**:
  - **Docker Hub / GHCR**: Multi-platform build, layer caching, tags, and registry push.
  - **Amazon Web Services (AWS)**: Deploy to AWS S3 & CloudFront, ECS, or AWS Lambda.
  - **Vercel**: Edge frontend and preview deployment.
  - **GitHub Pages**: Automated static site deployment with `id-token` write permissions.
  - Inter-job dependencies linked automatically via `needs: [build]`.

---

### 📄 Real-Time Live Output (Right Panel)
- **PrismJS Syntax-Highlighted YAML**: Live generation using a pure, deterministic YAML generator with line-by-line syntax highlighting and synchronized line numbering.
- **Full-Screen Focus Mode**: Distraction-free editing with dedicated "Exit Fullscreen" button and keyboard `Escape` support.
- **YAML Search & Filter**: Real-time keyword filter with instant line highlighting.
- **Word Wrap Toggle**: Switch between horizontal scroll and soft wrapping without breaking line number synchronization.
- **1-Click Export**:
  - **Copy to Clipboard**: Instant copy accompanied by celebration confetti and visual feedback.
  - **Download `.yml`**: Generates and downloads the configured workflow file ready for your repository.
- **Visual DAG Pipeline Architecture**: Interactive flow graph illustrating event triggers, runner environment, build matrix, and dependent deployment stages.
- **Automated Secrets Checklist**: Automatically detects required repository secrets (e.g. `DOCKERHUB_TOKEN`, `AWS_ACCESS_KEY_ID`, `VERCEL_TOKEN`, `SLACK_WEBHOOK_URL`) with 1-click name copying.

---

### 🎨 Micro-Interactions, Motion & Brand Icons
- **Framer Motion Integration**:
  - Sliding active tab pill indicator with `layoutId` across YAML Preview, Visual Pipeline, and Secrets tabs.
  - Fluid accordion collapse and expansion with 180° rotating chevrons.
  - Reorderable step list layout animations.
  - Animated modal dialogs with backdrop blur.
- **Glassmorphic Toast Notification System**:
  - Real-time feedback for preset loading, step actions, secret copying, and exports.
  - Shrinking gradient progress bar timer.
  - Hover-to-pause countdown.
  - Visual color distinctions: Success (Emerald), Info (Sapphire), Warning (Amber), Error (Ruby).
- **Authentic Brand SVG Icons**:
  - Official vector logos for Node.js, Python, Go, Java, Rust, Docker, AWS, Vercel, Slack, Codecov, Trivy, GitHub, npm, Yarn, pnpm, Bun, Ubuntu, Windows, and macOS.
- **Typography**:
  - Google Font `Inter` for crisp UI readability.
  - Google Font `JetBrains Mono` for code blocks, YAML tokens, and matrix chips.
  - Subpixel antialiasing enabled across all operating systems.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17+ (or v20 LTS recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) *(optional for containerized execution)*

---

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NisalSandeep/GitHub-Actions-Pipeline-Builder.git
   cd GitHub-Actions-Pipeline-Builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the studio**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

### Production Build

To test and compile the production bundle:
```bash
npm run build
npm run start
```

---

## 🐳 Docker Deployment

The application is fully containerized using a multi-stage, non-root Alpine Docker image with Next.js `standalone` output for maximum performance and minimal footprint (<150 MB).

### Running with Docker Compose (Recommended)

1. **Start the container in the background**:
   ```bash
   docker compose up --build -d
   ```

2. **Check container status and health**:
   ```bash
   docker compose ps
   ```

3. **View logs**:
   ```bash
   docker compose logs -f
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000).

5. **Stop the container**:
   ```bash
   docker compose down
   ```

---

### Running with Docker CLI

1. **Build the image**:
   ```bash
   docker build -t github-actions-pipeline-studio:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name pipeline-studio \
     -p 3000:3000 \
     --restart unless-stopped \
     github-actions-pipeline-studio:latest
   ```

---

## 📁 Project Structure

```
├── .github/                     # GitHub repository metadata & workflows
├── public/                      # Static web assets
├── src/
│   ├── app/
│   │   ├── globals.css          # Design system, Prism tokens & typography
│   │   ├── layout.tsx           # Root HTML layout with SEO metadata
│   │   └── page.tsx             # Main application orchestrator
│   ├── components/
│   │   ├── Header.tsx           # Top navigation, preset templates, stats
│   │   ├── builder/
│   │   │   ├── BuilderPanel.tsx         # Collapsible accordion container
│   │   │   ├── GlobalSettingsSection.tsx# Triggers, runners, concurrency
│   │   │   ├── LanguageSection.tsx      # Runtimes, matrices, package managers
│   │   │   ├── CacheSection.tsx         # Dependency caching options
│   │   │   ├── StepsBuilderSection.tsx  # Drag-and-drop step sequencer & presets
│   │   │   └── DeploymentSection.tsx    # Multi-job deploy orchestration
│   │   ├── icons/
│   │   │   └── BrandIcons.tsx           # Official vector brand SVG icons
│   │   └── preview/
│   │       ├── OutputPanel.tsx          # Sliding tab navigation
│   │       ├── YamlPreview.tsx          # Syntax highlighter & fullscreen modal
│   │       ├── PipelineDiagram.tsx      # Visual DAG pipeline architecture
│   │       └── SecretsInspector.tsx     # Required GitHub secrets checklist
│   ├── context/
│   │   ├── WorkflowContext.tsx  # Global workflow state management
│   │   └── ToastContext.tsx     # Framer Motion floating toast system
│   ├── types/
│   │   └── workflow.ts          # Complete TypeScript interfaces & types
│   └── utils/
│       ├── presets.ts           # Starter templates & step presets
│       └── yamlGenerator.ts     # Deterministic YAML & secrets extractor
├── Dockerfile                   # Multi-stage production container
├── docker-compose.yml           # Multi-container orchestration & healthchecks
├── next.config.ts               # Standalone output configuration
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Project documentation
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Scope |
| :--- | :--- | :--- |
| <kbd>Esc</kbd> | Exit Fullscreen Mode | YAML Preview Pane |
| <kbd>Esc</kbd> | Dismiss Starter Templates Menu | Header Navigation |
| <kbd>Esc</kbd> | Close Preset Library Modal | Step Sequencer |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
