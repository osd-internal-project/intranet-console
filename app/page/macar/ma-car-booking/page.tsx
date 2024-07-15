"use client";
import { Breadcrumb, Card, Col, Divider, Row, Tabs, TabsProps } from "antd";
import React from "react";
import MaCarBook from "./components/maCarBooking";
import MaCarReturn from "./components/maCarReturn";
// import MaCarDetails from "./components/maCarDetails";
import MaCarHistory from "./components/maCarHistory";
import { MaCarIcon } from "../../../../components/icon";

const MaCarBooking = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ทำการจองรถ",
      children: <MaCarBook />,
    },
    {
      key: "2",
      label: "การคืนรถ",
      children: <MaCarReturn />,
    },
    // {
    //   key: "3",
    //   label: "รายละเอียดรถยนต์",
    //   children: <MaCarDetails />,
    // },
    {
      key: "4",
      label: "ประวัติการดำเนินการ",
      children: <MaCarHistory />,
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
            <span style={{ marginRight: "8px" }}>Ma Car Book</span>
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

export default MaCarBooking;
