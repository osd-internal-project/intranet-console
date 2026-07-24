"use client";
import React from "react";
import { Card, Progress, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { numberFormat } from "@/app/utils";
import { PerVehicleRow } from "../services/dashboard.service";

/** ตารางสรุปการใช้งาน + ค่าใช้จ่ายรายคัน (มุมมองผู้บริหาร) */
const PerVehicleTable: React.FC<{
  data: PerVehicleRow[];
  loading?: boolean;
}> = ({ data, loading }) => {
  const columns: ColumnsType<PerVehicleRow> = [
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
      title: "จำนวนจอง",
      dataIndex: "bookings",
      key: "bookings",
      align: "center",
      sorter: (a, b) => a.bookings - b.bookings,
      render: (v: number) => numberFormat(v),
    },
    {
      title: "วันใช้งาน",
      dataIndex: "days",
      key: "days",
      align: "center",
      sorter: (a, b) => a.days - b.days,
      render: (v: number) => numberFormat(v),
    },
    {
      title: "อัตราการใช้",
      dataIndex: "utilization",
      key: "utilization",
      width: 140,
      sorter: (a, b) => a.utilization - b.utilization,
      render: (v: number) => <Progress percent={v} size="small" />,
    },
    {
      title: "ค่าน้ำมัน (฿)",
      dataIndex: "fuelCost",
      key: "fuelCost",
      align: "right",
      sorter: (a, b) => a.fuelCost - b.fuelCost,
      render: (v: number) => numberFormat(v),
    },
    {
      title: "ค่าบำรุงรักษา (฿)",
      dataIndex: "maintenanceCost",
      key: "maintenanceCost",
      align: "right",
      sorter: (a, b) => a.maintenanceCost - b.maintenanceCost,
      render: (v: number) => numberFormat(v),
    },
  ];

  return (
    <Card title="สรุปการใช้งาน + ค่าใช้จ่ายรายคัน" size="small">
      <Table<PerVehicleRow>
        rowKey="carId"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </Card>
  );
};

export default PerVehicleTable;
