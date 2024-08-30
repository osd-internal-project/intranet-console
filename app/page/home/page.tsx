"use client";
import React, { useEffect, useState } from "react";
import { Card, message } from "antd";
import MeetingRoomTableComponent from "./components/MeetingRoomTable";
import NewsCarouselComponent from "./components/NewsCarousel";
import HolidaysCalendarComponent from "./components/HolidaysCalendar";
import BigCarouselComponent from "./components/BigCarousel";
import DocumentComponent from "./components/Document";
import "antd/dist/reset.css";
import { CarFilled, FileFilled, TeamOutlined } from "@ant-design/icons";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import SlideImageService from "./services/index.service";
import {
  SlideImageType,
  MasterRoomType,
  HandbookFileType,
  HandbookType,
  InformationNewsType,
  NewsImageType,
} from "./common";
import { RcFile, UploadProps } from "antd/es/upload";

export default function HomePage() {
  const intraAuth = useAxiosIntranet();
  const slideImageService = SlideImageService(intraAuth);
  const [loading, setLoading] = useState<boolean>(true);
  const [slideImage, setSlideImage] = useState<any[]>([]);
  const [filePath, setFilePath] = useState<any[]>([]);
  const [fileName, setFileName] = useState<any[]>([]);
  const [bookingRoom, setBookingRoom] = useState<MasterRoomType[]>([]);
  const [handbookFile, setHandbookFile] = useState<HandbookFileType[]>([]);
  const [handbookQuery, setHandbookQuery] = useState<HandbookType[]>([]);
  const [informationNews, setInformationNews] = useState<InformationNewsType[]>(
    []
  );
  const [NewsImage, setNewsImage] = useState<NewsImageType[]>([]);

  const fetchData = async () => {
    const dataSlideImage = await slideImageService.getSlideImageQuery();
    const dataFilePath = dataSlideImage.map(
      (item: SlideImageType) => item.filePath
    );
    const dataFileName = dataSlideImage.map(
      (item: SlideImageType) => item.fileName
    );
    const Bookingresponse = await slideImageService.getMasterRoomQuery();
    const dataHandbookFileQuery =
      await slideImageService.getHandbookFileQuery();
    const dataHandbookQuery = await slideImageService.getHandbookQuery();
    const dataInformationNews =
      await slideImageService.getinformationNewsQuery();

    // const dataNewsImage = dataInformationNews.map((item: any) => ({
    //   ...item,
    //   images: item.newsImage,
    // }));
    const dataNewsImage = await slideImageService.getNewsImageQuery();

    setNewsImage(dataNewsImage);
    setInformationNews(dataInformationNews);
    setHandbookQuery(dataHandbookQuery);
    setHandbookFile(dataHandbookFileQuery);
    setBookingRoom(Bookingresponse);
    setFileName(dataFileName);
    setFilePath(dataFilePath);
    setSlideImage(dataSlideImage);
    setLoading(false);
  };

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await slideImageService.downloadFile(id);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  return (
    <>
      <BigCarouselComponent loading={loading} slideImage={slideImage} />

      <div className="my-2" />
      <div className="grid md:grid-cols-3">
        <div className="px-2 mb-4">
          <Card className="text-center">
            <a href="/page/data-leave/online-leave">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card
            title="ข่าวเเละกิจกรรมล่าสุด"
            bordered={false}
            className="text-center"
          >
            <NewsCarouselComponent
              informationNews={informationNews}
              NewsImage={NewsImage}
            />
          </Card>
          <div className="my-4"></div>
          <Card title="เอกสาร" bordered={false} className="text-center">
            <DocumentComponent
              handbookFile={handbookFile}
              handbookQuery={handbookQuery}
              downloadFile={(id: number, filename: string) =>
                downloadFile(id, filename)
              }
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="หอประชุม">
            <MeetingRoomTableComponent
              pagination={false}
              bookingRoom={bookingRoom}
            />
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
