"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Input, Table, TableProps, message } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManagehandbookFileServices } from "../service/handbook.service";

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
  const [searchFileName, setSearchFileName] = useState("");
  const [searchFileType, setSearchFileType] = useState("");
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
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
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
      message.error("ไม่สามารถเรียกข้อมูลเอกสารได้");
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

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFileName(e.target.value);
  };

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFileType(e.target.value);
  };

  const filteredData = handbook
    .filter((handbook) => handbook.status)
    .filter(
      (handbook) =>
        handbook.fileName
          .toLowerCase()
          .includes(searchFileName.toLowerCase()) &&
        handbook.filetype.toLowerCase().includes(searchFileType.toLowerCase())
    );

  const dataWithKey = filteredData.map((item, index) => ({
    ...item,
    key: index + 1,
    index: index + 1,
  }));
  const columns: TableProps<handbook>["columns"] = [
    {
      title: "ไอดี",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อไฟล์",
      dataIndex: "fileName",
      key: "fileName",
      width: "200px",
    },
    {
      title: "ประเภทเอกสาร",
      dataIndex: "filetype",
      key: "filetype",
      width: "50px",
      ellipsis: true,
    },
    {
      title: "อัปเดตล่าสุด",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "50px",
      render: (updatedAt: Date) =>
        moment(updatedAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "ผู้อัปโหลด",
      dataIndex: "author",
      key: "author",
      width: "70px",
    },
    {
      title: "ดาวโหลดไฟล์",
      dataIndex: "x",
      key: "x",
      width: "50px",
      align: "center",
      ellipsis: true,
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "16px",
        }}
      >
        <div>
          <div>
            ค้นหาชื่อเอกสาร :
            <Input
              type="text"
              value={searchFileName}
              onChange={handleFileNameChange}
              placeholder="ค้นหาชื่อเอกสาร"
              style={{
                margin: "10px 10px 10px 10px",
                width: "300px",
              }}
            />
            ค้นหาประเภทเอกสาร :
            <Input
              type="text"
              value={searchFileType}
              onChange={handleFileTypeChange}
              placeholder="ค้นหาประเภทเอกสาร"
              style={{
                margin: "10px 10px 10px 10px",
                width: "300px",
              }}
            />
          </div>
        </div>
      </div>
      <Table
        dataSource={dataWithKey}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default Tablehandbook;
