"use client";
import React, { useEffect, useState } from "react";
import { Descriptions, Modal, Table, Tag, Tooltip } from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { MaCarWrapupType } from "../../../../common";
import WrapupImageList from "../../../../common/wrapup-image-list";
import { ManageCarServices } from "../../../services/manage-car.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { numberFormat } from "@/app/utils";

export interface CarMaTableProps {
  carId: string;
}

/** สถานะการตรวจสภาพ: null = รอตรวจ, true = เช็คแล้ว, false = ยกเลิก */
const renderStatus = (status: boolean | null) => {
  if (status === null || status === undefined) return <Tag color="blue">รอตรวจสภาพ</Tag>;
  return status ? <Tag color="green">เช็คแล้ว</Tag> : <Tag color="red">ยกเลิกการเช็ค</Tag>;
};

/**
 * ตารางประวัติตรวจสภาพ (MA) ของรถ 1 คัน — อ่านอย่างเดียว แบ่งหน้าฝั่ง server
 * ถือ pagination/total ไว้เอง และ query ใหม่ทุกครั้งที่เปลี่ยนหน้า/ขนาดหน้า (ส่ง skip/take)
 * @param carId รหัสรถ
 * @param onViewDetail callback ดูรายละเอียด/หมายเหตุ
 */
const CarMaTable: React.FC<CarMaTableProps> = ({ carId }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const manageCarServices = ManageCarServices(baseUrIntranet);

  const [rows, setRows] = useState<MaCarWrapupType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<MaCarWrapupType | null>(null);
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
      const res = await manageCarServices.findMaCarWrapupByCarId(carId, skip, take);
      if (active) {
        setRows(res.data ?? []);
        setTotal(res.count ?? 0);
        setLoading(false);
      }
    };
    fetchRows();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, pagination]);

  const columns: TableProps<MaCarWrapupType>["columns"] = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (_value, _record, index) =>
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10) + (index + 1),
    },
    {
      title: "ประเภทการตรวจสภาพ",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
      render: (detail: string) => detail || "-",
    },
    {
      title: "สถานที่ตรวจสภาพ",
      dataIndex: "vender",
      key: "vender",
      render: (vender: string) => vender || "-",
    },
    {
      title: "เลขไมล์ตรวจสภาพ",
      dataIndex: "wrapupMiles",
      key: "wrapupMiles",
      align: "center",
      render: (miles: string) => (miles ? numberFormat(Number(miles)) : "-"),
    },
    {
      title: "ราคา",
      dataIndex: "cost",
      key: "cost",
      align: "right",
      render: (cost: number) => numberFormat(Number(cost ?? 0)),
    },
    {
      title: "วันที่ตรวจสภาพ",
      dataIndex: "dateStart",
      key: "dateStart",
      align: "center",
      render: (date: Date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "ตรวจครั้งถัดไป",
      dataIndex: "dateEnd",
      key: "dateEnd",
      align: "center",
      render: (date: Date | null) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: boolean | null) => renderStatus(status),
    },
    {
      title: "ผู้บันทึก",
      dataIndex: "createbyName",
      key: "createbyName",
      render: (name: string) => name || "-",
    },
    {
      title: "ดู",
      key: "view",
      align: "center",
      render: (_value, record) => (
        <Tooltip title="ดูรายละเอียด/หมายเหตุ">
          <EyeOutlined
            style={{ fontSize: 20, color: "var(--ant-blue)", cursor: "pointer" }}
            onClick={() => setDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Table<MaCarWrapupType>
        columns={columns}
        dataSource={rows}
        loading={loading}
        rowKey={(record) => record.carWrapupId ?? String(record.id)}
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

      <Modal
        title="รายละเอียดการตรวจสภาพ"
        open={detail !== null}
        onCancel={() => setDetail(null)}
        footer={null}
        width={560}
      >
        {detail && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="ประเภท">{detail.typeName || "-"}</Descriptions.Item>
            <Descriptions.Item label="สถานที่">{detail.vender || "-"}</Descriptions.Item>
            <Descriptions.Item label="เลขไมล์">
              {detail.wrapupMiles ? numberFormat(Number(detail.wrapupMiles)) : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="ราคา">
              {numberFormat(Number(detail.cost ?? 0))}
            </Descriptions.Item>
            <Descriptions.Item label="วันที่ตรวจ">
              {detail.dateStart ? dayjs(detail.dateStart).format("DD/MM/YYYY") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="ตรวจครั้งถัดไป">
              {detail.dateEnd ? dayjs(detail.dateEnd).format("DD/MM/YYYY") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="รายละเอียด">{detail.detail || "-"}</Descriptions.Item>
            <Descriptions.Item label="หมายเหตุ">{detail.remark || "-"}</Descriptions.Item>
          </Descriptions>
        )}
        {detail && (
          <div className="mt-4">
            <div className="mb-2 text-sm font-medium text-gray-700">ไฟล์แนบ</div>
            <WrapupImageList images={detail.maCarWrapupImage} />
          </div>
        )}
      </Modal>
    </>
  );
};

export default CarMaTable;
