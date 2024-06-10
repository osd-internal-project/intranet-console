"use client";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Breadcrumb, Card, Col, Row, Tabs, TreeDataNode } from "antd";
import React, { useEffect, useState } from "react";
import UserGroupServices from "../../users-management/user-group/services/usergroup.service";
import { CarryOutOutlined } from "@ant-design/icons";
import { Tree, TreeNode } from "react-organizational-chart";

export default function Page() {
  const userAuth = useAxiosUser();
  const userGroupServices = UserGroupServices(userAuth);

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
              title: <span>excutive devision</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`Excutive devision`}</div>
      </Col>
      <Col span={24}>
        <div className=" grid-span-1 space-y-2">
          <Card></Card>
        </div>
      </Col>
    </Row>
  );
}
