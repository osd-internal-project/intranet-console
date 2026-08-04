"use client";
import React from "react";
import { Card, Tooltip } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CarOutlined,
  DollarOutlined,
  FileProtectOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { numberFormat } from "@/app/utils";
import { CostKpis } from "../services/report.service";

/**
 * ส่วนต่างเป็น % เทียบช่วงก่อนหน้า
 * @param current ค่าปัจจุบัน
 * @param previous ค่าช่วงก่อนหน้าที่ยาวเท่ากัน
 * @returns % การเปลี่ยนแปลง หรือ null ถ้าช่วงก่อนหน้าเป็น 0 (คำนวณ % ไม่ได้)
 */
const deltaPercent = (current: number, previous: number): number | null => {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
};

/** ป้ายส่วนต่าง — ค่าใช้จ่ายเพิ่ม = แดง, ลด = เขียว (ตรงข้ามกับ KPI รายได้) */
const DeltaHint: React.FC<{ current: number; previous: number }> = ({
  current,
  previous,
}) => {
  const delta = deltaPercent(current, previous);
  if (delta === null) {
    return <div className="text-xs text-gray-400 mt-1">ไม่มีข้อมูลช่วงก่อนหน้า</div>;
  }
  const up = delta > 0;
  const color = delta === 0 ? "#8c8c8c" : up ? "#f5222d" : "#52c41a";
  return (
    <Tooltip title={`ช่วงก่อนหน้า ${numberFormat(previous)} บาท`}>
      <div className="text-xs mt-1" style={{ color }}>
        {delta === 0 ? null : up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
        {Math.abs(delta)}% เทียบช่วงก่อนหน้า
      </div>
    </Tooltip>
  );
};

const Tile: React.FC<{
  title: string;
  value: string;
  suffix?: string;
  hint?: React.ReactNode;
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
        {hint}
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

/** แถว KPI ค่าใช้จ่ายฟลีต พร้อมส่วนต่างเทียบช่วงก่อนหน้า */
const CostKpiTiles: React.FC<{
  kpis: CostKpis;
  previousKpis: CostKpis;
  activeCars: number;
}> = ({ kpis, previousKpis, activeCars }) => {
  const items = [
    {
      title: "ค่าใช้จ่ายรวม",
      value: numberFormat(kpis.total),
      suffix: "บาท",
      hint: <DeltaHint current={kpis.total} previous={previousKpis.total} />,
      icon: <WalletOutlined />,
      color: "#f5222d",
    },
    {
      title: "ค่าน้ำมัน",
      value: numberFormat(kpis.fuel),
      suffix: "บาท",
      hint: <DeltaHint current={kpis.fuel} previous={previousKpis.fuel} />,
      icon: <DollarOutlined />,
      color: "#faad14",
    },
    {
      title: "ค่าบำรุงรักษา",
      value: numberFormat(kpis.maintenance),
      suffix: "บาท",
      hint: (
        <DeltaHint
          current={kpis.maintenance}
          previous={previousKpis.maintenance}
        />
      ),
      icon: <ToolOutlined />,
      color: "#722ed1",
    },
    {
      title: "ค่าประกัน + พ.ร.บ.",
      value: numberFormat(kpis.insuranceAct),
      suffix: "บาท",
      hint: (
        <DeltaHint
          current={kpis.insuranceAct}
          previous={previousKpis.insuranceAct}
        />
      ),
      icon: <SafetyCertificateOutlined />,
      color: "#1677ff",
    },
    {
      title: "ค่าภาษี",
      value: numberFormat(kpis.tax),
      suffix: "บาท",
      hint: <DeltaHint current={kpis.tax} previous={previousKpis.tax} />,
      icon: <FileProtectOutlined />,
      color: "#52c41a",
    },
    {
      title: "เฉลี่ยต่อคันต่อเดือน",
      value: numberFormat(kpis.avgPerCarPerMonth),
      suffix: "บาท",
      hint: (
        <div className="text-xs text-gray-400 mt-1">
          จากรถใช้งาน {numberFormat(activeCars)} คัน
        </div>
      ),
      icon: <CarOutlined />,
      color: "#13c2c2",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {items.map((it) => (
        <Tile {...it} key={it.title} />
      ))}
    </div>
  );
};

export default CostKpiTiles;
