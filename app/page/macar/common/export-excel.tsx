import React from "react";
import * as XLSX from "xlsx";
import { Button, TablePaginationConfig } from "antd";
import { MaCarBookType, dataMaCarbook } from "./index";
import { ExcelIcon } from "@/components/icon";
import dayjs from "dayjs";

interface ShareMaCarBookProps {
  data: MaCarBookType[];
  total: number;
  pagination: TablePaginationConfig;
}

const ShareMaCarBook: React.FC<ShareMaCarBookProps> = ({ data, pagination, total }) => {
  const handleOnExport = () => {
    const transdata = data
      .filter((e) => e.carBookApprovedStatus !== "holiday")
      .map((dataItem, index) => ({
        ลำดับ: total - index,
        ชื่อรถ: dataItem.carName,
        วันที่เริ่มจอง: `${dayjs(dataItem.carBookStartDate).format("DD/MM/YYYY , HH:mm")} น.`,
        วันที่สิ้นสุดการจอง: `${dayjs(dataItem.carBookEndDate).format("DD/MM/YYYY , HH:mm")} น.`,
        ชื่อผู้จอง: dataItem.createdByName,
        สถานะ:
          dataItem.carBookApprovedStatus === "Process"
            ? "กำลังรออนุมัติ"
            : dataItem.carBookApprovedStatus === "Cancel"
            ? "ยกเลิก"
            : dataItem.carBookApprovedStatus === "Approve"
            ? "อนุมัติแล้ว"
            : dataItem.carBookApprovedStatus === "DisapProved"
            ? "ไม่อนุมัติ"
            : dataItem.carBookApprovedStatus === "Return"
            ? "แจ้งคืนรถแล้ว"
            : "Unknown Status",
        ผู้อนุมัติ: dataItem.carBookApprovedByName,
        รายละเอียด: dataItem.detail,
      }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transdata);
    const colWidths = [{ wch: 10 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 40 }];

    worksheet["!cols"] = colWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, "ข้อมูลการจองรถยนต์");
    XLSX.writeFile(workbook, `ข้อมูลการจองรถยนต์${dayjs(new Date()).format("DD/MM/YY")}.xlsx`);
  };

  return (
    <Button type="default" onClick={handleOnExport} icon={<ExcelIcon width="1.5rem" height="1.5rem" />}>
      Export Excel
    </Button>
  );
};

export default ShareMaCarBook;
