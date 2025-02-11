"use client";
import React, { useEffect, useState } from "react";
import { Card } from "antd";
import MeetingRoomTableComponent from "./components/MeetingRoomTable";
import NewsCarouselComponent from "./components/NewsCarousel";
import HolidaysCalendarComponent from "./components/HolidaysCalendar";
import BigCarouselComponent from "./components/BigCarousel";
import DocumentComponent from "./components/Document";
import "antd/dist/reset.css";
import { CarFilled, FileFilled, TeamOutlined } from "@ant-design/icons";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import SlideImageService from "./services/index.service";
import { MasterRoomType, HandbookFileType, InformationNewsType } from "./common";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export default function HomePage() {
  const { id24Axios, tokenAccess } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [loading, setLoading] = useState<boolean>(true);
  const [slideImage, setSlideImage] = useState<any[]>([]);
  const [masterBookingRoom, setMasterBookingRoom] = useState<MasterRoomType[]>([]);
  const [handbookFile, setHandbookFile] = useState<HandbookFileType[]>([]);
  const [informationNews, setInformationNews] = useState<InformationNewsType[]>([]);
  useEffect(() => {
    //  if(tokenAccess?.userAccess.roles){
    //  }
  }, [tokenAccess?.userAccess]);

  const fetchData = async () => {
    const dataSlideImage = await SlideImageService(baseUrlIntranet).getSlideImageByOrder();
    const MasterBookingresponse = await SlideImageService(baseUrlIntranet).getMasterRoomQuery();
    const dataHandbookFileQuery = await SlideImageService(baseUrlIntranet).getHandbookFileQuery();
    const dataInformationNews = await SlideImageService(baseUrlIntranet).getinformationNewsQuery();
    setInformationNews(dataInformationNews);
    setHandbookFile(dataHandbookFileQuery);
    setMasterBookingRoom(MasterBookingresponse);
    setSlideImage(dataSlideImage);
    setLoading(false);
  };

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await SlideImageService(baseUrlIntranet).downloadFile(id);
      if (response) {
        const url = URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  }

  return (
    <>
      <BigCarouselComponent slideImage={slideImage} />
      <div className="my-2" />
      <div className="grid md:grid-cols-3">
        <div className="px-2 mb-4">
          <Card className="text-center">
            <a href="/page/leave-control-management/leave-history">
              <FileFilled className="text-5xl text-blue-500" />
              <br />
              ใบลาออนไลน์
            </a>
          </Card>
        </div>
        <div className="px-2 mb-4">
          <Card className="text-center">
            <a href="/page/bookingroom/booking-room">
              <TeamOutlined className="text-5xl text-blue-500" />
              <br />
              จองห้องประชุมออนไลน์
            </a>
          </Card>
        </div>
        <div className="px-2 mb-4">
          <Card className="text-center">
            <a href="/page/macar/ma-car">
              <CarFilled className="text-5xl text-blue-500" />
              <br />
              จองรถยนต์ออนไลน์
            </a>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h">
        <div className="lg:col-span-2">
          <Card title="กิจกรรมและข่าวสาร" bordered={false} className="text-center" style={{ height: "500px" }}>
            <NewsCarouselComponent informationNews={informationNews} />
          </Card>
          <div className="my-4"></div>
          <Card title="เอกสาร" bordered={false} className="text-center" style={{ height: "520px" }}>
            <DocumentComponent handbookFile={handbookFile} downloadFile={(id: number, filename: string) => downloadFile(id, filename)} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="ห้องประชุม" className="text-center" style={{ height: "500px" }}>
            <MeetingRoomTableComponent pagination={false} masterBookingRoom={masterBookingRoom} />
          </Card>
          <div className="my-4"></div>
          <Card title="วันหยุดประจำปี" className="text-center" style={{ height: "520px" }}>
            <HolidaysCalendarComponent />
          </Card>
        </div>
      </div>
    </>
  );
}
