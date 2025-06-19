import { Table, TablePaginationConfig, TableProps, Tag } from "antd";
import React from "react";
import { THoliday } from "../page";
import { dateFormatTimeNoTIme } from "@/app/utils";

export interface props {
  holiday: THoliday[];
  changePagination: (page: TablePaginationConfig) => void;
  pagination: TablePaginationConfig;
}

export const TableOvertime: React.FC<props> = ({ holiday, changePagination, pagination }): React.ReactElement => {
  const columns: TableProps<any>["columns"] = [
    {
      key: "no",
      title: "ลำดับ",
      dataIndex: "no",
      render: (id: number, record: any, index: number) =>
        pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : "",
    },
    {
      key: "dateStart",
      title: "วันที่ทำ OT",
      dataIndex: "dateStart",
      render: (_) => dateFormatTimeNoTIme(_),
    },
    {
      key: "detailWork",
      title: "รายละเอียดการทำ OT",
      dataIndex: "detailWork",
    },
    {
      key: "id",
      title: "เวลาเริ่ม - เวลาสิ้นสุด",
      dataIndex: "id",
      render: (_, record) => (
        <span>
          {record.startTime} - {record.endTime}
        </span>
      ),
    },
    {
      key: "typeDate",
      title: "วันที่ทำการ",
      dataIndex: "typeDate",
      render: (_, record) => <span>{_ === "normall" ? "วันปกติ" : "วันหยุด"}</span>,
    },

    {
      key: "totalTime",
      title: "ระยะเวลารวม",
      dataIndex: "totalTime",
    },
    {
      key: "workingTime",
      title: "ระยะเวลาทำงาน",
      dataIndex: "workingTime",
    },
    {
      key: "breakTime",
      title: "พัก",
      dataIndex: "breakTime",
    },
    {
      key: "status",
      title: "สถานะ",
      dataIndex: "status",
      render: (status: string) => {
        let color = "";
        let text = "";
        switch (status) {
          case "waiting":
            color = "blue";
            text = "กำลังรออนุมัติ";
            break;
          case "approved":
            color = "green";
            text = "อนุมัติสำเร็จ";
            break;
          case "reject":
            color = "red";
            text = "ไม่อนุมัติ";
            break;
          case "cancel":
            color = "red";
            text = "ยกเลิกการจอง";
            break;
          default:
            color = "default";
            text = "Unknown Status";
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      key: "approvedUser",
      title: "ผู้อนุมัติ",
      dataIndex: "approvedUser",
    },
    {
      key: "approvedDate",
      title: "วันที่อนุมัติ",
      dataIndex: "approvedDate",
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        size="small"
        dataSource={holiday.filter((e) => e.type)}
        rowKey="id"
        onChange={changePagination}
        pagination={pagination}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
