import React from "react";
import * as XLSX from "xlsx";
import { FileExcelFilled } from "@ant-design/icons";
import { Button } from "antd";

interface ExportExcelProps {
  datamacartype: any[];
}

const ExportExcel: React.FC<ExportExcelProps> = ({ datamacartype }) => {
  const handleExport = () => {
    const transdata = datamacartype.map((datadic) => {
      return {
        ลำดับ: datadic.key,
        ประเภทการตรวตสภาพ: datadic.typeName,
        รายละเอียดการตรวตสภาพ: datadic.detail,
        ประเภทตรวจสภาพ: datadic.createdByName,
        "วันที่ระบุ": new Date(
          datadic.createdAt
        )
          .toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(",", ""),
        สถานะ: datadic.status ? "เปิดการมอง" : "ปิดการมอง",
      };
    });

    const chunkSize = 10;
    const transdataWithPageInfo: any[] = [];

    for (let i = 0; i < transdata.length; i += chunkSize) {
      const pageNumber = i / chunkSize + 1;
      transdataWithPageInfo.push(...transdata.slice(i, i + chunkSize));
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transdataWithPageInfo);

    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    worksheet["!freezePane"] = {
      ySplit: 1,
      topLeftCell: "A2",
      activePane: "bottomLeft",
      state: "frozen",
    };
    worksheet["!ref"] = XLSX.utils.encode_range(range);

    const columnWidths = [
      { wpx: 50 },
      { wpx: 365 },
      { wpx: 235 },
      { wpx: 60 },
      { wpx: 150 },
      { wpx: 200 },
      { wpx: 320 },
    ];

    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataMacartpye.xlsx");
  };

  return (
    <a>
      <Button onClick={handleExport} style={{ color: "black" }}>
        <FileExcelFilled /> Download data
      </Button>
    </a>
  );
};

export default ExportExcel;
