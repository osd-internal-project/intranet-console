import React, { useState } from "react";
import { Badge, Modal, Tag, Form, Input, DatePicker, Collapse, TimePicker } from "antd";
import dayjs from "dayjs";
import { Calendar, momentLocalizer, EventProps, Event as RbcEvent, CalendarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

const localizer = momentLocalizer(moment);
const { TextArea } = Input;

interface BookingType {
    id: string;
    title: string;
    roomName: string;
    bookerName: string;
    bookerPhone: string;
    bookingStatus: string;
    description: string;
    startDate: string;
    endDate: string;
}

interface Props {
    bookingFetchData: BookingType[];
}

interface CustomEvent extends RbcEvent {
    id: string;
    status: string;
    description: string;
    userName: string;
}

const BookingCalendar: React.FC<Props> = ({ bookingFetchData }) => {
    const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
    const [statusModalDetail, setStatusModalDetail] = useState(false);
    const [formUpdate] = useForm();
    const { data: session } = useSession();

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

    const onSelectEventCalendar = (event: CustomEvent) => {
        const booking = bookingFetchData.find((b) => b.id === event.id);
        if (booking) {
            setSelectedBooking(booking);
            formUpdate.setFieldsValue({
                ...booking,
                startDate: moment(booking.startDate),
                endDate: moment(booking.endDate),
            });
            setStatusModalDetail(true);
        }
    };

    return (
        <>
            <Calendar<CustomEvent>
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
                eventPropGetter={(event: CustomEvent) => {
                    const backgroundColor =
                        event.status === "Approve" ? "#4CAF50" :
                            event.status === "cancel" ? "#D24545" : "#2196F3";
                    return {
                        style: { backgroundColor, color: "#fff", fontSize: 10 },
                    };
                }}
            />
            <Modal
                title="รายละเอียดการจอง"
                open={statusModalDetail}
                width={750}
                onCancel={onCancelModalDetail}
                footer={null}
            >
                {selectedBooking && (
                    <Form form={formUpdate} labelCol={{ span: 4 }}>
                        <Collapse
                            bordered={false}
                            defaultActiveKey={["1", "2", "3"]}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        >
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
                                <Form.Item label="คำอธิบาย" name="description">
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
                                <Form.Item label="สถานะ">
                                    {renderStatusTag(selectedBooking.bookingStatus)}
                                </Form.Item>
                            </Collapse.Panel>
                        </Collapse>
                    </Form>
                )}
            </Modal>
        </>
    );
};

export default BookingCalendar;
