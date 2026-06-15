import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Switch,
} from "antd";
import React from "react";
import { FormInstance } from "antd/lib";

export interface FuelCardFormValues {
  // fuelCardNumber?: string;
  fuelCardStatus?: "active" | "inactive";
  fuelCardExpiredDate?: any;
  fuelMonthlyLimit?: number;
  fuelMonthlyRemaining?: number;
  fuelResetDayOfMonth?: number;
}

export interface props {
  form: FormInstance;
  openModal: boolean;
  handleCloseModal: () => void;
  onFinish: (values: FuelCardFormValues) => void;
}

const ManagementCarFuelcardManage: React.FC<props> = ({
  form,
  openModal,
  handleCloseModal,
  onFinish,
}): React.ReactElement => {
  return (
    <Modal
      title="จัดการ Fuel Card"
      open={openModal}
      onCancel={handleCloseModal}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        name="fuelcard"
        onFinish={onFinish}
        autoComplete="off"
        // size="small"
      >
        <Row gutter={[8, 0]}>
          {/* <Col span={24}>
            <Form.Item label="หมายเลขบัตรเชื้อเพลิง" name="fuelCardNumber">
              <Input placeholder="กรอกหมายเลขบัตรเชื้อเพลิง" />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item
              label="สถานะบัตรเชื้อเพลิง"
              name="fuelCardStatus"
              valuePropName="checked"
              getValueProps={(value) => ({ checked: value === "active" })} // Converts 'active' -> true
              getValueFromEvent={(checked) => (checked ? "active" : "inactive")} // Converts true -> 'active'
            >
              <Switch checkedChildren="ใช้งาน" unCheckedChildren="ไม่ใช้งาน" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="วันหมดอายุบัตร" name="fuelCardExpiredDate">
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันหมดอายุ"
                mode="month"
                picker="month"
                format="YYYY-MM"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="วงเงินรายเดือน (บาท)" name="fuelMonthlyLimit">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="0.00"
                precision={2}
              />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item label="วงเงินคงเหลือ (บาท)" name="fuelMonthlyRemaining">
              <InputNumber style={{ width: "100%" }} min={0} placeholder="0.00" precision={2} />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item
              label="วันรีเซ็ตวงเงิน (วันที่ของเดือน)"
              name="fuelResetDayOfMonth"
              rules={[
                {
                  type: "number",
                  min: 1,
                  max: 31,
                  message: "กรุณากรอกวันที่ 1-31",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                max={31}
                placeholder="1-31"
                precision={0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="flex justify-center" gutter={[8, 8]}>
          <Col>
            <Button type="default" onClick={handleCloseModal}>
              {`ยกเลิก`}
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              {`บันทึก`}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ManagementCarFuelcardManage;
