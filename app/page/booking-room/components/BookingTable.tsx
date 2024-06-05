import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from '@/app/lib/axios/axios';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    no: number;
    roomname: string;
    type: string;
    date: string;
    time: string;
    bookername: string;
    status: string;
    details: string;
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
        dataIndex: 'roomname',
        key: 'roomname',
    },
    {
        title: 'ประเภทการจอง',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'วันที่จอง',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'เวลาจอง',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: 'ชื่อผู้จอง',
        dataIndex: 'bookername',
        key: 'bookername',
    },
    {
        title: 'สถานะ',
        key: 'status',
        dataIndex: 'status',
    },
    {
        title: 'รายละเอียด',
        key: 'details',
        dataIndex: 'details',
    },
];

const BookingTable = () => {
    const [data, setData] = useState<DataType[]>([]);

    useEffect(() => {
        axios.get('https://665edcf31e9017dc16f1c666.mockapi.io/roomname')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <Table columns={columns} dataSource={data} />
    );
};

export default BookingTable;
