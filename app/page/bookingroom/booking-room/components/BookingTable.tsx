import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Divider } from 'antd';
import { TableProps } from 'antd/es/table';
import dayjs from 'dayjs';

interface DataType {
    id: string;
    no: number;
    roomName: string;
    roomType: string;
    startDate: string;
    endDate: string;
    bookerName: string;
    bookingStatus: string;
    details: string;
    created_at: string;
}

interface Props {
    bookingFetchData: DataType[];
}

const BookingTable: React.FC<Props> = ({ bookingFetchData }) => {
    const [modalBookingDetails, setModalBookingDetails] = useState(false);
    const [currentBookingDetails, setCurrentBookingDetails] = useState<DataType | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const columns: TableProps<DataType>['columns'] = [
        {
            key: 'no',
            title: 'ลำดับ',
            dataIndex: 'no',
            width: "50px",
            render: (_, __, index) => <>{(currentPage - 1) * pageSize + index + 1}</>,
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
            render: (status: string) => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'process':
                        color = 'blue';
                        text = 'กำลังรออนุมัติ';
                        break;
                    case 'Approve':
                        color = 'green';
                        text = 'อนุมัติสำเร็จ';
                        break;
                    case 'cancel':
                        color = 'red';
                        text = 'ยกเลิกการจอง';
                        break;
                    default:
                        color = 'default';
                        text = 'Unknown Status';
                        break;
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            key: 'details',
            title: 'รายละเอียด',
            dataIndex: 'details',
            width: "100px",
            render: (_, record) => (
                <Button type="link" onClick={() => showModalBookingDetails(record)}>
                    รายละเอียด
                </Button>
            ),
        },
    ];

    const renderStatusTag = (status: string) => {
        switch (status) {
            case 'Approve':
                return <Tag color={'green'}>อนุมัติสำเร็จ</Tag>;
            case 'process':
                return <Tag color={'blue'}>กำลังรออนุมัติ</Tag>;
            case 'cancel':
                return <Tag color="red">ยกเลิกการจอง</Tag>;
            default:
                return 'Unknown Status';
        }
    };

    const showModalBookingDetails = (record: DataType) => {
        setCurrentBookingDetails(record);
        setModalBookingDetails(true);
    };

    const handleBookingDetailsCancel = () => {
        setModalBookingDetails(false);
        setCurrentBookingDetails(null);
    };

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const paginatedData = bookingFetchData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: bookingFetchData.length,
        onChange: handleTableChange,
    };

    useEffect(() => {
    }, [currentPage, pageSize]);

    return (
        <>
            <Modal
                title="รายละเอียดการจอง"
                visible={modalBookingDetails}
                onCancel={handleBookingDetailsCancel}
                footer={null}
                centered
                width={400}
                style={{ top: 20 }}
            >
                {currentBookingDetails && (
                    <>
                        <Divider />
                        <p><strong>ชื่อห้องประชุม : </strong> <span className="modal-content">{currentBookingDetails.roomName}</span></p>
                        <p><strong>ประเภทการจอง : </strong> <span className="modal-content">{currentBookingDetails.roomType}</span></p>
                        <p><strong>วันที่จอง : </strong> <span className="modal-content">{dayjs(currentBookingDetails.startDate).format('YYYY-MM-DD')} - {dayjs(currentBookingDetails.endDate).format('YYYY-MM-DD')}</span></p>
                        <p><strong>เวลาจอง : </strong> <span className="modal-content">{dayjs(currentBookingDetails.startDate).format('HH:mm')} - {dayjs(currentBookingDetails.endDate).format('HH:mm')}</span></p>
                        <p>
                            <strong>สถานะ : </strong>
                            <span className="modal-content">
                                {currentBookingDetails.bookingStatus ? renderStatusTag(currentBookingDetails.bookingStatus) : 'ไม่มีสถานะ'}
                            </span>
                        </p>
                        <Divider />
                        <p><strong>ชื่อผู้จอง : </strong> <span className="modal-content">{currentBookingDetails.bookerName}</span></p>
                    </>
                )}
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
};

export default BookingTable;
