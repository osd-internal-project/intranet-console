"use client";

import React, { useState, useEffect } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Breadcrumb, Card, Col, Row, TabsProps, Tabs, Button, Modal, message, Form, Input, FormProps, Divider, Select, DatePicker } from "antd";
import CalendarComponent from "./components/BookingCalendar";
import TableComponent from "./components/BookingTable";
import RoomStatusComponent from "./components/RoomStatus";
import { BookingRoomServices } from "./services/booking-room.service";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";

type BookingType = {
    roomName: String;
    roomType: String;
    bookerName: String;
    bookerPhone: String;
    bookerDepartment: String;
    bookingStatus: String;
    startDate: String;
    endDate: String;
    approveDate: string;
    title: String;
    member: String;
    approver: string;
    outSider: String;
    note: String;
};

type MasterRoomType = {
    roomName: String;
    roomDescription: String;
    roomStatus: boolean;
    masterRoomTypeId: Number;
};

const BookingRoomPage: React.FC = () => {
    const { data: session } = useSession();
    const intraAuth = useAxiosIntranet();
    const bookingRoomServices = BookingRoomServices(intraAuth);
    const [isModalBooking, setIsModalBooking] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [masterRoomData, setMasterRoomData] = useState<MasterRoomType[]>([]);
    const [bookingFetchData, setBookingFetchData] = useState([]);
    const [form] = useForm();

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "แสดงข้อมูลแบบปฎิทิน",
            children: <CalendarComponent bookingFetchData={bookingFetchData} />,
        },
        {
            key: "2",
            label: "แสดงข้อมูลแบบตาราง",
            children: <TableComponent bookingFetchData={bookingFetchData} />,
        },
        {
            key: "3",
            label: "สถานะห้องประชุม",
            children: <RoomStatusComponent />,
        },
    ];

    const showModal = () => {
        form.setFieldsValue({
            bookerName: `${session?.user.firstNameTh || ""} ${session?.user.lastNameTh || ""}`,
            bookerPhone: session?.user.phoneNumber ? session?.user.phoneNumber : "",
        });
        setIsModalBooking(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalBooking(false);
    };

    const checkBookingConflict = async (roomName: string, startDate: string, endDate: string) => {
        const existingBookings = await bookingRoomServices.getBookingRoomQuery();
        return existingBookings.some((booking: any) => {
            return booking.roomName === roomName &&
                ((new Date(startDate) >= new Date(booking.startDate) && new Date(startDate) < new Date(booking.endDate)) ||
                    (new Date(endDate) > new Date(booking.startDate) && new Date(endDate) <= new Date(booking.endDate)) ||
                    (new Date(startDate) <= new Date(booking.startDate) && new Date(endDate) >= new Date(booking.endDate)));
        });
    };

    const createBooking: FormProps<BookingType>["onFinish"] = async (values) => {
        setSubmitLoading(true);

        const roomName = values.roomName as string;
        const startDate = values.startDate as string;
        const endDate = values.endDate as string;

        const today = new Date();
        if (new Date(startDate) < today) {
            message.error("ไม่สามารถจองในวันที่ผ่านมาได้");
            setSubmitLoading(false);
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            message.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
            setSubmitLoading(false);
            return;
        }

        const data = {
            userId: session?.user.userId,
            roomName: roomName,
            roomType: values.roomType,
            bookerName: session?.user.firstNameTh && session?.user.lastNameTh ? `${session.user.firstNameTh} ${session.user.lastNameTh}` : "",
            bookerPhone: session?.user.phoneNumber ? session.user.phoneNumber : "",
            title: values.title,
            bookerDepartment: values.bookerDepartment,
            bookingStatus: "process",
            approver: "",
            startDate: startDate,
            endDate: endDate,
            approveDate: null,
            member: values.member ? values.member : "",
            outSider: values.outSider,
            note: values.note ? values.note : "",
        };

        try {
            const conflict = await checkBookingConflict(roomName, startDate, endDate);

            if (conflict) {
                message.error("ห้องนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่.");
                setSubmitLoading(false);
                return;
            }

            const response = await bookingRoomServices.createBookingRoom(data);

            if (response) {
                message.success("จองห้องสำเร็จ");
                form.resetFields();
                setIsModalBooking(false);
            } else {
                message.error("จองห้องไม่สำเร็จ");
            }

            setSubmitLoading(false);
            fetchData();
        } catch (error) {
            message.error("จองห้องไม่สำเร็จ");
            setSubmitLoading(false);
        }
    };



    const onFinishFailed: FormProps<BookingType>["onFinishFailed"] = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const fetchData = async () => {
        try {
            const bookingRoom = await bookingRoomServices.getMasterRoomQuery();
            const masterRoomActive = bookingRoom.filter((room: any) => room.roomsStatus === true);
            setMasterRoomData(masterRoomActive);

            const bookings = await bookingRoomServices.getBookingRoomQuery();
            setBookingFetchData(bookings);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Modal
                title="จองห้องประชุม"
                open={isModalBooking}
                onCancel={handleCancel}
                footer={null}
                width={1000}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="create"
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 120 }}
                    initialValues={{ remember: true }}
                    onFinish={createBooking}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Divider orientation="left">ข้อมูลผู้จอง</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item<BookingType> label="ชื่อผู้จอง" name="bookerName" rules={[{ required: true, message: "กรุณากรอกชื่อผู้จอง!" }]}>
                                <Input disabled placeholder="กรอกชื่อผู้จอง" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="เบอร์โทรศัพท์ผู้จอง"
                                name="bookerPhone"
                                rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์ผู้จอง!" }]}
                            >
                                <Input disabled placeholder="กรอกเบอร์โทรศัพท์ผู้จอง" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType> label="ชื่อแผนก" name="bookerDepartment" rules={[{ required: true, message: "กรุณากรอกกรอกชื่อแผนก!" }]}>
                                <Select
                                    placeholder="โปรดเลือกเเผนกผู้จอง"
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "Business Consulting Department", label: "Business Consulting Department" },
                                        { value: "Business Solution Consulting Department", label: "Business Solution Consulting Department" },
                                        { value: "Business Support Department", label: "Business Support Department" },
                                        { value: "Customer Relationship Management Department", label: "Customer Relationship Management Department" },
                                        { value: "Executive Division", label: "Executive Division" },
                                        { value: "Executive Secretary Department", label: "Executive Secretary Department" },
                                        { value: "Finance and Accounting Department", label: "Finance and Accounting Department" },
                                        { value: "Human Resources Department", label: "Human Resources Department" },
                                        { value: "IT Support Department", label: "IT Support Department" },
                                        { value: "Legal & Compliance Department", label: "Legal & Compliance Department" },
                                        { value: "Marketing Department ", label: "Marketing Department " },
                                        { value: "Mbiz & Exam", label: "Mbiz & Exam" },
                                        { value: "Network Department", label: "Network Department" },
                                        { value: "New Installation Department", label: "New Installation Department" },
                                        { value: "New Network Department", label: "New Network Department" },
                                        { value: "Procurement Department", label: "Procurement Department" },
                                        { value: "Research and Development Department", label: "Research and Development Department" },
                                        { value: "Service and Support Department", label: "Service and Support Department" },
                                        { value: "Voice Collaboration Department", label: "Voice Collaboration Department" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left">ข้อมูลการจอง</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item<BookingType> label="ชื่อห้อง" name="roomName" rules={[{ required: true, message: "กรุณากเลือกห้องประชุม" }]}>
                                <Select placeholder="โปรดเลือกห้องประชุม" style={{ width: "100%" }}>
                                    {masterRoomData.map((room, index) => (
                                        <Select.Option key={index} value={room.roomName}>
                                            {room.roomName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType> label="วันที่เริ่มการจอง" name="startDate" rules={[{ required: true, message: "กรุณากรอกวันที่เริ่มการจอง!" }]}>
                                <DatePicker placeholder="กรอกวันที่เริ่มการจอง" showTime style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="วันที่สิ้นสุดการจอง"
                                name="endDate"
                                rules={[{ required: true, message: "กรุณากรอกวันที่สิ้นสุดการจอง!" }]}
                            >
                                <DatePicker placeholder="กรอกวันที่สิ้นสุดการจอง" showTime style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType> label="หัวข้อการประชุม" name="title" rules={[{ required: true, message: "กรุณากรอกหัวข้อการประชุม!" }]}>
                                <Input placeholder="กรอกหัวข้อการประชุม" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType> label="ประเทภการจอง" name="roomType" rules={[{ required: true, message: "กรุณาเลือกประภทการประชุม!" }]}>
                                <Select
                                    placeholder="โปรดเลือกประภทการประชุม"
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "Meeting", label: "ประชุม (Meeting)" },
                                        { value: "Train", label: "อบรม (Train)" },
                                        { value: "seminar", label: "สัมมนา (seminar)" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="จำนวนสมาชิก"
                                name="member"
                            >
                                <Input placeholder="กรอกจำนวนผู้เข้าใช้งาน" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="บุคคลภายนอก"
                                name="outSider"
                            >
                                <Select
                                    placeholder="บุคคลภายนอก"
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "มี", label: "มี" },
                                        { value: "ไม่มี", label: "ไม่มี" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType> label="หมายเหตุ" name="note">
                                <Input placeholder="หมายเหตุ" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Row justify="end">
                            <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
                                ยกเลิก
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitLoading}>
                                ตกลง
                            </Button>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
            <Row>
                <Col span={24}>
                    <Breadcrumb
                        items={[
                            {
                                href: "/page",
                                title: <span>Home</span>,
                            },
                            {
                                title: <span>Booking Room Details</span>,
                            },
                        ]}
                    />
                </Col>
                <Divider orientation="left" orientationMargin="0">
                    <div className="title-page-font">{`Booking Room Details`}</div>
                </Divider>
                <Col span={24}>
                    <div className="grid-span-1 space-y-2">
                        <Card>
                            <div className="flex justify-end">
                                <Button type="primary" onClick={showModal}>
                                    จองห้องประชุม
                                </Button>
                            </div>
                            <Tabs defaultActiveKey="1" items={items} />
                        </Card>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default BookingRoomPage;
