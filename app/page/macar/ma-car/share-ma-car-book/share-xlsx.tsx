import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";
import { MaCarBookType } from "../../common/index";
import { ExcelIcon } from "@/components/icon";

interface ShareMaCarBookProps {
  data: MaCarBookType[];
}

const ShareMaCarBook: React.FC<ShareMaCarBookProps> = ({ data }) => {
  const handleOnExport = () => {
    const transdata = data.map((dataItem) => ({
      ชื่อรถ: dataItem.carName,
      ชื่อผู้จอง: dataItem.createdByName,
      วันที่เริ่มจอง: new Date(dataItem.carBookStartDate).toLocaleDateString(),
      วันที่สิ้นสุดการจอง: new Date(
        dataItem.carBookEndDate
      ).toLocaleDateString(),
      เวลาที่เริ่มจอง: new Date(dataItem.carBookStartDate).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      ),
      เวลาที่สิ้นสุดการจอง: new Date(
        dataItem.carBookEndDate
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      สถานะ: dataItem.carBookApprovedStatus,
      ผู้อนุมัติ: dataItem.carBookApprovedByName,
      รายละเอียด: dataItem.detail,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transdata);

    const colWidths = [
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
    ];

    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "การจองรถ");
    XLSX.writeFile(workbook, "การจองรถ.xlsx");
  };

  return (
    <Button
      type="text"
      onClick={handleOnExport}
      style={{
        marginRight: "8px",
        marginTop: "10px",
        marginBottom: "10px",
        border: "none",
        backgroundColor: "transparent",
        color: "inherit",
        padding: 0,
      }}
      icon={<ExcelIcon width="1.5rem" height="1.5rem" />}
    >
      Export Excel
    </Button>
  );
};

export default ShareMaCarBook;
