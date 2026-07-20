"use client";
import React, { useMemo, useState } from "react";
import { AxiosInstance } from "axios";
import { Button, Card, DatePicker, Select, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { ExcelIcon } from "@/components/icon";
import { CarLite, DocLogRow, DocType } from "../../common";
import { DOC_TYPE_LABEL } from "../../common/doc-status";
import { MaCarDocumentServices } from "../services/ma-car-document.service";
import { DateShortTH } from "@/app/utils/time-convertor";

const { RangePicker } = DatePicker;

interface DocExportPanelProps {
  axios: AxiosInstance;
  cars: CarLite[];
}

/** สถานะเป็นข้อความไทยสำหรับเซลล์ Excel (แถวยกเลิกติดป้ายชัด) */
const statusText = (row: DocLogRow): string => {
  if (!row.status) return "ยกเลิก";
  if (row.level === "expired") return "หมดอายุ";
  if (row.level === "warning") return "ใกล้หมดอายุ";
  return "ปกติ";
};

/**
 * ชื่อ worksheet ต้องไม่เกิน 31 ตัว และห้ามมีอักขระ \ / ? * [ ] :
 * กันชื่อซ้ำด้วยการต่อ (2)(3) เพราะ Excel ไม่ยอมให้ 2 sheet ชื่อเดียวกัน
 */
const makeSheetName = (base: string, used: Set<string>): string => {
  const cleaned = (base || "รถ").replace(/[\\/?*[\]:]/g, " ").trim().slice(0, 31) || "รถ";
  let name = cleaned;
  let suffix = 2;
  while (used.has(name)) {
    const tag = ` (${suffix})`;
    name = cleaned.slice(0, 31 - tag.length) + tag;
    suffix += 1;
  }
  used.add(name);
  return name;
};

/**
 * ส่งออกภาพรวมเป็น Excel — แยก 1 sheet ต่อรถ 1 คัน + sheet "สรุป" นำหน้า
 * ดึงข้อมูลด้วยช่วงเดือนอย่างเดียว (ไม่กรองคัน) จึงได้ทุกคันในไฟล์เดียว
 */
export default function DocExportPanel({ axios, cars }: DocExportPanelProps) {
  const services = useMemo(() => MaCarDocumentServices(axios), [axios]);
  // default: ต้นปีนี้ ถึง เดือนปัจจุบัน — ครอบเอกสารที่เพิ่งบันทึก
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("year"),
    dayjs(),
  ]);
  const [carId, setCarId] = useState<string | undefined>();
  const [exporting, setExporting] = useState<boolean>(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const startDate = range[0].startOf("month").toISOString();
      const endDate = range[1].add(1, "month").startOf("month").toISOString();
      // ไม่ส่ง take → backend คืนทุกแถวในช่วง (ไม่แบ่งหน้า) เพื่อให้ Export ได้ครบ
      // carId ว่าง = ทุกคัน, เลือกคัน = เฉพาะคันนั้น (ได้ sheet เดียว)
      const res = await services.getLog({ startDate, endDate, carId });
      const rows: DocLogRow[] = res.data ?? [];

      if (rows.length === 0) {
        message.warning("ไม่มีข้อมูลในช่วงที่เลือก");
        return;
      }

      // จัดกลุ่มตามคัน คงลำดับใหม่→เก่าที่ backend เรียงมาแล้ว
      const byCar = new Map<string, DocLogRow[]>();
      for (const row of rows) {
        const list = byCar.get(row.carId) ?? [];
        list.push(row);
        byCar.set(row.carId, list);
      }

      const workbook = XLSX.utils.book_new();
      const usedNames = new Set<string>();

      // sheet "สรุป" นำหน้า: 1 บรรทัดต่อคัน + จำนวนรายการ
      const summaryRows = Array.from(byCar.values()).map((list, index) => {
        const head = list[0];
        return {
          ลำดับ: index + 1,
          ทะเบียน: head.licensePlate || "-",
          ชื่อรถ: head.carName || "-",
          จำนวนรายการ: list.length,
        };
      });
      const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
      summarySheet["!cols"] = [{ wch: 8 }, { wch: 14 }, { wch: 24 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, "สรุป");

      // 1 sheet ต่อคัน
      for (const list of Array.from(byCar.values())) {
        const head = list[0];
        const sheetRows = list.map((row, index) => ({
          ลำดับ: index + 1,
          วันที่บันทึก: row.createdAt ? DateShortTH(new Date(row.createdAt)) : "-",
          ประเภท: DOC_TYPE_LABEL[row.docType as DocType],
          บริษัท: row.vender || "-",
          ชั้นประกัน: row.insuranceType || "-",
          เลขที่เอกสาร: row.policyNo || "-",
          ค่าใช้จ่าย: row.cost ?? "",
          วันเริ่ม: DateShortTH(new Date(row.startDate)),
          วันหมดอายุ: DateShortTH(new Date(row.expireDate)),
          สถานะ: statusText(row),
          หมายเหตุ: row.remark || "-",
          ผู้บันทึก: row.createdByName || "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(sheetRows);
        worksheet["!cols"] = [
          { wch: 6 }, { wch: 12 }, { wch: 10 }, { wch: 22 }, { wch: 10 },
          { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
          { wch: 24 }, { wch: 18 },
        ];
        const sheetName = makeSheetName(head.licensePlate || head.carName, usedNames);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }

      const label = `${range[0].format("MMMYY")}-${range[1].format("MMMYY")}`;
      XLSX.writeFile(workbook, `เอกสารรถยนต์-ภาพรวม-${label}.xlsx`);
      message.success("ส่งออกไฟล์สำเร็จ");
    } catch (error) {
      console.error(error);
      message.error("ส่งออกไฟล์ไม่สำเร็จ");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card title="ส่งออกภาพรวม (Excel)" className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600">เลือกช่วงเดือน (วันที่บันทึก):</span>
        <RangePicker
          picker="month"
          allowClear={false}
          value={range}
          onChange={(value) => value && setRange(value as [Dayjs, Dayjs])}
        />
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="ทุกคัน"
          style={{ width: 220 }}
          value={carId}
          onChange={setCarId}
          options={cars.map((car) => ({
            value: car.carId,
            label: car.licensePlate
              ? `${car.licensePlate} — ${car.carName}`
              : car.carName,
          }))}
        />
        <Button
          type="primary"
          loading={exporting}
          onClick={handleExport}
          icon={<ExcelIcon width="1.25rem" height="1.25rem" />}
        >
          Export
        </Button>
        <span className="text-xs text-gray-400">
          {carId
            ? "ส่งออกเฉพาะคันที่เลือก"
            : "ไฟล์จะแยกชีทตามรถแต่ละคัน + ชีท “สรุป” นำหน้า"}
        </span>
      </div>
    </Card>
  );
}
