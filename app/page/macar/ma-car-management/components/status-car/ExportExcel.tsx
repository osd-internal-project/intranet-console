import React from "react";
import * as XLSX from 'xlsx';
import { FileExcelFilled } from "@ant-design/icons";
import { log } from "console";
import { MaCar } from "./WarpupmaCar";

interface ExportExcelProps {
  // datatype: any[];
  datamacar: any[];
}

const ExportExcel: React.FC<ExportExcelProps> = ({ datamacar}) => {
    
    
    const handleExport = () => {
      const transdata = datamacar.map((dataItem) => {
        return {
          vender: dataItem.vender,
          typeName: dataItem.typeName,
          carName: dataItem.carName,
          wrapupMiles: dataItem.wrapupMiles,
          cost: dataItem.cost,
          dateStart: new Date(dataItem.dateStart),
          dateEnd: new Date(dataItem.dateEnd),
          remark: dataItem.remark,
        };
    
    // console.log(datamacar);
    
    // const transdata = datamacar.map((dataItem, index) => {
    //   // const macItem = datamacar[index] || {}; // หาก `datamacar` มีน้อยกว่าก็จะใช้ค่าเริ่มต้นเป็น object ว่าง
    //   return {
        
    //     vender: dataItem.vender,
    //     typeName: dataItem.typeName,
    //     carName: dataItem.carName,
    //     wrapupMiles: dataItem.wrapupMiles,
    //     detail: dataItem.detail,
    //     cost: dataItem.cost,
    //     dateStart: new Date(dataItem.dateStart),
    //     dateEnd: new Date(dataItem.dateEnd),
    //     remark: dataItem.remark,
    //   };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transdata);
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
