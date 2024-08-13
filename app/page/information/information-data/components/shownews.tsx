"use client";
import React, { useState, useEffect } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageinformationNewsServices } from "../../service/information.service";
import { useForm } from "antd/es/form/Form";
import { Button, Row, Col, Card, Pagination, Modal, message, Input } from "antd";

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
  const [selectedNews, setSelectedNews] = useState<informationNews | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const intraAuth = useAxiosIntranet();
  const manageInformationNewsServices =
    ManageinformationNewsServices(intraAuth);
  const [form] = useForm();

  useEffect(() => {
    fetchDatainformationNews();
  }, []);

  const fetchDatainformationNews = async () => {
    try {
      const response =
        await manageInformationNewsServices.getinformationNewsQuery();
      const informationNews: informationNews[] = response.map((item: any) => ({
        ...item,
      }));
      setInformationNews(informationNews);
    } catch (error) {
      message.error("Failed to fetch news data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = informationNews.filter((news) =>
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
          // backgroundImage: "linear-gradient(to right,#87CEFA, #AFEEEE,#87CEFA)",borderRadius:"10px"
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
                style={{ margin: "20px 0 0 0", 
                  // border: "3px solid #87CEFA" 
                }}
                hoverable
                onClick={() => showModal(item)}
              >
                <p style={{fontSize:"20px"}}>{item.newsName}</p>
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
            <p>
              <strong>ชื่อข่าว:</strong> {selectedNews.newsName}
            </p>
            <p>
              <strong>เนื้อหา:</strong> {selectedNews.content}
            </p>
            <p>
              <strong>ผู้เขียน:</strong> {selectedNews.author}
            </p>
            <p>
              <strong>วันที่เผยแพร่:</strong> {selectedNews.phblishedAt}
            </p>
            <p>
              <strong>อัปเดตล่าสุด:</strong> {selectedNews.updatedAt}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagementNews;
