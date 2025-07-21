import { Button, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import React from "react";
import { THoliday } from "../page";
import { dateFormatTimeNoTIme } from "@/app/utils";
import { IOverTimeForm } from "@/app/common/overtime";

export interface props {
  dataTable: IOverTimeForm[];
  changePagination: (page: TablePaginationConfig) => void;
  pagination: TablePaginationConfig;
  handleOpenModal: (status: boolean, data: IOverTimeForm) => void;
}

export const TableOvertime: React.FC<props> = ({ dataTable, changePagination, pagination, handleOpenModal }): React.ReactElement => {
  const columns: TableProps<IOverTimeForm>["columns"] = [
    {
      key: "no",
      title: "ลำดับ",
      dataIndex: "no",
      render: (id, record, index) => (pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : ""),
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
      render: (_) => <span>{_ === "normall" ? "วันปกติ" : "วันหยุด"}</span>,
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
      key: "id",
      title: "รายละเอียด",
      dataIndex: "id",
      render: (status, record) => {
        return <Button type="primary" size="small" onClick={() => handleOpenModal(true, record)}>{`รายละเอียด`}</Button>;
      },
    },
    {
      key: "status",
      title: "สถานะ",
      dataIndex: "status",
      render: (status) => {
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
        dataSource={dataTable}
        rowKey="id"
        onChange={changePagination}
        pagination={pagination}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
