"use client";
import React, { useState, useEffect } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageinformationNewsServices } from "../../service/information.service";
import { useForm } from "antd/es/form/Form";
import {
  Button,
  Row,
  Col,
  Card,
  Pagination,
  Modal,
  message,
} from "antd";

export interface informationNews {
  newsId: Number;
  newsName: String;
  content: String;
  newsType: String;
  author: String;
  phblishedAt: String;
  updatedAt: String;
  status: boolean;
}

const ManagementNews: React.FC = () => {
  const [informationNews, setInformationNews] = useState<informationNews[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<informationNews | null>(null);

  const intraAuth = useAxiosIntranet();
  const manageInformationNewsServices = ManageinformationNewsServices(intraAuth);
  const [form] = useForm();

  useEffect(() => {
    fetchDatainformationNews();
  }, []);

  const fetchDatainformationNews = async () => {
    try {
      const response = await manageInformationNewsServices.getinformationNewsQuery();
      const informationNews: informationNews[] = response.map(
        (item: any) => ({
          ...item,
        })
      );
      setInformationNews(informationNews);
    } catch (error) {
      message.error("Failed to fetch news data");
    }
  };

  const newsPerPage = 12;
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = informationNews.slice(indexOfFirstNews, indexOfLastNews);

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
      <div style={{ display: "inline-block" }}>
        <Button
          style={{ margin: "10px 0 0 10px" }}
          type="primary"
        >
          {" "}
          สร้างหน้าข่าวสาร
        </Button>
      </div>

      <Card
        title="ข่าวเเละกิจกรรมล่าสุด"
        bordered={false}
        className="text-center"
      >
        <Row gutter={16}>
          {currentNews.map((item) => (
            <Col key={item.newsId} span={8}>
              <Card
                style={{ margin: "20px 0 0 0", border: "1px solid black" }}
                hoverable
                onClick={() => showModal(item)}
              >
                {item.newsName}
              </Card>
            </Col>
          ))}
        </Row>
        <Pagination
          align="center"
          current={currentPage}
          pageSize={newsPerPage}
          total={informationNews.length}
          onChange={handlePageChange}
          style={{ marginTop: "20px" }}
        />
      </Card>

      <Modal
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
            <p><strong>ชื่อข่าว:</strong> {selectedNews.newsName}</p>
            <p><strong>เนื้อหา:</strong> {selectedNews.content}</p>
            <p><strong>ผู้เขียน:</strong> {selectedNews.author}</p>
            <p><strong>วันที่เผยแพร่:</strong> {selectedNews.phblishedAt}</p>
            <p><strong>อัปเดตล่าสุด:</strong> {selectedNews.updatedAt}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagementNews;
