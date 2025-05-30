"use client";
import React, { useState, useEffect } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Button, Row, Col, Card, Pagination, Modal, message, Input, Image, Carousel } from "antd";
import { ManageinformationNewsServices } from "../services/information.service";
export interface informationNews {
  newsId: Number;
  newsName: String;
  content: String;
  newsType: String;
  author: String;
  phblishedAt: Date | String;
  updatedAt: Date | String;
  status: boolean;
  images: newsImage[];
}
export interface newsImage {
  imageId: Number;
  newsId: Number;
  createdAt: String;
  updatedAt: String;
  fileimageName: String;
  fileimagePath: String;
  fileName: string;
}
const NewsShow: React.FC = () => {
  const [informationNews, setInformationNews] = useState<informationNews[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<informationNews | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const intraAuth = useAxiosIntranet();
  const manageInformationNewsServices = ManageinformationNewsServices(intraAuth);
  const baseImageUrl = process.env.REACT_APP_API_BASE_URL_INTRANET;
  useEffect(() => {
    fetchDatainformationNews();
  }, []);

  const fetchDatainformationNews = async () => {
    try {
      const newsResponse = await manageInformationNewsServices.getinformationNewsQuery();
      const newsData: informationNews[] = newsResponse.map((item: any) => ({
        ...item,
        images: item.newsImage,
      }));
      setInformationNews(newsData);
    } catch (error) {
      message.error("Failed to fetch news data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = informationNews.filter((news) => news.status).filter((news) => news.newsName.toLowerCase().includes(searchTerm.toLowerCase()));

  const newsPerPage = 12;
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredData.slice(indexOfFirstNews, indexOfLastNews);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showModal = (newsItem: informationNews) => {
    setSelectedNews(newsItem);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedNews(null);
  };

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          fontSize: "36px",
        }}>
        ข่าวสารและกิจกรรมต่าง ๆ
      </div>

      <Input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="ข่าวสารและกิจกรรมต่าง ๆ"
        style={{
          margin: "10px 0 10px 0",
          width: "300px",
        }}
      />

      <Card title="" className="text-center">
        <Row gutter={16}>
          {currentNews
            .slice()
            .reverse()
            .map((item) => (
              <Col span={8} key={item.newsId.toString()}>
                <Card
                  style={{ margin: "20px 0 0 0", backgroundColor: "#F0F8FF" }}
                  hoverable
                  onClick={() => showModal(item)}
                  cover={
                    item.images.length > 0 && item.images[0]?.fileName ? (
                      <Image
                        preview={false}
                        alt="news"
                        crossOrigin="anonymous"
                        src={`${baseImageUrl}/public/news-image/${item.images[0].fileName}`}
                        style={{
                          width: "400px",
                          height: "350px",
                          margin: "30px 20px -20px 10px",
                        }}
                      />
                    ) : null
                  }>
                  <p style={{ fontSize: "20px" }}>{item.newsName}</p>
                  <p>ผู้เขียน : {item.author}</p>
                  <p>
                    เวลา :{" "}
                    {new Date(item.updatedAt.toString()).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    น.
                  </p>
                </Card>
              </Col>
            ))}
        </Row>
        <Pagination
          align="center"
          current={currentPage}
          pageSize={newsPerPage}
          total={filteredData.length}
          onChange={handlePageChange}
          style={{ marginTop: "20px" }}
        />
      </Card>

      <Modal width={950} title="รายละเอียดข่าวสาร" open={isModalVisible} onCancel={handleCancel} footer={[]}>
        {selectedNews && (
          <div>
            <p
              style={{
                textAlign: "center",
                fontSize: "24px ",
                fontWeight: "bold",
              }}>
              <strong></strong> {selectedNews.newsName}
            </p>
            <Carousel arrows infinite={true} autoplay autoplaySpeed={1500} style={{ width: "600px", margin: "0 auto" }}>
              {selectedNews.images.length > 0
                ? selectedNews.images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <Image
                        preview={false}
                        crossOrigin="anonymous"
                        alt="news"
                        src={`${baseImageUrl}/public/news-image/${image.fileName}`}
                        style={{ width: "600px", height: "600px" }}
                      />
                    </div>
                  ))
                : null}
            </Carousel>
            <div style={{ fontSize: "20px" }}>
              <Input.TextArea
                style={{
                  fontSize: "20px",
                  width: "900px",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  boxShadow: "none",
                }}
                value={selectedNews?.content?.toString()}
                readOnly
                autoSize
              />
            </div>
            <p>
              <strong>ผู้เขียน : </strong> {selectedNews.author}
            </p>
            <p>
              <strong>วันที่เผยแพร่ : </strong>{" "}
              {new Date(selectedNews.phblishedAt.toString())
                .toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(",", "")}{" "}
              น.
            </p>
            <p>
              <strong>อัปเดตล่าสุด : </strong>{" "}
              {new Date(selectedNews.updatedAt.toString())
                .toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(",", "")}{" "}
              น.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NewsShow;
