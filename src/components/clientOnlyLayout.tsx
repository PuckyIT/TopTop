// src/components/clientOnlyLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import HeaderComponent from "@/components/header";
import Sidebar from "@/components/sidebar";

const ClientOnlyLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentPath = usePathname();
  const hideHeaderFooter = currentPath && ["/login", "/signup"].includes(currentPath);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {!hideHeaderFooter && <HeaderComponent />}
      <div style={{ display: "flex", flex: 1 }}>
        {!hideHeaderFooter && <Sidebar />}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

export default ClientOnlyLayout;