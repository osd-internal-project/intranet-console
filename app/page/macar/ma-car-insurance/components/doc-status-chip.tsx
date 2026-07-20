"use client";
import React from "react";
import { Tag, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MaCarDocumentType } from "../../common";
import { LEVEL_TAG_COLOR } from "../../common/doc-status";
import { DateShortTH } from "@/app/utils/time-convertor";
import { numberFormat } from "@/app/utils";

interface DocStatusChipProps {
  doc: MaCarDocumentType | null;
  /** ข้อความบอกจำนวนวันที่เหลือ คำนวณจาก daysLeft ที่ backend ส่งมา */
  onClick?: () => void;
}

/**
 * แสดงจำนวนวันที่เหลือเป็นข้อความ ไม่ให้ผู้ใช้ต้องนั่งนับวันจากวันที่เอง
 * @param daysLeft จำนวนวัน (ติดลบ = เกินกำหนด)
 */
const daysLabel = (daysLeft: number | null): string => {
  if (daysLeft === null) return "";
  if (daysLeft < 0) return `เกินกำหนด ${Math.abs(daysLeft)} วัน`;
  if (daysLeft === 0) return "หมดอายุวันนี้";
  return `เหลืออีก ${daysLeft} วัน`;
};

/**
 * ป้ายสถานะเอกสาร 1 ใบ — บรรทัดบนคือวันหมดอายุ (พ.ศ.) บรรทัดล่างคือจำนวนวันที่เหลือ
 * ใช้ทั้งในตาราง matrix และใน Drawer ประวัติ
 */
export default function DocStatusChip({ doc, onClick }: DocStatusChipProps) {
  if (!doc) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer inline-flex items-center gap-1 text-gray-400 hover:text-blue-500"
      >
        <PlusOutlined />
        <span className="text-xs">เพิ่มข้อมูล</span>
      </div>
    );
  }

  const tooltip = (
    <div className="text-xs leading-5">
      {doc.vender && <div>บริษัท: {doc.vender}</div>}
      {doc.insuranceType && <div>ประเภท: {doc.insuranceType}</div>}
      {doc.policyNo && <div>เลขที่: {doc.policyNo}</div>}
      {doc.cost !== null && <div>ค่าใช้จ่าย: {numberFormat(doc.cost)} บ.</div>}
      <div className="mt-1 text-gray-300">คลิกเพื่อดูประวัติ / ต่ออายุ</div>
    </div>
  );

  return (
    <Tooltip title={tooltip}>
      <div onClick={onClick} className="cursor-pointer inline-block">
        {/* แสดงช่วงคุ้มครอง เริ่ม – หมดอายุ ให้เห็นทั้งสองวันในบรรทัดเดียว */}
        <Tag color={LEVEL_TAG_COLOR[doc.level]} className="!mr-0">
          {DateShortTH(new Date(doc.startDate))} – {DateShortTH(new Date(doc.expireDate))}
        </Tag>
        <div className="text-[11px] text-gray-500 mt-0.5">
          {daysLabel(doc.daysLeft)}
        </div>
      </div>
    </Tooltip>
  );
}
