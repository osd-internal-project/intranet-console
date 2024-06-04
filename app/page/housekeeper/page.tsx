"use client";
import { Breadcrumb, Button, Card, Checkbox, Col, Form, Input, Row, Tabs, TabsProps } from "antd";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import CalendarComponent from "./components/calendar";
import ReportComponent from "./components/report";

export default function UserDetailPage() {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Calendar",
      children: <CalendarComponent />,
    },
    {
      key: "2",
      label: "Report",
      children: <ReportComponent />,
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>Home</span>,
            },

            {
              title: <span>Housekeeper</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`housekeeper`}</div>
      </Col>
      <Col span={24}>
        <div className=" grid-span-1 space-y-2">
          <Card>
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </div>
      </Col>
    </Row>
  );
}
