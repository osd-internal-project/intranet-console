"use client";
import React from "react";
import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { FormInstance } from "antd/lib";
import { ICreateMasterHolidayDto, IManagePageDay } from "../../common";

export interface Props {
  onFinishAction: (event: ICreateMasterHolidayDto) => void;
  setManageStatusDay: (value: IManagePageDay) => void;
  manageStatusDay: IManagePageDay;
  formAction: FormInstance;
}

export const HolidayActions: React.FC<Props> = ({ onFinishAction, setManageStatusDay, manageStatusDay, formAction }): React.ReactElement => {
  return (
    <div>
      <Modal
        title={`${manageStatusDay.statusAction} Holiday`}
        open={manageStatusDay.statusModal}
        onCancel={() => {
          setManageStatusDay({ statusModal: false }), formAction.resetFields();
        }}
        footer={false}>
        <Form layout="vertical" form={formAction} autoComplete="off" onFinish={onFinishAction}>
          <Row gutter={[8, 8]}>
            <Form.Item<ICreateMasterHolidayDto> name="holidaysYear" hidden>
              <Input />
            </Form.Item>
            <Col span={24}>
              <Form.Item<ICreateMasterHolidayDto>
                className=" mb-0"
                label="ชื่อวันหยุด:"
                name="holidaysName"
                rules={[{ required: true, message: "โปรดกรอกชื่อวันหยุด" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<ICreateMasterHolidayDto>
                className=" mb-0"
                label="วันที่:"
                name="holidaysDate"
                rules={[{ required: true, message: "โปรดเลือกวันที่" }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4 mt-2">
              <Button
                onClick={() => {
                  setManageStatusDay({ statusModal: false }), formAction.resetFields();
                }}>{`Cancel`}</Button>
              <Button type="primary" htmlType="submit">
                {`Add`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <div className="flex justify-end mb-5">
        <Button
          type="primary"
          onClick={() => {
            setManageStatusDay({ statusModal: true, statusAction: "create" });
          }}>{`Add Holiday`}</Button>
      </div>
    </div>
  );
};
