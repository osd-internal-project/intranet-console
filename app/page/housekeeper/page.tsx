"use client";
import { Breadcrumb, Button, Card, Checkbox, Col, Form, Input, Row, Tabs } from "antd";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
export default function UserDetailPage() {
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
              title: <span>Profile</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`housekeeper`}</div>
      </Col>
      <Col span={24}>
        <div className=" grid-span-1 space-y-2"></div>
      </Col>
    </Row>
  );
}
