/* eslint-disable @next/next/no-img-element */
"use client";

import { Layout, Input, Button, Avatar, Dropdown, Menu } from "antd";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/untils/ThemeContext";
import {
  SearchOutlined,
  MoreOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  TranslationOutlined,
  MoonOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const userInitials = user?.email
    ? user.email
        .split("@")[0]
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  const menu = (
    <Menu
      style={{
        backgroundColor: theme === "dark" ? "#333333" : "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Menu.Item
        key="creator"
        icon={<HomeOutlined />}
        style={{
          color: theme === "dark" ? "#f5f5f5" : "#333333",
          padding: "8px 16px",
        }}
      >
        Công cụ dành cho nhà sáng tạo
      </Menu.Item>
      <Menu.Item
        key="language"
        icon={<TranslationOutlined />}
        style={{
          color: theme === "dark" ? "#f5f5f5" : "#333333",
          padding: "8px 16px",
        }}
      >
        Tiếng Việt
      </Menu.Item>
      <Menu.Item
        key="support"
        icon={<QuestionCircleOutlined />}
        style={{
          color: theme === "dark" ? "#f5f5f5" : "#333333",
          padding: "8px 16px",
        }}
      >
        Phản hồi và trợ giúp
      </Menu.Item>
      <Menu.Item
        key="theme"
        icon={<MoonOutlined />}
        style={{
          color: theme === "dark" ? "#f5f5f5" : "#333333",
          padding: "8px 16px",
        }}
        onClick={toggleTheme}
      >
        {theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      className={theme === "dark" ? "dark-mode" : "light-mode"}
      style={{
        background: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#333" : "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "fixed",
        height: "80px",
        width: "100vw",
        zIndex: 10,
        borderBottom: `1px solid ${theme === "light" ? "#e0e0e0" : "#444"}`,
      }}
    >
      {/* Logo and Search */}
      <div
        style={{
          width: "15%",
          height: "80px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          href="/home"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src="logo.png"
            alt="Logo"
            style={{
              width: "40%",
              height: "100%",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(0.9)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <span
            style={{
              fontSize: "30px",
              fontWeight: "600",
              color: theme === "light" ? "#333" : "#f5f5f5",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
            }}
          >
            TopTop
          </span>
        </Link>
      </div>

      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        className={theme === "dark" ? "dark-placeholder" : "light-placeholder"}
        style={{
          width: 400,
          borderRadius: 20,
          backgroundColor: theme === "light" ? "#f5f5f5" : "#555",
          color: theme === "light" ? "#333" : "#ffffff",
          padding: "8px 16px",
          fontSize: "16px",
          border: "1px solid #e0e0e0",
        }}
        suffix={
          <SearchOutlined
            style={{
              color: theme === "light" ? "#b0b0b0" : "#aaa",
              fontSize: "16px",
              cursor: "pointer",
              padding: 5,
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF204E")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color =
                theme === "light" ? "#b0b0b0" : "#aaa")
            }
          />
        }
      />

      {/* Log In and Dropdown */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10%",
        }}
      >
        {isLoggedIn ? (
          <div
            style={{ display: "flex", alignItems: "center", marginRight: 30 }}
          >
            <Link href="/profile">
              <Avatar
                src={user?.avatar || undefined}
                alt="User Avatar"
                className="avatar-user"
                style={{
                  backgroundColor: "#ff204e",
                  marginRight: 20,
                  fontWeight: "bold",
                  height: "39px",
                  width: "39px",
                  cursor: "pointer",
                }}
              >
                {!user?.avatar && userInitials}
              </Avatar>
            </Link>
            <Button
              type="default"
              className="custom-btn"
              style={{
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
                height: "100%",
              }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button
              type="primary"
              style={{
                height: "40px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "600",
              }}
            >
              Log in
            </Button>
          </Link>
        )}
        <Dropdown
          overlay={menu}
          trigger={["hover"]}
          overlayStyle={{
            marginTop: "10px",
            borderRadius: "8px",
          }}
        >
          <MoreOutlined
            style={{
              fontSize: "24px",
              cursor: "pointer",
              color: theme === "light" ? "#333333" : "#f5f5f5",
            }}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
