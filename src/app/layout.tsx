import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Actions Pipeline Studio | Interactive Workflow Generator",
  description:
    "Interactive, visual GitHub Actions workflow builder with real-time YAML preview, multi-job deployment orchestration, and live secrets checklist.",
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
      <body className="min-h-full flex flex-col bg-[#0d1117] text-[#f0f6fc]">
        {children}
      </body>
    </html>
  );
}
