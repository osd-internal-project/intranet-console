import React, { useState } from "react";
import { Modal, Tag, Form, Input, DatePicker, Collapse } from "antd";
import moment from "moment";
import {
  Calendar,
  momentLocalizer,
  Event as RbcEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined } from "@ant-design/icons";

const localizer = momentLocalizer(moment);
const { TextArea } = Input;

interface MaCarType {
  id: string;
  carId: string;
  carName: string;
  carPetrol: string;
  detail: string;
  carBookApprovedStatus: string;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  carBookProvince: string;
  carBookPlace: string;
  carBookUsers: number;
  carBookStartDate: Date;
  carBookEndDate: Date;
  approveDate: string;
  carBookApprovedDate?: Date;
  carBookApprovedById?: string;
  carBookApprovedByName?: string;
  description: string;
  userName: string;
}

interface Props {
  maFetchCalendar: MaCarType[];
}

interface CustomEvent extends RbcEvent {
  id: string;
  carBookApprovedStatus: string;
  description: string;
  userName: string;
}

const CalendarComponent: React.FC<Props> = ({ maFetchCalendar }) => {
  const [selectedMa, setSelectedMa] = useState<MaCarType | null>(null);
  const [carBookApprovedStatusModalDetail, setStatusModalDetail] =
    useState(false);
  const [formUpdate] = useForm();
  const onCancelModalDetail = () => {
    setStatusModalDetail(false);
    setSelectedMa(null);
  };
  const renderStatusTag = (status: string) => {
    switch (status) {
      case "Approve":
        return <Tag color="green">อนุมัติสำเร็จ</Tag>;
      case "process":
        return <Tag color="blue">กำลังรออนุมัติ</Tag>;
      case "Cancel":
        return <Tag color="red">ยกเลิกการจอง</Tag>;
      case "Return":
        return <Tag color="gray">คืนรถสำเร็จ</Tag>;
      default:
        return "Unknown Status";
    }
  };

  const onSelectEventCalendar = (event: CustomEvent) => {
    const ma = maFetchCalendar.find((b) => b.id === event.id);
    if (ma) {
      setSelectedMa(ma);
      formUpdate.setFieldsValue({
        ...ma,
        carBookStartDate: moment(ma.carBookStartDate),
        carBookEndDate: moment(ma.carBookEndDate),
        approveDate: ma.approveDate
          ? moment(ma.approveDate).format("DD-MM-YYYY HH:mm")
          : undefined,
      });
      setStatusModalDetail(true);
    }
  };

  return (
    <>
      <Calendar<CustomEvent>
        localizer={localizer}
        events={maFetchCalendar.map((ma: MaCarType) => ({
          id: ma.id,
          title: ma.carName,
          start: new Date(ma.carBookStartDate),
          end: new Date(ma.carBookEndDate),
          carBookApprovedStatus: ma.carBookApprovedStatus,
          description: ma.description,
          userName: ma.userName,
        }))}
        style={{ height: 500 }}
        onSelectEvent={onSelectEventCalendar}
        eventPropGetter={(event: CustomEvent) => {
          const backgroundColor =
            event.carBookApprovedStatus === "Approve"
              ? "#4CAF50"
              : event.carBookApprovedStatus === "Cancel"
              ? "#D24545"
              : "#2196F3";
          return {
            style: { backgroundColor, color: "#fff", fontSize: 10 },
          };
        }}
      />
      <Modal
        title="รายละเอียดการจอง"
        visible={carBookApprovedStatusModalDetail}
        width={750}
        onCancel={onCancelModalDetail}
        footer={null}
      >
        {selectedMa && (
          <Form form={formUpdate} labelCol={{ span: 4 }}>
            <Collapse
              bordered={false}
              defaultActiveKey={["1", "2", "3"]}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              <Collapse.Panel header="ข้อมูลการจอง" key="1">
                <Form.Item label="ชื่อรถ" name="carName">
                  <Input className="read-only-input" disabled />
                </Form.Item>
                <Form.Item label="เริ่มวันที่" name="carBookStartDate">
                  <DatePicker
                    showTime={false}
                    format="DD-MM-YYYY HH:mm"
                    disabled
                    className="read-only-input"
                  />
                </Form.Item>
                <Form.Item label="สิ้นสุดวันที่" name="carBookEndDate">
                  <DatePicker
                    showTime={false}
                    format="DD-MM-YYYY HH:mm"
                    disabled
                    className="read-only-input"
                  />
                </Form.Item>
                <Form.Item label="จังหวัดที่จอดรถ" name="carBookProvince">
                  <Input className="read-only-input" disabled />
                </Form.Item>
                <Form.Item label="สถานที่จอดรถ" name="carBookPlace">
                  <Input className="read-only-input" disabled />
                </Form.Item>
                <Form.Item label="จำนวนผู้ใช้รถ" name="carBookUsers">
                  <Input className="read-only-input" disabled />
                </Form.Item>
                <Form.Item label="รายละเอียด" name="detail">
                  <TextArea className="read-only-input" disabled />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header="ข้อมูลผู้จอง" key="2">
                <Form.Item label="ชื่อผู้จอง" name="createdByName">
                  <Input className="read-only-input" disabled />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header="สถานะ" key="3">
                <Form.Item label="สถานะ">
                  {renderStatusTag(selectedMa.carBookApprovedStatus)}
                </Form.Item>
                {selectedMa.carBookApprovedStatus !== "process" && (
                  <>
                    <Form.Item label="ผู้อนุมัติ" name="carBookApprovedByName">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="วันที่อนุมัติ" name="carBookApprovedDate">
                      <Input className="read-only-input" disabled />
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
export default CalendarComponent;
