import { Card, Empty, Spin } from "antd";
import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { numberFormat } from "@/app/utils";
import { FuelChartBucket } from "../services/report-fuel.service";

export interface props {
  data: FuelChartBucket[];
  loading: boolean;
}

/**
 * Bar chart of monthly fuel-usage amount (last 6 months, `use` only).
 */
const ReportFuelCardChart: React.FC<props> = ({ data, loading }): React.ReactElement => {
  const hasData = data.some((bucket) => bucket.amount > 0);

  return (
    <Card title="ยอดการเติมน้ำมันย้อนหลัง 6 เดือน" size="small" style={{ marginBottom: 16 }}>
      <Spin spinning={loading}>
        <div style={{ width: "100%", height: 300 }}>
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value: number) => numberFormat(value)} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`${numberFormat(value)} บาท`, "ยอดเติม"]} />
                <Bar dataKey="amount" name="ยอดเติม" fill="#25B9EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Empty description="ไม่มีข้อมูลการเติมน้ำมัน" />
            </div>
          )}
        </div>
      </Spin>
    </Card>
  );
};

export default ReportFuelCardChart;
