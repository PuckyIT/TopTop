"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const avatar = urlParams.get("avatar"); // Lấy avatar từ URL

    if (token) {
      // Lưu token, email, và avatar vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, avatar })); // Lưu avatar cùng với email

      // Điều hướng đến trang home hoặc trang người dùng
      router.push("/home");
    } else {
      // Điều hướng đến trang đăng nhập nếu không có token
      router.push("/login");
    }
  }, [router]);

  return <p>Đang xử lý đăng nhập...</p>;
};

export default LoginCallback;