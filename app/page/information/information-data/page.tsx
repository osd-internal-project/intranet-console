"use client";
import React, { useState } from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import {
  Select,
  Table,
  Space,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Tag,
  message,
  Popconfirm,
  InputNumber,
  Tooltip,
  Card,
  Pagination,
} from "antd";

const dataform: React.FC = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const addNews = () => {
    const newNews = `ข่าวที่ ${news.length + 1}`;
    setNews([...news, newNews]);
  };

  const newsPerPage = 12;
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showModal = (newsItem: string) => {
    setSelectedNews(newsItem);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedNews(null);
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <h1
        style={{
          margin: "0 0 0 10px",
          fontSize: "32px",
          fontStyle: "initial",
          borderBottom: "2px solid black",
        }}
      >
        ข้อมูลข่าวสาร
      </h1>
      <div style={{ display: "inline-block" }}>
        <Button
          style={{ margin: "10px 0 0 10px" }}
          type="primary"
          onClick={addNews}
        >
          {" "}
          สร้างหน้าข่าวสาร
        </Button>
        <Input
          style={{ margin: "10px 0 0 10px" }}
          placeholder="ค้นหาข่าวสาร"
        ></Input>
      </div>

      <Card
        title="ข่าวเเละกิจกรรมล่าสุด"
        bordered={false}
        className="text-center"
      >
        <Row gutter={16}>
          {currentNews.map((item, index) => (
            <Col key={index} span={8}>
              <Card
                style={{ margin: "20px 0 0 0", border: "1px solid black" }}
                hoverable
                onClick={() => showModal(item)}
              >
                {item}
              </Card>
            </Col>
          ))}
        </Row>
        <Pagination
          align="center"
          current={currentPage}
          pageSize={newsPerPage}
          total={news.length}
          onChange={handlePageChange}
          style={{ marginTop: "20px" }}
        />
      </Card>

      <Modal
        title="รายละเอียดข่าวสาร"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
      >
        <p>{selectedNews}</p>
      </Modal>
    </div>
  );
};

export default dataform;
