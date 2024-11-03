"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axiosInstance from "@/untils/axiosInstance";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #f8f8ff, #e9efff)",
        fontWeight: "bold",
      }}
    >
      <Form
        name="signup"
        onFinish={handleSubmit}
        style={{
          width: 500,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
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
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
          />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your Username!" }]}
        >
          <Input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Username"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password!" }]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Your Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            style={{
              height: "3rem",
              fontWeight: "bold",
              backgroundColor: "#ff204e",
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
              gap: 5,
            }}
          >
            Already have an account?
            <Button type="link" href="/login" style={{ right: 0, padding: 0 }}>
              Sign In
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;