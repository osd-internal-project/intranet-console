"use client";
import React from "react";
import { Card } from "antd";
import {
  CarOutlined,
  DollarOutlined,
  FileExclamationOutlined,
  ScheduleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { numberFormat } from "@/app/utils";
import { DashboardKpis } from "../services/dashboard.service";

const Tile: React.FC<{
  title: string;
  value: string;
  suffix?: string;
  hint?: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, suffix, hint, icon, color }) => (
  <Card size="small" className="h-full">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-semibold mt-1">
          {value}
          {suffix ? <span className="text-base font-normal"> {suffix}</span> : null}
        </div>
        {hint ? <div className="text-xs text-gray-400 mt-1">{hint}</div> : null}
      </div>
      <div
        className="flex items-center justify-center rounded-lg"
        style={{ width: 40, height: 40, background: `${color}1a`, color }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

/** แถว KPI ของแดชบอร์ด */
const KpiTiles: React.FC<{ kpis: DashboardKpis }> = ({ kpis }) => {
  const items = [
    {
      title: "การจองทั้งหมด",
      value: numberFormat(kpis.totalBookings),
      suffix: "ครั้ง",
      hint: `อนุมัติ ${kpis.approvedRate}%`,
      icon: <ScheduleOutlined />,
      color: "#1677ff",
    },
    {
      title: "อัตราการใช้รถ",
      value: `${kpis.utilization}`,
      suffix: "%",
      hint: `รถใช้งาน ${numberFormat(kpis.activeCars)} คัน`,
      icon: <CarOutlined />,
      color: "#52c41a",
    },
    {
      title: "ค่าน้ำมันรวม",
      value: numberFormat(kpis.fuelSpend),
      suffix: "บาท",
      icon: <DollarOutlined />,
      color: "#faad14",
    },
    {
      title: "ค่าบำรุงรักษารวม",
      value: numberFormat(kpis.maintenanceSpend),
      suffix: "บาท",
      icon: <ToolOutlined />,
      color: "#722ed1",
    },
    {
      title: "เอกสารใกล้หมดอายุ",
      value: numberFormat(kpis.docExpiringSoon),
      suffix: "ฉบับ",
      hint: "ภายใน 60 วัน",
      icon: <FileExclamationOutlined />,
      color: "#f5222d",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {items.map((it) => (
        <Tile {...it} key={it.title} />
      ))}
    </div>
  );
};

export default KpiTiles;
