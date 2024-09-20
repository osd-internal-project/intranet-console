import React from "react";
import * as XLSX from "xlsx";
import { FileExcelFilled } from "@ant-design/icons";
import { Button } from "antd";

interface ExportExcelProps {
  datamacar: any[];
}

const ExportExcel: React.FC<ExportExcelProps> = ({ datamacar }) => {
  const handleExport = () => {
    const transdata = datamacar.map((dataItem) => {
      const dateEndFormatted = dataItem.dateEnd
        ? new Date(dataItem.dateEnd).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "-";
      const dateStartFormatted = dataItem.dateStart
        ? new Date(dataItem.dateStart).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "-";

      return {
        ลำดับ: dataItem.key,
        เลขรถ: dataItem.carId ? dataItem.carId : "Null",
        ชื่อรถ: dataItem.carName,
        เลขไมล์ตรวจสภาพ: dataItem.wrapupMiles,
        ประเภทตรวจสภาพ: dataItem.typeName,
        สถานที่เช็คสภาพ: dataItem.vender,
        รายละเอียดการตรวจ: dataItem.detail,
        ราคา: dataItem.cost,
        วันที่ตรวจสภาพ: dateStartFormatted,
        วันตรวจสภาพครั้งถัดไป: dateEndFormatted,
        หมายเหตุ: dataItem.remark,
        สถานะการตรวจเช็ค:
          dataItem.status === true
            ? "เช็คแล้ว"
            : dataItem.status === false
            ? "ยกเลิกการเช็ค"
            : "รอตรวจสภาพ",
        "ชื่อ-นามสกุล": dataItem.createbyName,
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
      { wpx: 90 },
      { wpx: 180 },
      { wpx: 180 },
      { wpx: 115 },
      { wpx: 130 },
      { wpx: 130 },
    ];

    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataMacarwarpup.xlsx");
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
