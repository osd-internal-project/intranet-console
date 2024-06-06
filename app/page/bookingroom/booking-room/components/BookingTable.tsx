import React, { useState, useEffect } from 'react';
import { Table, Tag, Button } from 'antd';
import axios from '@/app/lib/axios/axios';
import type { TableProps } from 'antd';
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { BookingRoomServices } from "../services/booking-room.service"
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

interface DataType {
    key: string;
    no: number;
    roomname: string;
    type: string;
    startDate: string;
    endDate: string;
    bookername: string;
    bookingStatus: string;
    details: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'ลำดับ',
        dataIndex: 'no',
        key: 'no',
        width: "50px",
        render: (_, record, index) => <>{index + 1}</>,
    },
    {
        title: 'ชื่อห้องประชุม',
        dataIndex: 'roomName',
        key: 'roomName',
        width: "200px",
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
        render: (data: string) =>
            data ? (
                data === "process" ? (
                    <Tag color="blue">กำลังรออนุมัติ</Tag>
                ) : data === "success" ? (
                    <Tag color="green">อนุมัติสำเร็จ</Tag>
                ) : data === "cancel" ? (
                    <Tag color="red">ยกเลิกการจอง</Tag>
                ) : (
                    ""
                )
            ) : (
                ""
            ),
    },
    {
        title: 'รายละเอียด',
        key: 'note',
        dataIndex: 'note',
        width: "100px",
        render: (data: Date) => (
            <Button type="link" ghost>
                รายละเอียด
            </Button>
        ),
    },
];

const BookingTable = () => {
    const {data:session} = useSession();
    const stockAuth = useAxiosIntranet();
    const bookingRoomServices = BookingRoomServices(stockAuth);
    const [data, setData] = useState<DataType[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        console.log(session);
        const bookingRoom = await bookingRoomServices.getBookingRoomQuery();
        setData(bookingRoom);
    };

    return (
        <Table columns={columns} dataSource={data} />
    );
};

export default BookingTable;
