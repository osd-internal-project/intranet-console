import React, { useState } from "react";
import { Modal, Tag, Form, Input, DatePicker, Collapse, message } from "antd";
import moment from "moment";
import { Calendar, momentLocalizer, Event as RbcEvent } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined } from "@ant-design/icons";
import { checkIcon, loadingIcon } from "@/components/icon";
import dayjs, { Dayjs } from "dayjs";
import { dateToStringThWithTime } from "@/app/utils/format";

const localizer = momentLocalizer(moment);
const { TextArea } = Input;

interface BookingType {
  id: string;
  title: string;
  roomName: string;
  bookerName: string;
  bookerPhone: string;
  bookingStatus: string;
  approver: string;
  description: string;
  startDate: string;
  approveDate: string;
  endDate: string;
  updatedAt: string;
}

interface Props {
  bookingFetchCalendar: BookingType[];
  handleChangeMonth: (month: Dayjs | string) => void;
}

interface CustomEvent extends RbcEvent {
  id: string;
  status: string;
  description: string;
  userName: string;
}

const BookingCalendar: React.FC<Props> = ({ bookingFetchCalendar, handleChangeMonth }) => {
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const [statusModalDetail, setStatusModalDetail] = useState(false);
  const [formUpdate] = useForm();

  const onCancelModalDetail = () => {
    setStatusModalDetail(false);
    setSelectedBooking(null);
  };

  const renderStatusTag = (status: string) => {
    switch (status) {
      case "Approve":
        return <Tag color="green">อนุมัติสำเร็จ</Tag>;
      case "process":
        return <Tag color="blue">กำลังรออนุมัติ</Tag>;
      case "cancel":
        return <Tag color="red">ยกเลิกการจอง</Tag>;
      default:
        return "Unknown Status";
    }
  };

  const CustomEventComponent = ({ event }: { event: CustomEvent }) => {
    const icon = event.status === "Approve" ? checkIcon : event.status === "holiday" ? null : loadingIcon;
    return (
      <span className="flex justify-start items-center gap-1 text-[10px] text-white overflow-hidden">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="truncate">
          {event.start ? dateToStringThWithTime(event.start) : ""}-{event.end ? dateToStringThWithTime(event.end) : ""}, {event.title}
        </span>
      </span>
    );
  };

  const onSelectEventCalendar = (event: CustomEvent) => {
    if (event.status === "holiday") {
      message.info(event.title);
      return false;
    }
    const booking = bookingFetchCalendar.find((b) => b.id === event.id);
    if (booking) {
      setSelectedBooking(booking);
      formUpdate.setFieldsValue({
        ...booking,
        startDate: dayjs(booking.startDate),
        endDate: dayjs(booking.endDate),
        approveDate: dayjs(booking.approveDate).format("DD-MM-YYYY HH:mm"),
      });
      setStatusModalDetail(true);
    }
  };

  const dayPropGetter = (date: any) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return {
        className: "weekend-day",
      };
    }
    return {};
  };

  // function reduceEventsToOnePerDay(events: CustomEvent[]) {
  //   const grouped: Record<string, CustomEvent[]> = {};

  //   // group events by day
  //   events.forEach((ev) => {
  //     const dayKey = dayjs(ev.start).format("YYYY-MM-DD");
  //     if (!grouped[dayKey]) {
  //       grouped[dayKey] = [];
  //     }
  //     grouped[dayKey].push(ev);
  //   });

  //   // keep only the first event in each day
  //   return Object.values(grouped).map((evts) => evts[0]);
  // }

  return (
    <>
      <Calendar<CustomEvent>
        localizer={localizer}
        messages={{
          next: ">",
          previous: "<",
          showMore: (total: number) => `+${total} more`,
        }}
        dayLayoutAlgorithm="no-overlap"
        events={bookingFetchCalendar.map((booking: BookingType, idx: number) => ({
          id: booking.id,
          title: booking.roomName,
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
          status: booking.bookingStatus,
          description: booking.description,
          userName: booking.bookerName,
          isHidden: idx > 0,
        }))}
        onNavigate={(newDate, view, action) => {
          handleChangeMonth(dayjs(newDate));
        }}
        popup
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        components={{
          event: CustomEventComponent,
        }}
        dayPropGetter={dayPropGetter}
        style={{ height: 500 }}
        onSelectEvent={onSelectEventCalendar}
        eventPropGetter={(event: CustomEvent) => {
          let backgroundColor = "#FFA500";
          backgroundColor = event.status === "Approve" ? "#4CAF50" : event.status === "cancel" ? "#D24545" : "#FFA500";
          return {
            style: { backgroundColor, color: "#fff", fontSize: 10 },
          };
        }}
      />
      <Modal title="รายละเอียดการจอง" open={statusModalDetail} width={750} onCancel={onCancelModalDetail} footer={null}>
        {selectedBooking && (
          <Form form={formUpdate} labelCol={{ span: 4 }}>
            <Collapse bordered={false} defaultActiveKey={["1"]} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
              <Collapse.Panel header="ข้อมูลการจอง" key="1">
                <Form.Item label="หัวข้อการประชุม" name="title">
                  <Input className="read-only-input" disabled />
                </Form.Item>
                <Form.Item label="ห้อง" name="roomName">
                  <Input className="read-only-input" disabled />
                </Form.Item>
                <Form.Item label="เริ่มวันที่" name="startDate">
                  <DatePicker showTime={false} format="DD-MM-YYYY HH:mm" disabled className="read-only-input" />
                </Form.Item>
                <Form.Item label="สิ้นสุดวันที่" name="endDate">
                  <DatePicker showTime={false} format="DD-MM-YYYY HH:mm" disabled className="read-only-input" />
                </Form.Item>
                <Form.Item label="คำอธิบาย" name="note">
                  <TextArea className="read-only-input" disabled />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header="ข้อมูลผู้จอง" key="2">
                <Form.Item label="ชื่อผู้จอง" name="bookerName">
                  <Input className="read-only-input" disabled />
                </Form.Item>
                <Form.Item label="ติดต่อโทร" name="bookerPhone">
                  <Input className="read-only-input" disabled />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header="Status" key="3">
                <Form.Item label="สถานะ">{renderStatusTag(selectedBooking.bookingStatus)}</Form.Item>
                {selectedBooking.bookingStatus !== "process" && (
                  <>
                    <Form.Item label="ผู้อนุมัติ" name="approver">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="วันที่อนุมัติ" name="approveDate">
                      <Input disabled className="read-only-input" />
                    </Form.Item>
                  </>
                )}
              </Collapse.Panel>
            </Collapse>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default BookingCalendar;
