"use client";
import React from "react";
import { Descriptions, Empty, Tag } from "antd";
import { FileOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { MaCarFile, MaCarType } from "../../../../common";
import { macarFileUrl } from "../../../../common/macar-file";
import { numberWithCommas } from "@/app/utils/format";

export interface CarInfoPanelProps {
  car: MaCarType;
}

/**
 * แท็บ "ข้อมูลอื่น ๆ" — สรุปข้อมูล Fleet Card และไฟล์แนบของรถ (อ่าน/ดาวน์โหลด)
 * @param car ข้อมูลรถ
 */
const CarInfoPanel: React.FC<CarInfoPanelProps> = ({ car }): React.ReactElement => {
  const files: MaCarFile[] = car.maCarFiles ?? [];
  const hasFleetCard = car.fuelCardStatus === "active";

  /** ดาวน์โหลดไฟล์แนบของรถจาก MinIO (ใช้ชื่อไฟล์เดิมตอนดาวน์โหลด) */
  const downloadFile = (file: MaCarFile) => {
    const url = macarFileUrl(
      file.filePath,
      file.name ?? file.fileName,
      "attachment",
    );
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Fleet Card */}
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

      {/* ไฟล์แนบ */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-3 pb-1 border-b border-green-200">
          ไฟล์แนบ ({files.length})
        </h3>
        {files.length === 0 ? (
          <Empty description="ไม่มีไฟล์แนบ" />
        ) : (
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => downloadFile(file)}
                className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileOutlined className="text-blue-600 text-lg" />
                </div>
                <span className="text-sm text-gray-800 group-hover:text-blue-600 truncate">
                  {file.name ?? file.fileName ?? "ไฟล์แนบ"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarInfoPanel;
