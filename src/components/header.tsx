"use client";

import {
  Layout,
  Input,
  Button,
  Avatar,
  Dropdown,
  Menu,
  Upload,
  message,
} from "antd";
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
  UploadOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axiosInstance from "@/untils/axiosInstance";
import Image from "next/image";

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

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token if necessary
          },
        }
      );

      // Clear the token and user info from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optionally redirect the user or update the UI state
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("Logout failed. Please try again.");
    }
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
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        style={{
          color: theme === "dark" ? "#f5f5f5" : "#333333",
          padding: "8px 16px",
        }}
        onClick={handleLogout}
      >
        Log out
      </Menu.Item>
    </Menu>
  );

  const handleVideoUpload = async (file: File) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You need to log in to upload a video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      await axiosInstance.post("/videos/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Video uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload video.");
    }
  };

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
        position: "absolute",
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
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            style={{
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleVideoUpload(file);
                return false; // Prevent auto upload
              }}
            >
              <Button
                type="default"
                className="custom-btn"
                icon={<UploadOutlined />}
              >
                Upload
              </Button>
            </Upload>
            <Link href="/profile">
              <Avatar
                src={user?.avatar || undefined}
                alt="User Avatar"
                className="avatar-user"
                style={{
                  backgroundColor: "#ff204e",
                  marginLeft: 20,
                  marginRight: 0,
                  fontWeight: "bold",
                  height: "39px",
                  width: "39px",
                  cursor: "pointer",
                }}
              >
                {!user?.avatar && userInitials}
              </Avatar>
            </Link>
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
