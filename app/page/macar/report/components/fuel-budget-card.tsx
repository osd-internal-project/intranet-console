"use client";
import React, { useMemo } from "react";
import { Alert, Card, DatePicker, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import { numberFormat } from "@/app/utils";
import { FuelBudget, FuelBudgetRow } from "../services/report.service";
import { FuelBudgetChart } from "./cost-charts";

/** จำนวนคันสูงสุดที่แสดงในกราฟ — มากกว่านี้กราฟจะสูงจนอ่านยาก (ตารางยังแสดงครบ) */
const CHART_LIMIT = 15;

/** การ์ดเปรียบเทียบวงเงินบัตรน้ำมันกับการใช้จริง รายเดือน */
const FuelBudgetCard: React.FC<{
  data: FuelBudget;
  loading?: boolean;
  month: Dayjs;
  onMonthChange: (m: Dayjs) => void;
}> = ({ data, loading, month, onMonthChange }) => {
  // กราฟเรียงตามยอดใช้จริงมากสุด เพื่อให้คันที่น่าสนใจอยู่บน
  const chartData = useMemo(
    () => [...data.rows].sort((a, b) => b.actual - a.actual).slice(0, CHART_LIMIT),
    [data.rows],
  );

  const columns: ColumnsType<FuelBudgetRow> = [
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
      title: "วงเงิน (฿)",
      dataIndex: "limit",
      key: "limit",
      align: "right",
      sorter: (a, b) => a.limit - b.limit,
      render: (v: number) => numberFormat(v),
    },
    {
      title: "ใช้จริง (฿)",
      dataIndex: "actual",
      key: "actual",
      align: "right",
      sorter: (a, b) => a.actual - b.actual,
      render: (v: number) => numberFormat(v),
    },
    {
      title: "ส่วนต่าง (฿)",
      dataIndex: "variance",
      key: "variance",
      align: "right",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.variance - b.variance,
      // บวก = เกินวงเงิน (แดง), ลบ = เหลือวงเงิน (เขียว)
      render: (v: number) => (
        <span style={{ color: v > 0 ? "#f5222d" : "#52c41a" }}>
          {v > 0 ? "+" : ""}
          {numberFormat(v)}
        </span>
      ),
    },
    {
      title: "ใช้ไป",
      dataIndex: "usedPercent",
      key: "usedPercent",
      align: "center",
      sorter: (a, b) => a.usedPercent - b.usedPercent,
      render: (v: number, r) => (
        <Tag color={r.overBudget ? "red" : v >= 80 ? "orange" : "green"}>{v}%</Tag>
      ),
    },
  ];

  return (
    <Card
      title="วงเงินบัตรน้ำมัน เทียบ การใช้จริง"
      size="small"
      extra={
        <DatePicker
          picker="month"
          value={month}
          allowClear={false}
          format="MM/YYYY"
          onChange={(v) => v && onMonthChange(v)}
        />
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Alert
            type="info"
            showIcon
            message={`วงเงินรวม ${numberFormat(data.totalLimit)} บาท`}
            description={`ใช้จริงรวม ${numberFormat(data.totalActual)} บาท`}
          />
          <Alert
            type={data.overBudgetCount ? "error" : "success"}
            showIcon
            message={`ใช้เกินวงเงิน ${numberFormat(data.overBudgetCount)} คัน`}
            description={
              data.overBudgetCount
                ? "ดูรายละเอียดในตารางด้านล่าง"
                : "ทุกคันอยู่ในวงเงิน"
            }
          />
          <Alert
            type="warning"
            showIcon
            message={`ไม่ได้เทียบงบ ${numberFormat(data.excludedCount)} คัน`}
            description="รถที่ไม่มีบัตรน้ำมันหรือยังไม่ได้ตั้งวงเงิน"
          />
        </div>

        {chartData.length ? (
          <FuelBudgetChart data={chartData} loading={loading} />
        ) : null}

        <Table<FuelBudgetRow>
          rowKey="carId"
          size="small"
          loading={loading}
          columns={columns}
          dataSource={data.rows}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </Card>
  );
};

export default FuelBudgetCard;
