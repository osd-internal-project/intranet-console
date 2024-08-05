"use client";
import React, { useState } from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import type { TableProps, FormProps } from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
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

const Newoption: React.FC = () => {
  return (
    <div>
      <div style={{ margin: "100px 0 0 100px", fontSize: "40px" }}>
        หน้าสามไม่มีอะไร
      </div>

      <div style={{ margin: "100px 0 0 100px", fontSize: "20px" }}>
        งงอะไรกัน งานยังไม่เสร็จ!!
      </div>
    </div>
  );
};
export default Newoption;
