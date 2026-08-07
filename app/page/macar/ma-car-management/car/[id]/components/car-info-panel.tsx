"use client";
import React from "react";
import { Descriptions, Tag } from "antd";
import dayjs from "dayjs";
import { MaCarType } from "../../../../common";
import { numberWithCommas } from "@/app/utils/format";

export interface CarInfoPanelProps {
  car: MaCarType;
}

/**
 * แท็บ "ข้อมูลอื่น ๆ" — สรุปข้อมูล Fleet Card ของรถ
 * (ไฟล์แนบย้ายไปอยู่แท็บ "ไฟล์แนบ" ที่ car-files-panel.tsx แล้ว)
 * @param car ข้อมูลรถ
 */
const CarInfoPanel: React.FC<CarInfoPanelProps> = ({ car }): React.ReactElement => {
  const hasFleetCard = car.fuelCardStatus === "active";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-3 pb-1 border-b border-blue-200">
          Fleet Card
        </h3>
        <Descriptions
          column={{ xs: 1, md: 2 }}
          size="small"
          bordered
          items={[
            {
              key: "status",
              label: "สถานะ",
              children: hasFleetCard ? (
                <Tag color="green">ใช้งาน</Tag>
              ) : (
                <Tag color="red">ไม่มี Fleet Card</Tag>
              ),
            },
            {
              key: "number",
              label: "หมายเลขบัตร",
              children: car.fuelCardNumber || "-",
            },
            {
              key: "limit",
              label: "วงเงินรายเดือน",
              children: hasFleetCard ? numberWithCommas(car.fuelMonthlyLimit ?? 0) : "-",
            },
            {
              key: "remaining",
              label: "คงเหลือเดือนนี้",
              children: hasFleetCard
                ? numberWithCommas(car.fuelMonthlyRemaining ?? 0)
                : "-",
            },
            {
              key: "resetDay",
              label: "วันรีเซ็ตวงเงิน",
              children: car.fuelResetDayOfMonth ? `วันที่ ${car.fuelResetDayOfMonth}` : "-",
            },
            {
              key: "expired",
              label: "วันหมดอายุบัตร",
              children: car.fuelCardExpiredDate
                ? dayjs(car.fuelCardExpiredDate).format("DD/MM/YYYY")
                : "-",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default CarInfoPanel;
