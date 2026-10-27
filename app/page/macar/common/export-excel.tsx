import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, message } from "antd";
import { MaCarBookType } from "./index";
import { ExcelIcon } from "@/components/icon";
import dayjs from "dayjs";

interface ShareMaCarBookProps {
  /** ดึงทุกแถวที่ตรง filter ปัจจุบัน (ไม่ใช่แค่หน้าที่แสดง) */
  fetchAll: () => Promise<MaCarBookType[]>;
  /** หน้าจัดการ — เพิ่มคอลัมน์รายละเอียดการจอง/อนุมัติ/คืนรถ */
  detailed?: boolean;
  disabled?: boolean;
}

const statusLabel: Record<string, string> = {
  Process: "กำลังรออนุมัติ",
  Cancel: "ยกเลิก",
  Approve: "อนุมัติแล้ว",
  DisapProved: "ไม่อนุมัติ",
  Return: "แจ้งคืนรถแล้ว",
  Completed: "คืนรถสำเร็จ",
};

const formatDateTime = (date?: Date) => (date ? `${dayjs(date).format("DD/MM/YYYY , HH:mm")} น.` : "");

const ShareMaCarBook: React.FC<ShareMaCarBookProps> = ({ fetchAll, detailed, disabled }) => {
  const [exporting, setExporting] = useState(false);

  const handleOnExport = async () => {
    setExporting(true);
    try {
      const data = await fetchAll();
      const transdata = data.map((dataItem, index) => ({
        ลำดับ: data.length - index,
        ชื่อรถ: dataItem.carName,
        ...(detailed && { ทะเบียนรถ: dataItem.maCar?.licensePlate ?? "" }),
        วันที่เริ่มจอง: formatDateTime(dataItem.carBookStartDate),
        วันที่สิ้นสุดการจอง: formatDateTime(dataItem.carBookEndDate),
        ชื่อผู้จอง: dataItem.createdByName,
        สถานะ: statusLabel[dataItem.carBookApprovedStatus] ?? "Unknown Status",
        ผู้อนุมัติ: dataItem.carBookApprovedByName,
        รายละเอียด: dataItem.detail,
        ...(detailed && {
          หัวข้อ: dataItem.carBookTitle,
          สถานที่: dataItem.carBookPlace,
          จังหวัด: dataItem.carBookProvince,
          จำนวนผู้โดยสาร: dataItem.carBookUsers,
          วันที่อนุมัติ: formatDateTime(dataItem.carBookApprovedDate),
          หมายเหตุอนุมัติ: dataItem.remarkApproved,
          หมายเหตุยกเลิก: dataItem.remarkCancel,
          หมายเหตุ: dataItem.remark,
          ผู้รับคืน: dataItem.recipientName,
          วันที่คืนรถ: formatDateTime(dataItem.returnAt),
          // ไมล์ปัจจุบันของรถ — ไม่มีไมล์ต่อการจองใน schema
          เลขไมล์: dataItem.maCar?.carMile ?? "",
          ค่าน้ำมัน: dataItem.fuelTransaction ? Number(dataItem.fuelTransaction.amount) : "",
        }),
      }));
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(transdata);
      worksheet["!cols"] = Object.keys(transdata[0] ?? {}).map((key) => ({ wch: key === "ลำดับ" ? 10 : key === "รายละเอียด" ? 40 : 25 }));
      XLSX.utils.book_append_sheet(workbook, worksheet, "ข้อมูลการจองรถยนต์");
      XLSX.writeFile(workbook, `ข้อมูลการจองรถยนต์${dayjs().format("DD/MM/YY")}.xlsx`);
    } catch (error) {
      console.error("Export excel failed", error);
      message.error("Export Excel ไม่สำเร็จ");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button type="default" onClick={handleOnExport} loading={exporting} disabled={disabled} icon={<ExcelIcon width="1.5rem" height="1.5rem" />}>
      Export Excel
    </Button>
  );
};

export default ShareMaCarBook;
