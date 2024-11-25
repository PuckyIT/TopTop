// pages/login.tsx

"use client";
import { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import { useRouter } from "next/navigation";
import axiosInstance from "@/untils/axiosInstance";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "@/app/globals.css";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { theme } = useTheme();
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const themeColors = {
    background: theme === "dark" ? "#333333" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#000000",
    inputBg: theme === "dark" ? "#555555" : "#f5f5f5",
    inputColor: theme === "dark" ? "#ffffff" : "#333333",
    buttonColor: theme === "dark" ? "#ff204e" : "#1890ff",
    dividerColor: theme === "dark" ? "#666666" : "#eaeaea",
    secondaryText:
      theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(98, 98, 98, 0.5)",
  };

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);
      message.success("Đăng nhập thành công!");
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setLoading(false);
      router.push("/home");
    } catch (error) {
      message.error("Email hoặc mật khẩu không đúng.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", {
        email: forgotEmail,
      });
      message.success("OTP đã được gửi đến email của bạn!");
      setForgotPasswordModal(false);
      setOtpModal(true);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        message.error("OTP đã gửi. Vui lòng kiểm tra mail.");
      } else {
        message.error("Không thể gửi OTP. Vui lòng thử lại.");
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    setOtpLoading(true);
    try {
      message.success("OTP đã nhập!");
      setOtpModal(false);
      setResetPasswordModal(true);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetPasswordLoading(true);
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await axiosInstance.post(`/auth/reset-password/${otp}`, {
        email: forgotEmail,
        newPassword: newPassword,
      });
      message.success("Đặt lại mật khẩu thành công!");
      setResetPasswordModal(false);
      setForgotEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      message.error("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = "https://toptop-be.onrender.com/api/v1/auth/google";
  };

  return (
    <div
      className="login-page"
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
        padding: "10px",
      }}
    >
      <Form
        name="login"
        className="login-form"
        onFinish={onFinish}
        style={{
          display: "flex",
          width: "35vw",
          maxHeight: "80vh",
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
            type="email"
            placeholder="Your Email"
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
            Sign In
          </Button>
        </Form.Item>
        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link href="/signup">
              <Button
                type="link"
                block
                style={{ textAlign: "left", padding: 0 }}
              >
                Sign Up
              </Button>
            </Link>
            <Button
              type="link"
              onClick={() => setForgotPasswordModal(true)}
              style={{ textAlign: "right", padding: 0 }}
            >
              Forgot Password?
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: themeColors.dividerColor,
              }}
            />
            <span
              style={{ padding: "0 10px", color: themeColors.secondaryText }}
            >
              Sign in with
            </span>
            <span
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: themeColors.dividerColor,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Button
              style={{
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "rgba(98, 98, 98, 0.5)",
                padding: "0 15px",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              onClick={handleGoogleLogin}
            >
              <Image
                src="/icons/google.png"
                alt="Google Icon"
                width={20}
                height={20}
              />
            </Button>

            <Button
              style={{
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "rgba(98, 98, 98, 0.5)",
                padding: "0 15px",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              onClick={() => {
                window.location.href =
                  "https://toptop-be.onrender.com/api/v1/auth/github";
              }}
            >
              <Image
                src="/icons/github.png"
                alt="GitHub Icon"
                width={20}
                height={20}
              />
            </Button>
          </div>
        </Form.Item>
      </Form>

      <Modal
        title={
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              color: themeColors.color,
            }}
          >
            Quên mật khẩu
          </div>
        }
        open={forgotPasswordModal}
        className="forgot-password-modal"
        onOk={handleForgotPassword}
        onCancel={() => setForgotPasswordModal(false)}
        confirmLoading={forgotPasswordLoading}
        okText="Xác nhận"
        cancelText="Hủy"
        width={500}
        centered
        bodyStyle={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px", // Thêm borderRadius
        }}
        style={{
          borderRadius: "8px", // Áp dụng borderRadius cho Modal chính
          overflow: "hidden", // Đảm bảo phần viền không bị cắt
        }}
        cancelButtonProps={{
          style: {
            color: themeColors.color,
            background: themeColors.inputBg,
            border: "none",
          },
        }}
      >
        <Form layout="vertical" style={{ width: "100%", padding: "16px" }}>
          <Form.Item
            className="forgot-password-form"
            label={
              <span style={{ color: themeColors.color, fontWeight: "bold" }}>
                Email
              </span>
            }
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              style={{
                color: themeColors.color,
                background: themeColors.inputBg,
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              color: themeColors.color,
            }}
          >
            Nhập OTP
          </div>
        }
        open={otpModal}
        onOk={handleVerifyOtp}
        onCancel={() => setOtpModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        className="otp-modal"
        confirmLoading={otpLoading}
        width={500}
        centered
        bodyStyle={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "8px",
        }}
        style={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
        cancelButtonProps={{
          style: {
            color: themeColors.color,
            background: themeColors.inputBg,
            border: "none",
          },
        }}
      >
        <Form.Item
          className="otp-form"
          label={
            <span
              style={{
                color: themeColors.color,
                fontWeight: "bold",
                flex: 1,
              }}
            >
              OTP
            </span>
          }
          rules={[{ required: true, message: "Vui lòng nhập OTP!" }]}
        >
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Nhập OTP"
            style={{
              color: themeColors.color,
              background: themeColors.inputBg,
            }}
          />
        </Form.Item>
      </Modal>

      <Modal
        title={
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              color: themeColors.color,
            }}
          >
            Đặt lại mật khẩu
          </div>
        }
        open={resetPasswordModal}
        onOk={handleResetPassword}
        onCancel={() => setResetPasswordModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        className="reset-password-modal"
        confirmLoading={resetPasswordLoading}
        width={500}
        centered
        bodyStyle={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "8px",
        }}
        style={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
        cancelButtonProps={{
          style: {
            color: themeColors.color,
            background: themeColors.inputBg,
            border: "none",
          },
        }}
      >
        <Form layout="vertical" style={{ width: "100%" }}>
          <Form.Item
            className="reset-password-form"
            label={
              <span style={{ color: themeColors.color, fontWeight: "bold" }}>
                Mật khẩu mới
              </span>
            }
            name="newPassword"
            rules={[
              {
                required: true,
                min: 6,
                message: "Mật khẩu mới phải ít nhất 6 ký tự!",
              },
            ]}
          >
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              style={{
                color: themeColors.color,
                background: themeColors.inputBg,
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
            label={
              <span style={{ color: themeColors.color, fontWeight: "bold" }}>
                Xác nhận mật khẩu mới
              </span>
            }
            name="confirmPassword"
            rules={[
              {
                required: true,
                min: 6,
                message: "Vui lòng xác nhận mật khẩu!",
              },
            ]}
          >
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              style={{
                color: themeColors.color,
                background: themeColors.inputBg,
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
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;
