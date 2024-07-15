"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, TabsProps } from "antd";
import React from "react";
import ManageCar from "./components/manageCar";
import ManageCarStatus from "./components/manageCarStatus";
import { MaCarIcon } from "../../../../components/icon";

const ManageMaCar = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "จัดการการจองรถ",
      children: <ManageCar />,
    },
    {
      key: "2",
      label: "จัดการรถ",
      children: <ManageCarStatus />,
    },
  ];

  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Ma Car Management</span>,
              },
            ]}
          />
        </Col>
        <Divider
          orientation="left"
          orientationMargin="0"
          // style={{ backgroundColor: "#6CB4EE", color: "#EEEEEE" }}
          // style={{ backgroundColor: "#6CB4EE" }}
        >
          {/* <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "center" }}
          >
            {MaCarIcon}
            <span style={{ marginLeft: "8px" }}>จองรถออนไลน์</span>
          </div> */}

          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>Ma Car Management</span>
            {/* {MaCarIcon} */}
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
    </>
  );
};

export default ManageMaCar;
