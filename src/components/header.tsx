"use client";

import {
  Layout,
  Input,
  Button,
  Avatar,
  message,
  MenuProps,
} from "antd";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import {
  SearchOutlined,
  MoreOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  TranslationOutlined,
  MoonOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axiosInstance from "@/untils/axiosInstance";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/redux/userSlice";
import UploadVideoButton from "@/components/UploadVideoButton";
import CustomDropdown from "./DropdownBtn";

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
      setIsLoggedIn(true);
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");

      // Clear the token and user info from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optionally redirect the user or update the UI state
      window.location.href = "/home"; // Redirect to login page
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

    const menuItems = [
      {
        key: "creator",
        label: "Công cụ dành cho nhà sáng tạo",
        icon: <HomeOutlined />,
      },
      {
        key: "language",
        label: "Tiếng Việt",
        icon: <TranslationOutlined />,
      },
      {
        key: "support",
        label: "Phản hồi và trợ giúp",
        icon: <QuestionCircleOutlined />,
      },
      {
        key: "theme",
        label: theme === "light" ? "Chế độ tối" : "Chế độ sáng",
        icon: <MoonOutlined />,
        onClick: toggleTheme,
      },
      {
        key: "logout",
        label: "Log out",
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ];

  return (
    <Header
      className="header-components"
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
            <UploadVideoButton />
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
        <CustomDropdown items={menuItems} />
      </div>
    </Header>
  );
};

export default HeaderComponent;
