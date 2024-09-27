import { HomeFilled } from "@ant-design/icons";
import { Table, TableProps, Tag } from "antd";
import React from "react";
import { MasterRoomType } from "../common";

export interface props {
  pagination: any;
  masterBookingRoom: MasterRoomType[];
}
const MeetingRoomTableComponent: React.FC<props> = ({
  masterBookingRoom,
}): React.ReactElement => {
  const columns: TableProps<MasterRoomType>["columns"] = [
    {
      title: "ชื่อห้องประชุม",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "สถานะการจองห้องประชุม",
      dataIndex: "roomsStatus",
      align: "center",
      key: "id",
      render: (value: string, row: any) => {
        const now = new Date();
        const isRoomBooked = row.bookingRoom?.some((booking: any) => {
          const startDate = new Date(booking.startDate);
          const endDate = new Date(booking.endDate);
          return now >= startDate && now <= endDate;
        });
        if (isRoomBooked) {
          return <Tag color="red">ไม่ว่างใช้งาน</Tag>;
        } else {
          return <Tag color="green">ว่าง</Tag>;
        }
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={masterBookingRoom}
      pagination={false}
    />
  );
};

export default MeetingRoomTableComponent;
