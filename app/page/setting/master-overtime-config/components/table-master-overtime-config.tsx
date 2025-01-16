import { Button, Table } from "antd";
import React from "react";
import { manageDays, typeDate } from "../manage-config";

export interface props {
  dataSource: any[];
  OpenModal: (events: any) => void;
}

const TableMasterOvertimeConfig: React.FC<props> = ({ dataSource, OpenModal }) => {
  const DataSource: any = Object.values(dataSource[0].partTimeCondition);
  const columns = [
    { key: "index", title: "Index", dataIndex: "index" },
    {
      key: "name",
      title: "วัน",
      dataIndex: "name",
      render: (value: string, events: any, index: number) => manageDays(value),
    },
    {
      key: "intime",
      title: "อัตราการคิดในเวลา",
      dataIndex: "intime",
      render: (value: string, events: any, index: number) => {
        return `${value} เท่า`;
      },
    },
    {
      key: "overtime",
      title: "อัตราการคิดนอกเวลา",
      dataIndex: "overtime",
      render: (value: string, events: any, index: number) => {
        return `${value} เท่า`;
      },
    },
    {
      key: "startTime",
      title: "เริ่มทำงาน",
      dataIndex: "startTime",
      render: (value: string, events: any, index: number) => {
        return `${value} น.`;
      },
    },
    {
      key: "endTime",
      title: "เลิกงาน",
      dataIndex: "endTime",
      render: (value: string, events: any, index: number) => {
        return `${value} น.`;
      },
    },
    {
      key: "startOt",
      title: "ล่วงเวลา",
      dataIndex: "startOt",
      render: (value: string, events: any, index: number) => {
        return `${value} น.`;
      },
    },
    { key: "typeDate", title: "ประเภทของวัน", dataIndex: "typeDate", render: (value: string, events: any, index: number) => typeDate(value) },
    {
      key: "breakTime",
      title: "เวลาพัก",
      dataIndex: "breakTime",
      render: (value: string, events: any, index: number) => {
        return `${value} ชม.`;
      },
    },
    {
      key: "index",
      title: "...",
      dataIndex: "index",
      render: (value: string, events: any, index: number) => {
        return (
          <>
            <Button onClick={() => OpenModal(events)}>{`แก้ไข`}</Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Table dataSource={DataSource} rowKey={(e: any) => e.index} columns={columns} />
    </>
  );
};

export default TableMasterOvertimeConfig;
