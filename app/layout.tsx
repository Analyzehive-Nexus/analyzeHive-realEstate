import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analyzehive Flow - ERP",
  description: "Real Estate ERP foundation",
};

import { ToastProvider } from "@/components/ui/toast";
import { ProjectProvider } from "@/lib/contexts/ProjectContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <ProjectProvider>
            {children}
          </ProjectProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
