import React, { useState, useEffect } from 'react';
import { Table, Tag, Button } from 'antd';
import type { TableProps } from 'antd';
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { BookingRoomServices } from "../services/booking-room.service";
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

interface DataType {
    key: string;
    no: number;
    roomName: string;
    roomType: string;
    startDate: string;
    endDate: string;
    bookerName: string;
    bookingStatus: string;
    details: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        key: 'no',
        title: 'ลำดับ',
        dataIndex: 'no',
        width: "50px",
        render: (_, record, index) => <>{index + 1}</>,
    },
    {
        key: 'roomName',
        title: 'ชื่อห้องประชุม',
        dataIndex: 'roomName',
        width: "200px",
    },
    {
        key: 'roomType',
        title: 'ประเภทการจอง',
        dataIndex: 'roomType',
        width: "150px",
    },
    {
        key: 'bookingDate',
        title: 'วันที่จอง',
        width: "250px",
        render: (_, record) => (
            <span>
                {dayjs(record.startDate).format('YYYY-MM-DD')} - {dayjs(record.endDate).format('YYYY-MM-DD')}
            </span>
        ),
    },
    {
        key: 'bookingTime',
        title: 'เวลาจอง',
        width: "150px",
        render: (_, record) => (
            <span>
                {dayjs(record.startDate).format('HH:mm')} - {dayjs(record.endDate).format('HH:mm')}
            </span>
        ),
    },
    {
        key: 'bookerName',
        title: 'ชื่อผู้จอง',
        dataIndex: 'bookerName',
        width: "150px",
    },
    {
        key: 'bookingStatus',
        title: 'สถานะ',
        dataIndex: 'bookingStatus',
        width: "100px",
        render: (data: string) =>
            data ? (
                data === "process" ? (
                    <Tag color="blue">กำลังรออนุมัติ</Tag>
                ) : data === "Approve" ? (
                    <Tag color="green">อนุมัติสำเร็จ</Tag>
                ) : data === "cancel" ? (
                    <Tag color="red">ยกเลิกการจอง</Tag>
                ) : (
                    <Tag>Unknown Status</Tag> // Example of handling unknown status
                )
            ) : (
                <Tag>ไม่มีสถานะ</Tag> // Example of handling undefined/null case
            ),
    },
    {
        key: 'details',
        title: 'รายละเอียด',
        dataIndex: 'details',
        width: "100px",
        render: (_, record) => (
            <Button type="link">
                รายละเอียด
            </Button>
        ),
    },
];

const BookingTable = () => {
    const { data: session } = useSession();
    const intraAuth = useAxiosIntranet();
    const bookingRoomServices = BookingRoomServices(intraAuth);
    const [bookingData, setBookingData] = useState<DataType[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const bookingRoom = await bookingRoomServices.getBookingRoomQuery();
        setBookingData(bookingRoom);
    };
    return (
        <Table columns={columns} dataSource={bookingData} />
    );
};

export default BookingTable;
