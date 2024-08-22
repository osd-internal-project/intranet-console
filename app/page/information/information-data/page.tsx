"use client";
import React from "react";
import { Col, Card, Tabs, TabsProps } from "antd";
import Newsshow from "./components/shownews";

const dataform: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "สร้างข้อมูลข่าว",
      children: <Newsshow />,
    },
  ];

  // while

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
        ข้อมูลข่าวสาร
      </h1>
      <Col span={24}>
        <div className="grid-span-1 space-y-2">
          <Card>
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </div>
      </Col>
    </div>
  );
};

export default dataform;
