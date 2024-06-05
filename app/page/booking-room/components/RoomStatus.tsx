import React, { useState, useEffect } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import axios from '@/app/lib/axios/axios';

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
        dataIndex: 'roomname',
        key: 'roomname',
    },
    {
        title: 'สถานะ',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'หมายเหตุ',
        dataIndex: 'note',
        key: 'note',
    },
];

const RoomStatus = () => {
    const [data, setData] = useState<DataType[]>([]);

    useEffect(() => {
        axios.get('https://665edcf31e9017dc16f1c666.mockapi.io/roomstatus')
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

export default RoomStatus;