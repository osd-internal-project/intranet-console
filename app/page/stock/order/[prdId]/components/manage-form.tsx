import React, { useState } from "react";
import { Form, Input, InputNumber, Select, DatePicker, Button, Card, Row, Col, Space, Typography, Divider, message, FormInstance } from "antd";
import { ShoppingCartOutlined, SaveOutlined, ClearOutlined, CalendarOutlined, DollarOutlined, ProductOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface OrderFormData {
  oderId?: string;
  prdId: string;
  prdName: string;
  price: number;
  totalPrice: number;
  totalQty: number;
  unit?: string;
  expiredAt?: Date;
  updatedBy: string;
  masterProductId?: string;
}

export interface props {
  form: FormInstance;
  handleCalculateTotal: () => void;
  onFinish: (values: OrderFormData) => void;
}

export const ManageFormPage: React.FC<props> = ({ form, handleCalculateTotal, onFinish }) => {
  return (
    <div className="max-w-full mx-auto">
      <Card className="shadow-lg">
        <div className="text-center ">
          <ShoppingCartOutlined className="text-4xl text-blue-500 " />
          <Title level={2} className="text-gray-800 ">
            สร้างออเดอร์ใหม่
          </Title>
          <Text type="secondary">กรอกข้อมูลออเดอร์ให้ครบถ้วนเพื่อดำเนินการต่อ</Text>
        </div>

        <Divider />

        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <div>
            <Title level={4} className="flex items-center mb-4">
              <ProductOutlined className="mr-2 text-blue-500" />
              ข้อมูลสินค้า
            </Title>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="prdId"
                  label="รหัสสินค้า"
                  rules={[
                    { required: true, message: "กรุณากรอกรหัสสินค้า" },
                    { max: 50, message: "รหัสสินค้าต้องไม่เกิน 50 ตัวอักษร" },
                  ]}>
                  <Input placeholder="เช่น PRD001" className="rounded-md" disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="prdName"
                  label="ชื่อสินค้า"
                  rules={[
                    { required: true, message: "กรุณากรอกชื่อสินค้า" },
                    { max: 250, message: "ชื่อสินค้าต้องไม่เกิน 250 ตัวอักษร" },
                  ]}>
                  <Input placeholder="ชื่อสินค้า" className="rounded-md" disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>
            <Title level={4} className="flex items-center mb-4">
              <DollarOutlined className="mr-2 text-green-500" />
              ราคาและจำนวน
            </Title>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="price"
                  label="ราคาต่อหน่วย (บาท)"
                  rules={[
                    { required: true, message: "กรุณากรอกราคา" },
                    { type: "number", min: 0, message: "ราคาต้องมากกว่าหรือเท่ากับ 0" },
                  ]}>
                  <InputNumber
                    className="w-full rounded-md"
                    placeholder="0.00"
                    min={0}
                    precision={2}
                    onChange={handleCalculateTotal}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  name="totalQty"
                  label="จำนวน"
                  rules={[
                    { required: true, message: "กรุณากรอกจำนวน" },
                    { type: "number", min: 0.01, message: "จำนวนต้องมากกว่า 0" },
                  ]}>
                  <InputNumber className="w-full rounded-md" placeholder="1" min={0.01} precision={2} onChange={handleCalculateTotal} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item name="unit" label="หน่วย">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="totalPrice" label="ราคารวม (บาท)">
                  <InputNumber
                    className="w-full rounded-md"
                    placeholder="0.00"
                    min={0}
                    precision={2}
                    readOnly
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>
            <Title level={4} className="flex items-center mb-4">
              <CalendarOutlined className="mr-2 text-orange-500" />
              ข้อมูลเพิ่มเติม
            </Title>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item name="expiredAt" label="วันหมดอายุ">
                  <DatePicker className="w-full rounded-md" placeholder="เลือกวันหมดอายุ" format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="updatedBy" label="ผู้บันทึกข้อมูล">
                  <Input placeholder="ชื่อผู้บันทึก" className="rounded-md" disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-md">
              บันทึกออเดอร์
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
