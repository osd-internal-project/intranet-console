import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Row, Col, Space, Modal, Form, Input, Divider, message, Select, DatePicker, Popconfirm } from 'antd';
import type { TableProps, FormProps } from 'antd';
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageRoomServices } from "../services/manage-room.service";
import dayjs, { Dayjs } from 'dayjs';
import { useForm } from "antd/es/form/Form";
import { useSession } from 'next-auth/react';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

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

interface UserData {
    firstNameTh: string;
}

const ManageRoom: React.FC = () => {
    const intraAuth = useAxiosIntranet();
    const [form] = useForm();
    const manageRoomServices = ManageRoomServices(intraAuth);
    const userAuth = useAxiosUser();
    const [isModalBooking, setIsModalBooking] = useState(false);
    const [modalEditBooking, setModalEditBooking] = useState(false);
    const [modalApproveBooking, setModalApproveBooking] = useState(false);
    const [bookingStatus, setBookingStatus] = useState("");
    const [bookingData, setBookingData] = useState<BookingType[]>([]);
    const [masterRoomData, setMasterRoomData] = useState<MasterRoomType[]>([]);
    const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const columns: TableProps<BookingType>['columns'] = [
        {
            title: 'ลำดับ',
            dataIndex: 'no',
            key: 'no',
            width: "50px",
            render: (_, __, index) => <>{(currentPage - 1) * pageSize + index + 1}</>,
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
        if (record.bookingStatus === "Approve") {
            message.warning('ไม่สามารถแก้ไขการจองที่อนุมัติแล้วได้');
            return;
        }
        setCurrentBookingId(record.id);
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
        setBookingStatus(record.bookingStatus);
        setCurrentBookingId(record.id);
        setModalApproveBooking(true);
    };

    const handleApproveBookingCancel = () => {
        setModalApproveBooking(false);
    };

    const handleDeleteBooking = async (id: string) => {
        setSubmitLoading(true);
        try {
            await manageRoomServices.deleteBooking(id);
            setBookingData(bookingData.filter(item => item.id !== id));
            message.success('ลบข้อมูลการจองสำเร็จ');
            setSubmitLoading(false);
        } catch (error) {
            message.error('ลบข้อมูลการจองไม่สำเร็จ');
        }
    };

    const updatedBooking: FormProps<BookingType>['onFinish'] = async (values) => {
        setSubmitLoading(true);
        if (currentBookingId === null) {
            message.error('No booking selected for update');
            return;
        }

        try {
            const { startDate, endDate, roomName, ...restValues } = values;
            const updatedStartDate = startDate.toISOString();
            const updatedEndDate = endDate.toISOString();

            const today = new Date();
            if (new Date(updatedStartDate) < today) {
                message.error('ไม่สามารถจองในวันที่ผ่านมาได้');
                setSubmitLoading(false);
                return;
            }

            if (new Date(updatedEndDate) < new Date(updatedStartDate)) {
                message.error('วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง');
                setSubmitLoading(false);
                return;
            }

            const existingBookings = await manageRoomServices.getBookingRoomQuery();

            const hasOverlap = existingBookings.some((booking: BookingType) => {
                if (booking.roomName === roomName && booking.id !== currentBookingId) {
                    const existingStart = dayjs(booking.startDate);
                    const existingEnd = dayjs(booking.endDate);
                    const newStart = dayjs(updatedStartDate);
                    const newEnd = dayjs(updatedEndDate);

                    return (
                        (newStart.isBetween(existingStart, existingEnd, null, '[)') ||
                            newEnd.isBetween(existingStart, existingEnd, null, '(]')) ||
                        (existingStart.isBetween(newStart, newEnd, null, '[)') ||
                            existingEnd.isBetween(newStart, newEnd, null, '(]'))
                    );
                }
                return false;
            });

            if (hasOverlap) {
                message.error('ไม่สามารถแก้ไขการจองนี้ได้เนื่องจากมีการจองห้องนี้ในช่วงเวลานี้แล้ว');
                setSubmitLoading(false);
                return;
            }

            const updatedBooking = {
                ...restValues,
                id: currentBookingId,
                roomName,
                startDate: updatedStartDate,
                endDate: updatedEndDate,
            };

            await manageRoomServices.updateBooking(updatedBooking);
            fetchData();
            message.success('แก้ไขการจองสำเร็จ');
            setSubmitLoading(false);
            setModalEditBooking(false);
        } catch (error) {
            message.error('แก้ไขการจองไม่สำเร็จ');
            setSubmitLoading(false);
        }
    };


    const onFinishApprove: FormProps<BookingType>['onFinish'] = async () => {
        setSubmitLoading(true);
        try {
            const updatedApproveBooking = {
                id: currentBookingId,
                approver: session?.user.firstNameTh && session?.user.lastNameTh ? `${session.user.firstNameTh} ${session.user.lastNameTh}` : "",
                bookingStatus: "Approve",
                approveDate: dayjs()
            };
            await manageRoomServices.updateBooking(updatedApproveBooking);
            setModalApproveBooking(false);
            fetchData();
            message.success('อนุมัติการจองสำเร็จ');
            setSubmitLoading(false);
        } catch (error) {
            message.error('อนุมัติการจองไม่สำเร็จ');
        }
    };


    const onFinishFailed: FormProps<BookingType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        setIsModalBooking(false);
    };

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const paginatedData = bookingData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: bookingData.length,
        onChange: handleTableChange,
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const masterRoom = await manageRoomServices.getMasterRoomQuery();
            const masterRoomActive = masterRoom.filter((room: any) => room.roomsStatus === true);
            setMasterRoomData(masterRoomActive);

            const bookingRoom = await manageRoomServices.getBookingRoomQuery();
            setBookingData(bookingRoom.map((item: any, index: number) => ({
                ...item,
                key: index.toString(),
                id: item.id,
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
                    onFinish={updatedBooking}
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
                                ยกเลิก
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitLoading}>
                                ตกลง
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
                    <Row justify="end">
                        <Button type="primary" htmlType="submit" disabled={bookingStatus === "Approve"} loading={submitLoading}>
                            อนุมัติ
                        </Button>
                    </Row>
                </Form>
            </Modal>
            <Table
                columns={columns}
                dataSource={paginatedData}
                rowKey="id"
                pagination={paginationConfig}
                onChange={handleTableChange}
            />
        </>
    );
}

export default ManageRoom;
