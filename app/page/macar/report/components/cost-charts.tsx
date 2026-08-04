"use client";
import React from "react";
import { Card, Empty, Spin } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { numberFormat } from "@/app/utils";
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  CostTrendRow,
  DOC_TYPE_LABEL,
  ForecastMonth,
  FuelBudgetRow,
} from "../services/report.service";

/** กล่องว่าง — รูปแบบเดียวกับแดชบอร์ดเดิม */
const EmptyBox = () => (
  <div
    style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Empty description="ไม่มีข้อมูล" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>
);

/** แกน/เส้นกริดร่วมของทุกกราฟในหน้ารายงาน */
const AXIS_TICK = { fontSize: 12 };
const moneyTooltip = (v: number, name: string) => [
  `${numberFormat(v)} บาท`,
  name,
];

/**
 * กราฟแท่งซ้อน — ค่าใช้จ่ายรายเดือนแยกหมวด (มุมมองผู้บริหาร)
 */
export const CostTrendCard: React.FC<{
  title: string;
  data: CostTrendRow[];
  loading?: boolean;
  /** ตัวควบคุมมุมขวาบนของการ์ด เช่น ตัวเลือกปี */
  extra?: React.ReactNode;
}> = ({ title, data, loading, extra }) => (
  <Card title={title} size="small" className="h-full" extra={extra}>
    <Spin spinning={!!loading}>
      <div style={{ width: "100%", height: 340 }}>
        {data.some((d) => d.total > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} tickFormatter={(v) => numberFormat(v)} />
              <Tooltip formatter={moneyTooltip} />
              <Legend />
              {CATEGORY_ORDER.map((c, i) => (
                <Bar
                  key={c}
                  dataKey={c}
                  name={CATEGORY_LABEL[c]}
                  stackId="cost"
                  fill={CATEGORY_COLOR[c]}
                  // มุมโค้งเฉพาะแท่งบนสุดของกอง
                  radius={
                    i === CATEGORY_ORDER.length - 1 ? [4, 4, 0, 0] : undefined
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyBox />
        )}
      </div>
    </Spin>
  </Card>
);

/**
 * กราฟแท่งคู่ — วงเงินบัตรน้ำมัน vs การใช้จริงรายคัน
 */
export const FuelBudgetChart: React.FC<{
  data: FuelBudgetRow[];
  loading?: boolean;
}> = ({ data, loading }) => (
  <Spin spinning={!!loading}>
    <div style={{ width: "100%", height: Math.max(280, data.length * 38) }}>
      {data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={AXIS_TICK}
              tickFormatter={(v) => numberFormat(v)}
            />
            <YAxis
              type="category"
              dataKey="carName"
              width={150}
              tick={AXIS_TICK}
            />
            <Tooltip formatter={moneyTooltip} />
            <Legend />
            <Bar dataKey="limit" name="วงเงิน" fill="#d9d9d9" radius={[0, 4, 4, 0]} />
            <Bar dataKey="actual" name="ใช้จริง" fill="#faad14" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyBox />
      )}
    </div>
  </Spin>
);

/**
 * กราฟแท่งซ้อน — ประมาณการค่าต่อเอกสาร 12 เดือนข้างหน้า แยกตามประเภทเอกสาร
 */
export const ForecastChart: React.FC<{
  data: ForecastMonth[];
  loading?: boolean;
}> = ({ data, loading }) => (
  <Spin spinning={!!loading}>
    <div style={{ width: "100%", height: 300 }}>
      {data.some((d) => d.total > 0) ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} tickFormatter={(v) => numberFormat(v)} />
            <Tooltip formatter={moneyTooltip} />
            <Legend />
            <Bar
              dataKey="insurance"
              name={DOC_TYPE_LABEL.insurance}
              stackId="doc"
              fill={CATEGORY_COLOR.insurance}
            />
            <Bar
              dataKey="act"
              name={DOC_TYPE_LABEL.act}
              stackId="doc"
              fill={CATEGORY_COLOR.act}
            />
            <Bar
              dataKey="tax"
              name={DOC_TYPE_LABEL.tax}
              stackId="doc"
              fill={CATEGORY_COLOR.tax}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyBox />
      )}
    </div>
  </Spin>
);
