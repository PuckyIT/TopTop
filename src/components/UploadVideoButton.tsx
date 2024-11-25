"use client";

import { Button, Modal, Input, Form, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "@/untils/axiosInstance";
import toast from "react-hot-toast";
import { useState } from "react";
import { useSelector } from "react-redux";

const UploadVideoButton: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Lấy thông tin người dùng từ Redux
  const user = useSelector((state: any) => state.user);

  const handleUploadClick = () => {
    setIsModalVisible(true); // Hiển thị modal khi nhấn nút
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal khi bấm cancel
  };

  const handleVideoUpload = async () => {
    if (!title || !videoFile) {
      message.error("Please fill all fields and select a video.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You need to log in to upload a video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("userId", user.id); // Gửi thông tin người dùng từ Redux

    try {
      setLoading(true);
      await axiosInstance.post("/videos/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Video uploaded successfully!");
      setIsModalVisible(false); // Đóng modal sau khi upload thành công
    } catch (error) {
      toast.error("Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="default"
        className="custom-btn"
        icon={<UploadOutlined />}
        style={{
          height: "40px",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "600",
        }}
        onClick={handleUploadClick}
      >
        Upload
      </Button>

      <Modal
        title="Upload Video"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleVideoUpload}
        okButtonProps={{ loading }}
        cancelButtonProps={{
          style: {
            // color: "#fff", // Màu chữ
          },
        }}
        closeIcon={<span style={{ color: "#000", fontSize: "18px" }}>×</span>} // Tùy chỉnh dấu "x" đóng modal
      >
        <Form layout="vertical">
          <Form.Item label="Video Title" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the video title"
            />
          </Form.Item>

          <Form.Item label="Upload Video" required>
            <Upload
              accept="video/*"
              beforeUpload={(file) => {
                setVideoFile(file);
                return false; // Prevent auto upload
              }}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Select Video
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UploadVideoButton;