"use client";

import React, { useState } from 'react';
import { Breadcrumb, Card, Col, Row, TabsProps, Tabs, Button, Modal, Form, Input, FormProps, Divider, Select, DatePicker } from "antd";
import CalendarComponent from "./components/BookingCalendar";
import TableComponent from "./components/BookingTable";
import RoomStatusComponent from "./components/RoomStatus";

type FieldType = {
    bookername?: string;
    tell?: string;
    department?: string;
    roomname?: string;
    startdate?: string;
    enddate?: string;
    title?: string;
    type?: string;
    member?: string;
    outsider?: string;
    note?: string;
};

const BookingRoomPage: React.FC = () => {
    const [isModalBooking, setIsModalBooking] = useState(false);

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

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        setIsModalBooking(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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
                    name="basic"
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
                                name="bookername"
                                rules={[{ required: true, message: 'Please input your booker name!' }]}
                            >
                                <Input placeholder="Enter your booker name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="tell"
                                rules={[{ required: true, message: 'Please input your telephone number!' }]}
                            >
                                <Input placeholder="Enter your telephone number" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="department"
                                rules={[{ required: true, message: 'Please select your department!' }]}
                            >
                                <Select
                                    placeholder="Select your department"
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
                                name="roomname"
                                rules={[{ required: true, message: 'Please select your room name!' }]}
                            >
                                <Select
                                    placeholder="Select your room name"
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
                                name="startdate"
                                rules={[{ required: true, message: 'Please select start date!' }]}
                            >
                                <DatePicker
                                    placeholder="Select start date"
                                    showTime
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="enddate"
                                rules={[{ required: true, message: 'Please select end date!' }]}
                            >
                                <DatePicker
                                    placeholder="Select end date"
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
                                <Input placeholder="Enter title" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="type"
                                rules={[{ required: true, message: 'Please select type!' }]}
                            >
                                <Select
                                    placeholder="Select type"
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
                                <Input placeholder="Enter number of members" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="outsider"
                                rules={[{ required: true, message: 'Please select if outsider is allowed!' }]}
                            >
                                <Select
                                    placeholder="Select if outsider is allowed"
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
                                <Input placeholder="Enter your note (optional)" />
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
