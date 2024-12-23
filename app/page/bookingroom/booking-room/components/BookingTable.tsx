import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Divider,
  TablePaginationConfig,
} from "antd";
import type { TableProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { BookingRoomServices } from "../services/booking-room.service";
import dayjs from "dayjs";

interface DataType {
  id: string;
  no: number;
  roomName: string;
  roomType: string;
  startDate: string;
  endDate: string;
  bookerName: string;
  bookingStatus: string;
  details: string;
  created_at: string;
}

export interface props {
  bookingFetchData: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const BookingTable: React.FC<props> = ({
  bookingFetchData,
  pagination,
  changePagination,
}: any): React.ReactElement => {
  const intraAuth = useAxiosIntranet();
  const bookingRoomServices = BookingRoomServices(intraAuth);
  const [bookingData, setBookingData] = useState<DataType[]>([]);
  const [modalBookingDetails, setModalBookingDetails] = useState(false);
  const [currentBookingDetails, setCurrentBookingDetails] =
    useState<DataType | null>(null);

  const columns: TableProps<DataType>["columns"] = [
    {
      key: "no",
      title: "ลำดับ",
      dataIndex: "no",
      render: (id: number, record: any, index: number) =>
        pagination.current && pagination.pageSize
          ? (pagination.current - 1) * pagination.pageSize + (index + 1)
          : "",
    },
    {
      key: "roomName",
      title: "ชื่อห้องประชุม",
      dataIndex: "roomName",
    },
    {
      key: "roomType",
      title: "ประเภทการจอง",
      dataIndex: "roomType",
    },
    {
      key: "bookingDate",
      title: "วันที่จอง",
      render: (_, record) => (
        <span>
          {dayjs(record.startDate).format("YYYY-MM-DD")} -{" "}
          {dayjs(record.endDate).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      key: "bookingTime",
      title: "เวลาจอง",
      render: (_, record) => (
        <span>
          {dayjs(record.startDate).format("HH:mm")} -{" "}
          {dayjs(record.endDate).format("HH:mm")}
        </span>
      ),
    },
    {
      key: "bookerName",
      title: "ชื่อผู้จอง",
      dataIndex: "bookerName",
    },
    {
      key: "bookingStatus",
      title: "สถานะ",
      dataIndex: "bookingStatus",
      render: (status: string) => {
        let color = "";
        let text = "";

        switch (status) {
          case "process":
            color = "blue";
            text = "กำลังรออนุมัติ";
            break;
          case "Approve":
            color = "green";
            text = "อนุมัติสำเร็จ";
            break;
          case "Reject":
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
      key: "details",
      title: "รายละเอียด",
      dataIndex: "details",
      render: (_, record) => (
        <Button type="link" onClick={() => showModalBookingDetails(record)}>
          รายละเอียด
        </Button>
      ),
    },
  ];

  const renderStatusTag = (status: any) => {
    switch (status) {
      case "Approve":
        return <Tag color={"green"}>อนุมัติสำเร็จ</Tag>;
      case "Reject":
        return <Tag color={"red"}>ไม่อนุมัติ</Tag>;
      case "process":
        return <Tag color={"blue"}>กำลังรออนุมัติ</Tag>;
      case "cancel":
        return <Tag color="red">ยกเลิกการจอง</Tag>;
      default:
        return "Unknown Status";
    }
  };

  const showModalBookingDetails = (record: DataType) => {
    setCurrentBookingDetails(record);
    setModalBookingDetails(true);
  };

  const handleBookingDetailsCancel = () => {
    setModalBookingDetails(false);
    setCurrentBookingDetails(null);
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal
        title="รายละเอียดการจอง"
        visible={modalBookingDetails}
        onCancel={handleBookingDetailsCancel}
        footer={null}
        centered
        width={400}
        style={{ top: 20 }}
      >
        {currentBookingDetails && (
          <>
            <Divider />
            <p>
              <strong>ชื่อห้องประชุม : </strong>{" "}
              <span className="modal-content">
                {currentBookingDetails.roomName}
              </span>
            </p>
            <p>
              <strong>ประเภทการจอง : </strong>{" "}
              <span className="modal-content">
                {currentBookingDetails.roomType}
              </span>
            </p>
            <p>
              <strong>วันที่จอง : </strong>{" "}
              <span className="modal-content">
                {dayjs(currentBookingDetails.startDate).format("YYYY-MM-DD")} -{" "}
                {dayjs(currentBookingDetails.endDate).format("YYYY-MM-DD")}
              </span>
            </p>
            <p>
              <strong>เวลาจอง : </strong>{" "}
              <span className="modal-content">
                {dayjs(currentBookingDetails.startDate).format("HH:mm")} -{" "}
                {dayjs(currentBookingDetails.endDate).format("HH:mm")}
              </span>
            </p>
            <p>
              <strong>สถานะ : </strong>
              <span className="modal-content">
                {currentBookingDetails.bookingStatus
                  ? renderStatusTag(currentBookingDetails.bookingStatus)
                  : "ไม่มีสถานะ"}
              </span>
            </p>
            <Divider />
            <p>
              <strong>ชื่อผู้จอง : </strong>{" "}
              <span className="modal-content">
                {currentBookingDetails.bookerName}
              </span>
            </p>
          </>
        )}
      </Modal>
      <Table
        columns={columns}
        dataSource={bookingFetchData}
        rowKey="id"
        onChange={changePagination}
        pagination={pagination}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default BookingTable;
