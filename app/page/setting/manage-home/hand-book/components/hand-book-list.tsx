"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Input, Table, TableProps, message } from "antd";
import { ManagehandbookFileServices } from "../service/handbook.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

import { notifyError } from "@/app/utils/message";
export interface handbookFile {
  [x: string]: any;
  handbookid?: Number | null;
  fileName: String;
  fileoriginalName: string;
  author: String;
  createdAt?: Date;
  updatedAt?: Date;
  filetype: String;
  status?: boolean;
}
const HandBookList: React.FC = () => {
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const managehandbookFileServices = ManagehandbookFileServices(baseUrlIntranet);
  const [handbookFile, sethandbookFile] = useState<handbookFile[]>([]);
  const [searchFileName, setSearchFileName] = useState("");
  const [searchFileType, setSearchFileType] = useState("");
  const baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL_INTRANET;
  useEffect(() => {
    fetchDataHandbookfile();
  }, []);

  const fetchDataHandbookfile = async () => {
    try {
      const maresponse = await managehandbookFileServices.gethandbookFileQuery();
      const handbookFile: handbookFile[] = maresponse.map((item: any, index: number) => ({
        ...item,
        key: index.toString(),
      }));
      sethandbookFile(handbookFile);
    } catch (error) {
      notifyError(error, "car.document.load");
    }
  };
  const handleDownload = async (record: handbookFile) => {
    if (record && record.fileId) {
      const fileUrl = `${baseImageUrl}/public/handbook-file/${record.fileId}?fileName=${encodeURIComponent(String(record.fileName))}`;
      try {
        const response = await fetch(fileUrl);
        if (response.ok) {
          const blob = await response.blob();
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = String(record.fileName);
          link.click();

          window.URL.revokeObjectURL(link.href);
        } else {
          message.error("ไม่มีไฟล์ให้ดาวน์โหลด");
        }
      } catch (error) {
        notifyError(error, "file.download");
      }
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

  const filteredData = handbookFile
    .filter((handbookFile) => handbookFile.status)
    .filter(
      (handbookFile) =>
        handbookFile.fileName.toLowerCase().includes(searchFileName.toLowerCase()) &&
        handbookFile.filetype.toLowerCase().includes(searchFileType.toLowerCase()),
    );

  const dataWithKey = filteredData.map((item, index) => ({
    ...item,
    key: index + 1,
    index: index + 1,
  }));
  const columns: TableProps<handbookFile>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "40px",
    },
    {
      title: "ชื่อเอกสาร",
      dataIndex: "fileName",
      key: "fileName",
      width: "300px",
    },
    {
      title: "ประเภทเอกสาร",
      dataIndex: "filetype",
      key: "filetype",
      width: "130px",
    },
    {
      title: "อัปเดตล่าสุด",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "180px",
      render: (updatedAt: Date) => moment(updatedAt).format("DD/MM/YYYY HH:mm" + " น."),
    },
    {
      title: "ผู้อัปโหลด",
      dataIndex: "author",
      key: "author",
      width: "200px",
    },
    {
      title: "ดาวโหลดไฟล์",
      dataIndex: "x",
      key: "x",

      align: "center",
      render: (_record: number, row: any, _index: number) => (
        <Button icon={<DownloadOutlined />} size="small" type="primary" onClick={() => handleDownload(row)}>
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
        }}>
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
        size="small"
        columns={columns}
        scroll={{ x: "max-content" }}
        rowKey="key"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default HandBookList;
