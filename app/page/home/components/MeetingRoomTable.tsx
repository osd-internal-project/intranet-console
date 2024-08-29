import { HomeFilled } from "@ant-design/icons";
import { Table, TableProps, Tag } from "antd";
import React from "react";
import { MasterRoomType } from "../common";

export interface props {
  pagination: any;
  bookingRoom: MasterRoomType[];
}
const MeetingRoomTableComponent: React.FC<props> = ({
  bookingRoom,
}): React.ReactElement => {
  const columns: TableProps<MasterRoomType>["columns"] = [
    {
      title: "ชื่อห้องประชุม",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "สถานะ",
      dataIndex: "roomsStatus",
      key: "roomsStatus",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">ใช้งานได้ปกติ</Tag>
        ) : (
          <Tag color="red">ไม่สามารถใช้งานได้</Tag>
        ),
    },
    // {
    //   title: "สถานะการจองห้องประชุม",
    //   dataIndex: "",
    //   key: "",
    // },
  ];

  return (
    <Table columns={columns} dataSource={bookingRoom} pagination={false} />
  );
};

export default MeetingRoomTableComponent;
