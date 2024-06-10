import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Card, Modal, Divider, Typography } from 'antd';
import { Icon } from "@iconify/react";
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { BookingRoomServices } from "../services/booking-room.service";

interface Booking {
    id: string;
    title: string;
    roomName: string;
    bookerName: string;
    description: string;
    startDate: string;
    endDate: string;
}

const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
        return 1394;
    }
    return null;
};

const BookingCalendar: React.FC = () => {
    const intraAuth = useAxiosIntranet();
    const bookingRoomServices = BookingRoomServices(intraAuth);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { Title } = Typography;

    const showModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const monthCellRender = (value: Dayjs) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };

    const dateCellRender = (value: Dayjs) => {
        const dailyBookings = bookings.filter((booking) => {
            const bookingStartDate = dayjs(booking.startDate);
            const bookingEndDate = dayjs(booking.endDate);
            return value.isSame(bookingStartDate, 'day') || value.isSame(bookingEndDate, 'day') || (value.isAfter(bookingStartDate, 'day') && value.isBefore(bookingEndDate, 'day'));
        });

        return (
            <div className="events">
                {dailyBookings.map((booking) => (
                    <div key={booking.id} style={{ listStyle: 'none' }}>
                        <div
                            key={booking.id}
                            style={{
                                // width: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                padding: '2px 4px',
                                display: 'block',
                            }}
                            onClick={() => showModal(booking)}
                        >
                            <Badge
                                status="processing"
                                text={booking.roomName}
                                style={{
                                    display: 'block'
                                }}
                            />
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            {dayjs(booking.startDate).format('HH:mm')} - {dayjs(booking.endDate).format('HH:mm')}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const bookingRoom = await bookingRoomServices.getBookingRoomQuery();
            console.log(bookingRoom);
            setBookings(bookingRoom);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    };

    return (
        <>
            <Card>
                <Calendar cellRender={cellRender}/>
            </Card>
            {selectedBooking && (
                <Modal
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}><Title level={4}><Icon icon="cil:room" /> {selectedBooking.roomName}</Title></Divider>
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>ข้อมูลการจอง</Divider>
                    <Title level={5} style={{ marginLeft: '24px' }}><strong>หัวข้อประชุม :</strong> {selectedBooking.title}</Title>
                    <Title level={5} style={{ marginLeft: '24px' }}><strong>วันที่จอง :</strong> {dayjs(selectedBooking.startDate).format('YYYY-MM-DD')} - {dayjs(selectedBooking.endDate).format('YYYY-MM-DD')}</Title>
                    <Title level={5} style={{ marginLeft: '24px' }}><strong>เวลาที่จอง :</strong> {dayjs(selectedBooking.startDate).format('HH:mm')} - {dayjs(selectedBooking.endDate).format('HH:mm')}</Title>
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>ข้อมูลผู้จอง</Divider>
                    <Title level={5} style={{ marginLeft: '24px' }}><strong>ชื่อผู้จอง :</strong> {selectedBooking.bookerName}</Title>
                    
                </Modal >
            )}
        </>
    );
};

export default BookingCalendar;
