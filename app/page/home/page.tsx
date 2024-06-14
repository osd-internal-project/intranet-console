"use client";

//import "./globals.css";
import React from "react";
import { Card } from "antd";
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
      <div className="my-2" />
      <div className="grid md:grid-cols-3">
        <div className="px-2 mb-4">
          <Card className="text-center">
            <FileFilled className="text-5xl text-blue-500" />
            <br />
            <a href="/page/data-leave/online-leave">ใบลาออนไลน์</a>
          </Card>
        </div>
        <div className="px-2 mb-4">
          <Card className="text-center">
            <TeamOutlined className="text-5xl text-blue-500" />
            <br />
            <a href="/page/bookingroom/booking-room">จองห้องประชุมออนไลน์</a>
          </Card>
        </div>
        <div className="px-2 mb-4">
          <Card className="text-center">
            <CarFilled className="text-5xl text-blue-500" />
            <br />
            <a href="#">จองรถยนต์ออนไลน์</a>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card
            title="ข่าวเเละกิจกรรมล่าสุด"
            bordered={false}
            className="text-center"
          >
            <NewsCarouselComponent />
          </Card>
          <div className="my-4"></div>
          <Card title="เอกสาร" bordered={false} className="text-center">
            <DocumentComponent />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="หอประชุม">
            <MeetingRoomTableComponent pagination={false} />
          </Card>
          <div className="my-4"></div>
          <Card title="วันหยุดประจำปี">
            <HolidaysCalendarComponent />
          </Card>
        </div>
      </div>

      <div className="my-6"></div>
    </>
  );
}
