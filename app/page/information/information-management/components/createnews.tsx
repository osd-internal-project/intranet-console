"use client";
import React, { useState } from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import type { TableProps, FormProps } from "antd";
import ImageUpload from "./ImageUpload";
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
const { TextArea } = Input;
const Infomation_management: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState(true);


  const handleFilesUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
    // คุณสามารถส่งไฟล์ไปยังเซิร์ฟเวอร์ของคุณได้ที่นี่
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      
      <div style={{ display: "inline-block", margin: " 10px 0 0 10px " }}>
        <Form style={{ display: "inline-block" }}>
          <Form.Item>
            หัวข้อข่าวสาร :<Input style={{ margin: "0 0 0 10px" }}></Input>
          </Form.Item>
          <Form.Item>
            ประเภทข่าวสาร :<Input style={{ margin: "0 0 0 10px" }}></Input>
          </Form.Item>
          <Form.Item>
            เนื้อหาข่าวสาร :<TextArea style={{ margin: "0 0 0 10px" }}></TextArea>
          </Form.Item>
          <Form.Item>
            วันที่เผยแพร่ :<Input style={{ margin: "0 0 0 10px" }}></Input>
          </Form.Item>
          <Form.Item style={{ margin: "10px 0 0 0" }}>
            รูปอัพโหลด :
            <ImageUpload onFilesUpload={handleFilesUpload} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
            ></Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Infomation_management;
