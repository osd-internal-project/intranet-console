"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, TabsProps } from "antd";
import React from "react";
import CalendarComponent from "./components/calendar";
import ReportComponent from "./components/report";

export default function Page() {
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
              title: <span>หน้าหลัก</span>,
            },

            {
              title: <span>ข้อมูลการการทำงานของแม่บ้าน</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`ข้อมูลการการทำงานของแม่บ้าน`}</div>
      </Divider>
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
