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
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { SlideImageType } from "../common";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import React, { useState } from "react";
import { DeleteIcon } from "@/components/icon";

export interface props {
  loading: boolean;
  slideImage: SlideImageType[];
  handleDeleteSlideImage: any;
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

export const TableSlideImage: React.FC<props> = ({
  loading,
  slideImage,
  handleDeleteSlideImage,
  pagination,
  changePagination,
}): React.ReactElement => {
  const columns: any = [
    {
      key: "id",
      dataIndex: "id",
      title: "ID",
      render: (_: any, __: any, index: number) =>
        pagination.current && pagination.pageSize
          ? (pagination.current - 1) * pagination.pageSize + (index + 1)
          : "",
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
      render: (text: string) => dayjs(text).format("DD-MM-YYYY, HH:mm"),
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
        <Space>
          <Popconfirm
            title="คุณต้องการลบรูปนี้ใช่หรือไม่?"
            onConfirm={() => handleDeleteSlideImage(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <a type="link">
                {" "}
                <DeleteIcon />{" "}
              </a>
            </Tooltip>
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
        pagination={pagination}
        onChange={changePagination}
        rowKey="id"
      />
    </>
  );
};
