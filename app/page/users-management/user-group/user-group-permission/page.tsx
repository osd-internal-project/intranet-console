"use client";
import { Breadcrumb, Card, Col, Divider, Row } from "antd";
import React from "react";
import { useParams } from "next/navigation";
export default function UserGroupPermission() {

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
              title: <span>User Management</span>,
            },
            {
              href: "/page/users-management/users-groups",
              title: <span>Users</span>,
            },
            {
              title: <span>Users Groups Permission</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Group User`}</div>
      </Divider>
      <Card></Card>
    </Row>
  );
}
