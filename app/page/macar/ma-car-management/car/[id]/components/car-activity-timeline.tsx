"use client";
import React, { useEffect, useState } from "react";
import { Empty, Pagination, Spin, Tag, Timeline } from "antd";
import {
  ManageCarServices,
  TCarActivityLog,
} from "../../../services/manage-car.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { dateFormatTime } from "@/app/utils";

export interface CarActivityTimelineProps {
  carId: string;
  loadActivity: boolean;
  setLoadActivity: (status: boolean) => void;
}

/** ป้ายไทยของ action (ให้ตรงกับ ACTION_LABEL ฝั่ง backend) */
const ACTION_LABEL: Record<string, string> = {
  "car.create": "เพิ่มรถ",
  "car.update": "แก้ไขข้อมูลรถ",
  "car.delete": "ลบรถ",
  "booking.create": "สร้างการจองรถ",
  "booking.approve": "อนุมัติการจอง",
  "booking.reject": "ปฏิเสธการจอง",
  "booking.complete": "รับคืนรถ (จบการจอง)",
  "booking.cancel": "ยกเลิกการจอง",
  "booking.return": "แจ้งคืนรถ",
  "booking.delete": "ลบการจอง",
  "wrapup.create": "เพิ่มการตรวจสภาพ",
  "wrapup.update": "แก้ไขการตรวจสภาพ",
  "wrapup.delete": "ลบการตรวจสภาพ",
  "document.create": "เพิ่ม/ต่ออายุเอกสาร",
  "document.update": "แก้ไขเอกสาร",
  "document.void": "ยกเลิกเอกสาร",
  "document.file-upload": "อัปโหลดไฟล์เอกสาร",
  "document.file-delete": "ลบไฟล์เอกสาร",
  "fuel.use": "ตัดน้ำมัน (ใช้งาน)",
  "fuel.reset": "รีเซ็ตวงเงินน้ำมัน",
  "fuel.adjust": "ปรับวงเงินน้ำมัน",
  "file.car-upload": "อัปโหลดไฟล์รถ",
  "file.car-delete": "ลบไฟล์รถ",
  "file.booking-upload": "อัปโหลดรูปการจอง",
  "file.booking-delete": "ลบรูปการจอง",
  "file.wrapup-upload": "อัปโหลดรูปตรวจสภาพ",
  "file.wrapup-delete": "ลบรูปตรวจสภาพ",
};

/** สีของ dot ตามหมวด (type) */
const TYPE_COLOR: Record<string, string> = {
  car: "blue",
  booking: "green",
  wrapup: "orange",
  document: "purple",
  fuel: "gold",
  file: "gray",
};

const TYPE_LABEL: Record<string, string> = {
  car: "รถ",
  booking: "การจอง",
  wrapup: "ตรวจสภาพ",
  document: "เอกสาร",
  fuel: "น้ำมัน",
  file: "ไฟล์",
};

const PAGE_SIZE = 5;

/**
 * ไทม์ไลน์ประวัติกิจกรรมของรถ 1 คัน — อ่านอย่างเดียว แบ่งหน้าฝั่ง server
 * @param carId รหัสรถ
 */
const CarActivityTimeline: React.FC<CarActivityTimelineProps> = ({
  carId,
  loadActivity,
  setLoadActivity,
}) => {
  const { id24Axios } = useId24();
  const services = ManageCarServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET),
  );

  const [rows, setRows] = useState<TCarActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [acloading, setAcLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setAcLoading(true);

      const res = await services.getCarActivity(
        carId,
        (page - 1) * PAGE_SIZE,
        PAGE_SIZE,
      );    console.log("CarActivityTimeline useEffect", { res, page, loadActivity });

      if (active) {
        setRows(res.data ?? []);
        setTotal(res.count ?? 0);
        setAcLoading(false);
      }
    })();
      // setLoadActivity(false);
    return () => {
      active = false;
    };
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, page]);

  if (acloading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (!rows.length) {
    return <Empty description="ยังไม่มีประวัติกิจกรรม" />;
  }

  return (
    <div>
      <Timeline
        items={rows.map((r) => ({
          color: TYPE_COLOR[r.type] ?? "blue",
          children: (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">
                  {ACTION_LABEL[r.action] ?? r.description ?? r.action}
                </span>
                <Tag color={TYPE_COLOR[r.type] ?? "blue"}>
                  {TYPE_LABEL[r.type] ?? r.type}
                </Tag>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {dateFormatTime(r.createdAt)}
                {r.actorName ? ` · โดย ${r.actorName}` : ""}
              </div>
            </div>
          ),
        }))}
      />
      <div className="flex justify-end mt-2">
        <Pagination
          size="small"
          current={page}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={setPage}
          showTotal={(count) => `ทั้งหมด ${count} รายการ`}
        />
      </div>
    </div>
  );
};

export default CarActivityTimeline;
