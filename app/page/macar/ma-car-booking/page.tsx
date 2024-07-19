"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, TabsProps } from "antd";
import React from "react";
import MaCarBook from "./components/maCarBooking";
import MaCarReturn from "./components/maCarReturn";

const MaCarBooking = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ทำการจองรถ",
      children: <MaCarBook />,
    },
    {
      key: "2",
      label: "การคืนรถ",
      children: <MaCarReturn />,
    },
  ];
  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Ma Car Management</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>Ma Car Book</span>
          </div>
        </Divider>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card>
              <Tabs defaultActiveKey="1" items={items} />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MaCarBooking;
