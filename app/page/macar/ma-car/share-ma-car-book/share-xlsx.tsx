import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";

interface MaCarType {
  carName: string;
  detail: string;
  remark: string;
  status: string;
  createdByName: string;
  carBookStartDate: Date;
  carBookEndDate: Date;
  carBookApprovedByName?: string;
  carBookApprovedStatus: string;
}
interface ShareMaCarBookProps {
  data: MaCarType[];
}

const ShareMaCarBook: React.FC<ShareMaCarBookProps> = ({ data }) => {
  const handleOnExport = () => {
    const transdata = data.map((dataItem) => ({
      ชื่อรถ: dataItem.carName,
      ชื่อผู้จอง: dataItem.createdByName,
      วันที่เริ่มจอง: new Date(dataItem.carBookStartDate).toLocaleDateString(),
      วันที่สิ้ดสุดการจอง: new Date(
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
      เวลาที่สิ้ดสุดเริ่มจอง: new Date(
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "การจองรถ");
    XLSX.writeFile(workbook, "การจองรถ.xlsx");
  };

  return (
    <Button
      type="primary"
      onClick={handleOnExport}
      style={{ marginRight: "8px", marginTop: "10", marginBottom: "10" }}
    >
      To Excel
    </Button>
  );
};

export default ShareMaCarBook;
