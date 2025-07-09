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
  endTime: string;
  startTime: string;
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
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { Option } = Select;

  const handleOk = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onSelectEventCalendar = (event: CustomEvent) => {
    console.log(event);

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
      startTime: event.startTime,
      endTime: event.endTime,
    });
    setVisible(true);
  };

  const CustomEventComponent = ({ event }: { event: CustomEvent }) => {
    const icon = event.status === "approved" ? checkIcon : event.type === "holiday" ? null : loadingIcon;
    return (
      <span className="flex justify-start items-center gap-1 text-[10px] text-white overflow-hidden">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="truncate">{event.title}</span>
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
                <Form.Item name="start" label="วันที่เริ่มทำ OT">
                  <DatePicker style={{ width: "100%" }} placeholder="เลือกวันเวลาเริ่ม" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="end" label="เวันที่สิ้นสุดทำ OT">
                  <DatePicker style={{ width: "100%" }} placeholder="เลือกวันเวลาสิ้นสุด" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="startTime" label="เวลาเริ่ม">
                  <Input style={{ width: "100%" }} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endTime" label="เวลาสิ้นสุด">
                  <Input style={{ width: "100%" }} disabled />
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
            startTime: events.startTime,
            end: events.holidaysDate,
            endTime: events.endTime,
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
              backgroundColor = "#4CAF50";
              color = "#000000";
            } else if (event.status === "waiting") {
              backgroundColor = "#25B9EB";
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
