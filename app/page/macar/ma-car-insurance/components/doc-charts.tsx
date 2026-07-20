"use client";
import React from "react";
import { Card, Empty, Spin, Tabs } from "antd";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CarLite, DocChartData, DocType } from "../../common";
import { numberFormat } from "@/app/utils";
import DocDueCalendar from "./doc-due-calendar";

interface DocChartsProps {
  chart: DocChartData | null;
  loading: boolean;
  cars: CarLite[];
  onSelectDocument: (carId: string, docType: DocType) => void;
}

const MONTH_LABELS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

/** เส้นกราฟงบประมาณ — ซีรีส์เดียว ไม่ต้องมี legend เพราะหัวข้อบอกอยู่แล้ว */
const BUDGET_COLOR = "#1D4ED8";

const AXIS_TICK = { fontSize: 12, fill: "#64748b" };

export default function DocCharts({
  chart,
  loading,
  cars,
  onSelectDocument,
}: DocChartsProps) {
  if (loading) {
    return (
      <Card>
        <div className="flex justify-center py-16">
          <Spin />
        </div>
      </Card>
    );
  }

  if (!chart) {
    return (
      <Card>
        <Empty description="ไม่มีข้อมูล" />
      </Card>
    );
  }

  const budget = chart.budget.map((item) => ({
    ...item,
    label: MONTH_LABELS[item.month - 1],
  }));
  const hasBudget = budget.some((item) => item.amount > 0);

  const budgetTab = (
    <div>
      <div className="text-xs text-gray-500 mb-3">
        ค่าใช้จ่ายเอกสารที่ชำระจริงในแต่ละเดือนของปี {chart.year + 543} (คิดจาก &quot;วันที่ชำระ&quot;)
      </div>
      {!hasBudget ? (
        <Empty description="ยังไม่มีข้อมูลค่าใช้จ่ายในปีนี้ — กรอก 'วันที่ชำระ' เพื่อให้ขึ้นกราฟ" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={budget}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => numberFormat(value)}
            />
            <Tooltip
              formatter={(value: number) => [`${numberFormat(value)} บ.`, "ค่าใช้จ่าย"]}
              labelFormatter={(label) => `เดือน ${label}`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={BUDGET_COLOR}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  return (
    <Card className="mt-4">
      <Tabs
        items={[
          {
            key: "upcoming",
            label: "ปฏิทินครบกำหนด",
            children: (
              <DocDueCalendar
                months={chart.upcoming}
                cars={cars}
                onSelectDocument={onSelectDocument}
              />
            ),
          },
          { key: "budget", label: "งบประมาณรายเดือน", children: budgetTab },
        ]}
      />
    </Card>
  );
}
