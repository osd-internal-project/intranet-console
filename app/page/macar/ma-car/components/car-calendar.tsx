import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Collapse, message } from "antd";
import moment from "moment";
import { Calendar, momentLocalizer, Event as RbcEvent } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined } from "@ant-design/icons";
import { MaCarBookCalendarType } from "../../common/index";
import dayjs from "dayjs";
import { dateFormatTime } from "@/app/utils";
import { CheckStatusMaCarBookType } from "@/app/utils/validatefield";
import { checkIcon, loadingIcon } from "@/components/icon";
interface CustomEvent extends RbcEvent {
  id: number;
  carBookApprovedStatus: string;
  description: string;
  userName: string;
}
interface Props {
  maFetchCalendar: MaCarBookCalendarType[];
}

const CalendarComponent: React.FC<Props> = ({ maFetchCalendar }) => {
  const [formUpdate] = useForm();
  const [modalMaCarBookDetail, setModalMaCarBookDetail] = useState(false);
  const [selectedMa, setSelectedMa] = useState<MaCarBookCalendarType | null>(null);
  const localizer = momentLocalizer(moment);
  const { TextArea } = Input;

  const onCancelModalDetail = () => {
    setModalMaCarBookDetail(false);
    setSelectedMa(null);
  };

  const onSelectEventCalendar = (event: CustomEvent) => {
    if (event.carBookApprovedStatus === "holiday") {
      message.info(event.title);
      return false;
    }
    const maCarCalendar = maFetchCalendar.find((b) => b.id === event.id);
    if (maCarCalendar) {
      setSelectedMa(maCarCalendar);
      formUpdate.setFieldsValue({
        ...maCarCalendar,
        carBookStartDate: dayjs(maCarCalendar.carBookStartDate),
        carBookEndDate: dayjs(maCarCalendar.carBookEndDate),
        approveDate: dayjs(maCarCalendar.approveDate),
      });
      setModalMaCarBookDetail(true);
    }
  };

  const CustomEventComponent = ({ event }: { event: CustomEvent }) => {
    const icon = event.carBookApprovedStatus === "Approve" ? checkIcon : event.carBookApprovedStatus === "holiday" ? null : loadingIcon;
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
  return (
    <>
      <Calendar<CustomEvent>
        style={{ height: 500 }}
        localizer={localizer}
        popup
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        events={maFetchCalendar
          .filter((maCarCalendar: MaCarBookCalendarType) => maCarCalendar.carBookApprovedStatus !== "Cancel")
          .map((maCarCalendar: MaCarBookCalendarType) => ({
            id: maCarCalendar.id,
            title: `${maCarCalendar.carName} ${maCarCalendar.createdByName ? `(${maCarCalendar.createdByName})` : ""}`,
            start: new Date(maCarCalendar.carBookStartDate),
            end: new Date(maCarCalendar.carBookEndDate),
            carBookApprovedStatus: maCarCalendar.carBookApprovedStatus,
            description: maCarCalendar.description,
            userName: maCarCalendar.userName,
          }))}
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
          backgroundColor = event.carBookApprovedStatus === "Approve" ? "#4CAF50" : event.carBookApprovedStatus === "holiday" ? "#FFA500" : "#2196F3";
          return {
            style: { backgroundColor, color: "#fff", fontSize: 10 },
          };
        }}
      />

      <Modal title="รายละเอียดการจอง" open={modalMaCarBookDetail} width={600} onCancel={onCancelModalDetail} footer={null}>
        {selectedMa && (
          <Form form={formUpdate} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Collapse
              bordered={false}
              defaultActiveKey={["1", "2", "3"]}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
              <Collapse.Panel header="ข้อมูลการจอง" key="1">
                <Form.Item label="ชื่อรถ" name="carName">
                  <Input className="read-only-input-calendar" disabled />
                </Form.Item>
                <Form.Item label="วันที่เริ่มจอง" name="carBookStartDate">
                  <DatePicker
                    format={dateFormatTime(formUpdate.getFieldValue("carBookStartDate"))}
                    className="read-only-input-calendar"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item label="วันที่สิ้นสุดการจอง" name="carBookEndDate">
                  <DatePicker
                    format={dateFormatTime(formUpdate.getFieldValue("carBookEndDate"))}
                    className="read-only-input-calendar"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item label="สถานที่ไป" name="carBookPlace">
                  <Input className="read-only-input-calendar" disabled />
                </Form.Item>
                <Form.Item label="จังหวัด" name="carBookProvince">
                  <Input className="read-only-input-calendar" disabled />
                </Form.Item>
                <Form.Item label="จำนวนผู้ใช้รถ" name="carBookUsers">
                  <Input className="read-only-input-calendar" disabled />
                </Form.Item>
                <Form.Item label="รายละเอียด" name="detail">
                  <TextArea className="read-only-input-calendar" disabled />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header="ข้อมูลผู้จอง" key="2">
                <Form.Item label="ชื่อผู้จอง" name="createdByName">
                  <Input className="read-only-input-calendar" disabled />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header="สถานะ" key="3">
                <Form.Item label="สถานะ">{CheckStatusMaCarBookType(selectedMa.carBookApprovedStatus)}</Form.Item>
                {selectedMa.carBookApprovedStatus !== "Process" && (
                  <div>
                    <Form.Item label="ผู้อนุมัติ" name="carBookApprovedByName">
                      <Input className="read-only-input-calendar" disabled />
                    </Form.Item>
                    <Form.Item label="วันที่อนุมัติ" name="approveDate">
                      <DatePicker
                        format={dateFormatTime(formUpdate.getFieldValue("approveDate"))}
                        className="read-only-input-calendar"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </div>
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
