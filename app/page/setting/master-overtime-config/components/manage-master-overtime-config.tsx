import { optionsTimesNormall } from "@/app/page/overtime/overtime-form/common";
import { Button, Col, Form, FormInstance, Input, Modal, Row, Select } from "antd";
import React from "react";

export interface props {
  ManageForm: FormInstance;
  openModal: boolean;
  CloseModal: () => void;
  onFinish: (events: any) => void;
}

const ManageMasterOvertimeConfig: React.FC<props> = ({ ManageForm, openModal, CloseModal, onFinish }): React.ReactElement => {
  return (
    <div>
      <Modal title="แก้ไขข้อมูล" open={openModal} footer={false} onCancel={CloseModal}>
        <Form onFinish={onFinish} name={`manage-form`} form={ManageForm} layout="vertical">
          <Form.Item name={`name`} label={`วัน`} layout="horizontal">
            <Input disabled />
          </Form.Item>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Form.Item name={`intime`} label={`อัตราการคิดในเวลา :`} rules={[{ required: true, message: "กรุณาเลือกเวลาออก" }]}>
                <Input addonAfter={`เท่า`} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={`overtime`} label={`อัตราการคิดนอกเวลา :`} rules={[{ required: true, message: "กรุณาเลือกเวลาออก" }]}>
                <Input addonAfter={`เท่า`} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={`startTime`} label={`เวลาเข้างาน :`} rules={[{ required: true, message: "กรุณาเลือกเวลาออก" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={`endTime`} label={`เวลาเลิกงาน :`} rules={[{ required: true, message: "กรุณาเลือกเวลาออก" }]}>
                <Select allowClear placeholder={`Please Select`} options={optionsTimesNormall} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={`startOt`} label={`เวลาล่วงเวลา :`} rules={[{ required: true, message: "กรุณาเลือกเวลาออก" }]}>
                <Select allowClear placeholder={`Please Select`} options={optionsTimesNormall} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={`typeDate`} label={`ประเภทของวัน :`} rules={[{ required: true, message: "กรุณาเลือกเวลาออก" }]}>
                <Select
                  placeholder={`Please Select`}
                  allowClear
                  options={[
                    { value: "dayoff", label: "วันหยุด" },
                    { value: "intime", label: "วันปกติ" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={`breakTime`} label={`เวลาพัก :`} rules={[{ required: true, message: "กรุณาเลือกเวลาออก" }]}>
                <Input addonAfter={`ชม.`} />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">{`ยืนยัน`}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageMasterOvertimeConfig;
