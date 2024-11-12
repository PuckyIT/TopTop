// pages/signup.tsx

"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axiosInstance from "@/untils/axiosInstance";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const themeColors = {
    background: theme === "dark" ? "#333333" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#000000",
    inputBg: theme === "dark" ? "#555555" : "#f5f5f5",
    inputColor: theme === "dark" ? "#ffffff" : "#333333",
    buttonColor: theme === "dark" ? "#ff204e" : "#1890ff",
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/signup", {
        email,
        username,
        password,
      });
      message.success("Registration successful!");
      router.push("/login");
    } catch (error) {
      message.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signup-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #1a1a1a, #121212)"
            : "linear-gradient(135deg, #f8f8ff, #e9efff)",
        color: themeColors.color,
        fontWeight: "bold",
      }}
    >
      <Form
        className="signup-form"
        name="signup"
        onFinish={handleSubmit}
        style={{
          width: 500,
          display: "flex",
          flexDirection: "column",
          backgroundColor: themeColors.background,
          color: themeColors.color,
          padding: "3% 5%",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
        layout="vertical"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 style={{ fontSize: "1.5rem" }}>TopTop</h1>
        </div>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter email!" }]}
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            style={{
              backgroundColor: themeColors.inputBg,
              color: themeColors.inputColor,
            }}
          />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter username!" }]}
        >
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Username"
            style={{
              backgroundColor: themeColors.inputBg,
              color: themeColors.inputColor,
            }}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            style={{
              backgroundColor: themeColors.inputBg,
              color: themeColors.inputColor,
            }}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: themeColors.color }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: themeColors.color }} />
              )
            }
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm password!" }]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            style={{
              backgroundColor: themeColors.inputBg,
              color: themeColors.inputColor,
            }}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: themeColors.color }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: themeColors.color }} />
              )
            }
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            style={{
              height: "3rem",
              fontWeight: "bold",
              backgroundColor: themeColors.buttonColor,
              border: "none",
            }}
            htmlType="submit"
            loading={loading}
            block
          >
            Sign Up
          </Button>
        </Form.Item>
        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Link href="/login">
              <Button
                type="link"
                block
                style={{ textAlign: "left", padding: 0 }}
              >
                Log In
              </Button>
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
