"use client";
import { Menu } from "antd";
import {
  HomeOutlined,
  CompassOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("1");

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    // Navigate to the corresponding page when a menu item is clicked
    switch (key) {
      case "1":
        router.push("/home"); // For You
        break;
      case "2":
        router.push("/explore"); // Explore
        break;
      case "3":
        router.push("/following"); // Following
        break;
      case "4":
        router.push("/live"); // LIVE
        break;
      case "5":
        router.push("/profile"); // Profile
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined style={{ fontSize: "18px" }} />,
      label: "For You",
    },
    {
      key: "2",
      icon: <CompassOutlined style={{ fontSize: "18px" }} />,
      label: "Explore",
    },
    {
      key: "3",
      icon: <TeamOutlined style={{ fontSize: "18px" }} />,
      label: "Following",
    },
    {
      key: "4",
      icon: <VideoCameraOutlined style={{ fontSize: "18px" }} />,
      label: "LIVE",
    },
    {
      key: "5",
      icon: <UserOutlined style={{ fontSize: "18px" }} />,
      label: "Profile",
    },
  ];

  return (
    <div
      style={{
        width: 256,
        position: "fixed",
        height: "100%",
        zIndex: 9,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{
          height: "100%",
          borderRight: 0,
          paddingTop: "40%",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "600",
          fontSize: "16px",
        }}
        onClick={({ key }) => handleMenuClick(key)}
        items={menuItems}
      />
    </div>
  );
};

export default Sidebar;