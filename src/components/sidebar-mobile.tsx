"use client";

import React, { useState } from "react";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass as faCompassOutlined,
  faEnvelope as faEnvelopeOutlined,
  faUser as faUserOutlined,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCompass as faCompassFilled,
  faEnvelope as faEnvelopeFilled,
  faUser as faUserFilled,
} from "@fortawesome/free-solid-svg-icons";
import { HomeOutlined, HomeFilled } from "@ant-design/icons";
import { useTheme } from "@/app/context/ThemeContext";

const SidebarMobile: React.FC = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("1");
  const { theme } = useTheme();
  const currentTheme = selectedKey === "1" ? "dark" : theme;

  const themeColors = {
    text: currentTheme === "dark" ? "#ffffff" : "#000000",
    background: currentTheme === "dark" ? "#000000" : "#ffffff",
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        router.push("/");
        break;
      case "2":
        router.push("/explore");
        break;
      case "3":
        router.push("/messages");
        break;
      case "4":
        router.push("/profile-mobile");
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: "1",
      icon:
        selectedKey === "1" ? (
          <HomeFilled
            style={{
              fontSize: "24px",
              color: themeColors.text,
            }}
          />
        ) : (
          <HomeOutlined
            style={{
              fontSize: "24px",
              color: themeColors.text,
            }}
          />
        ),
    },
    {
      key: "2",
      icon: (
        <FontAwesomeIcon
          icon={selectedKey === "2" ? faCompassFilled : faCompassOutlined}
          style={{
            fontSize: "24px",
            color: themeColors.text,
          }}
        />
      ),
    },
    {
      key: "3",
      icon: (
        <FontAwesomeIcon
          icon={selectedKey === "3" ? faEnvelopeFilled : faEnvelopeOutlined}
          style={{
            fontSize: "24px",
            color: themeColors.text,
          }}
        />
      ),
    },
    {
      key: "4",
      icon: (
        <FontAwesomeIcon
          icon={selectedKey === "4" ? faUserFilled : faUserOutlined}
          style={{
            fontSize: "24px",
            color: themeColors.text,
          }}
        />
      ),
    },
  ];

  return (
    <Menu
      className="sidebar-mobile"
      mode="horizontal"
      selectedKeys={[selectedKey]}
      onClick={handleMenuClick}
      style={{
        background: themeColors.background,
      }}
      items={menuItems.map((item) => ({
        ...item,
        className: "sidebar-mobile-item",
      }))}
    />
  );
};

export default SidebarMobile;
