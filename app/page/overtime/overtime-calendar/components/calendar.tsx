import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, Event as RbcEvent } from "react-big-calendar";
import { Col, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import { checkIcon, loadingIcon } from "@/components/icon";

export interface props {
  holiday: THoliday[];
  fetchDataHoliday: (value: string) => void;
}

interface CustomEvent extends RbcEvent {
  id: number | undefined;
  title: string;
  status: string;
  type: string;
  start: Date;
  end: Date;
}

interface THoliday {
  id: number;
  holidaysName: string;
  masterHolidaysYearId: number;
  holidaysDate: string;
  createdAt: string;
  updatedAt: string;
}

const CalendarPage: React.FC<props> = ({ holiday }): React.ReactElement => {
  const localizer = momentLocalizer(moment);
  const [visible, setVisible] = useState<boolean>(true);
  const [userClicked, setUserClicked] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    setUserClicked(false); // รีเซ็ตหลังโหลดหน้า
  }, []);

  const handleOk = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onSelectEventCalendar = (event: CustomEvent) => {
    if (event.type === "holiday") {
      message.info(event.title);
      return false;
    }
    form.setFieldsValue({
      ...event,
      title: event.title,
      status: event.status,
      start: dayjs(event.start),
      end: dayjs(event.end),
    });
    setVisible(true);

    // window.location.href = `${window.location.origin}/page/overtime/overtime-form?date=${dayjs(value).format("YYYY-MM-DD")}`;
  };

  const CustomEventComponent = ({ event }: { event: CustomEvent }) => {
    setUserClicked(true); // แสดงว่าเกิดจาก user จริง
    return (
      <span className="flex justify-start items-center gap-1">
        {event.status === "approved" ? checkIcon : event.type === "holiday" ? "" : loadingIcon} {event.title}
      </span>
    );
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

  const handleSelectSlot = (slotInfo: { start: any; end: any; action: "select" | "click" | "doubleClick" }) => {
    const clickedDate = dayjs(slotInfo.start).startOf("day");
    const hasEvent = holiday.some((event: any) => dayjs(event.holidaysDate).startOf("day").isSame(clickedDate));
    if (!hasEvent) {
      window.location.href = `${window.location.origin}/page/overtime/overtime-form?date=${dayjs(slotInfo.start).format("YYYY-MM-DD")}`;
    }
  };

  return (
    <div>
      {visible ? (
        <Modal title="รายละเอียด OT" open={visible} onCancel={onCancel} onOk={handleOk} okText="บันทึก" cancelText="ยกเลิก" footer={false}>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="title" label="ชื่อรายการ" rules={[{ required: true, message: "กรุณากรอกชื่อรายการ" }]}>
                  <Input placeholder="ระบุชื่อรายการ OT" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="start" label="เวลาเริ่ม" rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่ม" }]}>
                  <DatePicker style={{ width: "100%" }} placeholder="เลือกวันเวลาเริ่ม" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="end" label="เวลาสิ้นสุด" rules={[{ required: true, message: "กรุณาเลือกเวลาสิ้นสุด" }]}>
                  <DatePicker style={{ width: "100%" }} placeholder="เลือกวันเวลาสิ้นสุด" disabled />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="status" label="สถานะ" rules={[{ required: true, message: "กรุณาเลือกสถานะ" }]}>
                  <Select placeholder="เลือกสถานะ" disabled>
                    <Option value="waiting">รอดำเนินการ</Option>
                    <Option value="approved">อนุมัติ</Option>
                    <Option value="cancel">ยกเลิก</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      ) : null}

      <Calendar<CustomEvent>
        style={{ height: 500 }}
        localizer={localizer}
        popup
        selectable
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        onSelectSlot={handleSelectSlot}
        events={holiday.map((events: any) => {
          return {
            id: events.id,
            title: events.holidaysName,
            start: events.holidaysDate,
            end: events.holidaysDate,
            type: events.type,
            status: events.status,
          };
        })}
        messages={{
          next: ">",
          previous: "<",
        }}
        onSelectEvent={onSelectEventCalendar}
        components={{
          event: CustomEventComponent,
        }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={(event: CustomEvent) => {
          let backgroundColor = "#FFA500";
          let color = "#ffff";
          if (event.type === "holiday") {
            backgroundColor = "#FFA500";
            color = "#ffff";
          } else {
            if (event.status === "approved") {
              backgroundColor = "green";
              color = "#000000";
            } else if (event.status === "waiting") {
              backgroundColor = "blue";
              color = "#ffff";
            } else {
              backgroundColor = "silver";
              color = "#000000";
            }
          }
          return {
            style: {
              backgroundColor,
              color,
              fontSize: 10,
            },
          };
        }}
      />
    </div>
  );
};

export default CalendarPage;
