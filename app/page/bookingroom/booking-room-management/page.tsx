"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, TabsProps } from "antd";
import React from "react";
import ManageRoomComponent from "./components/manageRoom";
import ManageRoomStatusComponent from "./components/manageRoomStatus";

const ManageBookingRoom = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "จัดการห้องประชุม",
      children: <ManageRoomComponent />,
    },
    {
      key: "2",
      label: "จัดการสถานะห้องประชุม",
      children: <ManageRoomStatusComponent />,
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
                title: <span>Booking Room Management</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Booking Room Management`}</div>
        </Divider>
        <Col span={24}>
          <div className=" grid-span-1 space-y-2">
            <Card>
              <Tabs defaultActiveKey="1" items={items} />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ManageBookingRoom;
