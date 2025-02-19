import React, { useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType, TablePaginationConfig } from "antd";
import { Badge, Button, Calendar, Form, Input, Modal, Select, Table, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { ITMaTask, ITPagination } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import Link from "next/link";

export interface props {
  dataTable: ITMaTask[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const MaTableComponent: React.FC<props> = ({ dataTable, loading, setLoading, pagination, changePagination }): React.ReactElement => {
  const maColumns: TableColumnsType<ITMaTask> = [
    {
      key: "id",
      title: "No.",
      dataIndex: "id",
      width: "100px",
      align: "center",
      render: (id: number, record: ITMaTask, index: number) =>
        pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : "",
    },
    { key: "maTypeName", dataIndex: "maTypeName", title: "ประเภท MA", width: "200px" },
    { key: "maName", dataIndex: "maName", title: "ชื่อ MA", width: "200px" },
    { key: "maDate", dataIndex: "maDate", title: "วันนัดหมาย", width: "200px", render: (data: Date) => (data ? dateToStringTh(data) : "-") },
    {
      key: "maStatus",
      dataIndex: "maStatus",
      title: "สถานะ",
      width: "200px",
      render: (data: string) =>
        data ? (
          data === "process" ? (
            <Tag key={data} color="blue">
              รอดำเนินการ
            </Tag>
          ) : data === "success" ? (
            <Tag key={data} color="green">
              สำเร็จ
            </Tag>
          ) : data === "cancel" ? (
            <Tag key={data} color="red">
              ยกเลิก
            </Tag>
          ) : (
            ""
          )
        ) : (
          ""
        ),
    },
    { key: "contact", dataIndex: "contact", title: "ผู้นัดหมาย", width: "200px" },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "วันที่สร้าง",
      width: "200px",
      render: (data: Date) => (data ? dateToStringThNoTime(data) : "-"),
    },
    {
      key: "updatedAt",
      dataIndex: "updatedAt",
      title: "วันที่อัปเดต",
      width: "200px",
      render: (data: Date) => (data ? dateToStringThNoTime(data) : "-"),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "200px",
      render: (data: number) => (
        <Link href={`/page/maintenance-management/${data}`}>
          <Button type="link">รายละเอียด</Button>
        </Link>
      ),
    },
  ];
  return (
    <>
      <Table
        columns={maColumns}
        pagination={pagination}
        onChange={changePagination}
        rowKey={(record: ITMaTask) => record.id}
        dataSource={dataTable}
        size="small"
      />
    </>
  );
};

export default MaTableComponent;
