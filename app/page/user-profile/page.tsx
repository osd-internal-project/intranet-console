"use client";
import { Breadcrumb, Col, Row } from "antd";
import React, { useContext } from "react";
import ShowDetailComponent from "./components/ShowDetailComponent";
import { UserContectType, UserContext } from "@/app/config/userContext";
export default function UserDetailPage() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  if (user?.userId) {
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
            <ShowDetailComponent userid={user?.userId} />
          </div>
        </Col>
      </Row>
    );
  }
}
