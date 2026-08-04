"use client";
import React from "react";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { numberFormat } from "@/app/utils";
import { TcoRow } from "../services/report.service";
import ExportCostExcel from "./export-cost-excel";

/** คอลัมน์ตัวเลขเงิน — จัดขวา + เรียงลำดับได้ ทุกคอลัมน์ใช้รูปแบบเดียวกัน */
const moneyColumn = (
  title: string,
  key: keyof TcoRow,
): ColumnsType<TcoRow>[number] => ({
  title,
  dataIndex: key,
  key: key as string,
  align: "right",
  sorter: (a, b) => (a[key] as number) - (b[key] as number),
  render: (v: number) => numberFormat(v),
});

/** ตารางต้นทุนรวมต่อคัน (TCO) — ตารางหลักสำหรับฝ่ายบัญชี */
const TcoTable: React.FC<{
  data: TcoRow[];
  loading?: boolean;
  rangeLabel: string;
}> = ({ data, loading, rangeLabel }) => {
  const columns: ColumnsType<TcoRow> = [
    {
      title: "รถ",
      dataIndex: "carName",
      key: "carName",
      fixed: "left",
      render: (name: string, r) => (
        <div>
          <div>{name || r.carId}</div>
          {r.licensePlate ? (
            <div className="text-xs text-gray-400">{r.licensePlate}</div>
          ) : null}
        </div>
      ),
    },
    {
      title: "ประเภท",
      dataIndex: "carType",
      key: "carType",
      render: (v: string | null) => v || "-",
    },
    moneyColumn("ค่าน้ำมัน (฿)", "fuel"),
    moneyColumn("ค่าบำรุงรักษา (฿)", "maintenance"),
    moneyColumn("ประกันภัย (฿)", "insurance"),
    moneyColumn("พ.ร.บ. (฿)", "act"),
    moneyColumn("ภาษี (฿)", "tax"),
    {
      title: "รวม (฿)",
      dataIndex: "total",
      key: "total",
      align: "right",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.total - b.total,
      render: (v: number) => <strong>{numberFormat(v)}</strong>,
    },
    {
      title: "ครั้งที่ซ่อม",
      dataIndex: "repairCount",
      key: "repairCount",
      align: "center",
      sorter: (a, b) => a.repairCount - b.repairCount,
      render: (v: number) => numberFormat(v),
    },
    {
      title: "วันใช้งาน",
      dataIndex: "usageDays",
      key: "usageDays",
      align: "center",
      sorter: (a, b) => a.usageDays - b.usageDays,
      render: (v: number) => numberFormat(v),
    },
    {
      title: "฿ / วันใช้งาน",
      dataIndex: "costPerUsageDay",
      key: "costPerUsageDay",
      align: "right",
      sorter: (a, b) => a.costPerUsageDay - b.costPerUsageDay,
      // 0 = ยังไม่มีการจองที่ใช้รถจริงในช่วงนี้ หารไม่ได้
      render: (v: number, r) => (r.usageDays ? numberFormat(v) : "-"),
    },
  ];

  /** ยอดรวมทั้งฟลีตของทุกคอลัมน์เงิน */
  const sum = (key: keyof TcoRow) =>
    data.reduce((s, r) => s + (r[key] as number), 0);

  return (
    <Card
      title="ต้นทุนรวมต่อคัน (TCO)"
      size="small"
      extra={<ExportCostExcel data={data} rangeLabel={rangeLabel} />}
    >
      <Table<TcoRow>
        rowKey="carId"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <strong>รวมทั้งฟลีต ({numberFormat(data.length)} คัน)</strong>
              </Table.Summary.Cell>
              {(
                ["fuel", "maintenance", "insurance", "act", "tax", "total"] as const
              ).map((key, i) => (
                <Table.Summary.Cell key={key} index={2 + i} align="right">
                  <strong>{numberFormat(sum(key))}</strong>
                </Table.Summary.Cell>
              ))}
              <Table.Summary.Cell index={8} align="center">
                <strong>{numberFormat(sum("repairCount"))}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="center">
                <strong>{numberFormat(sum("usageDays"))}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={10} align="right">
                -
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default TcoTable;
