"use client";
import { Button, Table } from "antd";
import React from "react";
import { deleteIcon } from "@/components/icon";
import "dayjs/locale/en";
import { IFindAllDayDto } from "../../common";
import { dateToStringTh } from "@/app/utils/format";
import { DateTH } from "@/app/utils/time-convertor";
import dayjs from "dayjs";

export interface props {
  loading: boolean;
  dataHolidayDay: IFindAllDayDto[];
  onDelete: (value: number) => void;
}

export const HolidayTable: React.FC<props> = ({ loading, dataHolidayDay, onDelete }): React.ReactElement => {
  const columns: any = [
    {
      key: "id",
      title: "ลำดับ",
      dataIndex: "id",
      width: "10%",
      render: (value: string, records: IFindAllDayDto, index: number) => index + 1,
    },
    {
      key: "id",
      title: "วันที่",
      dataIndex: "holidaysDate",
      width: "20%",
      render: (value: Date) => DateTH(new Date(value), "DD-MM-BBBB"),
    },
    { key: "id", title: "ชื่อวันหยุด", dataIndex: "holidaysName", width: "20%" },
    { key: "id", title: "สร้างเมื่อ", dataIndex: "createdAt", width: "20%", render: (text: string) =>dayjs(text).format("DD-MM-YYYY , HH:mm")},
    { key: "id", title: "อัปเดทเมื่อ", dataIndex: "updatedAt", width: "20%", render: (text: string) =>dayjs(text).format("DD-MM-YYYY , HH:mm")},
    {
      key: "id",
      title: "ลบ",
      dataIndex: "id",
      width: "10%",
      render: (value: number, records: IFindAllDayDto, index: number) => (
        <Button
          type="link"
          onClick={() => {
            onDelete(value);
          }}
          danger
        >
          {deleteIcon}
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Table size="small" loading={loading} dataSource={dataHolidayDay} columns={columns} rowKey={`id`} />
    </div>
  );
};
