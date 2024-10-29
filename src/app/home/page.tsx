// pages/home.tsx

"use client";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import ShortVideo from "@/components/shortVideo";
import { useEffect, useRef, useState } from "react";

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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoContainerRef = useRef<HTMLDivElement>(null);

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
    <Layout>
      <Content
        ref={videoContainerRef}
        style={{
          height: "100vh", // Full height viewport for vertical scroll
          overflowY: "scroll", // Vertical scrolling
          scrollSnapType: "y mandatory", // Snap to each video section
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          msOverflowStyle: "none", // Hide scrollbar for IE and Edge
        }}
      >
        <style jsx global>{`
          /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
          .ant-layout-content::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {videos.map((video, index) => (
          <div
            key={index}
            style={{
              height: "100vh", // Full height for each video
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              scrollSnapAlign: "start", // Align each video section
            }}
          >
            <ShortVideo
              src={video.src}
              poster={video.poster}
              alt={video.alt}
              videoInfo={video.videoInfo}
              autoPlay={index === currentVideoIndex} // Play only if current video
            />
          </div>
        ))}
      </Content>
    </Layout>
  );
};

export default HomePage;