"use client";

import React from "react";
import { Card, Row, Col } from "antd";
import MeetingRoomTableComponent from "./components/MeetingRoomTable";
import NewsCarouselComponent from "./components/NewsCarousel";
import HolidaysCalendarComponent from "./components/HolidaysCalendar";
import BigCarouselComponent from "./components/BigCarousel";
import DocumentComponent from "./components/Document";
import "antd/dist/reset.css";
import { CarFilled, FileFilled, TeamOutlined } from "@ant-design/icons";

export default function HomePage() {
  return (
    <>
      <BigCarouselComponent />
      <br />
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ textAlign: "center" }}>
            <FileFilled style={{ fontSize: "30px", color: "#0693E3" }} />
            <br />
            <a href="#">ใบลาออนไลน์</a>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: "center" }}>
            <TeamOutlined style={{ fontSize: "30px", color: "#0693E3" }} />
            <br />
            <a href="/page/booking-room">จองห้องประชุมออนไลน์</a>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: "center" }}>
            <CarFilled style={{ fontSize: "30px", color: "#0693E3" }} />
            <br />
            <a href="#">จองรถยนต์ออนไลน์</a>
          </Card>
        </Col>
      </Row>
      <br />
      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="ข่าวเเละกิจกรรมล่าสุด"
            bordered={false}
            style={{ textAlign: "center" }}
          >
            <NewsCarouselComponent />
            <br />
          </Card>
          <br />
          <Card title="เอกสาร" bordered={false} style={{ textAlign: "center" }}>
            <DocumentComponent />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="หอประชุม">
            <MeetingRoomTableComponent pagination={false} />
          </Card>
          <br />
          <Card title="วันหยุดประจำปี">
            <HolidaysCalendarComponent />
          </Card>
        </Col>
      </Row>
      <br />
    </>
  );
}
