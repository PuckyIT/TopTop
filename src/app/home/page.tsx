"use client";

import { Layout, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import ShortVideo from "@/components/shortVideo";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { AbilityProvider } from "../context/AbilityProvider";
import { useAbility } from "../context/AbilityContext";
import axiosInstance from "@/untils/axiosInstance";
import { ClientPageRoot } from "next/dist/client/components/client-page";
import { Console } from "console";

// Interface cho dữ liệu video
interface Video {
  src: string;
  poster: string;
  alt: string;
  videoInfo: {
    uploader: string;
    title: string;
  };
}

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const ability = useAbility(); // Use ability context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const themeColors = {
    background: theme === "dark" ? "#121212" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#000000",
    scrollbarColor: theme === "dark" ? "#666666" : "#eaeaea",
  };

  const handleScroll = () => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      const scrollPosition = videoContainer.scrollTop;
      const containerHeight = videoContainer.clientHeight;
      const newIndex = Math.round(scrollPosition / containerHeight);

      if (newIndex !== currentVideoIndex) {
        setCurrentVideoIndex(newIndex);
      }
    }
  };

  // Fetch danh sách video từ API
  const fetchUserVideos = async () => {
    try {
      const response = await axiosInstance.get(`/videos/all`);
      console.log("Data", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  };

  // Load video khi component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const userVideos = await fetchUserVideos();
        setVideos(userVideos.videoUrls);
        setError(null);
      } catch (error: any) {
        setError(
          error.message || "Failed to load videos. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      videoContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (videoContainer) {
        videoContainer.removeEventListener("scroll", handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex]);

  // Render UI
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AbilityProvider role="user">
      <Layout className="layout" style={{ background: themeColors.background }}>
        <Content
          className="home-content"
          ref={videoContainerRef}
          style={{
            height: "100vh",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            background: themeColors.background,
            color: themeColors.color,
          }}
        >
          <style jsx global>{`
            .ant-layout-content::-webkit-scrollbar {
              display: none;
            }
            .ant-layout-content::-webkit-scrollbar-thumb {
              background-color: ${themeColors.scrollbarColor};
            }
          `}</style>
          {error ? (
            <div
              style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "red",
                textAlign: "center",
              }}
            >
              <p>{error}</p>
            </div>
          ) : videos.length > 0 ? (
            videos.map((video, index) =>
              ability.can("read", "ShortVideo") ? (
                <div
                  key={index}
                  style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    scrollSnapAlign: "start",
                  }}
                >
                  <ShortVideo
                    src={videos as unknown as string}
                    poster={video.poster}
                    alt={video.alt}
                    videoInfo={video.videoInfo}
                    autoPlay={index === currentVideoIndex}
                  />
                </div>
              ) : null
            )
          ) : (
            <div
              style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: themeColors.color,
                textAlign: "center",
                padding: "0 20px",
              }}
            >
              <div>
                <p>No videos available.</p>
                <p>Please check back later or try refreshing the page.</p>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </AbilityProvider>
  );
};

export default HomePage;
