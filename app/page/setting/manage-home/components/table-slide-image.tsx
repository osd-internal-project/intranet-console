"use client";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import React from "react";
import { SlideImageType } from "../common";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

export interface props {
  loading: boolean;
  slideImage: SlideImageType[];
  handleDeleteSlideImage: any;
}

export const TableSlideImage: React.FC<props> = ({
  loading,
  slideImage,
  handleDeleteSlideImage,
}): React.ReactElement => {
  const columns: any = [
    {
      key: "id",
      dataIndex: "id",
      title: "ID",
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      key: "fileName",
      dataIndex: "fileName",
      title: "fileName",
    },
    {
      key: "fileType",
      dataIndex: "fileType",
      title: "fileType",
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Created At",
      render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      key: "createdByName",
      dataIndex: "createdByName",
      title: "createdByName",
    },
    {
      key: "id",
      dataIndex: "",
      title: "Active",
      align: "center",
      render: (_: any, record: { id: number }) => (
        <Space size="middle">
          <Popconfirm
            title="คุณต้องการลบรูปนี้ใช่หรือไม่?"
            onConfirm={() => handleDeleteSlideImage(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <a>ลบ</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={slideImage}
        columns={columns}
        size="small"
        loading={loading}
      />
    </>
  );
};
