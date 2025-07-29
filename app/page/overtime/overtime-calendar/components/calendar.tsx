import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, Event as RbcEvent } from "react-big-calendar";
import { Modal, Form, Input, DatePicker, Select, Row, Col, Badge, Tag, Space, Typography, Divider, Card, Avatar, message } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { checkIcon, loadingIcon } from "@/components/icon";
import { IOverTimeForm } from "@/app/common/overtime";

const { Text } = Typography;

export interface props {
  calendar: IOverTimeForm[];
  fetchDataHoliday: (value: string) => void;
  handleChangeMonth: (month: Dayjs | string) => void;
}

const CalendarPage: React.FC<props> = ({ calendar, handleChangeMonth }): React.ReactElement => {
  const localizer = momentLocalizer(moment);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const detail = form.getFieldsValue(true);
  const { Option } = Select;

  const handleOk = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          color: "success",
          icon: <CheckCircleOutlined />,
          text: "อนุมัติ",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "waiting":
        return {
          color: "warning",
          icon: <ExclamationCircleOutlined />,
          text: "รอดำเนินการ",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "cancel":
        return {
          color: "error",
          icon: <CloseCircleOutlined />,
          text: "ยกเลิก",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          color: "default",
          icon: <ExclamationCircleOutlined />,
          text: "ไม่อนุมัติ",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const statusConfig = getStatusConfig(detail.status);

  const onSelectEventCalendar = (event: IOverTimeForm) => {
    if (event.type === "holiday") {
      message.info(event.detailWork);
      return false;
    }
    form.setFieldsValue({
      ...event,
      dateStart: event?.dateStart ? dayjs(event?.dateStart) : null,
      startTime: event?.startTime,
      endTime: event?.endTime,
      approvedDate: event?.approvedDate ? dayjs(event?.approvedDate) : null,
      createdAt: event?.createdAt ? dayjs(event?.createdAt) : null,
      updatedAt: event?.updatedAt ? dayjs(event?.updatedAt) : null,
    });
    setVisible(true);
  };

  const CustomEventComponent = ({ event }: { event: IOverTimeForm }) => {
    const icon = event.status === "approved" ? checkIcon : event.type === "holiday" ? null : loadingIcon;
    return (
      <span className="flex justify-start items-center gap-1 text-[10px] text-white overflow-hidden">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="truncate">{event.detailWork}</span>
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
    const hasEvent = calendar.some((event: any) => dayjs(event.holidaysDate).startOf("day").isSame(clickedDate));
    if (!hasEvent) {
      window.location.href = `${window.location.origin}/page/overtime/overtime-form?date=${dayjs(slotInfo.start).format("YYYY-MM-DD")}`;
    }
  };

  return (
    <div>
      {visible ? (
        <Modal
          title={
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-white text-sm" />
                </div>
                <span className="text-lg font-semibold text-gray-800">รายละเอียด OT</span>
              </div>
              <Badge status={statusConfig.color as "default" | "success" | "warning" | "error" | "processing"} />
            </div>
          }
          open={visible}
          onCancel={onCancel}
          onOk={handleOk}
          okText="บันทึก"
          cancelText="ยกเลิก"
          footer={false}
          width={600}
          className="top-8">
          <div className="py-4">
            <Card className={`mb-4 ${statusConfig.bgColor} ${statusConfig.borderColor} border-l-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar size={40} icon={<UserOutlined />} className="bg-blue-500" />
                  <div>
                    <Text strong className="text-lg block">
                      {detail.fullname}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      ID: {detail.overTimeID.slice(-8)}
                    </Text>
                  </div>
                </div>
                <div className="text-right">
                  <Tag icon={statusConfig.icon} color={statusConfig.color} className="px-3 py-1 text-sm font-medium">
                    {statusConfig.text}
                  </Tag>
                  <div className="text-xs text-gray-500 mt-1">{dayjs(detail.createdAt).format("DD/MM/YYYY HH:mm")}</div>
                </div>
              </div>
            </Card>

            <Form form={form} layout="vertical" className="space-y-1">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="title"
                    label={<span className="text-sm font-medium text-gray-700">ชื่อรายการ</span>}
                    rules={[{ required: true, message: "กรุณากรอกชื่อรายการ" }]}>
                    <Input placeholder="ระบุชื่อรายการ OT" disabled className="rounded-lg border-gray-200 bg-gray-50" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="dateStart" label={<span className="text-sm font-medium text-gray-700">วันที่เริ่มทำ OT</span>}>
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="เลือกวันเวลาเริ่ม"
                      disabled
                      className="rounded-lg border-gray-200 bg-gray-50"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="dateStart" label={<span className="text-sm font-medium text-gray-700">วันที่สิ้นสุดทำ OT</span>}>
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="เลือกวันเวลาสิ้นสุด"
                      disabled
                      className="rounded-lg border-gray-200 bg-gray-50"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="startTime" label={<span className="text-sm font-medium text-gray-700">เวลาเริ่ม</span>}>
                    <Input
                      style={{ width: "100%" }}
                      disabled
                      prefix={<ClockCircleOutlined className="text-gray-400" />}
                      className="rounded-lg border-gray-200 bg-gray-50"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="endTime" label={<span className="text-sm font-medium text-gray-700">เวลาสิ้นสุด</span>}>
                    <Input
                      style={{ width: "100%" }}
                      disabled
                      prefix={<ClockCircleOutlined className="text-gray-400" />}
                      className="rounded-lg border-gray-200 bg-gray-50"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="status"
                    label={<span className="text-sm font-medium text-gray-700">สถานะ</span>}
                    rules={[{ required: true, message: "กรุณาเลือกสถานะ" }]}>
                    <Select placeholder="เลือกสถานะ" disabled className="rounded-lg">
                      <Option value="waiting">รอดำเนินการ</Option>
                      <Option value="approved">อนุมัติ</Option>
                      <Option value="reject">ไม่อนุมัติ</Option>
                      <Option value="cancel">ยกเลิก</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            {/* Additional Info Summary */}
            <Divider className="my-4" />

            <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg p-4 border border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <Text type="secondary">รายละเอียดงาน:</Text>
                  <Text className="font-medium">{detail.detailWork}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">ลูกค้า:</Text>
                  <Text className="font-medium">{detail.customerName}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">เวลาทำงาน:</Text>
                  <Text className="font-medium text-green-600">{detail.workingTime} ชม.</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">เวลาพัก:</Text>
                  <Text className="font-medium text-orange-600">{detail.breakTime} ชม.</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">เวลารวม:</Text>
                  <Text className="font-medium text-blue-600">{detail.totalTime} ชม.</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">เบอร์ติดต่อ:</Text>
                  <Text className="font-medium">{detail.phoneNumber || "-"}</Text>
                </div>
              </div>
            </div>

            {/* Calculation Summary */}
            {detail.calculate && detail.calculate.length > 0 && (
              <div className="mt-4">
                <Text strong className="text-sm text-gray-700 block mb-2">
                  การคำนวณค่าตอบแทน
                </Text>
                <div className="space-y-2">
                  {detail.calculate.map((calc: { date: string; rate: number; timeRate: number; typeRate: string }, index: number) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <Tag color={calc.typeRate === "overtime" ? "red" : "green"} className="min-w-[70px] text-center">
                          {calc.typeRate === "overtime" ? "ล่วงเวลา" : "ปกติ"}
                        </Tag>
                        <Text className="text-sm">{calc.timeRate} ชม.</Text>
                      </div>
                      <Text className="font-medium text-orange-600">อัตรา ×{calc.rate}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      ) : null}

      <Calendar<IOverTimeForm>
        style={{ height: 500 }}
        localizer={localizer}
        popup
        selectable
        startAccessor="dateStart"
        endAccessor="dateStart"
        defaultView="month"
        views={["month"]}
        onSelectSlot={handleSelectSlot}
        events={calendar.map((events: any) => {
          return { ...events };
        })}
        messages={{
          next: ">",
          previous: "<",
        }}
        onSelectEvent={onSelectEventCalendar}
        components={{
          event: CustomEventComponent,
        }}
        onNavigate={(newDate, view, action) => {
          handleChangeMonth(dayjs(newDate));
        }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={(event: IOverTimeForm) => {
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
