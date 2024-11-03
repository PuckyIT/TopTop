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
} from "antd";
import {
  BookOutlined,
  HeartOutlined,
  SettingOutlined,
  ShareAltOutlined,
  TableOutlined,
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

  useEffect(() => {
    axiosInstance
      .get(`/users/profile/${user.id}`)
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        message.error("Failed to load profile");
        setLoading(false);
      });
  }, []);

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

  // Định nghĩa các item cho Tabs
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
                : theme === "dark"
                ? "#8e8e93"
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
          Upload your first video. Your videos will appear here
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
                : theme === "dark"
                ? "#8e8e93"
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
                : theme === "dark"
                ? "#8e8e93"
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
          No liked videos yet. Videos you liked will appear here
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
                  <Button type="primary" style={{ marginRight: "10px" }}>
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
    </Layout>
  );
};

export default ProfilePage;
