"use client";
import { Button, Table } from "antd";
import React from "react";
import { IFindAllYearDto } from "../common";
import { editIcon } from "@/components/icon";
import "dayjs/locale/en";
import Link from "next/link";
import dayjs from "dayjs";

export interface props {
  loading: boolean;
  dataHolidayYear: IFindAllYearDto[];
}

export const TableMasterHolidays: React.FC<props> = ({ loading, dataHolidayYear }): React.ReactElement => {
  const columns: any = [
    {
      key: "id",
      title: "ลำดับ",
      dataIndex: "id",
      width: "10%",
      render: (value: string, records: IFindAllYearDto, index: number) => index + 1,
    },
    { key: "id", title: "ปี", dataIndex: "holidaysYear", width: "30%" },
    { key: "id", title: "สร้างเมื่อ", dataIndex: "createdAt", width: "20%",render: (text: string) =>dayjs(text).format("DD-MM-YYYY , HH:mm") },
    { key: "id", title: "อัปเดทเมื่อ", dataIndex: "updatedAt", width: "20%",render: (text: string) =>dayjs(text).format("DD-MM-YYYY , HH:mm") },
    {
      key: "id",
      title: "เพิ่มวันหยุด",
      dataIndex: "holidaysYear",
      width: "20%",
      render: (value: string, records: IFindAllYearDto, index: number) => (
        <Link href={`/page/setting/master-holidays/${value}`}>
          <Button type="link" className="p-1">
            {editIcon}
          </Button>
        </Link>
      ),
    },
  ];
  return (
    <div>
      <Table size="small" loading={loading} dataSource={dataHolidayYear} columns={columns} rowKey={`id`} />
    </div>
  );
};
