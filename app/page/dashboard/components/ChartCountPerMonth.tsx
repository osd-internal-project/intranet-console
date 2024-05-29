"use client";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts";
export interface props {
  countPerMonthData: any[];
}
export const ChartCountPerMonth: React.FC<props> = ({ countPerMonthData }): React.ReactElement => {
  const [data, setData] = useState<any[]>([]);
  const textMonth = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ษ.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  useEffect(() => {
    fetchData();
  }, [countPerMonthData]);
  const fetchData = () => {
    if (countPerMonthData) {
      const chart = countPerMonthData.map((data: any) => ({
        ...data,
        textMonth: textMonth[data.month - 1],
      }));
      setData(chart);
    }
  };
  return (
    <div>
      <Card style={{ width: "100%" }}>
        <Typography style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>{`สถิติจำนวนการรับ-จ่ายรายเดือน`}</Typography>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <div style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="textMonth" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="recipt" strokeWidth={3} stroke="#0054B9" fill="#ccdcf1" />
                  <Line type="monotone" dataKey="pay" strokeWidth={3} stroke="#F97316" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
