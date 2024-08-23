"use client";
import React, { useState, useEffect } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageinformationNewsServices } from "../../service/information.service";
import {
  Button,
  Row,
  Col,
  Card,
  Pagination,
  Modal,
  message,
  Input,
  Image,
  Carousel,
} from "antd";
export interface informationNews {
  newsId: Number;
  newsName: String;
  content: String;
  newsType: String;
  author: String;
  phblishedAt: Date |String;
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
const ManagementNews: React.FC = () => {
  const [informationNews, setInformationNews] = useState<informationNews[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<informationNews | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const intraAuth = useAxiosIntranet();
  const manageInformationNewsServices =
    ManageinformationNewsServices(intraAuth);
  useEffect(() => {
    fetchDatainformationNews();
  }, []);

  const fetchDatainformationNews = async () => {
    try {
      const newsResponse =
        await manageInformationNewsServices.getinformationNewsQuery();
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

  const filteredData = informationNews
    .filter((news) => news.status)
    .filter((news) =>
      news.newsName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        }}
      >
        ข่าวกิจกรรมล่าสุด
      </div>

      <Input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="ค้นหาข่าว"
        style={{
          margin: "10px 0 0 0",
          width: "300px",
        }}
      />

      <Card title="" bordered={false} className="text-center">
        <Row gutter={16}>
          {currentNews.map((item) => (
            <Col span={8} key={item.newsId.toString()}>
              <Card
                style={{ margin: "20px 0 0 0" }}
                hoverable
                onClick={() => showModal(item)}
                cover={
                  item.images.length > 0 && item.images[0]?.fileName ? (
                    <Image
                      preview={false}
                      alt="news"
                      crossOrigin="anonymous"
                      src={`http://localhost:4003/api/public/news-image/${item.images[0].fileName}`}
                      style={{
                        width: "400px",
                        height: "350px",
                        marginBottom: "20px",
                      }}
                    />
                  ) : null
                }
              >
                <p style={{ fontSize: "20px" }}>{item.newsName}</p>
                <p>{item.author}</p>
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

      <Modal
        width={1000}
        title="รายละเอียดข่าวสาร"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
      >
        {selectedNews && (
          <div>
            <p
              style={{
                textAlign: "center",
                fontSize: "24px ",
                fontWeight: "bold",
              }}
            >
              <strong></strong> {selectedNews.newsName}
            </p>
            <p style={{ fontSize: "20px" }}>
              <strong style={{margin:"0 40px 0 0"}}></strong> {selectedNews.content}
            </p>
            <Carousel
              arrows
              infinite={true}
              autoplay
              autoplaySpeed={10000}
              style={{ width: "600px", margin: "0 auto" }}
            >
              {selectedNews.images.length > 0
                ? selectedNews.images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        preview={false}
                        crossOrigin="anonymous"
                        alt="news"
                        src={`http://localhost:4003/api/public/news-image/${image.fileName}`}
                        style={{ width: "600px", height: "600px" }}
                      />
                    </div>
                  ))
                : null}
            </Carousel>
            <p>
              <strong>ผู้เขียน:</strong> {selectedNews.author}
            </p>
            <p>
              <strong>วันที่เผยแพร่:</strong>{" "}
              {new Date(selectedNews.phblishedAt.toString()).toLocaleDateString()}
            </p>
            <p>
              <strong>อัปเดตล่าสุด:</strong>{" "}
              {new Date(selectedNews.updatedAt.toString()).toLocaleDateString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagementNews;
