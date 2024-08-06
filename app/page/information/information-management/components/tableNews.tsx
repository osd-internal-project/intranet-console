"use client";
import React, { useState,useEffect } from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import type { TableProps, FormProps } from "antd";
import { DeleteIcon, EditIcon } from "@/components/icon";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageinformationNewsServices } from "../../service/information.service";
import { useForm } from "antd/es/form/Form";
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
  const intraAuth = useAxiosIntranet();
  const [informationNews, setinformationNews] = useState<informationNews[]>([]);
  const manageinformationNewsServices = ManageinformationNewsServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    fetchDatainformationNews();
  }, []);

  const fetchDatainformationNews = async () => {
    try {
      const maresponse = await manageinformationNewsServices.getinformationNewsQuery();
      const informationNews: informationNews[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      setinformationNews(informationNews);
      setSubmitLoading(false);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };
  const columns: TableProps<informationNews>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "newsId",
      key: "newsId",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "newsName",
      key: "newsName",
      width: "180px",
    },
    {
      title: "ประเภทตรวจสภาพ",
      dataIndex: "content",
      key: "content",
      width: "140px",
    },
    {
      title: "รายละเอียดการตรวจ",
      dataIndex: "newsType",
      key: "newsType",
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
      <div style={{ margin: "100px 0 0 100px", fontSize: "40px" }}>
        หน้าสามไม่มีอะไร
      </div>

      <div style={{ margin: "100px 0 0 100px", fontSize: "20px" }}>
        งงอะไรกัน งานยังไม่เสร็จ!!
      </div>
      <Table
        dataSource={informationNews}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default Newoption;
