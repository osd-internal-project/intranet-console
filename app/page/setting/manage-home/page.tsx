"use client";
import React, { useState } from "react";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, TabsProps } from "antd";
import SlideImageSetting from "./slide-image/slide-image";
import InfomationManagement from "./information-management/page";
import HandBook from "./hand-book/page";

export default function TypeLeave() {
  const [keyItemTab, setKeyItemTab] = useState<string>("1");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ตั้งค่า รูปภาพสไลด์",
      children: <SlideImageSetting />,
    },
    {
      key: "2",
      label: "ตั้งค่า กิจกรรมและข่าวสาร",
      children: <InfomationManagement />,
    },
    {
      key: "3",
      label: "ตั้งค่า เอกสาร",
      children: <HandBook />,
    },
  ];

  const onChange = (key: string) => {
    setKeyItemTab(key);
  };

  return (
    <>
      {/* {messageHeader} */}
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Setting</span>,
              },
              {
                title: <span>Manage Home</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{items.filter((item) => item.key === keyItemTab).map((item) => item.label)}</div>
        </Divider>
        <Card className="w-full">
          <Tabs defaultActiveKey="1" items={items} type="card" onChange={onChange} />
        </Card>
      </Row>
    </>
  );
}
