"use client";
import React, { useState } from "react";
import { Col, Card, Tabs, TabsProps } from "antd";
import Createemail from "./createpage/create-page";
import Datatemplate from "./createpage/template-data";

const emailpage: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "html cover form",
      children: activeKey === "1" ? <Createemail /> : null,
    },
    {
      key: "2",
      label: "Templatedata",
      children: activeKey === "2" ? <Datatemplate /> : null,
    },
    // {
    //   key: "3",
    //   label: "Templatedata",
    //   children: activeKey === "3" ? <Datatemplate /> : null,
    // },
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
        เมลอิเล็กทรอนิกส์
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

export default emailpage;
