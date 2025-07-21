import { IOverTimeForm } from "@/app/common/overtime";
import { dateFormatTimeNoTIme } from "@/app/utils";
import { Button, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import { intersection } from "lodash";
import React from "react";

export interface Props {
  dataResource: { data: IOverTimeForm[]; total: number };
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
  onFinishUpdate: (values: IOverTimeForm, type: string) => void;
  onFinishDelete: (id: string) => void;
  sideMenuGroups: any;
  handleOpenModal: (status: boolean, data: IOverTimeForm) => void;
}

const TableOvertimeHistory: React.FC<Props> = ({
  dataResource,
  pagination,
  changePagination,
  onFinishUpdate,
  onFinishDelete,
  sideMenuGroups,
  handleOpenModal,
}): React.ReactElement => {
  const columns: TableProps<IOverTimeForm>["columns"] = [
    {
      key: "no",
      title: "ลำดับ",
      dataIndex: "no",
      render: (id: number, record: any, index: number) =>
        pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : "",
    },
    {
      key: "fullname",
      title: "ชื่อ - สกุล",
      dataIndex: "fullname",
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
      key: "partTimeType",
      title: "ประเภทการทำ OT",
      dataIndex: "partTimeType",
      align: "center",
      render: (status: string) => {
        return <Tag>{status === "working" ? "ทำงาน" : "ขับรถ"}</Tag>;
      },
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
      key: "id",
      title: "รายละเอียด",
      dataIndex: "id",
      render: (status: string, record) => {
        return <Button type="primary" size="small" onClick={() => handleOpenModal(true, record)}>{`รายละเอียด`}</Button>;
      },
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
      fixed: "right",
      key: "id",
      title: "...",
      dataIndex: "id",
      render: (_, record) => {
        return (
          <div className="flex justify-center gap-2">
            <div>
              <Button size="small" type="link" onClick={() => onFinishUpdate(record, "approved")} disabled={record.status !== "waiting"}>
                อนุมัติ
              </Button>
            </div>
            <div>
              <Button size="small" type="link" danger onClick={() => onFinishUpdate(record, "cancel")} disabled={record.status !== "waiting"}>
                ไม่อนุมัติ
              </Button>
            </div>
            {intersection(sideMenuGroups, ["hr"]).length ? (
              <div>
                <Button size="small" type="link" danger onClick={() => onFinishDelete(record.overTimeID ? record.overTimeID : "")}>
                  ลบ
                </Button>
              </div>
            ) : null}
          </div>
        );
      },
      width: 150,
      align: "center",
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        size="small"
        dataSource={dataResource.data}
        rowKey="id"
        onChange={changePagination}
        pagination={{ ...pagination, total: dataResource.total, showSizeChanger: true }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default TableOvertimeHistory;
