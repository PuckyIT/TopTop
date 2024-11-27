import React, { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

type ThongTinVideo = {
  uploader: string;
  title: string;
};

type ShortVideoProps = {
  src: string;
  poster?: string;
  alt?: string;
  videoInfo?: {
    uploader: string;
    title: string;
  };
  autoPlay?: boolean;
};

const ShortVideo: React.FC<ShortVideoProps> = ({
  src,
  poster,
  alt,
  videoInfo,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the screen width is 450px or less
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 450);
    handleResize(); // Check screen size on component mount
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => setCurrentTime(video!.currentTime);
    const handleLoadedMetadata = () => setDuration(video!.duration);

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    document.addEventListener("mouseup", () => setIsSeeking(false));

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Sử dụng Intersection Observer API
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Nếu video nằm trong viewport, phát tự động
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch((error) => {
                console.warn("Không thể phát tự động:", error);
              });
          } else {
            // Nếu video ra khỏi viewport, dừng lại
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.5, // 50% video nằm trong viewport thì kích hoạt
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const clickX =
        event.clientX - event.currentTarget.getBoundingClientRect().left;
      const newTime = (clickX / event.currentTarget.clientWidth) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (event: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const clickY =
        event.clientY - event.currentTarget.getBoundingClientRect().top;
      const newVolume = Math.min(
        1,
        Math.max(0, 1 - clickY / event.currentTarget.clientHeight)
      );
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? volume : 0;
      setIsMuted(!isMuted);
    }
  };

  const defaultVideoInfo: ThongTinVideo = {
    uploader: "Người tải lên không xác định",
    title: "Video không tiêu đề",
  };

  const info = videoInfo || defaultVideoInfo;

  return (
    <div
      className="video-container"
      style={{
        height: "95vh",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="video-player"
        loop
        playsInline
        onClick={handlePlayPause}
        onError={() => console.error("Failed to load video:", src)}
        style={{
          width: "100%",
          height: "90%",
          objectFit: "cover",
          marginTop: "20%",
        }}
      />
      <div
        className="video-info"
        style={{
          padding: "10px",
          color: "rgba(255,255,255,0.9)",
          position: "absolute",
          bottom: isHovered ? "10%" : "5%",
          left: "4%",
          transition: "bottom 0.3s ease",
        }}
      >
        <h3 style={{ margin: 0 }}>{info.uploader}</h3>
        <p style={{ margin: "5px 0" }}>{info.title}</p>
      </div>
      {isMobile ? (
        <div
          className="simple-progress-bar"
          onMouseDown={handleSeek}
          style={{
            width: "90%",
            height: "5px",
            backgroundColor: "rgba(255,255,255,0.2)",
            position: "absolute",
            bottom: "0",
            left: "5%",
            cursor: "pointer",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            className="progress"
            style={{
              height: "100%",
              width: `${(currentTime / duration) * 100}%`,
              backgroundColor: "rgba(255,255,255,0.6)",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      ) : (
        <div
          className="video-controls"
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            bottom: isHovered ? "5%" : "-10%",
            left: "5%",
            transition: "bottom 0.3s ease-in-out",
          }}
        >
          <Button
            type="link"
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "20px",
              padding: 3,
            }}
            icon={
              isPlaying ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )
            }
            onClick={handlePlayPause}
          />

          <div
            className="progress-bar"
            onMouseDown={handleSeek}
            style={{
              width: "70%",
              height: "5px",
              backgroundColor: "rgba(255,255,255,0.2)",
              position: "relative",
              cursor: "pointer",
              margin: "10px 0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              className="progress"
              style={{
                height: "100%",
                width: `${(currentTime / duration) * 100}%`,
                backgroundColor: "rgba(255,255,255,0.9)",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>

          <div
            className="volume-container"
            onMouseEnter={() => setIsVolumeHovered(true)}
            onMouseLeave={() => setIsVolumeHovered(false)}
            style={{ position: "relative", cursor: "pointer", paddingLeft: 10 }}
          >
            <FontAwesomeIcon
              icon={isMuted ? faVolumeMute : faVolumeUp}
              onClick={toggleMute}
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "20px",
                padding: "0 5%",
              }}
            />

            {isVolumeHovered && (
              <div
                className="volume-bar"
                onMouseDown={handleVolumeChange}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "65%",
                  width: "7px",
                  height: "70px",
                  backgroundColor: "rgba(255,255,255,0.2)", // Đây là màu nền của volume-bar
                  borderRadius: "8px",
                  cursor: "pointer",
                  transform: "translateX(-50%) rotate(180deg)", // Xoay thanh âm lượng 180 độ
                }}
              >
                <div
                  className="volume-progress"
                  style={{
                    width: "100%",
                    height: `${volume * 100}%`, // Điều chỉnh chiều cao theo volume
                    backgroundColor: "rgba(255,255,255,0.9)", // Đảm bảo màu trắng sáng cho thanh tiến độ
                    borderRadius: "8px",
                    bottom: 0,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortVideo;
