import React, { useState, useEffect } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import axios from '@/app/lib/axios/axios';
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { BookingRoomServices } from "../services/booking-room.service"

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'ลำดับ',
        dataIndex: 'no',
        key: 'no',
        render: (_, record, index) => <>{index + 1}</>,
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
];

const RoomStatus = () => {
    const stockAuth = useAxiosIntranet();
    const bookingRoomServices = BookingRoomServices(stockAuth);
    const [bookingData, setBookingData] = useState<DataType[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const bookingRoom = await bookingRoomServices.getMasterRoomQuery();
        console.log(bookingRoom);
        setBookingData(bookingRoom);
    };

    return (
        <Table columns={columns} dataSource={bookingData} />
    );
};

export default RoomStatus;