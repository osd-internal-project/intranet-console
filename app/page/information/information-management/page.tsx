"use client";
import React, { useState } from "react";
import Creaatenews from "./components/createnews";
import Newoption from "./components/newoption";
import Tablenews from "./components/tableNews";
import { Col, Card, Tabs, TabsProps } from "antd";

const Infomation_management: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "สร้างข้อมูลข่าวสาร",
      children: activeKey === "1" ? <Creaatenews /> : null,
    },
    {
      key: "2",
      label: "ตารางข้อมูลข่าวสาร",
      children: activeKey === "2" ? <Tablenews /> : null,
    },
    {
      key: "3",
      label: "ประเภทของข่าวสาร",
      children: activeKey === "3" ? <Newoption /> : null,
    },
  ];

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <h1
        style={{
          margin: "0 0 0 10px",
          fontSize: "32px",
          fontStyle: "initial",
          borderBottom: "2px solid black",
        }}
      >
        การจัดการข้อมูลข่าวสาร
      </h1>
      <Col span={24}>
        <div className="grid-span-1 space-y-2">
          <Card>
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              items={items}
            />
          </Card>
        </div>
      </Col>
    </div>
  );
};

export default Infomation_management;
