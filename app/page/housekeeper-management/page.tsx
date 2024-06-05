"use client";
import { Breadcrumb, Button, Card, Checkbox, Col, Form, Input, Row, Tabs, TabsProps } from "antd";
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
              title: <span>Home</span>,
            },

            {
              title: <span>Housekeeper Management</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`Housekeeper Management`}</div>
      </Col>
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
