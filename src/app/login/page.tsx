// pages/login.tsx

"use client";
import { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import { useRouter } from "next/navigation";
import axiosInstance from "@/untils/axiosInstance";
import Link from "next/link";
import Image from "next/image";

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

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);
      message.success("Đăng nhập thành công!");
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setLoading(false);
      router.push("/home");
    } catch (error) {
      message.error("Email hoặc mật khẩu không đúng.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axiosInstance.post("/users/forgot-password", {
        email: forgotEmail,
      });
      message.success("OTP đã được gửi đến email của bạn!");
      setForgotPasswordModal(false);
      setOtpModal(true);
    } catch (error) {
      message.error("Không thể gửi OTP. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = () => {
    message.success("OTP đã nhập!");
    setOtpModal(false);
    setResetPasswordModal(true);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await axiosInstance.post(`/users/reset-password/${otp}`, {
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
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = "https://toptop-be.onrender.com/api/v1/auth/google";
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
        name="login"
        onFinish={onFinish}
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
          rules={[{ required: true, message: "Please enter email!" }]}
        >
          <Input type="email" placeholder="Your Email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password!" }]}
        >
          <Input.Password placeholder="Your Password" />
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
              style={{ flex: 1, height: "1px", backgroundColor: "#eaeaea" }}
            />
            <span style={{ padding: "0 10px", color: "rgba(98, 98, 98, 0.5)" }}>
              Sign in with
            </span>
            <span
              style={{ flex: 1, height: "1px", backgroundColor: "#eaeaea" }}
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
        title="Quên mật khẩu"
        open={forgotPasswordModal}
        onOk={handleForgotPassword}
        onCancel={() => setForgotPasswordModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        style={{ top: "25%", textAlign: "center", fontWeight: "bold" }}
        width={500}
      >
        <Form.Item
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Nhập email của bạn"
          />
        </Form.Item>
      </Modal>

      <Modal
        title="Nhập OTP"
        open={otpModal}
        onOk={handleVerifyOtp}
        onCancel={() => setOtpModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        style={{ top: "25%", textAlign: "center", fontWeight: "bold" }}
        width={500}
      >
        <Form.Item
          label="OTP"
          rules={[{ required: true, message: "Vui lòng nhập OTP!" }]}
        >
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Nhập OTP đã gửi đến email"
          />
        </Form.Item>
      </Modal>

      <Modal
        title="Đặt lại mật khẩu"
        open={resetPasswordModal}
        onOk={handleResetPassword}
        onCancel={() => setResetPasswordModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        style={{ top: "25%", textAlign: "center", fontWeight: "bold" }}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item
            label="Mật khẩu mới"
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
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
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
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;
