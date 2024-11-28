"use client";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Tabs,
} from "antd";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import ShowDetailComponent from "./components/ShowDetailComponent";
import { useSession } from "next-auth/react";
export default function UserDetailPage() {
  const { data: session } = useSession();
  if (session?.user.userId) {
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
                title: <span>Profile</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`PROFILE`}</div>
        </Col>
        <Col span={24}>
          <div className=" grid-span-1 space-y-2">
            <ShowDetailComponent userid={session?.user.userId} />
          </div>
        </Col>
      </Row>
    );
  }
}
