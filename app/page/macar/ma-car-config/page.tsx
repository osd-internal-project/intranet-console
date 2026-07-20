"use client";
import React from "react";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, TabsProps } from "antd";
import ManagementCarMasterdataType from "../ma-car-management/components/management-car-masterdata-type/management-car-masterdata-type";
import ManagementVehicleType from "./components/management-vehicle-type/management-vehicle-type";
import ManagementVehicleTypeGroup from "./components/management-vehicle-type-group/management-vehicle-type-group";

/** หน้าตั้งค่าระบบรถ — รวม master data: ประเภทการตรวจสภาพ + กลุ่มประเภทรถ + ประเภทรถ */
const MaCarConfig: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ประเภทการตรวจสภาพ",
      children: <ManagementCarMasterdataType />,
    },
    {
      key: "2",
      label: "กลุ่มประเภทรถ",
      children: <ManagementVehicleTypeGroup />,
    },
    {
      key: "3",
      label: "ประเภทรถ",
      children: <ManagementVehicleType />,
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            { href: "/page/home", title: <span>หน้าหลัก</span> },
            { title: <span>ตั้งค่าระบบรถ</span> },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div
          className="title-page-font"
          style={{ display: "flex", alignItems: "left" }}
        >
          <span style={{ marginRight: "8px" }}>ตั้งค่าระบบรถ</span>
        </div>
      </Divider>
      <Col span={24}>
        <div className="grid-span-1 space-y-2">
          <Card>
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </div>
      </Col>
    </Row>
  );
};

export default MaCarConfig;
