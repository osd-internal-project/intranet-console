"use client";
import { Col, Row, Table, Typography } from "antd";
import React from "react";
import { ITypetypeleave } from "../common";

export interface props {
  getdata: ITypetypeleave[];
}

export const TableTypeLeave: React.FC<props> = ({ getdata }): React.ReactElement => {
  const { Paragraph } = Typography;
  const columns = [
    { key: "typeName", title: "ประเภทวันลา", dataIndex: "typeName" },
    {
      key: "descriptionLeave",
      title: "รายละเอียด",
      dataIndex: "descriptionLeave",
      render: (event: string) => {
        const lines = event.split("<br/>");
        return (
          <>
            {
              <Paragraph>
                {lines?.map((line: string, index: number) => (
                  <React.Fragment key={index}>
                    {line.trim()}
                    {index < lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </Paragraph>
            }
          </>
        );
      },
    },
    {
      key: "limitLeaveFour",
      title: (
        <>
          {
            <Row gutter={[8, 8]} className="flex justify-center">
              <Col>{"จำนวนวันลา"}</Col>
              <Col>{"(อายุงาน < 1 ปี)"}</Col>
            </Row>
          }
        </>
      ),
      dataIndex: "limitLeaveFour",
    },
    {
      key: "limitLeaveOne",
      title: (
        <>
          {
            <Row gutter={[8, 8]} className="flex justify-center">
              <Col>{"จำนวนวันลา"}</Col>
              <Col>{"(อายุงาน > 1 ปี)"}</Col>
            </Row>
          }
        </>
      ),
      dataIndex: "limitLeaveOne",
    },
    {
      key: "limitLeaveTwo",
      title: (
        <>
          {
            <Row gutter={[8, 8]} className="flex justify-center">
              <Col>{"จำนวนวันลา"}</Col>
              <Col>{"(อายุงาน > 3 ปี)"}</Col>
            </Row>
          }
        </>
      ),
      dataIndex: "limitLeaveTwo",
    },
    {
      key: "limitLeaveThree",
      title: (
        <>
          {
            <Row gutter={[8, 8]} className="flex justify-center">
              <Col>{"จำนวนวันลา"}</Col>
              <Col>{"(อายุงาน > 5 ปี)"}</Col>
            </Row>
          }
        </>
      ),
      dataIndex: "limitLeaveThree",
    },
    { key: "forwardLeave", title: "ระยะเวลาในการลาล่วงหน้า", dataIndex: "forwardLeave" },
    {
      key: "id",
      title: "Action",
      dataIndex: "id",
      render: (event: number, row: ITypetypeleave, index: number) => {
        return <></>;
      },
    },
  ];
  return (
    <div>
      <Table size="small" dataSource={getdata} columns={columns} rowKey={(e) => e.id} scroll={{ x: "calc(500px + 100%)" }} />
    </div>
  );
};
