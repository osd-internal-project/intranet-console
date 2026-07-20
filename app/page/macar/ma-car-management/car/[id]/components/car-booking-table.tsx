"use client";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import { MaCarBookType } from "../../../../common";
import { ManageCarServices } from "../../../services/manage-car.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { dateFormatTime } from "@/app/utils";
import { CheckStatusMaCarBookType } from "@/app/utils/validatefield";

export interface CarBookingTableProps {
  carId: string;
}

/**
 * ตารางการจองของรถ 1 คัน — อ่านอย่างเดียว แบ่งหน้าฝั่ง server
 * ถือ pagination/total ไว้เอง และ query ใหม่ทุกครั้งที่เปลี่ยนหน้า/ขนาดหน้า (ส่ง skip/take)
 * @param carId รหัสรถ
 */
const CarBookingTable: React.FC<CarBookingTableProps> = ({ carId }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const manageCarServices = ManageCarServices(baseUrIntranet);

  const [rows, setRows] = useState<MaCarBookType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  // query ใหม่ทุกครั้งที่ carId หรือหน้า/ขนาดหน้าเปลี่ยน — total เก็บแยกออกจาก pagination กัน loop
  useEffect(() => {
    let active = true;
    const fetchRows = async () => {
      setLoading(true);
      const take = pagination.pageSize ?? 10;
      const skip = ((pagination.current ?? 1) - 1) * take;
      const res = await manageCarServices.findMaCarBookByCarId(carId, skip, take);
      if (active) {
        setRows(res.docs ?? []);
        setTotal(res.total ?? 0);
        setLoading(false);
      }
    };
    fetchRows();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, pagination]);

  const columns: TableProps<MaCarBookType>["columns"] = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (_value, _record, index) =>
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10) + (index + 1),
    },
    {
      title: "หัวข้อการจอง",
      dataIndex: "carBookTitle",
      key: "carBookTitle",
      render: (title: string) => title || "-",
    },
    {
      title: "วันที่เริ่มจอง",
      dataIndex: "carBookStartDate",
      key: "carBookStartDate",
      align: "center",
      render: (value: string) => (value ? dateFormatTime(value) : "-"),
    },
    {
      title: "วันที่สิ้นสุด",
      dataIndex: "carBookEndDate",
      key: "carBookEndDate",
      align: "center",
      render: (value: string) => (value ? dateFormatTime(value) : "-"),
    },
    {
      title: "ผู้จอง",
      dataIndex: "createdByName",
      key: "createdByName",
      render: (name: string) => name || "-",
    },
    {
      title: "สถานที่",
      dataIndex: "carBookPlace",
      key: "carBookPlace",
      render: (place: string) => place || "-",
    },
    {
      title: "สถานะ",
      dataIndex: "carBookApprovedStatus",
      key: "carBookApprovedStatus",
      align: "center",
      render: (status: string) => CheckStatusMaCarBookType(status),
    },
  ];

  return (
    <Table<MaCarBookType>
      columns={columns}
      dataSource={rows}
      loading={loading}
      rowKey="id"
      size="small"
      scroll={{ x: "max-content" }}
      pagination={{
        ...pagination,
        total,
        showSizeChanger: true,
        showTotal: (count) => `ทั้งหมด ${count} รายการ`,
      }}
      onChange={(nextPagination) => setPagination(nextPagination)}
    />
  );
};

export default CarBookingTable;
