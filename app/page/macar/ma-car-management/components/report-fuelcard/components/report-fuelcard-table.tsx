import { dateFormatTimeNoTIme, numberFormat } from "@/app/utils";
import { Table, Tag, TablePaginationConfig, TableProps } from "antd";
import React from "react";
import { FuelTransactionRow } from "../services/report-fuel.service";

export interface props {
  dataSource: FuelTransactionRow[];
  loading: boolean;
  total: number;
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

/** Tag colour per transaction type. */
const actionStatusColor: Record<string, string> = {
  use: "green",
  reset: "blue",
  adjust: "orange",
};

/**
 * Table of fuel transactions joined with car name and booking info.
 */
const ReportFuelCardTable: React.FC<props> = ({
  dataSource,
  loading,
  total,
  pagination,
  changePagination,
}): React.ReactElement => {
  const columns: TableProps<FuelTransactionRow>["columns"] = [
    {
      title: "ลำดับ",
      align: "center",
      width: 70,
      render: (_: unknown, __: FuelTransactionRow, index: number) =>
        index + 1 + ((Number(pagination.current) || 1) - 1) * (Number(pagination.pageSize) || 10),
    },
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (value: string) => dateFormatTimeNoTIme(value),
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      align: "center",
    },
    {
      title: "ประเภท",
      dataIndex: "actionStatus",
      key: "actionStatus",
      align: "center",
      render: (value: string | null, record: FuelTransactionRow) => (
        <Tag color={value ? actionStatusColor[value] : "default"}>{record.actionStatusLabel || "-"}</Tag>
      ),
    },
    {
      title: "จำนวนเงิน (บาท)",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (value: string | number) => numberFormat(Number(value)),
    },
    {
      title: "ยอดคงเหลือ (บาท)",
      dataIndex: "remaining",
      key: "remaining",
      align: "right",
      render: (value: string | number) => numberFormat(Number(value)),
    },
    {
      title: "ผู้จอง",
      dataIndex: "bookedBy",
      key: "bookedBy",
      align: "center",
      render: (value: string) => value || "-",
    },
    {
      title: "ผู้รับรถ",
      dataIndex: "recipientName",
      key: "recipientName",
      align: "center",
      render: (value: string) => value || "-",
    },
    {
      title: "ช่วงวันจอง",
      key: "bookingPeriod",
      align: "center",
      render: (_: unknown, record: FuelTransactionRow) =>
        record.carBookStartDate || record.carBookEndDate
          ? `${dateFormatTimeNoTIme(record.carBookStartDate ?? "")} - ${dateFormatTimeNoTIme(record.carBookEndDate ?? "")}`
          : "-",
    },
    {
      title: "รายละเอียด",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (value: string | null) => value || "-",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={{ ...pagination, total }}
      onChange={changePagination}
      size="small"
      scroll={{ x: "max-content" }}
      style={{ marginTop: "10px" }}
      rowKey="id"
    />
  );
};

export default ReportFuelCardTable;
