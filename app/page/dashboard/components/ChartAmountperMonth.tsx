"use client";
import { Card, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
export interface props {
  amountPerMonthData: any[];
}
export const ChartAmountperMonth: React.FC<props> = ({ amountPerMonthData }): React.ReactElement => {
  const [data, setData] = useState<any[]>([]);
  const textMonth = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ษ.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  useEffect(() => {
    fetchData();
  }, [amountPerMonthData]);
  const fetchData = () => {
    if (amountPerMonthData) {
      const chart = amountPerMonthData.map((data: any) => ({
        ...data,
        textMonth: textMonth[data.month - 1],
      }));
      setData(chart);
    }
  };

  const TriangleBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };
  const getPath = (x: number, y: number, width: number, height: number) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };
  return (
    <div>
      <Card style={{ width: "100%" }}>
        <Typography style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>{`สถิติค่าใช้จ่ายการรับ-จ่ายรายเดือน`}</Typography>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <div style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width={500} height={300} data={data}>
                  <CartesianGrid strokeDasharray="2 3" />
                  <XAxis dataKey="textMonth" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar maxBarSize={15} dataKey="recipt" fill="#0054B9" />
                  <Bar maxBarSize={15} dataKey="pay" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
