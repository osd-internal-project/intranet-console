"use client";
import React, { useState } from "react";
import Creaatenews from "./components/createnews"
import Newoption from "./components/newoption"
import Tablenews from "./components/tableNews"
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
  TabsProps,
  Tabs,
} from "antd";
const Infomation_management: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "สร้างข้อมูลข่าว",
      children: <Creaatenews/>,
    },
    {
      key: "2",
      label: "ตารางข้อมูลข่าวสาร",
      children: <Tablenews/>,
    },
    {
      key: "3",
      label: "ประเภทของข่าวสาร",
      children: <Newoption/>,
    },
    
  ];

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
        การจัดการข้อมูลข่าวสาร
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

export default Infomation_management;
