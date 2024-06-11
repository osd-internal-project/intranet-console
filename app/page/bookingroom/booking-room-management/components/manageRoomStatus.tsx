import React, { useState, useEffect } from 'react';
import { Select, Table, Space, Button, Row, Modal, Form, Input, Divider, Tag, message, Popconfirm } from 'antd';
import type { TableProps, FormProps } from 'antd';
import axios from '@/app/lib/axios/axios';
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageRoomServices } from "../services/manage-room.service";
import { useForm } from "antd/es/form/Form";

interface MasterRoomType {
    id: string;
    no: string;
    roomName: string;
    roomsStatus: boolean;
    roomDescription: string;
}

const RoomStatus = () => {
    const intraAuth = useAxiosIntranet();
    const [form] = useForm();
    const manageRoomServices = ManageRoomServices(intraAuth);
    const [bookingData, setBookingData] = useState<MasterRoomType[]>([]);
    const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
    const [modalEditMasterRoom, setModalEditMasterRoom] = useState(false);

    const columns: TableProps<MasterRoomType>['columns'] = [
        {
            title: 'ลำดับ',
            dataIndex: 'no',
            key: 'no',
            render: (_, __, index) => <>{index + 1}</>,
        },
        {
            title: 'ชื่อห้องประชุม',
            dataIndex: 'roomName',
            key: 'roomName',
        },
        {
            title: 'สถานะ',
            dataIndex: 'roomsStatus',
            key: 'roomsStatus',
            render: (status: boolean) => (
                status ? <Tag color="green">ใช้งานได้ปกติ</Tag> : <Tag color="red">ไม่สามารถใช้งานได้</Tag>
            ),
        },
        {
            title: 'หมายเหตุ',
            dataIndex: 'roomDescription',
            key: 'roomDescription',
        },
        {
            title: 'จัดการ',
            dataIndex: 'manage',
            key: 'manage',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showModalEditMasterRoom(record)}>แก้ไข</a>
                    <Popconfirm
                        title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
                        onConfirm={() => handleDeleteRoomStatus(record.id)}
                        okText="ใช่"
                        cancelText="ไม่"
                    >
                        <a>ลบ</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEditMasterRoomCancel = () => {
        setModalEditMasterRoom(false);
        form.resetFields();
    };

    const showModalEditMasterRoom = (record: MasterRoomType) => {
        setCurrentBookingId(record.id);
        form.setFieldsValue(record);
        setModalEditMasterRoom(true);
    };

    const handleDeleteRoomStatus = async (id: string) => {
        try {
            await manageRoomServices.deleteMasterRoom(id);
            setBookingData(bookingData.filter(item => item.id !== id));
            message.success('Booking deleted successfully');
        } catch (error) {
            message.error('Failed to delete booking');
        }
    };

    const onFinish: FormProps<MasterRoomType>['onFinish'] = async (values) => {
        try {
            const { ...restValues } = values;
            const updatedMasterRoom = {
                ...restValues,
                id: currentBookingId,
            };
            console.log(updatedMasterRoom);
            await manageRoomServices.updateMasterRoom(updatedMasterRoom);
            message.success('Updated successfully!');
            fetchData();
            handleEditMasterRoomCancel();
        } catch (error) {
            message.error('Failed to update room');
        }
    };

    const fetchData = async () => {
        try {
            const bookingRoom = await manageRoomServices.getMasterRoomQuery();
            setBookingData(bookingRoom);
        } catch (error) {
            message.error('Failed to fetch room data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Modal
                title="แก้ไขห้องประชุม"
                open={modalEditMasterRoom}
                onCancel={handleEditMasterRoomCancel}
                footer={null}
                width={500}
            >
                <Form
                    form={form}
                    name="edit_booking"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Divider orientation="left">แก้ไขห้องประชุม</Divider>
                    <Form.Item
                        label="ชื่อห้องประชุม"
                        name="roomName"
                        rules={[{ required: true, message: 'กรุณากรอกชื่อห้องประชุม!' }]}
                    >
                        <Input placeholder="กรอกชื่อห้องประชุม" />
                    </Form.Item>
                    <Form.Item
                        label="รายละเอียดห้องประชุม"
                        name="roomDescription"
                        rules={[{ required: true, message: 'กรุณากรอกรายละเอียดห้องประชุม!' }]}
                    >
                        <Input placeholder="กรอกรายละเอียดห้องประชุม" />
                    </Form.Item>
                    <Form.Item
                        label="สถานะห้องประชุม"
                        name="roomsStatus"
                        rules={[{ required: true, message: 'กรุณาเลือกสถานะห้องประชุม!' }]}
                    >
                        <Select placeholder="เลือกสถานะห้องประชุม">
                            <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                            <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Row justify="end">
                            <Button type="default" onClick={handleEditMasterRoomCancel} style={{ marginRight: 8 }}>
                                ยกเลิก
                            </Button>
                            <Button type="primary" htmlType="submit">
                                ตกลง
                            </Button>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={bookingData} />
        </>
    );
};

export default RoomStatus;
