import React, { useState, useEffect } from "react";
import { Badge, Calendar, Card, Modal, Divider, Tag } from "antd";
import { CalendarProps } from "antd/es/calendar";
import dayjs, { Dayjs } from "dayjs";

interface BookingType {
  id: string;
  title: string;
  roomName: string;
  bookerName: string;
  bookingStatus: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface Props {
  bookingFetchData: BookingType[];
}

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394; // Example number for demonstration
  }
  return null;
};

const BookingCalendar: React.FC<Props> = ({ bookingFetchData }) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (booking: BookingType) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const dailyBookings = bookingFetchData.filter((booking: BookingType) => {
      const bookingStartDate = dayjs(booking.startDate);
      const bookingEndDate = dayjs(booking.endDate);
      return (
        value.isSame(bookingStartDate, "day") ||
        value.isSame(bookingEndDate, "day") ||
        (value.isAfter(bookingStartDate, "day") && value.isBefore(bookingEndDate, "day"))
      );
    });

    return (
      <div className="events">
        {dailyBookings.map((booking: BookingType) => (
          <div key={booking.id} style={{ listStyle: "none" }}>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                borderRadius: "4px",
                padding: "2px 4px",
                display: "block",
                backgroundColor: booking.bookingStatus === "Approve" ? "#f6ffec" : booking.bookingStatus === "process" ? "#e6f4ff" : "#f0f0f0",
                cursor: "pointer",
                border:
                  booking.bookingStatus === "Approve"
                    ? "1px solid #b7eb8f"
                    : booking.bookingStatus === "process"
                    ? "1px solid #90caf9"
                    : "1px solid #ccc",
              }}
              onClick={() => showModal(booking)}
            >
              <Badge
                status="processing"
                text={booking.roomName}
                style={{
                  display: "block",
                }}
              />
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              {dayjs(booking.startDate).format("HH:mm")} - {dayjs(booking.endDate).format("HH:mm")}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["dateCellRender"] = (current) => {
    return dateCellRender(current);
  };

  const renderStatusTag = (status: string) => {
    switch (status) {
      case "Approve":
        return <Tag color={"green"}>อนุมัติสำเร็จ</Tag>;
      case "process":
        return <Tag color={"blue"}>กำลังรออนุมัติ</Tag>;
      case "cancel":
        return <Tag color="red">ยกเลิกการจอง</Tag>;
      default:
        return "Unknown Status";
    }
  };

  return (
    <>
      <Card>
        <Calendar dateCellRender={cellRender} monthCellRender={monthCellRender} />
      </Card>
      {selectedBooking && (
        <Modal title="รายละเอียดการจอง" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={400} footer={null}>
          <Divider />
          <p>
            <strong>หัวข้อประชุม :</strong> {selectedBooking.title}
          </p>
          <p>
            <strong>วันที่จอง :</strong> {dayjs(selectedBooking.startDate).format("YYYY-MM-DD")} -{" "}
            {dayjs(selectedBooking.endDate).format("YYYY-MM-DD")}
          </p>
          <p>
            <strong>เวลาที่จอง :</strong> {dayjs(selectedBooking.startDate).format("HH:mm")} - {dayjs(selectedBooking.endDate).format("HH:mm")}
          </p>
          <p>
            <strong>สถานะการจอง :</strong> {renderStatusTag(selectedBooking.bookingStatus)}
          </p>
          <Divider />
          <p>
            <strong>ชื่อผู้จอง :</strong> {selectedBooking.bookerName}
          </p>
        </Modal>
      )}
    </>
  );
};

export default BookingCalendar;
