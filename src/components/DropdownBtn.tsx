import React, { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { useTheme } from "@/app/context/ThemeContext"; // Giả sử bạn đang sử dụng context theme
import { Menu, message } from "antd";

interface CustomDropdownProps {
  items: Array<{ key: string; label: string; icon: JSX.Element; onClick?: () => void }>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ items }) => {
  const { theme } = useTheme(); // Sử dụng theme từ context
  const [isOpen, setIsOpen] = useState(false); // Quản lý trạng thái mở/đóng dropdown

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (key: string, onClick?: () => void) => {
    if (onClick) onClick();
    setIsOpen(false); // Đóng dropdown sau khi click
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        onClick={toggleDropdown}
        style={{
          cursor: "pointer",
          fontSize: "24px",
          color: theme === "light" ? "#333333" : "#f5f5f5",
        }}
      >
        <MoreOutlined />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            backgroundColor: theme === "light" ? "#fff" : "#333",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
            marginTop: "8px",
          }}
        >
          <Menu
            style={{
              backgroundColor: theme === "light" ? "#fff" : "#333",
              color: theme === "light" ? "#333" : "#f5f5f5",
              borderRadius: "8px",
            }}
            onClick={(e) => handleMenuClick(e.key, items.find(item => item.key === e.key)?.onClick)}
          >
            {items.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                style={{
                  color: theme === "light" ? "#333" : "#f5f5f5",
                }}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;