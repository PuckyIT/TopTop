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
import { useTheme } from "@/untils/ThemeContext";

const { Title, Text } = Typography;

type ProfileData = {
  username: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  avatar?: string;
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = JSON.parse(localStorage.getItem("user") || "");
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [tempAvatar, setTempAvatar] = useState<string | undefined>();
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/users/profile/${user.id}`)
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
        setTempAvatar(response.data.avatar);
      })
      .catch((error) => {
        message.error("Failed to load profile");
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => {
    if (profile) {
      form.setFieldsValue({
        username: profile.username,
        bio: profile.bio,
      });
    }
    setTempAvatar(profile?.avatar);
    setIsModalVisible(true);
  };

  const handleAvatarChange = async (info: any) => {
    const file = info.file.originFileObj as File | undefined;

    if (file) {
      setAvatarFile(file); // Store the raw file for further processing.

      try {
        const base64 = await fileToBase64(file); // Convert file to base64
        setTempAvatar(base64 as string); // Update your state with the base64 string
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setTempAvatar(undefined);
  };

  const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // Resolve with base64 string
      reader.onerror = (error) => reject(error); // Handle error
    });
  };

  const handleOk = async () => {
    setLoadingSave(true); // Start loading
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("bio", values.bio);

      // Only append the avatar file if it's selected
      if (avatarFile) {
        formData.append("avatar", avatarFile as File);
      }

      // Make the API call to update the user profile
      await axiosInstance.put(`/users/${user.id}`, formData);

      // Optionally fetch the updated profile data
      const updatedProfile = await axiosInstance.get(
        `/users/profile/${user.id}`
      );
      setProfile(updatedProfile.data);
      message.success("Profile updated successfully!");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoadingSave(false); // End loading
    }
  };

  if (loading) {
    return <Skeleton active />;
  }

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
            color: theme === "dark" ? "#8e8e93" : "#ccc",
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
            color: theme === "dark" ? "#8e8e93" : "#ccc",
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
            color: theme === "dark" ? "#8e8e93" : "#ccc",
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
    <Layout style={{ background: theme === "dark" ? "#121212" : "#ffffff" }}>
      <Row
        justify="start"
        style={{
          padding: 0,
          minHeight: "100vh",
          background: theme === "dark" ? "#121212" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#000000",
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
                <Upload
                  showUploadList={false}
                  onChange={handleAvatarChange}
                >
                  <Avatar
                    src={profile?.avatar || undefined}
                    alt="User Avatar"
                    className="avatar-user"
                    style={{
                      backgroundColor: "#ff204e",
                      fontWeight: "bold",
                      height: "212px",
                      width: "212px",
                      cursor: "pointer",
                      fontSize: "96px",
                    }}
                  >
                    {!profile?.avatar && userInitials}
                  </Avatar>
                </Upload>
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
                  <Title
                    level={3}
                    style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
                  >
                    {profile?.username}
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
                          color: theme === "dark" ? "#ffffff" : "#000000",
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
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        }}
                      />
                    }
                  />
                </Row>

                <Row style={{ marginBottom: "10px", display: "flex", gap: 10 }}>
                  <Text
                    strong
                    style={{ color: theme === "dark" ? "#8e8e93" : "#000000" }}
                  >
                    <Text
                      style={{
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        marginRight: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {profile?.followingCount}
                    </Text>
                    Following
                  </Text>

                  <Text
                    strong
                    style={{ color: theme === "dark" ? "#8e8e93" : "#000000" }}
                  >
                    <Text
                      style={{
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        marginRight: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {profile?.followersCount}
                    </Text>
                    Followers
                  </Text>

                  <Text
                    strong
                    style={{ color: theme === "dark" ? "#8e8e93" : "#000000" }}
                  >
                    <Text
                      style={{
                        color: theme === "dark" ? "#ffffff" : "#000000",
                        marginRight: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {profile?.likesCount}
                    </Text>
                    Likes
                  </Text>
                </Row>

                <Row>
                  <Text type="secondary" style={{ color: "#8e8e93" }}>
                    {profile?.bio || "No bio available"}
                  </Text>
                </Row>
              </Col>
            </Row>

            <Tabs
              defaultActiveKey="1"
              activeKey={activeTab}
              onChange={setActiveTab}
              items={items}
              tabBarStyle={{
                color: theme === "dark" ? "#8e8e93" : "#000000",
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
              color: theme === "dark" ? "#fff" : "#000",
              fontSize: "24px",
            }}
          >
            Edit Profile
          </Title>

          <Divider
            style={{ backgroundColor: theme === "dark" ? "#333" : "#e0e0e0" }}
          />
          {/* Section 1: Profile Picture */}
          <div
            style={{
              alignSelf: "flex-start",
              marginBottom: "8px",
              color: theme === "dark" ? "#fff" : "#000",
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
                src={tempAvatar || profile?.avatar}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -3,
                  right: 0,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
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

          <Divider
            style={{ backgroundColor: theme === "dark" ? "#333" : "#e0e0e0" }}
          />

          {/* Section 2: Username */}
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              style={{
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
                border: "none",
              }}
            />
          </Form.Item>

          <Divider
            style={{ backgroundColor: theme === "dark" ? "#333" : "#e0e0e0" }}
          />

          {/* Section 3: Bio */}
          <Form.Item name="bio" label="Bio">
            <Input.TextArea
              rows={4}
              maxLength={80}
              showCount
              style={{
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
                border: "none",
              }}
            />
          </Form.Item>

          <Divider
            style={{ backgroundColor: theme === "dark" ? "#333" : "#e0e0e0" }}
          />
        </Form>
      </Modal>
    </Layout>
  );
};

export default ProfilePage;
