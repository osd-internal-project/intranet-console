import React, { useState } from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Button, Calendar, Form, Input, Modal, Select } from "antd";
import type { Dayjs } from "dayjs";

type FieldType = {
  floor: string;
  housekeeper: string;
  duration: string;
  result: string;
};
const CalendarComponenet: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const getListData = (value: Dayjs) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
        ];
        break;
      case 10:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
          { type: "error", content: "This is error event." },
        ];
        break;
      case 15:
        listData = [
          { type: "warning", content: "This is warning event" },
          { type: "success", content: "This is very long usual event......" },
          { type: "error", content: "This is error event 1." },
          { type: "error", content: "This is error event 2." },
          { type: "error", content: "This is error event 3." },
          { type: "error", content: "This is error event 4." },
        ];
        break;
      default:
    }
    return listData || [];
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
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
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps["status"]} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const onSelect = (event: any) => {
    console.log(event);
    setOpenModal(true);
  };

  const handleCancelModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Calendar cellRender={cellRender} onSelect={onSelect} />
      <Modal title="ลงสถานะการทำความสะอาด" open={openModal} onCancel={handleCancelModal} footer={[]}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          //   onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType> label="ชั้น" name="floor" rules={[{ required: true, message: "กรุณากรอกข้อมูล ชั้น!" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="ชื่อแม่บ้าน" name="housekeeper" rules={[{ required: true, message: "กรุณากรอกข้อมูล ชื่อแม่บ้าน!" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="ช่วงเวลา" name="duration" rules={[{ required: true, message: "กรุณากรอกข้อมูล ช่วงเวลา!" }]}>
            <Select
              options={[
                { value: "morning", label: "ช่วงเช้า" },
                { value: "afternoon", label: "ช่วงบ่าย" },
              ]}
            />
          </Form.Item>

          <Form.Item<FieldType> label="ผลลัพท์" name="result" rules={[{ required: true, message: "กรุณากรอกข้อมูล ผลลัพท์!" }]}>
            <Select
              options={[
                { value: "5", label: "ดีมาก" },
                { value: "4", label: "ดี" },
                { value: "3", label: "ปานกลาง" },
                { value: "2", label: "แย่" },
                { value: "1", label: "แย่มาก" },
              ]}
            />
          </Form.Item>
          <div className="flex justify-end">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CalendarComponenet;
