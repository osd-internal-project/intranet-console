import { FormInstance, Input } from "antd";
import { Form } from "antd/lib";
import React from "react";

export interface props {
  formDetailOrder: FormInstance;
}

const DetailOrderPage: React.FC<props> = ({ formDetailOrder }): React.ReactElement => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">ข้อมูล Order</h2>
        <div className="h-1 w-20 bg-blue-500 rounded"></div>
      </div>
      <Form form={formDetailOrder} layout="vertical" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* รหัส Order */}
          <Form.Item label={<span className="text-sm font-medium text-gray-700">รหัส Order</span>} name="oderId" className="mb-4">
            <Input
              readOnly
              className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-2 focus:shadow-none focus:border-blue-500 hover:border-gray-300"
              placeholder="-"
            />
          </Form.Item>

          {/* ชื่อสินค้า */}
          <Form.Item label={<span className="text-sm font-medium text-gray-700">ชื่อสินค้า</span>} name="prdName" className="mb-4">
            <Input
              readOnly
              className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-2 focus:shadow-none focus:border-blue-500 hover:border-gray-300"
              placeholder="-"
            />
          </Form.Item>

          {/* ราคา */}
          <Form.Item label={<span className="text-sm font-medium text-gray-700">ราคา</span>} name="price" className="mb-4">
            <Input
              readOnly
              className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-2 focus:shadow-none focus:border-blue-500 hover:border-gray-300"
              placeholder="-"
              suffix={<span className="text-gray-500">บาท</span>}
            />
          </Form.Item>

          {/* ราคารวม */}
          <Form.Item label={<span className="text-sm font-medium text-gray-700">ราคารวม</span>} name="totalPrice" className="mb-4">
            <Input
              readOnly
              className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-2 focus:shadow-none focus:border-blue-500 hover:border-gray-300"
              placeholder="-"
              suffix={<span className="text-gray-500">บาท</span>}
            />
          </Form.Item>

          {/* จำนวนทั้งหมด */}
          <Form.Item label={<span className="text-sm font-medium text-gray-700">จำนวนทั้งหมด</span>} name="totalQty" className="mb-4">
            <Input
              readOnly
              className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-2 focus:shadow-none focus:border-blue-500 hover:border-gray-300"
              placeholder="-"
            />
          </Form.Item>

          {/* หน่วย */}
          <Form.Item label={<span className="text-sm font-medium text-gray-700">หน่วย</span>} name="unit" className="mb-4">
            <Input
              readOnly
              className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-2 focus:shadow-none focus:border-blue-500 hover:border-gray-300"
              placeholder="-"
            />
          </Form.Item>

          {/* หมดอายุ */}
          <Form.Item label={<span className="text-sm font-medium text-gray-700">หมดอายุ</span>} name="expiredAt" className="mb-4">
            <Input
              readOnly
              className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-2 focus:shadow-none focus:border-blue-500 hover:border-gray-300"
              placeholder="-"
            />
          </Form.Item>

          {/* นำเข้าโดย */}
          <Form.Item label={<span className="text-sm font-medium text-gray-700">นำเข้าโดย</span>} name="updatedBy" className="mb-4">
            <Input
              readOnly
              className="border-0 border-b-2 border-gray-200 rounded-none bg-transparent px-0 py-2 focus:shadow-none focus:border-blue-500 hover:border-gray-300"
              placeholder="-"
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default DetailOrderPage;
