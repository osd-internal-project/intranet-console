"use client";
import React, { useState } from "react";
import ManageHandbook from "./manageHandbook/managehandBook";
import {
  Button,
  Row,
  Col,
  Modal,
  Input,
  Card,
  Pagination,
  Tabs,
  TabsProps,
} from "antd";


const dataform: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "สร้างบะหมี่เกี้ยวหมูสับ",
      children: <ManageHandbook />,
    },
  ];

  // while

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
      <Col span={24}>
        <div className="grid-span-1 space-y-2">
          <Card>
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </div>
      </Col>
    </div>
  );
};

export default dataform;
