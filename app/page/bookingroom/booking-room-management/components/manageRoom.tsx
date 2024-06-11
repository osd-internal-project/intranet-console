import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Row, Col, Space, Modal, Form, Input, Divider, message, Select, DatePicker, Popconfirm } from 'antd';
import type { TableProps, FormProps } from 'antd';
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageRoomServices } from "../services/manage-room.service";
import dayjs, { Dayjs } from 'dayjs';
import { useForm } from "antd/es/form/Form";
import { useSession } from 'next-auth/react';

interface BookingType {
    id: string;
    bookingId: number;
    roomName: string;
    roomType: string;
    bookerName: string;
    bookerPhone: string;
    bookerDepartment: string;
    bookingStatus: string;
    startDate: Dayjs;
    endDate: Dayjs;
    title: string;
    member: string;
    outSider: string;
    note: string;
}

interface MasterRoomType {
    roomName: string;
    roomDescription: string;
    masterRoomTypeId: number;
}

const ManageRoom: React.FC = () => {
    const { data: session } = useSession();
    const intraAuth = useAxiosIntranet();
    const [form] = useForm();
    const manageRoomServices = ManageRoomServices(intraAuth);
    const [isModalBooking, setIsModalBooking] = useState(false);
    const [modalEditBooking, setModalEditBooking] = useState(false);
    const [modalApproveBooking, setModalApproveBooking] = useState(false);
    const [bookingData, setBookingData] = useState<BookingType[]>([]);
    const [masterRoomData, setMasterRoomData] = useState<MasterRoomType[]>([]);
    const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);  // State to store the current booking ID

    const columns: TableProps<BookingType>['columns'] = [
        {
            title: 'ลำดับ',
            dataIndex: 'no',
            key: 'no',
            width: "50px",
            render: (_, __, index) => <>{index + 1}</>,
        },
        {
            title: 'ชื่อห้องประชุม',
            dataIndex: 'roomName',
            key: 'roomName',
            width: "150px",
        },
        {
            title: 'ประเภทการจอง',
            dataIndex: 'roomType',
            key: 'roomType',
            width: "150px",
        },
        {
            title: 'วันที่จอง',
            key: 'bookingDate',
            width: "250px",
            render: (_, record) => (
                <span>
                    {dayjs(record.startDate).format('YYYY-MM-DD')} - {dayjs(record.endDate).format('YYYY-MM-DD')}
                </span>
            ),
        },
        {
            title: 'เวลาจอง',
            key: 'bookingTime',
            width: "150px",
            render: (_, record) => (
                <span>
                    {dayjs(record.startDate).format('HH:mm')} - {dayjs(record.endDate).format('HH:mm')}
                </span>
            ),
        },
        {
            title: 'ชื่อผู้จอง',
            dataIndex: 'bookerName',
            key: 'bookerName',
            width: "150px",
        },
        {
            title: 'สถานะ',
            key: 'bookingStatus',
            dataIndex: 'bookingStatus',
            width: "100px",
            render: (status: string) => (
                <Tag color={status === "process" ? "blue" : status === "Approve" ? "green" : status === "cancel" ? "red" : undefined}>
                    {status === "process" ? "กำลังรออนุมัติ" : status === "Approve" ? "อนุมัติสำเร็จ" : status === "cancel" ? "ยกเลิกการจอง" : ""}
                </Tag>
            ),
        },
        {
            title: 'จัดการ',
            key: 'note',
            dataIndex: 'note',
            width: "150px",
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showModalEditBooking(record)}>แก้ไข</a>
                    <Popconfirm
                        title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
                        onConfirm={() => handleDeleteBooking(record.id)}
                        okText="ใช่"
                        cancelText="ไม่"
                    >
                        <a>ลบ</a>
                    </Popconfirm>
                    <a onClick={() => showModalApproveBooking(record)}>อนุมัติ</a>
                </Space>
            ),
        },
    ];

    const showModalEditBooking = (record: BookingType) => {
        setCurrentBookingId(record.id);  // Set the current booking ID
        form.setFieldsValue({
            ...record,
            startDate: dayjs(record.startDate),
            endDate: dayjs(record.endDate),
        });
        setModalEditBooking(true);
    };

    const handleEditBookingCancel = () => {
        setModalEditBooking(false);
    };

    const showModalApproveBooking = (record: BookingType) => {
        setCurrentBookingId(record.id);  // Set the current booking ID
        setModalApproveBooking(true);
    };

    const handleApproveBookingCancel = () => {
        setModalApproveBooking(false);
    };

    const handleDeleteBooking = async (id: string) => {
        console.log(id);
        try {
            await manageRoomServices.deleteBooking(id);
            setBookingData(bookingData.filter(item => item.id !== id));
            message.success('Booking deleted successfully');
        } catch (error) {
            message.error('Failed to delete booking');
        }
    };

    const onFinish: FormProps<BookingType>['onFinish'] = async (values) => {
        if (currentBookingId === null) {
            message.error('No booking selected for update');
            return;
        }
        try {
            const { startDate, endDate, ...restValues } = values;
            const updatedBooking = {
                ...restValues,
                id: currentBookingId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            console.log(updatedBooking);
            await manageRoomServices.updateBooking(updatedBooking);
            setModalEditBooking(false);
            fetchData();
            message.success('Booking updated successfully');
        } catch (error) {
            message.error('Failed to update booking');
        }
    };

    const onFinishApprove: FormProps<BookingType>['onFinish'] = async () => {
        try {
            const updatedApproveBooking = {
                id: currentBookingId,
                bookingStatus: "Approve"
            };
            await manageRoomServices.updateBooking(updatedApproveBooking);
            setModalApproveBooking(false);
            fetchData();
            message.success('Booking updated successfully');
        } catch (error) {
            message.error('Failed to update booking');
        }
    };


    const onFinishFailed: FormProps<BookingType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        setIsModalBooking(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const bookingRoom = await manageRoomServices.getBookingRoomQuery();
            setBookingData(bookingRoom.map((item: any, index: number) => ({
                ...item,
                key: index.toString(),
                id: item.id,  // Ensure ID is mapped
            })));
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    return (
        <>
            <Modal
                title="จองห้องประชุม"
                open={modalEditBooking}
                onCancel={handleEditBookingCancel}
                footer={null}
                width={1000}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="edit_booking"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<BookingType> name="bookingId" hidden>
                        <Input />
                    </Form.Item>
                    <Divider orientation="left">ข้อมูลผู้จอง</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="ชื่อผู้จอง"
                                name="bookerName"
                                rules={[{ required: true, message: 'กรุณากรอกชื่อผู้จอง!' }]}
                            >
                                <Input disabled placeholder="กรอกชื่อผู้จอง" />
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
                                rules={[{ required: true, message: 'กรุณาเลือกห้องประชุม' }]}
                            >
                                <Select placeholder="โปรดเลือกห้องประชุม">
                                    {masterRoomData.map(room => (
                                        <Select.Option key={room.roomName} value={room.roomName}>
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
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<BookingType>
                                label="วันที่สิ้นสุดการจอง"
                                name="endDate"
                                rules={[{ required: true, message: 'กรุณากรอกวันที่สิ้นสุดการจอง!' }]}
                            >
                                <DatePicker showTime style={{ width: '100%' }} />
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
                                label="ประเภทการจอง"
                                name="roomType"
                                rules={[{ required: true, message: 'กรุณาเลือกประเภทการประชุม!' }]}
                            >
                                <Select placeholder="โปรดเลือกประเภทการประชุม">
                                    <Select.Option value="Meeting">ประชุม (Meeting)</Select.Option>
                                    <Select.Option value="Train">อบรม (Train)</Select.Option>
                                    <Select.Option value="Seminar">สัมมนา (Seminar)</Select.Option>
                                </Select>
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
                                <Select placeholder="บุคคลภายนอก">
                                    <Select.Option value="มี">มี</Select.Option>
                                    <Select.Option value="ไม่มี">ไม่มี</Select.Option>
                                </Select>
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
                            <Button type="default" onClick={handleEditBookingCancel} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal width={400} title="อนุมัติจองห้อง" open={modalApproveBooking} onCancel={handleApproveBookingCancel} footer={null}>
                <p>ยืนยันอนุมัติจองห้อง</p>
                <Form
                    form={form}
                    layout="vertical"
                    name="edit_booking"
                    initialValues={{ remember: true }}
                    onFinish={onFinishApprove}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Row justify="end">
                            <Button type="default" onClick={handleApproveBookingCancel} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={bookingData} />
        </>
    );
}

export default ManageRoom;
