import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { BookingRoomServices } from "../services/booking-room.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

interface DataType {
  no: string;
  roomName: string;
  roomsStatus: string;
  roomDescription: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "ลำดับ",
    dataIndex: "no",
    key: "no",
    render: (_, record, index) => <>{index + 1}</>,
  },
  {
    title: "ชื่อห้องประชุม",
    dataIndex: "roomName",
    key: "roomName",
  },
  {
    title: "สถานะ",
    dataIndex: "roomsStatus",
    key: "roomsStatus",
    render: (status: boolean, record: any, index: number) => {
      console.log(record);

      return <>{status ? <Tag color="green">ใช้งานได้ปกติ</Tag> : <Tag color="red">ไม่สามารถใช้งานได้</Tag>}</>;
    },
  },
  {
    title: "หมายเหตุ",
    dataIndex: "roomDescription",
    key: "roomDescription",
  },
];

const RoomStatus = () => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [bookingData, setBookingData] = useState<DataType[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const Bookingresponse = await BookingRoomServices(baseUrIntranet).getMasterRoomQuery();
    const BookingRoom: DataType[] = Bookingresponse.map((item: any, index: number) => ({
      ...item,
      key: index.toString(),
    }));
    setBookingData(BookingRoom);
  };

  return <Table columns={columns} dataSource={bookingData} size="small" scroll={{ x: "max-content" }} />;
};

export default RoomStatus;
