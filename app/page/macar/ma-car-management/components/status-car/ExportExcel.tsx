import React from "react";
import * as XLSX from "xlsx";
import { FileExcelFilled } from "@ant-design/icons";
import { MaCar } from "./WarpupmaCar";

interface ExportExcelProps {
  datamacar: any[];
}

const ExportExcel: React.FC<ExportExcelProps> = ({ datamacar }) => {
  const handleExport = () => {
    const transdata = datamacar.map((dataItem) => {
      return {
        ลำดับที่: dataItem.key,
        เลขรถ: dataItem.carId ? dataItem.carId : "Null",
        ชื่อรถ: dataItem.carName,
        เลขไมล์: dataItem.wrapupMiles,
        ประเภทตรวจสภาพ: dataItem.typeName,
        สถานที่เช็คสภาพ: dataItem.vender,
        รายละเอียดการตรวจ: dataItem.detail,
        ราคา: dataItem.cost,
        วันที่ระบุ: new Date(dataItem.dateStart).toLocaleString(),
        วันตรวจสภาพ: new Date(dataItem.dateEnd).toLocaleString(),
        หมายเหตุ: dataItem.remark,
        สถานะการตรวจเช็ค: dataItem.status ? "รอการเช็ค" : "เช็คแล้ว",
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
      topLeftCell: "A1",
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
      { wpx: 90 },
      { wpx: 180 },
      { wpx: 180 },
      { wpx: 115 },
      { wpx: 130 },
    ];

    worksheet["!cols"] = columnWidths;

    Object.keys(worksheet).forEach((key) => {
      if (key[0] !== "!") {
        if (!worksheet[key].s) worksheet[key].s = {};
        worksheet[key].s.alignment = {
          horizontal: "center",
          vertical: "center",
        };
      }
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataExport.xlsx");
  };

  return (
    <a onClick={handleExport} style={{ color: "black" }}>
      <FileExcelFilled /> Export Excel
    </a>
  );
};

export default ExportExcel;
