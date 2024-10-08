"use client";
import React, { useState } from "react";
import Creaatenews from "./components/createnews";
import Newoption from "./components/newoption";
import Tablenews from "./components/tableNews";
import { Col, Card, Tabs, TabsProps, Breadcrumb, Divider } from "antd";

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
    <div>
      <Breadcrumb
        items={[
          {
            href: "/page",
            title: <span>Home</span>,
          },
          {
            title: <span>Information Management</span>,
          },
        ]}
      />
      <Divider orientation="left" orientationMargin="0">
        <div
          className="title-page-font"
          style={{ display: "flex", alignItems: "left" }}
        >
          <span style={{ marginRight: "8px" }}>Information Management</span>
        </div>
      </Divider>
      <div style={{ backgroundColor: "#FFFFFF" }}>
        <h1
          style={{
            margin: "0 0 0 10px",
            fontSize: "32px",
            fontStyle: "initial",
          }}
        >
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
    </div>
  );
};

export default Infomation_management;
