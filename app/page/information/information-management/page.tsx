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

const Infomation_management: React.FC = () => {
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
        <Button style={{ margin: "10px 0 0 10px" }} type="primary">
          {" "}
          สร้างหน้าข่าวสาร1
        </Button>
        <Button style={{ margin: "10px 0 0 10px" }} type="primary">
          {" "}
          สร้างหน้าข่าวสาร2
        </Button>
        <Button style={{ margin: "10px 0 0 10px" }} type="primary">
          {" "}
          สร้างหน้าข่าวสาร3
        </Button>
        <Button style={{ margin: "10px 0 0 10px" }} type="primary">
          {" "}
          สร้างหน้าข่าวสาร4
        </Button>

        <Input
          style={{ margin: "10px 0 0 10px" }}
          placeholder="ค้นหาข่าวสาร"
        ></Input>
      </div>
    </div>
  );
};

export default Infomation_management;
