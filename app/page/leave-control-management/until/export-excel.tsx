import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";
import { ITypeDataLeave } from "../common/index";
import { ExcelIcon } from "@/components/icon";
import dayjs from "dayjs";

interface ExportDataLeaveProps {
  data: ITypeDataLeave[];
}

const ExportDataLeaveAll: React.FC<ExportDataLeaveProps> = ({ data }) => {
  const handleOnExport = () => {
    const transdata = data.map((dataItem) => ({
      fuulname: `${dataItem.firstName} ${dataItem.lastName}`,
      position: dataItem.position,
      typeName: dataItem.typeName,
      rangeDate: `${dayjs(dataItem.startDate).format("DD/MM/YYYY")} ถึง ${dayjs(dataItem.endDate).format("DD/MM/YYYY")}`,
      status:
        dataItem.status === "waitting"
          ? "รอการอนุมัติ"
          : dataItem.status === "cancel"
          ? "ยกเลิก"
          : dataItem.status === "approved"
          ? "อนุมัติ"
          : "UNKNOWN",
      userApproved: dataItem.userApproved ?? "-",
      approvedDate: dataItem.approvedDate ? dayjs(dataItem.approvedDate).format("DD/MM/YYYY") : "-",
      detail: dataItem.detail,
    }));

    const customHeader = [["ชื่อ - นามสกุล", "ตำแหน่ง", "ประเภทการลา", "วันที่ลา", "สถานะ", "ผู้อนุมัติ", "วันที่อนุมัติ", "รายละเอียด"]];
    const dataArray = transdata.map((item) => Object.values(item));
    const result = [...customHeader, ...dataArray];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(result);

    const colWidths = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];

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
