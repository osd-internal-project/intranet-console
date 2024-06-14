"use client";
import { Breadcrumb, Button, Card, Checkbox, Col, Form, Input, Row, Tabs } from "antd";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import EditDetailComponent from "./components/EditDetailComponent";
import EditTreeComponent from "./components/EditTreeComponent";
import EditRoleComponent from "./components/EditRoleComponent";
import EditAssignGroupComponent from "./components/EditAssignGroupComponent";
export default function UserDetailPage() {
  const params = useParams();
  const userid = params.uid as string;

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
              href: "/page/setting",
              title: <span>Setting</span>,
            },
            {
              href: "/page/setting/usermanagement",
              title: <span>User Management</span>,
            },
            {
              title: <span>{userid}</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`EDIT USER`}</div>
      </Col>
      <Col span={24}>
        <div className=" grid-span-1 space-y-2">
          <div>
            <Tabs
              defaultActiveKey="1"
              destroyInactiveTabPane={true}
              items={[
                {
                  label: "Profile",
                  key: "1",
                  children: <EditDetailComponent userid={userid} />,
                },
                {
                  label: "Set Roles & Group",
                  key: "2",
                  children: <EditAssignGroupComponent userid={userid} />,
                  // (
                  //   <div className="grid grid-cols-2">
                  //     <div className="mb-5">
                  //       <EditRoleComponent userid={userid} />
                  //     </div>
                  //     <div className="mb-5">
                  //       <EditTreeComponent userid={userid} />
                  //     </div>
                  //   </div>
                  // ),
                },
              ]}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}
