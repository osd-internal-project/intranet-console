"use client";
import React from "react";
import { Empty, Row, Col, Tooltip } from "antd";
import { CarLite, DocDueMonth, DocType } from "../../common";
import { DOC_TYPE_LABEL } from "../../common/doc-status";
import { DateShortTH } from "@/app/utils/time-convertor";

interface DocDueCalendarProps {
  months: DocDueMonth[];
  /** คลิกรายการในเดือน -> เปิด Drawer ประวัติของรถคันนั้น */
  onSelectDocument: (carId: string, docType: DocType) => void;
  cars: CarLite[];
}

const MONTH_LABELS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

/**
 * สีของ 3 ประเภทเอกสาร — เลี่ยง แดง/ส้ม/เขียว โดยตั้งใจ
 * เพราะ 3 สีนั้นสื่อ "สถานะหมดอายุ" ไปแล้วทั้งหน้า ถ้าเอามาใช้ซ้ำจะอ่านสับสน
 */
const DOC_COLORS: Record<DocType, string> = {
  insurance: "#1D4ED8",
  act: "#DB2777",
  tax: "#0E9488",
};

const DOC_TYPES: DocType[] = ["insurance", "act", "tax"];

/** ป้ายเดือนแบบ พ.ศ. เช่น "ก.ค. 69" — ต้องมีปีเพราะหน้าต่างคาบเกี่ยวข้ามปี */
const monthLabel = (month: DocDueMonth) =>
  `${MONTH_LABELS[month.month - 1]} ${String((month.year + 543) % 100).padStart(2, "0")}`;

/**
 * ปฏิทินครบกำหนด 13 เดือน (เดือนนี้ + 12 เดือนข้างหน้า) — เห็นทุกเดือนพร้อมกันในหน้าจอเดียว
 *
 * แต่ละช่องเดือนโชว์ list รายคันตรงๆ (ทะเบียน + จุดสีตามประเภทเอกสาร) คลิกได้ทันที
 * ตั้งใจไม่ใช้ปฏิทินรายวัน (antd Calendar) เพราะมันเห็นทีละเดือน
 * ต้องกดเลื่อนไปมาถึงจะรู้ว่าเดือนไหนงานหนัก ซึ่งคือคำถามหลักของหน้านี้พอดี
 */
export default function DocDueCalendar({
  months,
  onSelectDocument,
}: DocDueCalendarProps) {
  const hasAny = months.some((month) => month.items.length > 0);
  if (!hasAny) {
    return <Empty description="ไม่มีเอกสารครบกำหนดใน 12 เดือนข้างหน้า" />;
  }

  return (
    <div>
      <div className="text-xs text-gray-500 mb-3">
        เอกสารที่ครบกำหนดต่ออายุในเดือนนี้ + 11 เดือนข้างหน้า — คลิกที่รายการเพื่อดูประวัติ / ต่ออายุ
        <br />
        เอกสารที่เลยกำหนดไปแล้วไม่นับที่นี่ ดูได้จากการ์ด &quot;หมดอายุแล้ว&quot; ด้านบน
      </div>

      <Row gutter={[8, 8]}>
        {months.map((month, index) => {
          const total = month.items.length;
          // เดือนแรกของหน้าต่างคือเดือนปัจจุบันเสมอ
          const isCurrentMonth = index === 0;

          return (
            <Col key={`${month.year}-${month.month}`} xs={12} sm={8} md={6} lg={4}>
              <div
                className={[
                  "border rounded-lg p-2 h-full",
                  isCurrentMonth ? "border-blue-400 bg-blue-50/40" : "border-gray-200",
                  total === 0 ? "opacity-60" : "",
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <span
                    className={`text-sm ${isCurrentMonth ? "font-bold" : "font-medium"}`}
                  >
                    {monthLabel(month)}
                  </span>
                  {isCurrentMonth && (
                    <span className="text-[10px] text-blue-600">เดือนนี้</span>
                  )}
                </div>

                {total === 0 ? (
                  <div className="text-xs text-gray-400 py-1">–</div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {month.items.map((item) => (
                      <Tooltip
                        key={`${item.carId}-${item.docType}`}
                        title={`${DOC_TYPE_LABEL[item.docType]} · หมดอายุ ${DateShortTH(
                          new Date(item.expireDate)
                        )}`}
                      >
                        <div
                          onClick={() =>
                            onSelectDocument(item.carId, item.docType)
                          }
                          className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5"
                        >
                          <span
                            className="inline-block w-2 h-2 rounded-sm shrink-0"
                            style={{ background: DOC_COLORS[item.docType] }}
                          />
                          <span className="truncate">
                            {item.licensePlate || item.carName}
                          </span>
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          );
        })}
      </Row>

      {/* คำอธิบายสี — ไม่ให้สื่อความหมายด้วยสีอย่างเดียว (จุดสีในช่องบอกประเภท legend นี้ถอดรหัสให้) */}
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        {DOC_TYPES.map((docType) => (
          <span key={docType} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-sm"
              style={{ background: DOC_COLORS[docType] }}
            />
            {DOC_TYPE_LABEL[docType]}
          </span>
        ))}
      </div>
    </div>
  );
}
