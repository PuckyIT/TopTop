// src/app/layout.tsx
"use client";

import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/app/globals.css";
import ClientOnlyLayout from "@/components/clientOnlyLayout";
import { ThemeProvider } from "@/untils/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className={inter.className}>
          <AntdRegistry>
            <ClientOnlyLayout>{children}</ClientOnlyLayout>
          </AntdRegistry>
        </body>
      </ThemeProvider>
    </html>
  );
}