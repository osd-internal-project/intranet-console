"use client";
import React, { useState } from "react";
import InfoCreateNews from "./components/info-manage-create-news";
import InfoTypeNews from "./components/info-manage-type-news";
import InfoTableNews from "./components/info-manage-table-news";
import { Col, Card, Tabs, TabsProps, Breadcrumb, Divider } from "antd";

const InfomationManagement: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "สร้างข้อมูลข่าวสาร",
      children: activeKey === "1" ? <InfoCreateNews /> : null,
    },
    {
      key: "2",
      label: "ตารางข้อมูลข่าวสาร",
      children: activeKey === "2" ? <InfoTableNews /> : null,
    },
    {
      key: "3",
      label: "ประเภทของข่าวสาร",
      children: activeKey === "3" ? <InfoTypeNews /> : null,
    },
  ];

  return (
    <div>
      <div style={{ backgroundColor: "#FFFFFF" }}>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card>
              <Tabs activeKey={activeKey} onChange={handleTabChange} items={items} />
            </Card>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default InfomationManagement;
