import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Actions Pipeline Studio | Interactive Workflow Generator",
  description:
    "Interactive, visual GitHub Actions workflow builder with real-time YAML preview, multi-job deployment orchestration, and live secrets checklist.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  keywords: [
    "GitHub Actions",
    "CI/CD",
    "Workflow Generator",
    "Docker Hub",
    "AWS",
    "Vercel",
    "YAML Generator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0d1117] text-[#f0f6fc]">
        {children}
      </body>
    </html>
  );
}
