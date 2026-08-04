"use client";
import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";
import { ExcelIcon } from "@/components/icon";
import dayjs from "dayjs";
import { TcoRow } from "../services/report.service";

interface ExportCostExcelProps {
  data: TcoRow[];
  /** ป้ายช่วงเวลาที่ใช้ตั้งชื่อไฟล์ เช่น 01/01/2026-31/12/2026 */
  rangeLabel: string;
}

/** ปุ่มส่งออกตาราง TCO เป็น Excel ให้ฝ่ายบัญชีไปทำ pivot ต่อ */
const ExportCostExcel: React.FC<ExportCostExcelProps> = ({ data, rangeLabel }) => {
  const handleOnExport = () => {
    const transdata = data.map((row, index) => ({
      ลำดับ: index + 1,
      ชื่อรถ: row.carName,
      ทะเบียนรถ: row.licensePlate ?? "-",
      ประเภทรถ: row.carType ?? "-",
      ค่าน้ำมัน: row.fuel,
      ค่าบำรุงรักษา: row.maintenance,
      ค่าประกันภัย: row.insurance,
      "ค่า พ.ร.บ.": row.act,
      ค่าภาษี: row.tax,
      รวมทั้งสิ้น: row.total,
      จำนวนครั้งที่ซ่อม: row.repairCount,
      วันใช้งาน: row.usageDays,
      // ไม่มีวันใช้งาน = หารไม่ได้ ปล่อยว่างแทนการใส่ 0 ที่อาจถูกเข้าใจผิด
      ค่าใช้จ่ายต่อวันใช้งาน: row.usageDays ? row.costPerUsageDay : "",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transdata);
    const colWidths = [
      { wch: 8 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 14 },
      { wch: 16 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 16 },
      { wch: 12 },
      { wch: 20 },
    ];

    worksheet["!cols"] = colWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, "ต้นทุนรวมต่อคัน");
    XLSX.writeFile(
      workbook,
      `รายงานค่าใช้จ่ายรถยนต์_${rangeLabel}_${dayjs().format("DDMMYY")}.xlsx`,
    );
  };

  return (
    <Button
      type="default"
      onClick={handleOnExport}
      disabled={!data.length}
      icon={<ExcelIcon width="1.5rem" height="1.5rem" />}
    >
      Export Excel
    </Button>
  );
};

export default ExportCostExcel;
