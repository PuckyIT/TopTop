"use client";

import { usePathname } from "next/navigation";
import HeaderComponent from "@/components/header";
import Sidebar from "@/components/sidebar";
import HeaderMobile from "./header-mobile";
import SidebarMobile from "./sidebar-mobile";
import { useEffect, useState } from "react";

const ClientOnlyLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentPath = usePathname();
  const hideHeaderFooter =
    currentPath && ["/login", "/signup"].includes(currentPath);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the screen width is 450px or less
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 450);
    handleResize(); // Check screen size on component mount
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {!hideHeaderFooter && (isMobile ? <HeaderMobile /> : <HeaderComponent />)}
      <div style={{ display: "flex", flex: 1, height: "100%", width: "100%" }}>
        {!hideHeaderFooter && (isMobile ? <SidebarMobile /> : <Sidebar />)}
        <div style={{ flex: 1, height: "100%", width: "100%" }}>{children}</div>
      </div>
    </div>
  );
};

export default ClientOnlyLayout;
