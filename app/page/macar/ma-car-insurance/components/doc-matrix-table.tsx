"use client";
import React from "react";
import { Table, Tag } from "antd";
import type { TableProps, TablePaginationConfig } from "antd";
import { CarDocMatrixRow, DocType } from "../../common";
import { DOC_TYPE_LABEL } from "../../common/doc-status";
import DocStatusChip from "./doc-status-chip";

interface DocMatrixTableProps {
  data: CarDocMatrixRow[];
  loading: boolean;
  pagination: TablePaginationConfig;
  total: number;
  onChange: (pagination: TablePaginationConfig) => void;
  onCellClick: (row: CarDocMatrixRow, docType: DocType) => void;
}

/**
 * ตารางหลัก: รถ 1 คัน = 1 แถว, 3 คอลัมน์เอกสาร (ประกัน / พ.ร.บ. / ภาษี)
 * โครงเดียวกับ Excel ที่ทีมใช้อยู่ จึงไม่ต้องเรียนรู้ใหม่
 *
 * เชื้อเพลิง/ผู้ถือกรรมสิทธิ์ ไม่ขึ้นตาราง (ดูใน Drawer แทน)
 * เพราะถ้าใส่หมด คอลัมน์เอกสารจะโดนบีบจนอ่านไม่ออก ซึ่งคือหัวใจของหน้านี้
 */
export default function DocMatrixTable({
  data,
  loading,
  pagination,
  total,
  onChange,
  onCellClick,
}: DocMatrixTableProps) {
  /** คอลัมน์เอกสารทั้ง 3 ประเภทหน้าตาเหมือนกันหมด ต่างแค่ key จึงสร้างจากตัวเดียว */
  const docColumn = (docType: DocType) => ({
    title: `ช่วงเวลา ` + DOC_TYPE_LABEL[docType],
    dataIndex: docType,
    key: docType,
    width: 140,
    render: (_: unknown, record: CarDocMatrixRow) => (
      <DocStatusChip
        doc={record[docType]}
        onClick={() => onCellClick(record, docType)}
      />
    ),
  });

  const columns: TableProps<CarDocMatrixRow>["columns"] = [
    {
      title: "ลำดับ",
      key: "index",
      width: 70,
      render: (_: unknown, __: CarDocMatrixRow, index: number) => index + 1,
    },
    {
      title: "ทะเบียน",
      dataIndex: "licensePlate",
      key: "licensePlate",
      width: 120,
      render: (licensePlate: string | null) =>
        licensePlate ? (
          <span className="font-semibold">{licensePlate}</span>
        ) : (
          <Tag color="default">ยังไม่ระบุ</Tag>
        ),
    },
    {
      title: "รถ",
      key: "car",
      width: 200,
      render: (_: unknown, record: CarDocMatrixRow) => (
        <div className="leading-5">
          <div>{record.carName}</div>
          <div className="text-xs text-gray-500">
            {[record.brand, record.model, record.carCategory]
              .filter(Boolean)
              .join(" · ") || "-"}
          </div>
        </div>
      ),
    },
    docColumn("insurance"),
    docColumn("act"),
    docColumn("tax"),
  ];

  return (
    <Table<CarDocMatrixRow>
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={(record) => record.carId}
      size="small"
      scroll={{ x: "max-content" }}
      pagination={{ ...pagination, total, showSizeChanger: true }}
      onChange={(nextPagination) => onChange(nextPagination)}
      // ระบายพื้นแถวที่มีเอกสารหมดอายุ ให้เห็นได้จากอีกฝั่งห้อง
      rowClassName={(record) =>
        record.worstLevel === "expired"
          ? "bg-red-50"
          : record.worstLevel === "warning"
            ? "bg-orange-50"
            : ""
      }
    />
  );
}
