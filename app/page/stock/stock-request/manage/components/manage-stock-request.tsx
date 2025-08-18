import { Button, Card, DatePicker, Form, FormInstance, Input, InputNumber, Select } from "antd";
import React, { useState } from "react";
import { ITRequestOrder } from "../../../common/request-order";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IDataUser, ISelect } from "@/app/page/leave-control-management/common";

export interface props {
  getdataUser: ISelect[];
  options: ISelect[];
  form: FormInstance<ITRequestOrder>;
  onFinish: (values: ITRequestOrder) => void;
}

export const ManageStockRequestPage: React.FC<props> = ({ getdataUser, options, form, onFinish }): React.ReactElement => {
  const [unitNames, setUnitNames] = useState<string[]>([]);
  const handleProductChange = (value: string, index: number) => {
    const unitName = options.find((o) => o.value === value)?.unit || "";
    setUnitNames((prev) => {
      const valueBefore = [...prev];
      valueBefore[index] = unitName;
      return valueBefore;
    });
  };
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">IT Request Order Form</h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลคำขอสั่งซื้ออุปกรณ์ IT</p>
        </div>
        <Form form={form} name="itRequestOrder" layout="vertical" onFinish={onFinish} autoComplete="off" className="space-y-4">
          <Card title="ข้อมูลคำขอ :" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Form.Item label="ผู้ขอ" name="requester" rules={[{ required: true, message: "กรุณากรอกชื่อผู้ขอ" }]}>
                <Select options={getdataUser} placeholder="ชื่อผู้ขอ" className="w-full" showSearch optionFilterProp="label" />
              </Form.Item>

              <Form.Item label="วันที่ขอ :" name="requestDate" rules={[{ required: true, message: "กรุณาเลือกวันที่ขอ" }]}>
                <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="เลือกวันที่" />
              </Form.Item>

              <Form.Item label="วัตถุประสงค์ :" name="object" rules={[{ required: true, message: "กรุณากรอกวัตถุประสงค์" }]}>
                <Input placeholder="วัตถุประสงค์การขอ" className="w-full" />
              </Form.Item>

              <Form.Item label="ผู้สร้าง :" name="createdBy">
                <Input placeholder="ชื่อผู้สร้าง" className="w-full" disabled />
              </Form.Item>
            </div>

            <Form.Item label="หมายเหตุ :" name="remark">
              <Input.TextArea rows={3} placeholder="หมายเหตุเพิ่มเติม..." className="w-full" showCount maxLength={250} />
            </Form.Item>
          </Card>
          <Card title="รายการสินค้าที่ขอ" className="mb-6">
            <Form.List name="requestList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="relative p-4 border border-gray-200 rounded-lg mb-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Form.Item
                          {...restField}
                          label="รหัสสินค้า"
                          name={[name, "masterProductId"]}
                          rules={[{ required: true, message: "กรุณาเลือกสินค้า" }]}
                          className="md:col-span-2">
                          <Select
                            placeholder="เลือกสินค้า"
                            options={options}
                            showSearch
                            optionFilterProp="label"
                            allowClear
                            onChange={(value) => handleProductChange(value, index)}
                          />
                        </Form.Item>
                        <Form.Item {...restField} label="จำนวน" name={[name, "qty"]} rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}>
                          <InputNumber placeholder="0" min={0} step={1} className="w-full" suffix={unitNames[index] || ""} />
                        </Form.Item>
                        <Form.Item {...restField} label="ราคา" name={[name, "amount"]} rules={[{ required: true, message: "กรุณากรอกราคา" }]}>
                          <InputNumber
                            placeholder="0.00"
                            min={0}
                            step={0.01}
                            className="w-full"
                            formatter={(value) => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value: any) => parseFloat(value!.replace(/฿\s?|(,*)/g, "")) || 0}
                          />
                        </Form.Item>
                      </div>
                      <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} className="absolute top-2 right-2">
                        ลบ
                      </Button>
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      className="w-full h-12 border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700">
                      เพิ่มรายการสินค้า
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button size="large" className="px-8">
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" size="large" className="px-8 bg-blue-600 hover:bg-blue-700">
              ขอเบิกสินค้า
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
