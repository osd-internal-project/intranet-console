"use client";
import { Button, Col, Form, Input, Modal, Row, Switch, Table, Typography } from "antd";
import React from "react";
import { ITypetypeleave } from "../common";
import { deleteIcon, editIcon } from "@/components/icon";
import TextArea from "antd/es/input/TextArea";

export interface props {
  getdata: ITypetypeleave[];
  setOpenModalEdit: (e: boolean) => void;
  openModalEdit: boolean;
  formedit: any;
  onFinishEdit: (e: ITypetypeleave) => void;
  onFinishDel: (e: number) => void;
}

export const TableTypeLeave: React.FC<props> = ({
  getdata,
  setOpenModalEdit,
  openModalEdit,
  formedit,
  onFinishEdit,
  onFinishDel,
}): React.ReactElement => {
  const { Paragraph } = Typography;
  const columns: any = [
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
      align: "center",
      // fixed: "right",
      width: "100px",
      render: (event: number, row: ITypetypeleave, index: number) => {
        const data = {
          limitLeaveThree: row.limitLeaveThree,
          limitLeaveFour: row.limitLeaveFour,
          limitLeaveTwo: row.limitLeaveTwo,
          limitLeaveOne: row.limitLeaveOne,
          forwardLeave: row.forwardLeave,
          descriptionLeave: row.descriptionLeave,
          typeName: row.typeName,
          typeNameEn: row.typeNameEn,
          typeNameTh: row.typeNameTh,
          typeEveryDay: row.typeEveryDay,
          id: row.id,
          updatedAt: new Date(),
          typeId: row.typeId,
        };
        return (
          <>
            <div className="flex justify-center">
              <Button
                type="link"
                onClick={() => {
                  setOpenModalEdit(true), formedit.setFieldsValue(data);
                }}
              >
                {editIcon}
              </Button>
              <Button
                type="link"
                onClick={() => {
                  onFinishDel(row.id);
                }}
                danger
              >
                {deleteIcon}
              </Button>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Table size="small" dataSource={getdata} columns={columns} rowKey={(e) => e.id} scroll={{ x: "calc(500px + 100%)" }} />
      <Modal title="Edit" open={openModalEdit} onCancel={() => setOpenModalEdit(false)} footer={false}>
        <Form layout="vertical" form={formedit} autoComplete="off" onFinish={onFinishEdit}>
          <Form.Item className=" mb-0" name="id" hidden>
            <Input />
          </Form.Item>
          <Row gutter={[8, 8]}>
            <Col span={8}>
              <Form.Item className=" mb-0" label="วันลา:" name="typeName" rules={[{ required: true, message: "กรุณากรอกวันลา" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className=" mb-0" label="ชื่อภาษาไทย:" name="typeNameTh" rules={[{ required: true, message: "กรุณากรอกชื่อภาษาไทย" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className=" mb-0" label="ชื่อภาษาอังกฤษ:" name="typeNameEn" rules={[{ required: true, message: "กรุณากรอกชื่อภาษาอังกฤษ" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="รายละเอียดข้อมูลวันลา:"
                name="descriptionLeave"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียดข้อมูลวันลา" }]}
              >
                <TextArea showCount maxLength={1000} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="ระยะเวลาในการลาล่วงหน้า:"
                name="forwardLeave"
                rules={[{ required: true, message: "กรุณากรอกระยะเวลาในการลาล่วงหน้า" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="จำนวนวันลา(อายุงานมากกว่า 1 ปี):"
                name="limitLeaveOne"
                rules={[{ required: true, message: "กรุณากรอกจำนวนวันลา (อายุงานมากกว่า 1 ปี)" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="จำนวนวันลา(อายุงานมากกว่า 3 ปี):"
                name="limitLeaveTwo"
                rules={[{ required: true, message: "กรุณากรอกจำนวนวันลา (อายุงานมากกว่า 3 ปี)" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="จำนวนวันลา(อายุงานมากกว่า 5 ปี):"
                name="limitLeaveThree"
                rules={[{ required: true, message: "กรุณากรอกจำนวนวันลา (อายุงานมากกว่า 5 ปี)" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="จำนวนวันลา(อายุงานน้อยกว่า 1 ปี):"
                name="limitLeaveFour"
                rules={[{ required: true, message: "กรุณากรอกจำนวนวันลา (อายุงานน้อยกว่า 1 ปี)" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="ต้องการให้ลารวมถึงเสาร์อาทิตย์ :" name="typeEveryDay">
                <Switch checkedChildren="Off" unCheckedChildren="On" defaultChecked={false} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button onClick={() => setOpenModalEdit(false)}>{`Cancel`}</Button>
              <Button type="primary" htmlType="submit">
                {`Edit`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
