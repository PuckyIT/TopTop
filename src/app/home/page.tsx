"use client";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import ShortVideo from "@/components/shortVideo";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { AbilityProvider } from "../context/AbilityProvider";
import { useAbility } from "../context/AbilityContext";

const videos = [
  {
    src: "/video/kpkg.mp4",
    poster: "/poster/kpkg.png",
    alt: "Short video example 1",
    videoInfo: {
      uploader: "User 1",
      title: "Video 1",
    },
  },
  {
    src: "/video/hq.mp4",
    poster: "/poster/hq.png",
    alt: "Short video example 2",
    videoInfo: {
      uploader: "User 2",
      title: "Video 2",
    },
  },
  {
    src: "/video/adb.mp4",
    poster: "/poster/adb.png",
    alt: "Short video example 3",
    videoInfo: {
      uploader: "User 3",
      title: "Video 3",
    },
  },
];

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const ability = useAbility(); // Use ability context

  const themeColors = {
    background: theme === "dark" ? "#121212" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#000000",
    scrollbarColor: theme === "dark" ? "#666666" : "#eaeaea", // Customize the scrollbar color
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

  return (
    <AbilityProvider role="user">
      <Layout className='layout' style={{ background: themeColors.background }}>
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
          {videos.map((video, index) =>
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
                  src={video.src}
                  poster={video.poster}
                  alt={video.alt}
                  videoInfo={video.videoInfo}
                  autoPlay={index === currentVideoIndex}
                />
              </div>
            ) : null
          )}
        </Content>
      </Layout>
    </AbilityProvider>
  );
};

export default HomePage;
