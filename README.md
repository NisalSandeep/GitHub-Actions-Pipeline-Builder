# 🚀 GitHub Actions Pipeline Studio

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**GitHub Actions Pipeline Studio** is a modern visual builder and live architect for generating production-ready GitHub Actions CI/CD workflows (`.github/workflows/*.yml`).

---

## ✨ Features

- **Visual Step Builder**: Step-by-step workflow architect (Triggers, Runtime, Cache, Steps, Deployment) with buttery Framer Motion animations.
- **Realistic 3D Brand Icons**: High-definition vector icons for Node.js, Python, Go, Java, Rust, PHP, .NET, Ruby, Flutter, Docker, AWS, Vercel, and GitHub.
- **Multi-Job Deployment**: Native support for Docker Hub / GHCR, AWS (S3, ECS, Lambda), Vercel, and GitHub Pages with automatic inter-job dependencies (`needs: [build]`).
- **Live YAML & Visual DAG**: Real-time PrismJS syntax-highlighted editor alongside an interactive pipeline topology graph.
- **Direct GitHub Commit**: Push generated workflows straight to your GitHub repository using a Personal Access Token.
- **Secrets Inspector**: Auto-detects and lists all required repository secrets with 1-click copying.
- **Frosted Glass UI/UX**: Premium dark theme with smooth transitions, responsive focus modes, and toast alerts.

---

## ⚡ Quick Start

### 1. Local Development
```bash
# Clone the repository
git clone https://github.com/NisalSandeep/GitHub-Actions-Pipeline-Builder.git
cd GitHub-Actions-Pipeline-Builder

# Install dependencies
npm install

# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Docker
```bash
# Run with Docker Compose
docker compose up -d --build
```
The app will be live at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Animations**: [React 19](https://react.dev/), [Framer Motion](https://motion.dev/), [Lucide Icons](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with frosted glassmorphism
- **Code & Syntax**: [PrismJS](https://prismjs.com/), [js-yaml](https://github.com/nodeca/js-yaml), [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 📄 License

Distributed under the [MIT License](LICENSE).
