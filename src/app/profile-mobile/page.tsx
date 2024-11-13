"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/untils/axiosInstance";
import {
  Avatar,
  Typography,
  Card,
  Button,
  Row,
  Col,
  Skeleton,
  Layout,
  Tabs,
  message,
  Modal,
  Form,
  Input,
  Upload,
  Divider,
} from "antd";
import {
  BookOutlined,
  HeartOutlined,
  SettingOutlined,
  ShareAltOutlined,
  TableOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useTheme } from "../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";

const { Title, Text } = Typography;

const ProfileMobile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLocal, setDataLocal] = useState<any>(null);
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [tempAvatar, setTempAvatar] = useState<string | undefined>();
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setDataLocal(parsedUser);
  
      // Fetch user profile
      axiosInstance
        .get(`/users/profile`)
        .then((response) => {
          dispatch(setUser(response.data));
          setLoading(false);
          setTempAvatar(response.data.avatar);
        })
        .catch((error) => {
          message.error("Failed to load profile");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch]);  

  const showModal = () => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        bio: user.bio,
      });
    }
    setTempAvatar(user?.avatar);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAvatarFile(null);
    setTempAvatar(user?.avatar);
  };

  const handleAvatarChange = (info: any) => {
    const file = info.file.originFileObj as File;
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setTempAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOk = async () => {
    setLoadingSave(true);
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("bio", values.bio);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Make the API call to update the profile
      const response = await axiosInstance.put(
        `/users/profile/${dataLocal.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // After a successful update, fetch the updated profile
      axiosInstance
        .get(`/users/profile`)
        .then((res) => {
          dispatch(setUser(res.data));
          localStorage.setItem("user", JSON.stringify(res.data));
          message.success("Profile updated successfully!");
        })
        .catch((error) => {
          message.error("Failed to load updated profile");
        });

      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoadingSave(false);
    }
  };

  if (loading) {
    return <Skeleton active />;
  }

  const themeColors = {
    background: theme === "dark" ? "#121212" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#000000",
    count: theme === "dark" ? "#8e8e93" : "#000000",
    dividerColor: theme === "dark" ? "#333" : "#e0e0e0",
    input: theme === "dark" ? "#333" : "#ffffff",
    secondaryText:
      theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(98, 98, 98, 0.5)",
  };

  const userInitials = user?.email
    ? user.email
        .split("@")[0]
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  const items = [
    {
      key: "1",
      label: (
        <div
          style={{
            display: "flex",
            gap: 8,
            color:
              activeTab === "1"
                ? theme === "dark"
                  ? "#ffffff"
                  : "#000000"
                : "#8e8e93",
          }}
        >
          <TableOutlined />
          Videos
        </div>
      ),
      children: (
        <Text
          style={{
            color: themeColors.secondaryText,
            display: "block",
            textAlign: "center",
            width: "80vw",
          }}
        >
          Upload your first video. Your videos will appear here.
        </Text>
      ),
    },
    {
      key: "2",
      label: (
        <div
          style={{
            display: "flex",
            gap: 8,
            color:
              activeTab === "2"
                ? theme === "dark"
                  ? "#ffffff"
                  : "#000000"
                : "#8e8e93",
          }}
        >
          <BookOutlined />
          Favorites
        </div>
      ),
      children: (
        <Text
          style={{
            color: themeColors.secondaryText,
            display: "block",
            textAlign: "center",
            width: "80vw",
          }}
        >
          Favorite posts. Your favorite posts will appear here.
        </Text>
      ),
    },
    {
      key: "3",
      label: (
        <div
          style={{
            display: "flex",
            gap: 8,
            color:
              activeTab === "3"
                ? theme === "dark"
                  ? "#ffffff"
                  : "#000000"
                : "#8e8e93",
          }}
        >
          <HeartOutlined />
          Liked
        </div>
      ),
      children: (
        <Text
          style={{
            color: themeColors.secondaryText,
            display: "block",
            textAlign: "center",
            width: "80vw",
          }}
        >
          No liked videos yet. Videos you liked will appear here.
        </Text>
      ),
    },
  ];

  return (
    <Layout style={{ background: themeColors.background }}>
      <Row
        justify="start"
        style={{
          padding: 0,
          minHeight: "100vh",
          background: themeColors.background,
          color: themeColors.color,
        }}
      >
        <Col xs={24} sm={16} md={12} lg={10}>
          <Card
            style={{
              backgroundColor: "transparent",
              border: "none",
              marginTop: "20%",
            }}
          >
            <Row justify="start" style={{ marginLeft: 10 }}>
              <Col>
                <Avatar
                  src={user?.avatar || undefined}
                  alt="User Avatar"
                  className="avatar-user"
                  onClick={showModal}
                  style={{
                    backgroundColor: "#ff204e",
                    fontWeight: "bold",
                    height: "212px",
                    width: "212px",
                    cursor: "pointer",
                    fontSize: "96px",
                  }}
                >
                  {!user?.avatar && userInitials}
                </Avatar>
              </Col>

              <Col
                style={{
                  marginLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 15,
                }}
              >
                <Row justify={"start"}>
                  <Title level={3} style={{ color: themeColors.color }}>
                    {user?.username}
                  </Title>
                </Row>

                <Row>
                  <Button
                    type="primary"
                    onClick={showModal}
                    style={{ marginRight: "10px" }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    id="custom-btn2"
                    icon={
                      <ShareAltOutlined
                        style={{
                          color: themeColors.color,
                        }}
                      />
                    }
                    style={{
                      marginRight: "10px",
                    }}
                  />
                  <Button
                    id="custom-btn2"
                    icon={
                      <SettingOutlined
                        style={{
                          color: themeColors.color,
                        }}
                      />
                    }
                  />
                </Row>

                <Row style={{ marginBottom: "10px", display: "flex", gap: 10 }}>
                  <Text strong style={{ color: themeColors.count }}>
                    <Text
                      style={{
                        color: themeColors.color,
                        marginRight: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {user?.followingCount}
                    </Text>
                    Following
                  </Text>

                  <Text strong style={{ color: themeColors.count }}>
                    <Text
                      style={{
                        color: themeColors.color,
                        marginRight: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {user?.followersCount}
                    </Text>
                    Followers
                  </Text>

                  <Text strong style={{ color: themeColors.count }}>
                    <Text
                      style={{
                        color: themeColors.color,
                        marginRight: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {user?.likesCount}
                    </Text>
                    Likes
                  </Text>
                </Row>

                <Row>
                  <Text type="secondary" style={{ color: "#8e8e93" }}>
                    {user?.bio || "No bio available"}
                  </Text>
                </Row>
              </Col>
            </Row>

            <Tabs
              defaultActiveKey="1"
              activeKey={activeTab}
              onChange={setActiveTab}
              className="profile-tabs"
              items={items}
              tabBarStyle={{
                color: themeColors.count,
                borderBottom: "none",
                width: "80vw",
                marginTop: "5%",
              }}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        width={700}
        visible={isModalVisible}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{
              marginRight: 8,
              backgroundColor: "transparent",
              color: "#999",
              border: "none",
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loadingSave}
            onClick={handleOk}
            style={{
              backgroundColor: "#ff204e",
              borderColor: "#ff204e",
              color: "#fff",
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Title
            style={{
              color: themeColors.color,
              fontSize: "24px",
            }}
          >
            Edit Profile
          </Title>

          <Divider style={{ backgroundColor: themeColors.dividerColor }} />
          {/* Section 1: Profile Picture */}
          <div
            style={{
              alignSelf: "flex-start",
              marginBottom: "8px",
              color: themeColors.color,
              fontWeight: "bold",
            }}
          >
            Avatar
          </div>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              flexDirection: "column",
            }}
          >
            <Upload showUploadList={false} onChange={handleAvatarChange}>
              <Avatar
                style={{
                  backgroundColor: "#ff204e",
                  fontWeight: "bold",
                  height: "96px",
                  width: "96px",
                  cursor: "pointer",
                  fontSize: "38px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "none",
                }}
                src={tempAvatar || user?.avatar || userInitials}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -3,
                  right: 0,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: themeColors.input,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <UploadOutlined style={{ fontSize: 16, color: "#fff" }} />
              </div>
            </Upload>
          </Form.Item>

          <Divider style={{ backgroundColor: themeColors.dividerColor }} />

          {/* Section 2: Username */}
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              style={{
                backgroundColor: themeColors.input,
                color: themeColors.color,
                border: "none",
              }}
            />
          </Form.Item>

          <Divider style={{ backgroundColor: themeColors.dividerColor }} />

          {/* Section 3: Bio */}
          <Form.Item name="bio" label="Bio">
            <Input.TextArea
              rows={4}
              maxLength={80}
              showCount
              style={{
                backgroundColor: themeColors.input,
                color: themeColors.color,
                border: "none",
              }}
            />
          </Form.Item>

          <Divider style={{ backgroundColor: themeColors.dividerColor }} />
        </Form>
      </Modal>
    </Layout>
  );
};

export default ProfileMobile;