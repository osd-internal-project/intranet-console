import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { BookingRoomServices } from "../services/booking-room.service"

interface DataType {
    no: string;
    roomName: string;
    roomsStatus: string;
    roomDescription: string;
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
            status 
            ? <Tag style={{scale:'120%',fontStyle:'bold',backgroundColor:'#00FF00',textAlign:'center'}}>ใช้งานได้ปกติ</Tag> 
            : <Tag style={{scale:'120%',fontStyle:'bold',backgroundColor:'#FF6347',textAlign:'center'}}>ไม่สามารถใช้งานได้</Tag>
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
        const Bookingresponse = await bookingRoomServices.getMasterRoomQuery();
        const BookingRoom: DataType[] = Bookingresponse.map((item: any, index: number) => ({
            ...item,
            key: index.toString()
        }));
        setBookingData(BookingRoom);
    };

    return (
        <Table columns={columns} dataSource={bookingData} />
    );
};

export default RoomStatus;