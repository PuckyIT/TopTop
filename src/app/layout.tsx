"use client";

import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/app/globals.css";
import ClientOnlyLayout from "@/components/clientOnlyLayout";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { AbilityProvider } from "./context/AbilityContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = "user"; // Replace with actual role logic if necessary

  return (
    <ThemeProvider>
      <html lang="en">
        <AbilityProvider role={userRole}>
          <body className={inter.className}>
            <AntdRegistry>
              <ClientOnlyLayout>{children}</ClientOnlyLayout>
            </AntdRegistry>
          </body>
        </AbilityProvider>
      </html>
    </ThemeProvider>
  );
}
