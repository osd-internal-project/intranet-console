"use client";
import {
  Breadcrumb,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Row,
  Tabs,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { VenderDetailComponent } from "./components/vender-detail";
import {
  AuditOutlined,
  ContactsOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

export default function VenderDetail() {
  const params = useParams();
  const venderId = params.id as string;

  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              title: <Link href={"/page"}>Home</Link>,
            },
            {
              title: <span>Vender</span>,
            },
            {
              title: <Link href={"/page/vender/venders"}>Venders</Link>,
            },
            {
              title: <span> {venderId}</span>,
            },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`ข้อมูลผู้ขาย`}</div>
      </Divider>
      <Col span={24}>
        <div className=" grid-span-1 space-y-2">
          <VenderDetailComponent details={undefined} />
          <div>
            <Card styles={{ body: { padding: 0 } }}>
              <Tabs
                type="card"
                items={[
                  {
                    key: "1",
                    label: "รายการคำสั่งซื้อ",
                    icon: <AuditOutlined />,
                    children: <div>111</div>,
                  },
                  {
                    key: "2",
                    label: "ข้อมูลการติดต่อ",
                    icon: <ContactsOutlined />,
                    children: <div>222</div>,
                  },
                  {
                    key: "3",
                    label: "ข้อมูลไฟล์",
                    icon: <FolderOpenOutlined />,
                    children: <div>333</div>,
                  },
                ]}
              />
            </Card>
          </div>
        </div>
      </Col>
    </Row>
  );
}
