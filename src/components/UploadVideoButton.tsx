import { Button, Modal, Input, Form, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "@/untils/axiosInstance";
import toast from "react-hot-toast";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/app/context/ThemeContext";

const UploadVideoButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Dùng `open` thay vì `visible`
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  // Lấy thông tin người dùng từ Redux
  const user = useSelector((state: any) => state.user);

  const handleUploadClick = () => {
    setIsModalOpen(true); // Hiển thị modal khi nhấn nút
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Đóng modal khi bấm cancel
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
    formData.append("userId", user.id);
    formData.append("username", user.username);

    try {
      setUploading(true); // Bật trạng thái upload khi bắt đầu upload
      await axiosInstance.post("/videos/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Video uploaded successfully!");

      // Reset tất cả sau khi upload thành công
      setTitle(""); // Reset title
      setVideoFile(null); // Reset video file
      setFileList([]); // Reset file list
    } catch (error) {
      toast.error("Failed to upload video.");
    } finally {
      setUploading(false); // Tắt trạng thái upload sau khi hoàn thành
      setIsModalOpen(false); // Đóng modal sau khi upload hoàn tất
    }
  };

  const { theme } = useTheme();

  const themeColors = {
    background: theme === "dark" ? "#555555" : "#F5F5F5",
    color: theme === "dark" ? "#ffffff" : "#000000",
    close: theme === "dark" ? "#555555" : "#e0e0e0",
    dividerColor: theme === "dark" ? "#333" : "#e0e0e0",
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
          backgroundColor: themeColors.background,
          color: themeColors.color,
          border: `1px solid ${themeColors.dividerColor}`,
        }}
        onClick={handleUploadClick}
        loading={uploading}
      >
        Upload
      </Button>

      <Modal
        title={
          <span
            style={{
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              color: themeColors.color,
            }}
          >
            Upload Video
          </span>
        }
        open={isModalOpen} // Sử dụng `open` thay vì `visible`
        width={500}
        centered
        onCancel={handleCancel}
        onOk={handleVideoUpload}
        cancelButtonProps={{
          style: {
            background: themeColors.background,
            color: themeColors.color,
          },
        }}
        closeIcon={
          <span
            style={{
              color: themeColors.close,
              fontSize: "24px",
            }}
          >
            ×
          </span>
        }
        style={{
          color: themeColors.color,
          borderRadius: "8px",
          overflow: "hidden",
        }}
        okButtonProps={{
          loading: uploading, // Hiển thị loading trên nút OK khi đang upload
        }}
      >
        <Form layout="vertical">
          <Form.Item
            label={
              <span style={{ color: themeColors.color }}>Video Title</span>
            }
            required
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the video title"
              style={{
                background: themeColors.background,
                color: themeColors.color,
                border: "1px solid",
                borderColor: themeColors.dividerColor,
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ color: themeColors.color }}>Upload Video</span>
            }
            required
          >
            <Upload
              accept="video/*"
              beforeUpload={(file) => {
                setVideoFile(file);
                setFileList([file]); // Set fileList để đảm bảo video được hiển thị
                return false; // Prevent auto upload
              }}
              fileList={fileList} // Set fileList từ state
              style={{ color: themeColors.color }}
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                style={{
                  color: "#ffffff",
                }}
              >
                Select Video
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .ant-upload-list-item {
          padding: 4px 11px !important;
          border-radius: 6px !important;
        }
        .ant-upload-list-item-name {
          color: ${themeColors.color} !important;
        }
        .ant-upload-list-item:hover {
          background: ${themeColors.background} !important;
          padding: 4px 11px !important;
          border-radius: 6px !important;
        }
        .ant-upload-list-item .ant-upload-icon svg,
        .ant-upload-list-item .ant-btn-icon svg {
          color: ${themeColors.color} !important;
        }
      `}</style>
    </>
  );
};

export default UploadVideoButton;