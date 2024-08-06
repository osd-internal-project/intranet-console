"use client";
import React, { useState,useEffect  } from "react";
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
export interface newType {
  idType: Number;
  nameType: string;
  deteil: string;
  createAt: string;
  status: boolean;
}

const Newoption: React.FC = () => {
  const intraAuth = useAxiosIntranet();
  const [newType, setnewType] = useState<newType[]>([]);
  const manageinformationNewsServices = ManageinformationNewsServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    fetchDatanewType();
  }, []);

  const fetchDatanewType = async () => {
    try {
      const maresponse = await manageinformationNewsServices.getnewsTypeQuery();
      const newType: newType[] = maresponse.map(
        (item: any, index: number) => ({
          ...item,
          key: index.toString(),
        })
      );
      setnewType(newType);
      setSubmitLoading(false);
    } catch (error) {
      message.error("Failed to fetch car data");
    }
  };
  const columns: TableProps<newType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "idType",
      key: "idType",
      align: "center",
      width: "20px",
    },
    {
      title: "ชื่อรถ",
      dataIndex: "nameType",
      key: "newsName",
      width: "180px",
    },
    {
      title: "ประเภทตรวจสภาพ",
      dataIndex: "deteil",
      key: "deteil",
      width: "140px",
    },
    {
      title: "รายละเอียดการตรวจ",
      dataIndex: "createAt",
      key: "createAt",
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
        คุณสามารถส่งไฟล์ไปยังเซิร์ฟเวอร์ของคุณได้ที่นี่ แต่ยังไม่ให้ส่ง 
      </div>

      <div style={{ margin: "100px 0 0 100px", fontSize: "20px" }}>
        งงอะไรกัน งานยังไม่เสร็จ!!
      </div>
      <Table
        dataSource={newType}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
export default Newoption;
