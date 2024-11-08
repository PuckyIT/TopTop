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
import { useAbility } from "@/app/context/AbilityContext";

const Sidebar = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("1");
  const ability = useAbility();

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        router.push("/home");
        break;
      case "2":
        router.push("/explore");
        break;
      case "3":
        router.push("/following");
        break;
      case "4":
        router.push("/live");
        break;
      case "5":
        if (ability.can("read", "Profile")) {
          router.push("/profile");
        }
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
    ...(ability.can("read", "Profile")
      ? [
          {
            key: "5",
            icon: <UserOutlined style={{ fontSize: "18px" }} />,
            label: "Profile",
          },
        ]
      : []),
  ];

  return (
    <div id="sidebar">
      <Menu
        mode="vertical"
        selectedKeys={[selectedKey]}
        id="sidebar-menu"
        onClick={({ key }) => handleMenuClick(key)}
        items={menuItems.map((item) => ({
          ...item,
          className: "sidebar-menu-item",
        }))}
      />
    </div>
  );
};

export default Sidebar;
