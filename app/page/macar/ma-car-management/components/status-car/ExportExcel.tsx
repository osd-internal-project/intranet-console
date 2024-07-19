
import React from 'react';
import * as XLSX from 'xlsx';
import {  FileExcelFilled } from '@ant-design/icons';
import { log } from 'console';
import { MaCar } from './WarpupmaCar';

interface ExportExcelProps {
  // datatype: any[];
  datamacar:any[];
}

const ExportExcel: React.FC<ExportExcelProps> = ({ datamacar}) => {
    
    
    const handleExport = () => {
    
    console.log(datamacar);
    
    const transdata = datamacar.map((dataItem, index) => {
      // const macItem = datamacar[index] || {}; // หาก `datamacar` มีน้อยกว่าก็จะใช้ค่าเริ่มต้นเป็น object ว่าง
      return {
        ...dataItem,
        status: dataItem.status ? 'ใช้งานได้ตามปกติ' : 'ไม่สามารถใช้งานได้',
      };
    });
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transdata);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'DataExport.xlsx');
  };

  return <a onClick={handleExport} style={{color:'black'}}><FileExcelFilled /> Export Excel</a>;
};

export default ExportExcel;