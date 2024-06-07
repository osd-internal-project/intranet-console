import { HomeFilled } from "@ant-design/icons";
import { Table } from "antd";
import React from "react";
export interface props {
  pagination: any;
}
const MeetingRoomTableComponent: React.FC<props> = (): React.ReactElement => {
  const columns = [
    {
      title: "",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "ชื่อห้อง",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "สถานะการจอง",
      dataIndex: "status",
      key: "status",
    },
  ];

  const data = [
    {
      key: "1",
      no: <HomeFilled />,
      name: "Alpha (ชั้น 4 ห้องใหญ่)",
      status: "ว่าง",
    },
    {
      key: "2",
      no: <HomeFilled />,
      name: "Bravo (ชั้น 4)",
      status: "ว่าง",
    },
    {
      key: "3",
      no: <HomeFilled />,
      name: "Chalie (ชั้น 3)",
      status: "ไม่ว่าง",
    },
    {
      key: "4",
      no: <HomeFilled />,
      name: "Delta (ชั้น 1 ห้องฟ้า)",
      status: "ว่าง",
    },
    {
      key: "5",
      no: <HomeFilled />,
      name: "Echo (ชั้น 1 กลางน้ำ)",
      status: "ว่าง",
    },
    {
      key: "6",
      no: <HomeFilled />,
      name: "Delight (ห้องรับรอง ชั้น 1)",
      status: "ว่าง",
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default MeetingRoomTableComponent;
