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
const managementNews: React.FC = () => {
  const [newsmanage, setNewsmanage] = useState([]);

  
    return(
        <div>
            <div style={{ backgroundColor: "#FFFFFF" }}>
      <h1
        style={{
          margin: "0 0 0 10px",
          fontSize: "32px",
          fontStyle: "initial",
          borderBottom: "2px solid black",
        }}
      >
        จัดการข้อมูลข่าวสาร
      </h1>
      </div>
        </div>
    );
}
export default managementNews;