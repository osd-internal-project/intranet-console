"use client";
import React, { useState, useEffect  } from "react";
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
  TableProps,message,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useForm } from "antd/es/form/Form";

export interface handbookFile {
  id: Number;
  fileName: String;
  fileLocation: String;
  createdAt: String;
  updatedAt: String;
  status: boolean;
}
const Tablehandbook: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [handbookFile, sethandbookFile] = useState<handbookFile[]>([]);
  const managehandbookFileServices = ManagehandbookFileServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    fetchDataHandbook();
  }, []);

  const fetchDataHandbook = async () => {
    try {
      const maresponse = await managehandbookFileServices.gethandbookFileQuery();
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
  const columns: TableProps<handbookFile>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "fileName",
      key: "fileName",
      width: "180px",
    },
    {
      title: "ประเภทตรวจสภาพ",
      dataIndex: "fileLocation",
      key: "fileLocation",
      width: "140px",
    },
    {
      title: "รายละเอียดการตรวจ",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "200px",
    },
    {
      title: "สถานที่เช็คสภาพ",
      dataIndex: "status",
      key: "status",
      width: "200px",
    },
  ];
  return (
    <div>
      ยังไม่เสร็จเด้อวัยรุ่น
      <Table
        dataSource={handbookFile}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default Tablehandbook;
