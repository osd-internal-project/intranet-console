import React from "react";
import { Form, Input, InputNumber, DatePicker, Button, Card, Row, Col, Typography, Divider, FormInstance } from "antd";
import {
  ShoppingCartOutlined,
  SaveOutlined,
  CalendarOutlined,
  DollarOutlined,
  ProductOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
  orderLot: any[];
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
            นำสินค้าเข้าคลัง
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
              <Col xs={24} sm={12}>
                <Form.Item
                  name="cost"
                  label="ราคาทุน (บาท)"
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

              <Col xs={12}>
                <Form.Item name="avgCost" label="ราคาทุนต่อชิ้น (บาท)">
                  <InputNumber
                    className="w-full rounded-md"
                    placeholder="0.00"
                    min={0}
                    precision={2}
                    disabled
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="price"
                  label="ราคาต่อหน่วย (บาท)"
                  rules={[
                    { required: true, message: "กรุณากรอกราคา" },
                    { type: "number", min: 0, message: "ราคาต้องมากกว่าหรือเท่ากับ 0" },
                  ]}>
                  <InputNumber
                    disabled
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
                  <InputNumber className="w-full rounded-md" placeholder="1" min={0} onChange={handleCalculateTotal} />
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
                    disabled
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
                <Form.Item name="updatedBy" label="ผู้บันทึกข้อมูล">
                  <Input placeholder="ชื่อผู้บันทึก" className="rounded-md" disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>
          {/* Order Lot Section
          <div>
            <Title level={4} className="flex items-center mb-4">
              <BarcodeOutlined className="mr-2 text-purple-500" />
              รายการ Order Lot
            </Title>

            <Form.List name="orderLot">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card
                      key={key}
                      className="mb-4 shadow-sm border-l-4 border-purple-400"
                      size="small"
                      title={
                        <div className="flex justify-between items-center">
                          <span className="text-purple-600">Order Lot #{index + 1}</span>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            className="text-red-500 hover:text-red-700">
                            ลบรายการ
                          </Button>
                        </div>
                      }>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "prdName"]}
                            label="ชื่อสินค้า"
                            rules={[
                              { required: true, message: "กรุณากรอกชื่อสินค้า" },
                              { max: 250, message: "ชื่อสินค้าต้องไม่เกิน 250 ตัวอักษร" },
                            ]}>
                            <Input placeholder="ชื่อสินค้าใน Lot" className="rounded-md" disabled />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} lg={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "barcode"]}
                            label="บาร์โค้ด"
                            rules={[{ max: 50, message: "บาร์โค้ดต้องไม่เกิน 50 ตัวอักษร" }]}>
                            <Input placeholder="บาร์โค้ดสินค้า" className="rounded-md" />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} lg={8}>
                          <Form.Item {...restField} name={[name, "unit"]} label="หน่วย">
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "price"]}
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
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "cost"]}
                            label="ราคาทุน (บาท)"
                            rules={[
                              { required: true, message: "กรุณากรอกราคา" },
                              { type: "number", min: 0, message: "ราคาต้องมากกว่าหรือเท่ากับ 0" },
                            ]}>
                            <InputNumber
                              className="w-full rounded-md"
                              placeholder="0.00"
                              min={0}
                              precision={2}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              disabled
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "avgCost"]}
                            label="ราคาทุนต่อชิ้น (บาท)"
                            rules={[
                              { required: true, message: "กรุณากรอกราคา" },
                              { type: "number", min: 0, message: "ราคาต้องมากกว่าหรือเท่ากับ 0" },
                            ]}>
                            <InputNumber
                              className="w-full rounded-md"
                              placeholder="0.00"
                              min={0}
                              precision={2}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item {...restField} name={[name, "expiredAt"]} label="วันหมดอายุ">
                            <DatePicker className="w-full rounded-md" placeholder="เลือกวันหมดอายุ" format="DD/MM/YYYY" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        const rootPrice = form.getFieldValue("price");
                        const rootCost = form.getFieldValue("cost");
                        const rootAvgCost = form.getFieldValue("avgCost");

                        add({
                          prdName: form.getFieldValue("prdName"),
                          unit: form.getFieldValue("unit"),
                          price: rootPrice,
                          cost: rootCost,
                          avgCost: rootAvgCost,
                        });
                      }}
                      block
                      icon={<PlusOutlined />}
                      className="h-12 border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:text-purple-700 rounded-md">
                      เพิ่ม Order Lot ใหม่
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div> */}
          <div className="flex justify-end flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-md">
              บันทึกการนำเข้า
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
