"use client";

import React, { useState, useEffect } from 'react';
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Breadcrumb, Card, Col, Row, TabsProps, Tabs, Button, Modal, message, Form, Input, FormProps, Divider, Select, DatePicker } from "antd";
import CalendarComponent from "./components/BookingCalendar";
import TableComponent from "./components/BookingTable";
import RoomStatusComponent from "./components/RoomStatus";
import { BookingRoomServices } from "./services/booking-room.service"
import { useForm } from "antd/es/form/Form";
import { useSession } from 'next-auth/react';

type BookingType = {
    roomName: String,
    roomType: String,
    bookerName: String,
    bookerPhone: String,
    bookerDepartment: String,
    bookingStatus: String,
    startDate: String,
    endDate: String,
    title: String,
    member: String,
    outSider: String,
    note: String
};

type MasterRoomType = {
    roomName: String,
    roomDescription: String,
    masterRoomTypeId: Number
}

const BookingRoomPage: React.FC = () => {
    const {data:session} = useSession();
    const stockAuth = useAxiosIntranet();
    const bookingRoomServices = BookingRoomServices(stockAuth);
    const [isModalBooking, setIsModalBooking] = useState(false);
    const [masterRoomData, setMasterRoomData] = useState<MasterRoomType[]>([]);
    const [form] = useForm();

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "แสดงข้อมูลแบบปฎิทิน",
            children: <CalendarComponent />,
        },
        {
            key: "2",
            label: "แสดงข้อมูลแบบตาราง",
            children: <TableComponent />,
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
            bookerPhone: session?.user.phoneNumber ? session?.user.phoneNumber : ""
        });
        setIsModalBooking(true);
    };

    const handleCancel = () => {
        setIsModalBooking(false);
    };

    const onChange = (key: string) => {
        console.log(key);
    };

    const onFinish: FormProps<BookingType>['onFinish'] = async (values) => {
        const data = {
            roomName: values.roomName,
            roomType: values.roomType,
            bookerName: session?.user.firstNameTh && session?.user.lastNameTh ? session?.user.firstNameTh + " " +session?.user.lastNameTh : "",
            bookerPhone: session?.user.phoneNumber ? session?.user.phoneNumber : "",
            title: values.title,
            bookerDepartment: values.bookerDepartment,
            bookingStatus: "process",
            startDate: values.startDate,
            endDate: values.endDate,
            member: values.member ? values.member : "",
            outSider: values.outSider,
            note: values.note ? values.note : ""
        }
        try {
            const reponse = await bookingRoomServices.createBookingRoom(data);
            if (reponse) {
                message.success("Booking Successfull");
                form.resetFields();
                setIsModalBooking(false);
            } else {
                message.error("Add Booking failed");
            }
        } catch (error) {
            console.error("Error creating user", error);
            message.error("Add Booking failed");
        }
    };

    const onFinishFailed: FormProps<BookingType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const fetchData = async () => {
        const bookingRoom = await bookingRoomServices.getMasterRoomQuery();
        setMasterRoomData(bookingRoom);
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
                width={1000} // Set custom width
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="create"
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 120 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Divider orientation="left">ข้อมูลผู้จอง</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="ชื่อผู้จอง"
                                name="bookerName"
                                rules={[{ required: true, message: 'กรุณากรอกชื่อผู้จอง!' }]}
                            >
                                <Input disabled  placeholder="กรอกชื่อผู้จอง" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="เบอร์โทรศัพท์ผู้จอง"
                                name="bookerPhone"
                                rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์ผู้จอง!' }]}
                            >
                                <Input disabled placeholder="กรอกเบอร์โทรศัพท์ผู้จอง" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="ชื่อแผนก"
                                name="bookerDepartment"
                                rules={[{ required: true, message: 'กรุณากรอกกรอกชื่อแผนก!' }]}
                            >
                                <Select
                                    placeholder="โปรดเลือกเเผนกผู้จอง"
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'HR', label: 'HR' },
                                        { value: 'IT', label: 'IT' },
                                        { value: 'Marketing', label: 'Marketing' },
                                        { value: 'Finance', label: 'Finance' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left">ข้อมูลการจอง</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="ชื่อห้อง"
                                name="roomName"
                                rules={[{ required: true, message: 'กรุณากเลือกห้องประชุม' }]}
                            >
                                <Select
                                    placeholder="โปรดเลือกห้องประชุม"
                                    style={{ width: '100%' }}
                                >
                                    {masterRoomData.map(room => (
                                        <Select.Option value={room.roomName}>
                                            {room.roomName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="วันที่เริ่มการจอง"
                                name="startDate"
                                rules={[{ required: true, message: 'กรุณากรอกวันที่เริ่มการจอง!' }]}
                            >
                                <DatePicker
                                    placeholder="กรอกวันที่เริ่มการจอง"
                                    showTime
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="วันที่สิ้นสุดการจอง"
                                name="endDate"
                                rules={[{ required: true, message: 'กรุณากรอกวันที่สิ้นสุดการจอง!' }]}
                            >
                                <DatePicker
                                    placeholder="กรอกวันที่สิ้นสุดการจอง"
                                    showTime
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="หัวข้อการประชุม"
                                name="title"
                                rules={[{ required: true, message: 'กรุณากรอกหัวข้อการประชุม!' }]}
                            >
                                <Input placeholder="กรอกหัวข้อการประชุม" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="ประเทภการจอง"
                                name="roomType"
                                rules={[{ required: true, message: 'กรุณาเลือกประภทการประชุม!' }]}
                            >
                                <Select
                                    placeholder="โปรดเลือกประภทการประชุม"
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'Meeting', label: 'ประชุม (Meeting)' },
                                        { value: 'Train', label: 'อบรม (Train)' },
                                        { value: 'seminar', label: 'สัมมนา (seminar)' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="จำนวนสมาชิก"
                                name="member"
                                // rules={[{ required: true, message: 'กรุณาระบุจำนวนผู้เข้าใช้งาน!' }]}
                            >
                                <Input placeholder="กรอกจำนวนผู้เข้าใช้งาน" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="บุคคลภายนอก"
                                name="outSider"
                                // rules={[{ required: true, message: 'กรุณาระบุข้อมูลบุคคลภายนอก!' }]}
                            >
                                <Select
                                    placeholder="บุคคลภายนอก"
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'มี', label: 'มี' },
                                        { value: 'ไม่มี', label: 'ไม่มี' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="หมายเหตุ"
                                name="note"
                            >
                                <Input placeholder="หมายเหตุ" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Row justify="end">
                            <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Submit
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
                                title: <span>Booking room</span>,
                            },
                        ]}
                    />
                </Col>
                <Col span={24}>
                    <div className="title-page-font">{`Booking Room Details`}</div>
                </Col>
                <Col span={24}>
                    <div className="grid-span-1 space-y-2">
                        <Card>
                            <div className='flex justify-end'>
                                <Button type="primary" onClick={showModal}>
                                    จองห้องประชุม
                                </Button>
                            </div>
                            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                        </Card>
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default BookingRoomPage;
