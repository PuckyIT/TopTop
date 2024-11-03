// pages/profile.tsx

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
  Divider,
  Tabs,
  message,
  Skeleton,
} from "antd";
import { SettingOutlined, ShareAltOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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

  useEffect(() => {
    axiosInstance
      .get("/users/profile")
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

  return (
    <Row
      justify="center"
      style={{
        padding: "20px",
        backgroundColor: "#1c1c1e",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <Col xs={24} sm={16} md={12} lg={10}>
        <Card
          style={{ backgroundColor: "#1c1c1e", border: "none", color: "#fff" }}
        >
          <Row justify="center">
            <Avatar
              size={100}
              src={profile?.avatar || "/default-avatar.png"}
              style={{ backgroundColor: "#8e8e93" }}
            />
          </Row>
          <Row justify="center" style={{ marginTop: "10px" }}>
            <Title level={3} style={{ color: "#fff" }}>
              {profile?.username}
            </Title>
          </Row>
          <Row justify="center" style={{ marginBottom: "10px" }}>
            <Text type="secondary" style={{ color: "#8e8e93" }}>
              {profile?.bio || "No bio available"}
            </Text>
          </Row>
          <Row justify="center" gutter={16} style={{ marginBottom: "20px" }}>
            <Button type="primary" style={{ marginRight: "10px" }}>
              Edit Profile
            </Button>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<SettingOutlined />} />
          </Row>
          <Divider style={{ backgroundColor: "#3a3a3c" }} />
          <Row justify="space-around" style={{ textAlign: "center" }}>
            <Col>
              <Text strong style={{ color: "#fff" }}>
                Following
              </Text>
              <br />
              <Text style={{ color: "#fff" }}>{profile?.followingCount}</Text>
            </Col>
            <Col>
              <Text strong style={{ color: "#fff" }}>
                Followers
              </Text>
              <br />
              <Text style={{ color: "#fff" }}>{profile?.followersCount}</Text>
            </Col>
            <Col>
              <Text strong style={{ color: "#fff" }}>
                Likes
              </Text>
              <br />
              <Text style={{ color: "#fff" }}>{profile?.likesCount}</Text>
            </Col>
          </Row>
          <Divider style={{ backgroundColor: "#3a3a3c" }} />
          <Tabs defaultActiveKey="1" centered tabBarStyle={{ color: "#fff" }}>
            <TabPane tab="Videos" key="1">
              <Text
                style={{
                  color: "#8e8e93",
                  display: "block",
                  textAlign: "center",
                }}
              >
                Upload your first video here.
              </Text>
            </TabPane>
            <TabPane tab="Liked" key="2">
              <Text
                style={{
                  color: "#8e8e93",
                  display: "block",
                  textAlign: "center",
                }}
              >
                Videos you liked will appear here.
              </Text>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePage;
