"use client";
import React from "react";
import { Col, Card, Tabs, TabsProps, Breadcrumb, Divider } from "antd";
import Newsshow from "./components/show-news";

const InfomationResult: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "",
      children: <Newsshow />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default InfomationResult;
