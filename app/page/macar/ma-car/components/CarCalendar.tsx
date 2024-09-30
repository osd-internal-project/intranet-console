import React, { useState } from "react";
import {
  Modal,
  Tag,
  Form,
  Input,
  DatePicker,
  Collapse,
  TimePicker,
} from "antd";
import moment from "moment";
import {
  Calendar,
  momentLocalizer,
  Event as RbcEvent,
} from "react-big-calendar";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined } from "@ant-design/icons";
import { MaCarBookCalendarType } from "../../common/index";
import dayjs from "dayjs";

const localizer = momentLocalizer(moment);
const { TextArea } = Input;

interface Props {
  maFetchCalendar: MaCarBookCalendarType[];
}

interface CustomEvent extends RbcEvent {
  id: number;
  carBookApprovedStatus: string;
  description: string;
  userName: string;
}

const CalendarComponent: React.FC<Props> = ({ maFetchCalendar }) => {
  const [formUpdate] = useForm();
  const [modalMaCarBookDetail, setModalMaCarBookDetail] = useState(false);
  const [selectedMa, setSelectedMa] = useState<MaCarBookCalendarType | null>(
    null
  );

  const onCancelModalDetail = () => {
    setModalMaCarBookDetail(false);
    setSelectedMa(null);
  };

  const renderStatusTag = (status: string) => {
    let color = "";
    let text = "";
    let icon = null;
    switch (status) {
      case "Process":
        color = "DodgerBlue";
        text = "กำลังรออนุมัติ";
        icon = <SyncOutlined spin />;
        break;
      case "Cancel":
        color = "silver";
        text = "ยกเลิก";
        icon = <CloseCircleOutlined />;
        break;
      case "Approve":
        color = "LimeGreen";
        text = "อนุมัติแล้ว";
        icon = <CheckCircleOutlined />;
        break;
      case "DisapProved":
        color = "OrangeRed";
        text = "ไม่อนุมัติ";
        icon = <CloseCircleOutlined />;
        break;
      case "Return":
        color = "Gold";
        text = "แจ้งคืนรถแล้ว";
        icon = <ExclamationCircleOutlined />;
        break;
      case "Completed":
        color = "MediumPurple";
        text = "คืนรถสำเร็จ";
        icon = <CheckCircleOutlined />;
        break;
      default:
        color = "default";
        text = "Unknown Status";
        break;
    }

    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  const onSelectEventCalendar = (event: CustomEvent) => {
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

  return (
    <>
      <Calendar<CustomEvent>
        localizer={localizer}
        events={maFetchCalendar
          .filter(
            (maCarCalendar: MaCarBookCalendarType) =>
              maCarCalendar.carBookApprovedStatus === "Approve" ||
              maCarCalendar.carBookApprovedStatus === "Process"
          )
          .map((maCarCalendar: MaCarBookCalendarType) => ({
            id: maCarCalendar.id,
            title: maCarCalendar.carName,
            start: new Date(maCarCalendar.carBookStartDate),
            end: new Date(maCarCalendar.carBookEndDate),
            carBookApprovedStatus: maCarCalendar.carBookApprovedStatus,
            description: maCarCalendar.description,
            userName: maCarCalendar.userName,
          }))}
        style={{ height: 500 }}
        onSelectEvent={onSelectEventCalendar}
        eventPropGetter={(event: CustomEvent) => {
          const backgroundColor =
            event.carBookApprovedStatus === "Approve" ? "#4CAF50" : "#2196F3";
          return {
            style: { backgroundColor, color: "#fff", fontSize: 10 },
          };
        }}
      />

      <Modal
        title="รายละเอียดการจอง"
        open={modalMaCarBookDetail}
        width={600}
        onCancel={onCancelModalDetail}
        footer={null}
      >
        {selectedMa && (
          <Form
            form={formUpdate}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
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

                <Form.Item label="วันที่เริ่มจอง" name="carBookStartDate">
                  <DatePicker
                    format="DD-MM-YYYY , HH:mm"
                    disabled
                    className="read-only-input"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item label="วันที่สิ้นสุดการจอง" name="carBookEndDate">
                  <DatePicker
                    format="DD-MM-YYYY , HH:mm"
                    disabled
                    className="read-only-input"
                    style={{ width: "100%" }}
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
                {selectedMa.carBookApprovedStatus !== "Process" && (
                  <div>
                    <Form.Item label="ผู้อนุมัติ" name="carBookApprovedByName">
                      <Input className="read-only-input" disabled />
                    </Form.Item>
                    <Form.Item label="วันที่อนุมัติ" name="approveDate">
                      <DatePicker
                        format="DD-MM-YYYY , HH:mm"
                        disabled
                        className="read-only-input"
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
