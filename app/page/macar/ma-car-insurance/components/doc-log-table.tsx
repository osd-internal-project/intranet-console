"use client";
import React, { useEffect, useState } from "react";
import { AxiosInstance } from "axios";
import { Button, Card, DatePicker, Select, Table, Tag } from "antd";
import type { TableProps, TablePaginationConfig } from "antd";
import type { Dayjs } from "dayjs";
import { CarLite, DocLogRow, DocType } from "../../common";
import { DOC_TYPE_LABEL, DOC_TYPES, LEVEL_TAG_COLOR } from "../../common/doc-status";
import { MaCarDocumentServices } from "../services/ma-car-document.service";
import { DateShortTH } from "@/app/utils/time-convertor";
import { numberFormat } from "@/app/utils";

const { RangePicker } = DatePicker;

interface DocLogTableProps {
  axios: AxiosInstance;
  cars: CarLite[];
  /** คลิกแถว -> เปิด drawer ประวัติของรถ + ประเภทนั้น */
  onRowClick: (carId: string, docType: DocType) => void;
}

/**
 * ตาราง Log เอกสารทั้งหมด เรียงตามวันที่บันทึก ใหม่→เก่า (รวมแถวที่ยกเลิก)
 * กรองได้ด้วย คัน / ประเภทเอกสาร / ช่วงเดือน (อิง createdAt)
 */
export default function DocLogTable({ axios, cars, onRowClick }: DocLogTableProps) {
  // สร้างใหม่ทุก render ได้ ไม่ผูกเข้า effect deps (axios ถูกสร้างใหม่ทุก render ของหน้าแม่)
  const services = MaCarDocumentServices(axios);

  const [carId, setCarId] = useState<string | undefined>();
  const [docType, setDocType] = useState<DocType | undefined>();
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);

  const [rows, setRows] = useState<DocLogRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // pagination ฝั่ง server — total แยกจาก pagination กัน effect วนซ้ำ (total ไม่อยู่ใน deps)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let active = true;
    const fetchLog = async () => {
      setLoading(true);
      // ช่วงเดือน: ต้นเดือนแรก ถึง ต้นเดือนถัดจากเดือนสุดท้าย (gte/lt) จึงคลุมทั้งเดือนสุดท้าย
      const startDate = range?.[0]?.startOf("month").toISOString();
      const endDate = range?.[1]?.add(1, "month").startOf("month").toISOString();
      const take = pagination.pageSize ?? 20;
      const skip = ((pagination.current ?? 1) - 1) * take;
      const res = await services.getLog({
        carId,
        docType,
        startDate,
        endDate,
        skip,
        take,
      });
      if (active) {
        setRows(res.data ?? []);
        setTotal(res.count ?? 0);
        setLoading(false);
      }
    };
    fetchLog();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, docType, range, pagination]);

  const carOptions = cars.map((car) => ({
    value: car.carId,
    label: car.licensePlate
      ? `${car.licensePlate} — ${car.carName}`
      : car.carName,
  }));

  /** เปลี่ยนตัวกรอง = กลับหน้า 1 เสมอ (ไม่งั้นอาจอยู่หน้า 5 ของผลลัพธ์ที่มี 2 หน้า) */
  const resetToFirstPage = () =>
    setPagination((prev) => ({ ...prev, current: 1 }));

  const clearFilters = () => {
    setCarId(undefined);
    setDocType(undefined);
    setRange(null);
    resetToFirstPage();
  };

  const columns: TableProps<DocLogRow>["columns"] = [
    {
      title: "วันที่บันทึก",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      render: (value: string) => (value ? DateShortTH(new Date(value)) : "-"),
    },
    {
      title: "ทะเบียน",
      dataIndex: "licensePlate",
      key: "licensePlate",
      width: 110,
      render: (value: string | null, record) => value || record.carName || "-",
    },
    {
      title: "ประเภท",
      dataIndex: "docType",
      key: "docType",
      width: 100,
      render: (value: DocType) => DOC_TYPE_LABEL[value],
    },
    {
      title: "บริษัท / ผู้ให้บริการ",
      dataIndex: "vender",
      key: "vender",
      render: (value: string | null) => value || "-",
    },
    {
      title: "ชั้นประกัน",
      dataIndex: "insuranceType",
      key: "insuranceType",
      width: 100,
      render: (value: string | null) => value || "-",
    },
    {
      title: "เลขที่เอกสาร",
      dataIndex: "policyNo",
      key: "policyNo",
      render: (value: string | null) => value || "-",
    },
    {
      title: "ค่าใช้จ่าย",
      dataIndex: "cost",
      key: "cost",
      align: "right",
      width: 110,
      render: (value: number | null) =>
        value !== null ? numberFormat(value) : "-",
    },
    {
      title: "คุ้มครอง",
      key: "coverage",
      width: 170,
      render: (_, record) =>
        `${DateShortTH(new Date(record.startDate))} – ${DateShortTH(
          new Date(record.expireDate)
        )}`,
    },
    {
      title: "สถานะ",
      key: "status",
      width: 120,
      render: (_, record) =>
        !record.status ? (
          <Tag color="default">ยกเลิก</Tag>
        ) : (
          <Tag color={LEVEL_TAG_COLOR[record.level]}>
            {record.level === "expired"
              ? "หมดอายุ"
              : record.level === "warning"
              ? "ใกล้หมดอายุ"
              : "ปกติ"}
          </Tag>
        ),
    },
    {
      title: "หมายเหตุ",
      dataIndex: "remark",
      key: "remark",
      render: (value: string | null) => value || "-",
    },
    {
      title: "ผู้บันทึก",
      dataIndex: "createdByName",
      key: "createdByName",
      width: 140,
      render: (value: string | undefined) => value || "-",
    },
  ];

  return (
    <Card title="บันทึกประวัติเอกสาร (Log)" className="mt-4">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="ทุกคัน"
          style={{ width: 220 }}
          options={carOptions}
          value={carId}
          onChange={(value) => {
            setCarId(value);
            resetToFirstPage();
          }}
        />
        <Select
          allowClear
          placeholder="ทุกประเภท"
          style={{ width: 160 }}
          options={DOC_TYPES.map((type) => ({
            value: type,
            label: DOC_TYPE_LABEL[type],
          }))}
          value={docType}
          onChange={(value) => {
            setDocType(value);
            resetToFirstPage();
          }}
        />
        <RangePicker
          picker="month"
          placeholder={["เดือนเริ่ม", "เดือนสิ้นสุด"]}
          value={range}
          onChange={(value) => {
            setRange(value as [Dayjs, Dayjs] | null);
            resetToFirstPage();
          }}
        />
        <Button onClick={clearFilters}>ล้างตัวกรอง</Button>
      </div>

      <Table<DocLogRow>
        columns={columns}
        dataSource={rows}
        loading={loading}
        rowKey={(record) => record.documentId}
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{ ...pagination, total, showSizeChanger: true }}
        onChange={(nextPagination) => setPagination(nextPagination)}
        onRow={(record) => ({
          onClick: () => onRowClick(record.carId, record.docType),
          className: "cursor-pointer",
        })}
        rowClassName={(record) => (!record.status ? "opacity-50" : "")}
      />
    </Card>
  );
}
