"use client";
import React from "react";
import { Card, Empty, Spin } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { numberFormat } from "@/app/utils";

/** จานสีสำหรับกราฟวงกลม/แท่ง */
export const PALETTE = [
  "#1677ff",
  "#25B9EB",
  "#52c41a",
  "#faad14",
  "#f5222d",
  "#722ed1",
  "#13c2c2",
  "#eb2f96",
];

interface HBarDatum {
  label: string;
  value: number;
  days?: number;
}

/** การ์ดกราฟแท่งแนวนอน (อันดับ) — ใช้ซ้ำสำหรับ ผู้จอง / รถ / ปลายทาง */
export const HBarCard: React.FC<{
  title: string;
  data: HBarDatum[];
  loading?: boolean;
  color?: string;
  valueUnit?: string;
  showDays?: boolean;
}> = ({ title, data, loading, color = "#1677ff", valueUnit = "ครั้ง", showDays }) => (
  <Card title={title} size="small" className="h-full">
    <Spin spinning={!!loading}>
      <div style={{ width: "100%", height: Math.max(240, data.length * 34) }}>
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, _n, item: any) => {
                  const d = item?.payload?.days;
                  return [
                    `${numberFormat(value)} ${valueUnit}${
                      showDays && d != null ? ` · ${numberFormat(d)} วัน` : ""
                    }`,
                    "",
                  ];
                }}
                labelFormatter={(l) => l}
              />
              <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyBox />
        )}
      </div>
    </Spin>
  </Card>
);

/** การ์ดกราฟวงกลม (donut) — ใช้ซ้ำสำหรับ สถานะ / องค์ประกอบฟลีต */
export const DonutCard: React.FC<{
  title: string;
  data: { name: string; value: number }[];
  loading?: boolean;
}> = ({ title, data, loading }) => (
  <Card title={title} size="small" className="h-full">
    <Spin spinning={!!loading}>
      <div style={{ width: "100%", height: 300 }}>
        {data.some((d) => d.value > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => numberFormat(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyBox />
        )}
      </div>
    </Spin>
  </Card>
);

/** การ์ดกราฟเส้น — แนวโน้มการจองรายเดือน */
export const TrendCard: React.FC<{
  title: string;
  data: { label: string; count: number }[];
  loading?: boolean;
}> = ({ title, data, loading }) => (
  <Card title={title} size="small" className="h-full">
    <Spin spinning={!!loading}>
      <div style={{ width: "100%", height: 300 }}>
        {data.some((d) => d.count > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip formatter={(v: number) => [`${numberFormat(v)} ครั้ง`, "การจอง"]} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1677ff"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyBox />
        )}
      </div>
    </Spin>
  </Card>
);

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
