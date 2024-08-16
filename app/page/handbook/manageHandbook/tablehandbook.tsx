"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
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
  Table,
  TableProps,
  message,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useForm } from "antd/es/form/Form";

export interface handbookFile {
  id: Number;
  fileName: String;
  fileLocation: String;
  createdAt: String;
  author: String;
  updatedAt: String;
  status: boolean;
}
const Tablehandbook: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [handbookFile, sethandbookFile] = useState<handbookFile[]>([]);
  const managehandbookFileServices = ManagehandbookFileServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDataHandbook();
  }, []);

  const fetchDataHandbook = async () => {
    try {
      const maresponse =
        await managehandbookFileServices.gethandbookFileQuery();
      const handbookFile: handbookFile[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      sethandbookFile(handbookFile);
      setSubmitLoading(false);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = handbookFile.filter((handbookFile) =>
    handbookFile.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: TableProps<handbookFile>["columns"] = [
    {
      title: "ไอดี",
      dataIndex: "handbookid",
      key: "handbookid",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อไฟล์",
      dataIndex: "fileName",
      key: "fileName",
      width: "180px",
    },
    {
      title: "ที่อยู่ข้อมูล",
      dataIndex: "fileLocation",
      key: "fileLocation",
      width: "140px",
    },
    {
      title: "นำเข้าเวลา",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "200px",
    },
    {
      title: "อัพโหลดโดย",
      dataIndex: "author",
      key: "author",
      width: "200px",
    },
  ];
  return (
    <div>
      <div style={{ fontSize: "16px" }}>
        ค้นหาข่าวสาร :
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="ค้นหาข่าวสาร"
          style={{
            margin: "10px 0 10px 10px",
            width: "300px",
          }}
        />
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default Tablehandbook;
