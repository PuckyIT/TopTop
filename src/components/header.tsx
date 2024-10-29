/* eslint-disable @next/next/no-img-element */
"use client";

import { Layout, Input, Button, Avatar } from "antd";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Fetch user info from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Convert from string to object
      setIsLoggedIn(true); // Set login status to true
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null); // Set user to null on logout
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

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "fixed",
        height: "80px",
        width: "100vw",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: "15%",
          height: "80px",
          position: "relative",
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
              color: "#333",
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
        style={{
          width: 400,
          borderRadius: 20,
          backgroundColor: "#f5f5f5",
          padding: "8px 16px",
          fontSize: "16px",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
        suffix={
          <SearchOutlined
            style={{
              color: "#b0b0b0",
              fontSize: "16px",
              cursor: "pointer",
              padding: 5,
              transition: "color 0.3s", // Smooth transition
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF204E")} // Hover color
            onMouseLeave={(e) => (e.currentTarget.style.color = "#b0b0b0")} // Original color
          />
        }
      />

      {isLoggedIn ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "50%",
            marginRight: 30,
          }}
        >
          <Link href="/profile">
            <Avatar
              src={user?.avatar || undefined} // Get avatar from localStorage
              alt="User Avatar"
              style={{
                backgroundColor: "#ff204e",
                borderColor: "rgb(248, 248, 255)",
                marginRight: 20,
                fontWeight: "bold",
                height: "39px",
                width: "39px",
                cursor: "pointer",
              }}
            >
              {!user?.avatar && userInitials}
              {""}
              {/* Display initials if no avatar */}
            </Avatar>
          </Link>
          <Button
            type="default"
            style={{
              fontWeight: "bold",
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
              marginRight: 30,
            }}
          >
            Log In
          </Button>
        </Link>
      )}
    </Header>
  );
};

export default HeaderComponent;
