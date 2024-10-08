"use client";
import React from "react";
import { Col, Card, Tabs, TabsProps, Breadcrumb, Divider } from "antd";
import Newsshow from "./components/shownews";

const dataform: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "",
      children: <Newsshow />,
    },
  ];

  // while

  return (
    <div>
      <Breadcrumb
        items={[
          {
            href: "/page",
            title: <span>Home</span>,
          },
          {
            title: <span>Information Data</span>,
          },
        ]}
      />
      <Divider orientation="left" orientationMargin="0">
        <div
          className="title-page-font"
          style={{ display: "flex", alignItems: "left" }}
        >
          <span style={{ marginRight: "8px" }}>Information Data</span>
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
              <Tabs defaultActiveKey="1" items={items} />
            </Card>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default dataform;
