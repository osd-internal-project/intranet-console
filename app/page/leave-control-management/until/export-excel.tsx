import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";
import { ITypeDataLeave } from "../common/index";
import { ExcelIcon } from "@/components/icon";

interface ExportDataLeaveProps {
  data: ITypeDataLeave[];
}

const ExportDataLeaveAll: React.FC<ExportDataLeaveProps> = ({ data }) => {
  const handleOnExport = () => {
    const transdata = data.map((dataItem) => ({
      firstName: dataItem.firstName,
      lastName: dataItem.lastName,
      position: dataItem.position,
      typeName: dataItem.typeName,
      startDate: new Date(dataItem.startDate).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      endDate: new Date(dataItem.endDate).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      status: dataItem.status,
      userApproved: dataItem.userApproved ?? "-",
      approvedDate: dataItem.approvedDate
        ? new Date(dataItem.approvedDate).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "-",
      detail: dataItem.detail,
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(transdata);

    const colWidths = [
      { wch: 10 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "การลา");
    XLSX.writeFile(workbook, "ข้อมูลการลา.xlsx");
  };

  return (
    <Button type="default" onClick={handleOnExport} icon={<ExcelIcon width="1.5rem" height="1.5rem" />}>
      {`ดาวน์โหลดไฟล์`}
    </Button>
  );
};

export default ExportDataLeaveAll;
