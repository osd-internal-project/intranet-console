"use client";
import React, { useState } from "react";
import { Col, Card, Tabs, TabsProps, Breadcrumb, Divider } from "antd";
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
    <div>
      <Breadcrumb
        items={[
          {
            href: "/page",
            title: <span>Home</span>,
          },
          {
            title: <span>Email Template</span>,
          },
        ]}
      />
      <Divider orientation="left" orientationMargin="0">
        <div
          className="title-page-font"
          style={{ display: "flex", alignItems: "left" }}
        >
          <span style={{ marginRight: "8px" }}>Email Template</span>
        </div>
      </Divider>

      <div style={{ backgroundColor: "#FFFFFF" }}>
        <h1
          style={{
            margin: "0 0 0 10px",
            fontSize: "32px",
            fontStyle: "initial",
          }}
        ></h1>
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

export default emailpage;
