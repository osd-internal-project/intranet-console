import { Table, TableProps, Tag } from "antd";
import React from "react";
import { MasterRoomType } from "../common";

export interface props {
  pagination: any;
  masterBookingRoom: MasterRoomType[];
}
const MeetingRoomTableComponent: React.FC<props> = ({ masterBookingRoom }): React.ReactElement => {
  const columns: TableProps<MasterRoomType>["columns"] = [
    {
      title: "ชื่อห้องประชุม",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "สถานะห้องประชุม",
      dataIndex: "roomsStatus",
      align: "center",
      render: (value: string, row: any) => {
        const now = new Date();
        console.log(row);
        const roomStatus = row?.roomsStatus;
        const isRoomBooked = row.bookingRoom?.some((booking: any) => {
          const startDate = new Date(booking.startDate);
          const endDate = new Date(booking.endDate);
          return now >= startDate && now <= endDate;
        });
        if (roomStatus) {
          if (isRoomBooked) {
            return <Tag color="red">ไม่ว่างใช้งาน</Tag>;
          } else {
            return <Tag color="green">ว่าง</Tag>;
          }
        } else {
          return <Tag color="red">ไม่พร้อมใช้งาน</Tag>;
        }
      },
    },
  ];

  return <Table columns={columns} dataSource={masterBookingRoom} pagination={false} rowKey="id" />;
};

export default MeetingRoomTableComponent;
