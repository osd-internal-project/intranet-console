"use client";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Tabs,
  TabsProps,
} from "antd";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Floor from "./components/floor";
import Housekeeper from "./components/housekeeper";
export default function Page() {
  const onChange = (key: string) => {};

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ชั้น",
      children: <Floor />,
    },
    {
      key: "2",
      label: "แม่บ้าน",
      children: <Housekeeper />,
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
              title: <span>จัดการข้อมูลแม่บ้าน</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`จัดการข้อมูลแม่บ้าน`}</div>
      </Divider>
      <Col span={24}>
        <div className=" grid-span-1 space-y-2">
          <Card>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Card>
        </div>
      </Col>
    </Row>
  );
}
