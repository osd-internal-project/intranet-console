import React, { useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType } from "antd";
import { Badge, Button, Calendar, Form, Input, Modal, Select, Table, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { ITMaDetail, ITPagination } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";

export interface props {
  dataTable: ITMaDetail[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  pagination: ITPagination;
  changePagination: (page: { current: number; pageSize: number }) => void;
}

const MaTableComponent: React.FC<props> = ({ dataTable, loading, setLoading, pagination, changePagination }): React.ReactElement => {
  const maColumns: TableColumnsType<ITMaDetail> = [
    {
      key: "id",
      title: "NO",
      dataIndex: "id",
      width: "100px",
      align: "center",
      render: (id: number, record: ITMaDetail, index: number) => (pagination.current - 1) * pagination.pageSize + (index + 1),
    },
    { key: "maTypeName", dataIndex: "maTypeName", title: "ประเภท MA", width: "200px" },
    { key: "maName", dataIndex: "maName", title: "ชื่อ MA", width: "200px" },
    { key: "maDate", dataIndex: "maDate", title: "วันนัดหมาย", width: "200px", render: (data: Date) => (data ? dateToStringThNoTime(data) : "-") },
    {
      key: "maStatus",
      dataIndex: "maStatus",
      title: "สถานะ",
      width: "200px",
      render: (data: string) =>
        data ? (
          data === "process" ? (
            <Tag color="blue">รอดำเนินการ</Tag>
          ) : data === "success" ? (
            <Tag color="green">สำเร็จ</Tag>
          ) : data === "cancel" ? (
            <Tag color="red">ยกเลิก</Tag>
          ) : (
            ""
          )
        ) : (
          ""
        ),
    },
    { key: "contact", dataIndex: "contact", title: "ผู้นัดหมาย", width: "200px" },
    { key: "createdDate", dataIndex: "createdDate", title: "วันที่สร้าง", width: "200px", render: (data: Date) => (data ? dateToStringThNoTime(data) : "-") },
    { key: "updatedDate", dataIndex: "updatedDate", title: "วันที่อัพเดท", width: "200px", render: (data: Date) => (data ? dateToStringThNoTime(data) : "-") },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "200px",
      render: (data: Date) => (
        <Button type="link" ghost>
          รายละเอียด
        </Button>
      ),
    },
  ];
  return (
    <>
      <Table columns={maColumns} dataSource={dataTable} size="small" />
    </>
  );
};

export default MaTableComponent;
