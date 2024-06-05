"use client";
import { Breadcrumb, Button, Card, Checkbox, Col, Form, Input, Row, Tabs, TabsProps } from "antd";
import React from 'react'

const page = () => {
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "ชั้น",
        },
        {
            key: "2",
            label: "แม่บ้าน",
        },
    ];
    return (
        <>
            <Row>
                <Col span={24}>
                    <Breadcrumb
                        items={[
                            {
                                href: "/page",
                                title: <span>Home</span>,
                            },

                            {
                                title: <span>Booking room Management</span>,
                            },
                        ]}
                    />
                </Col>
                <Col span={24}>
                    <div className="title-page-font">{`Booking room Management`}</div>
                </Col>
                <Col span={24}>
                    <div className=" grid-span-1 space-y-2">
                        <Card>
                            <Tabs defaultActiveKey="1" items={items} />
                        </Card>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default page