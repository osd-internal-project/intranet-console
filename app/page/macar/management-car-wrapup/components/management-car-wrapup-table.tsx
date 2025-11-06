import { Button, Space, Table, TableProps, Tag, Tooltip } from "antd";
import React from "react";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { dateFormatTime, numberFormat } from "@/app/utils";
import { numberWithCommas } from "@/app/utils/format";
import type { Decimal } from "@prisma/client/runtime/library";
import type { MaCarWrapupImage } from "../../common";

export interface props {
  handleOpen: (status: string, values: any) => void;
  dataSource: any;
  loading: boolean;
}

export interface MaCarwarpup {
  id: number;
  carWrapupId: string;
  carId?: string;
  carName: string;
  typeId?: number;
  typeName: string;
  vender: string;
  cost: Decimal;
  detail: string;
  wrapupMiles: number;
  dateStart: Date | string;
  dateEnd: Date | string;
  remark: string;
  createdAt: string;
  updatedAt: string;
  status?: boolean;
  createbyName?: string;
  maCarWrapupImage: MaCarWrapupImage[];
}

const ManagementCarWrapupTable: React.FC<props> = ({ handleOpen, dataSource, loading }): React.ReactElement => {
  const columns: TableProps<MaCarwarpup>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      render: (value: number, record: any, index: number) => index + 1,
    },
    {
      title: "ชื่อรถ",
      dataIndex: "carName",
      key: "carName",
      fixed: "left",
    },
    {
      title: "ประเภทการตรวจสภาพ",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "รายละเอียดการตรวจ",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "สถานที่เช็คสภาพ",
      dataIndex: "vender",
      key: "vender",
    },
    {
      title: "เลขไมล์ตรวจสภาพ",
      dataIndex: "wrapupMiles",
      key: "wrapupMiles",
      align: "center",
      render: (values: number) => numberFormat(values),
    },
    {
      title: "ราคา",
      dataIndex: "cost",
      key: "cost",
      align: "center",
      render: (values: number) => numberWithCommas(values),
    },
    {
      title: "วันที่ตรวจสภาพ",
      dataIndex: "dateStart",
      key: "dateStart",
      align: "center",
      render: (values: string) => dateFormatTime(values),
    },
    {
      title: "วันตรวจสภาพครั้งถัดไป",
      dataIndex: "dateEnd",
      key: "dateEnd",
      align: "center",
      render: (values: string) => dateFormatTime(values),
    },

    {
      title: "ชื่อ - นามสกุล",
      dataIndex: "createbyName",
      key: "createbyName",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: boolean) =>
        status === null ? (
          <Tag color="blue">รอตรวจสภาพ</Tag>
        ) : status === true ? (
          <Tag color="green">เช็คแล้ว</Tag>
        ) : (
          <Tag color="red">ยกเลิกการเช็ค</Tag>
        ),
    },
    {
      title: "ตัวเลือก",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_: any, record: MaCarwarpup) => {
        return (
          <Space>
            <Button size="small" type="default" onClick={() => handleOpen("edit", record)}>{`Edit`}</Button>
            <Button size="small" type="primary" onClick={() => handleOpen("delete", record)} danger>{`Delete`}</Button>
            <Button size="small" type="primary" onClick={() => handleOpen("approved", record)}>{`Approved`}</Button>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Table size="small" loading={loading} dataSource={dataSource} columns={columns} scroll={{ x: "max-content" }} rowKey="id" />
    </div>
  );
};

export default ManagementCarWrapupTable;
