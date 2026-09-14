import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мафия",
  description: "Локальная PWA-игра «Мафия» для одного устройства",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#121113",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
