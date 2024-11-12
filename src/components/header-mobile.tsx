import React, { useState } from "react";
import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const HeaderMobile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Đề xuất");

  return (
    <div>
      {/* <div className="flex space-x-4">
        {["Bạn bè", "Đã follow", "Đề xuất"].map((tab) => (
          <Button
            key={tab}
            type="text"
            className={`text-sm font-bold ${
              activeTab === tab ? "text-white border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      <Button type="text" icon={<SearchOutlined className="text-xl text-white" />} /> */}
    </div>
  );
};

export default HeaderMobile;
