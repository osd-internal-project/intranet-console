"use client";
import React from "react";
import { Alert, Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { numberFormat } from "@/app/utils";
import {
  DOC_TYPE_LABEL,
  ForecastItem,
  RenewalForecast,
} from "../services/report.service";
import { ForecastChart } from "./cost-charts";

/** จำนวนวันก่อนหมดอายุที่ถือว่าเร่งด่วน — ตรงกับ WARNING_DAYS ฝั่ง backend */
const WARNING_DAYS = 30;

/**
 * ป้ายสถานะของงวดที่จะครบกำหนด
 * @param item รายการประมาณการ 1 รายการ
 */
const ExpiryTag: React.FC<{ item: ForecastItem }> = ({ item }) => {
  const days = dayjs(item.expireDate)
    .startOf("day")
    .diff(dayjs().startOf("day"), "day");
  if (item.overdue) return <Tag color="red">เกินกำหนด {Math.abs(days)} วัน</Tag>;
  if (days <= WARNING_DAYS) return <Tag color="orange">อีก {days} วัน</Tag>;
  return <Tag color="green">อีก {days} วัน</Tag>;
};

/** การ์ดประมาณการค่าต่อเอกสาร 12 เดือนข้างหน้า (ใช้เบี้ยงวดล่าสุดเป็นตัวประมาณ) */
const RenewalForecastCard: React.FC<{
  data: RenewalForecast;
  loading?: boolean;
}> = ({ data, loading }) => {
  const columns: ColumnsType<ForecastItem> = [
    {
      title: "รถ",
      dataIndex: "carName",
      key: "carName",
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
      title: "ประเภทเอกสาร",
      dataIndex: "docType",
      key: "docType",
      render: (v: string) => DOC_TYPE_LABEL[v] ?? v,
    },
    {
      title: "วันหมดอายุ",
      dataIndex: "expireDate",
      key: "expireDate",
      sorter: (a, b) =>
        dayjs(a.expireDate).valueOf() - dayjs(b.expireDate).valueOf(),
      render: (v: string) => dayjs(v).format("DD/MM/YYYY"),
    },
    {
      title: "สถานะ",
      key: "status",
      align: "center",
      render: (_, r) => <ExpiryTag item={r} />,
    },
    {
      title: "เบี้ย/ค่าธรรมเนียมงวดล่าสุด (฿)",
      dataIndex: "lastCost",
      key: "lastCost",
      align: "right",
      sorter: (a, b) => a.lastCost - b.lastCost,
      render: (v: number) => numberFormat(v),
    },
    {
      title: "ผู้ให้บริการ",
      dataIndex: "vender",
      key: "vender",
      render: (v: string | null) => v || "-",
    },
  ];

  return (
    <Card title="ประมาณการค่าต่อเอกสาร 12 เดือนข้างหน้า" size="small">
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Alert
            type="info"
            showIcon
            message={`ประมาณการรวม ${numberFormat(data.grandTotal)} บาท`}
            description={`จาก ${numberFormat(
              data.items.length,
            )} งวดที่จะครบกำหนด — ใช้เบี้ย/ค่าธรรมเนียมงวดล่าสุดเป็นตัวประมาณ`}
          />
          {data.missing.length ? (
            <Alert
              type="warning"
              showIcon
              message={`ไม่มีข้อมูลเอกสาร ${numberFormat(
                data.missing.length,
              )} รายการ`}
              description={`ประมาณการไม่ครอบคลุม: ${data.missing
                .slice(0, 5)
                .map((m) => `${m.carName} (${DOC_TYPE_LABEL[m.docType] ?? m.docType})`)
                .join(", ")}${data.missing.length > 5 ? " และอื่น ๆ" : ""}`}
            />
          ) : (
            <Alert
              type="success"
              showIcon
              message="ข้อมูลเอกสารครบทุกคัน"
              description="รถที่ใช้งานทุกคันมีข้อมูลประกัน พ.ร.บ. และภาษีครบถ้วน"
            />
          )}
        </div>

        <ForecastChart data={data.months} loading={loading} />

        <Table<ForecastItem>
          rowKey={(r) => `${r.carId}-${r.docType}`}
          size="small"
          loading={loading}
          columns={columns}
          dataSource={data.items}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </Card>
  );
};

export default RenewalForecastCard;
