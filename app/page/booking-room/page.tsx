"use client";

import React, { useState, useEffect } from 'react';
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Breadcrumb, Card, Col, Row, TabsProps, Tabs, Button, Modal, message, Form, Input, FormProps, Divider, Select, DatePicker } from "antd";
import CalendarComponent from "./components/BookingCalendar";
import TableComponent from "./components/BookingTable";
import RoomStatusComponent from "./components/RoomStatus";
import { BookingRoomServices } from "./services/booking-room.service"
import { useForm } from "antd/es/form/Form";

type FieldType = {
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

const BookingRoomPage: React.FC = () => {
    const stockAuth = useAxiosStock();
    const bookingRoomServices = BookingRoomServices(stockAuth);
    const [isModalBooking, setIsModalBooking] = useState(false);
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
        setIsModalBooking(true);
    };

    const handleCancel = () => {
        setIsModalBooking(false);
    };

    const onChange = (key: string) => {
        console.log(key);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const data = {
            roomName: values.roomName,
            roomType: values.roomType,
            bookerName: values.bookerName,
            bookerPhone: values.bookerPhone,
            title: values.title,
            bookerDepartment: values.bookerDepartment,
            bookingStatus: "process",
            startDate: values.startDate,
            endDate: values.endDate,
            member: values.member,
            outSider: values.outSider,
            note: values.note
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

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const fetchData = async () => {
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
                    name="create"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Divider orientation="left">ข้อมูลผู้จอง</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="bookerName"
                                rules={[{ required: true, message: 'Please input your booker name!' }]}
                            >
                                <Input placeholder="กรอกชื่อผู้จอง" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="bookerPhone"
                                rules={[{ required: true, message: 'Please input your telephone number!' }]}
                            >
                                <Input placeholder="กรอกเบอร์โทรศัพท์ผู้จอง" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="bookerDepartment"
                                rules={[{ required: true, message: 'Please select your department!' }]}
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
                            <Form.Item<FieldType>
                                name="roomName"
                                rules={[{ required: true, message: 'Please select your room name!' }]}
                            >
                                <Select
                                    placeholder="โปรดเลือกห้องประชุม"
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'Room A', label: 'Room A' },
                                        { value: 'Room B', label: 'Room B' },
                                        { value: 'Room C', label: 'Room C' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="startDate"
                                rules={[{ required: true, message: 'Please select start date!' }]}
                            >
                                <DatePicker
                                    placeholder="กรอกวันที่เริ่มการจอง"
                                    showTime
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="endDate"
                                rules={[{ required: true, message: 'Please select end date!' }]}
                            >
                                <DatePicker
                                    placeholder="กรอกวันที่สิ้นสุดการจอง"
                                    showTime
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="title"
                                rules={[{ required: true, message: 'Please enter title!' }]}
                            >
                                <Input placeholder="กรอกหัวข้อการประชุม" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="roomType"
                                rules={[{ required: true, message: 'Please select type!' }]}
                            >
                                <Select
                                    placeholder="โปรดเลือกประภทการประชุม"
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'Meeting', label: 'Meeting' },
                                        { value: 'Conference', label: 'Conference' },
                                        { value: 'Workshop', label: 'Workshop' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="member"
                                rules={[{ required: true, message: 'Please enter number of members!' }]}
                            >
                                <Input placeholder="กรอกจำนวนผู้เข้าใช้งาน" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="outSider"
                                rules={[{ required: true, message: 'Please select if outsider is allowed!' }]}
                            >
                                <Select
                                    placeholder="บุคคลภายนอก"
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'Yes', label: 'Yes' },
                                        { value: 'No', label: 'No' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
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
