import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChipGPT Workspace",
  description:
    "AI-ассистент для генерации и верификации HDL-кода с рабочим пространством"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}

