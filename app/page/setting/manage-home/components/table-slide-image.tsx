"use client";
import {
  Popconfirm,
  Space,
  Table,
  TablePaginationConfig,
  Tooltip,
  Button,
} from "antd";
import { SlideImageType } from "../common";
import dayjs from "dayjs";
import React, { useState, useContext, useMemo } from "react";
import { DeleteIcon } from "@/components/icon";
import { HolderOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TableColumnsType } from "antd";

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
