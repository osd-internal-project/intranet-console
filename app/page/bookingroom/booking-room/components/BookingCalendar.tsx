import React, { useState } from "react";
import { Badge, Modal, Divider, Tag, Form, Input, DatePicker, Collapse } from "antd";
import { CalendarProps } from "antd/es/calendar";
import dayjs, { Dayjs } from "dayjs";
import { Calendar, momentLocalizer, Event, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined } from "@ant-design/icons";
const localizer = momentLocalizer(moment);

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
    return 1394;
  }
  return null;
};

const { TextArea } = Input;

const BookingCalendar: React.FC<Props> = ({ bookingFetchData }) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const [statusModalDetail, setStatusModalDetail] = useState(false);
  const [formUpdate] = useForm();

  // const showModal = (booking: BookingType) => {
  //   setSelectedBooking(booking);
  //   setIsModalVisible(true);
  // };

  // const handleOk = () => {
  //   setIsModalVisible(false);
  // };

  const onCancleModalDetail = () => {
    setStatusModalDetail(false);
  };

  // const monthCellRender = (value: Dayjs) => {
  //   const num = getMonthData(value);
  //   return num ? (
  //     <div className="notes-month">
  //       <section>{num}</section>
  //       <span>Backlog number</span>
  //     </div>
  //   ) : null;
  // };

  // const dateCellRender = (value: Dayjs) => {
  //   const dailyBookings = bookingFetchData.filter((booking: BookingType) => {
  //     const bookingStartDate = dayjs(booking.startDate);
  //     const bookingEndDate = dayjs(booking.endDate);
  //     return (
  //       value.isSame(bookingStartDate, "day") ||
  //       value.isSame(bookingEndDate, "day") ||
  //       (value.isAfter(bookingStartDate, "day") && value.isBefore(bookingEndDate, "day"))
  //     );
  //   });

  //   return (
  //     <div className="events">
  //       {dailyBookings.map((booking: BookingType) => (
  //         <div key={booking.id} style={{ listStyle: "none" }}>
  //           <div
  //             style={{
  //               overflow: "hidden",
  //               textOverflow: "ellipsis",
  //               whiteSpace: "nowrap",
  //               borderRadius: "4px",
  //               padding: "2px 4px",
  //               display: "block",
  //               backgroundColor: booking.bookingStatus === "Approve" ? "#f6ffec" : booking.bookingStatus === "process" ? "#e6f4ff" : "#f0f0f0",
  //               cursor: "pointer",
  //               border:
  //                 booking.bookingStatus === "Approve"
  //                   ? "1px solid #b7eb8f"
  //                   : booking.bookingStatus === "process"
  //                   ? "1px solid #90caf9"
  //                   : "1px solid #ccc",
  //             }}
  //             onClick={() => showModal(booking)}
  //           >
  //             <Badge
  //               status="processing"
  //               text={booking.roomName}
  //               style={{
  //                 display: "block",
  //               }}
  //             />
  //           </div>
  //           <div style={{ fontSize: "12px", color: "#888" }}>
  //             {dayjs(booking.startDate).format("HH:mm")} - {dayjs(booking.endDate).format("HH:mm")}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // const cellRender: CalendarProps<Dayjs>["dateCellRender"] = (current) => {
  //   return dateCellRender(current);
  // };

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

  const onSelectEventCalendar = (event: Event) => {
    console.log(event);
    setStatusModalDetail(true);
  };

  const onRangeChangeCalendar = (range: Date[] | { start: Date; end: Date }, view?: View | undefined) => {};

  console.log(bookingFetchData)

  return (
    <>
      <Calendar
        localizer={localizer}
        events={bookingFetchData.map((booking: BookingType) => ({
          id: booking.id,
          title: booking.roomName,
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
          status: booking.bookingStatus,
          description: booking.description,
          userName: booking.bookerName,
        }))}
        style={{ height: 500 }}
        onSelectEvent={onSelectEventCalendar}
        eventPropGetter={(event: any) => {
          if (event.status === "success") {
            return {
              style: { backgroundColor: " #4CAF50", color: "#fff", fontSize: 10 },
            };
          } else if (event.status === "cancel") {
            return {
              style: { backgroundColor: "#D24545", color: "#fff", fontSize: 10 },
            };
          } else {
            return {
              style: { backgroundColor: "#2196F3", color: "#fff", fontSize: 10 },
            };
          }
        }}
        onRangeChange={onRangeChangeCalendar}
        // onDoubleClickEvent={onDoubleClickEventCalendar}
      />
      {/* <Card>
        <Calendar dateCellRender={cellRender} monthCellRender={monthCellRender} />
      </Card> */}
      <Modal title="รายละเอียดการจอง" open={statusModalDetail} width={750} onCancel={onCancleModalDetail} footer={null}>
        <Form form={formUpdate} labelCol={{ span: 4 }}>
          <Collapse
            bordered={false}
            defaultActiveKey={["1", "2", "3"]}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            items={[
              {
                key: "1",
                label: "ข้อมูลการจอง",
                children: (
                  <>
                    <Form.Item label="หัวข้อประชุม">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="ห้อง">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="เริ่มวันที่">
                      <DatePicker />
                    </Form.Item>
                    <Form.Item label="เวลา">
                      <DatePicker />
                    </Form.Item>
                    <Form.Item label="วันทำการจอง">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="อื่นๆ">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: "2",
                label: "ข้อมูลผู้จอง",
                children: (
                  <>
                    <Form.Item label="ชื่อผู้จอง">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="สามารถติดต่อ โทร">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: "3",
                label: "Status",
                children: (
                  <>
                    <Form.Item label="ลงชื่อ">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="วันทำการ">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="เวลาทำการ">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                  </>
                ),
              },
            ]}
          />
        </Form>
        {/* <p>
          <strong>หัวข้อประชุม :</strong> {selectedBooking.title}
        </p>
        <p>
          <strong>วันที่จอง :</strong> {dayjs(selectedBooking.startDate).format("YYYY-MM-DD")} - {dayjs(selectedBooking.endDate).format("YYYY-MM-DD")}
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
        </p> */}
      </Modal>
    </>
  );
};

export default BookingCalendar;
