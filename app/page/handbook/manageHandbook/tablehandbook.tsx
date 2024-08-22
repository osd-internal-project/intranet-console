"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
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
  Image,
  Form,
  Space,
  Upload,
  Switch,
  Tooltip,
  Popconfirm,
  Select,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";

export interface handbookFile {
  id: number;
  fileName: String;
  fileLocation: string;
  createdAt: string;
  author: string;
  updatedAt: string;
  status: boolean;
}
export interface handbook {
  handbookFile: any;
  idbook: number;
  fileName: String;
  filetype: String;
  createdAt: Date;
  updatedAt: Date;
  author: String;
  status: boolean;
}
const Tablehandbook: React.FC = () => {
  const intraAuth = useAxiosIntranet();

  const [handbook, sethandbook] = useState<handbook[]>([]);
  const [handbookFile, sethandbookFile] = useState<handbookFile[]>([]);
  const managehandbookFileServices = ManagehandbookFileServices(intraAuth);
  const [form] = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchDataHandbook();
    fetchDataHandbookfile();
  }, []);

  const fetchDataHandbookfile = async () => {
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
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };

  const fetchDataHandbook = async () => {
    try {
      const maresponse = await managehandbookFileServices.gethandbookQuery();
      const handbook: handbook[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      sethandbook(handbook);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };
  const handleDownload = (record: handbook) => {
    if (
      record.handbookFile &&
      record.handbookFile[0] &&
      record.handbookFile[0].fileName
    ) {
      window.open(
        `http://localhost:4003/api/public/handbook-file/${record.handbookFile[0].fileName}`,
        "_blank"
      );
    } else {
      message.error("ไม่มีไฟล์ให้ดาวน์โหลด");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = handbook
    .filter((handbook) => handbook.status) // กรองข้อมูลที่มี status เป็น true
    .filter(
      (handbook) =>
        handbook.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        handbook.filetype.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // const handleDownload = (fileUrl: string, p0?: string) => {
  //   console.log(fileUrl);

  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.setAttribute("download", ""); // ตั้งค่า download เพื่อให้บราวเซอร์ดาวน์โหลดไฟล์
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const columns: TableProps<handbook>["columns"] = [
    {
      title: "ไอดี",
      dataIndex: "idbook",
      key: "idbook",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อไฟล์",
      dataIndex: "fileName",
      key: "fileName",
      width: "250px",
    },
    {
      title: "ประเภทเอกสาร",
      dataIndex: "filetype",
      key: "filetype",
      width: "50px",
      align: "center",
    },
    {
      title: "นำเข้าเวลา",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "50px",
      align: "center",
      render: (createdAt: Date) => moment(createdAt).format("YYYY/MM/DD"),
    },
    {
      title: "อัพโหลดโดย",
      dataIndex: "author",
      key: "author",
      width: "100px",
    },
    {
      title: "ดาวโหลดไฟล์",
      dataIndex: "x",
      key: "x",
      width: "30px",
      align: "center",
      render: (_record: number, row: any, _index: number) => (
        <Button
          icon={<DownloadOutlined />}
          size="small"
          onClick={() => handleDownload(row)}
        >
          ดาวน์โหลด
        </Button>
      ),
    },
  ];
  function opencreate() {
    fetchDataHandbook();
    fetchDataHandbookfile();
  }

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
        ></Input>
        <Button type="primary" onClick={opencreate}
        style={{display: 'flex', justifyContent: 'inline-end' }}>
          Reload
        </Button>
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
function generateUniqueId(): any {
  throw new Error("Function not implemented.");
}
