import { ISelect } from "@/app/page/leave-control-management/common";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, FormInstance, Input, InputNumber, Select, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ITRequestOrder } from "../../../common/request-order";
import { useRouter } from "next/navigation";

export interface props {
  getdataUser: ISelect[];
  options: ISelect[];
  form: FormInstance<ITRequestOrder>;
  onFinish: (values: ITRequestOrder) => void;
  unitNames: string[];
  setUnitNames: React.Dispatch<React.SetStateAction<string[]>>;
}

const ManageRequestDetailPage: React.FC<props> = ({ getdataUser, options, form, onFinish, unitNames, setUnitNames }): React.ReactElement => {
  const navigate = useRouter();
  useEffect(() => {
    const list = form.getFieldsValue(true);
    list?.requestList?.forEach((item: any, idx: number) => {
      if (item.masterProductId) {
        handleProductChange(item.masterProductId, idx);
      }
    });
  }, [form]);

  const handleProductChange = (value: string, index: number) => {
    const unitName = options.find((o) => o.value === value)?.unit || "";
    setUnitNames((prev) => {
      const valueBefore = [...prev];
      valueBefore[index] = unitName;
      return valueBefore;
    });
  };

  const checkStatus = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      new: { text: "ใหม่", color: "blue" },
      approved: { text: "อนุมัติ", color: "green" },
      rejected: { text: "ปฏิเสธ", color: "red" },
      cancelled: { text: "ยกเลิก", color: "orange" },
    };
    const test = statusMap[status] || { text: status, color: "default" };
    return <Tag color={test.color}>{test.text}</Tag>;
  };

  return (
    <Card className="shadow-lg" bodyStyle={{ padding: "16px" }}>
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-1">IT Request Order Form</h1>
          <p className="text-sm text-gray-600">กรุณากรอกข้อมูลคำขอสั่งซื้ออุปกรณ์ IT</p>
        </div>
        <div>{checkStatus(form.getFieldValue("status"))}</div>
      </div>

      <Form form={form} name="itRequestOrder" layout="vertical" onFinish={onFinish} autoComplete="off" className="space-y-3" size="small">
        <Card
          title="ข้อมูลคำขอ :"
          className="mb-4"
          size="small"
          bodyStyle={{ padding: "12px" }}
          headStyle={{ padding: "8px 12px", minHeight: "auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Form.Item label="ผู้ขอ" name="requester" className="mb-2">
              <Form.Item name="action" hidden>
                <Input />
              </Form.Item>
              <Select options={getdataUser} placeholder="ชื่อผู้ขอ" className="w-full" showSearch optionFilterProp="label" disabled size="small" />
            </Form.Item>

            <Form.Item label="วันที่ขอ :" name="requestDate" className="mb-2">
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="เลือกวันที่" disabled size="small" />
            </Form.Item>

            <Form.Item label="วัตถุประสงค์ :" name="object" className="mb-2">
              <Input placeholder="วัตถุประสงค์การขอ" className="w-full" disabled size="small" />
            </Form.Item>

            <Form.Item label="ผู้สร้าง :" name="createdBy" className="mb-2">
              <Input placeholder="ชื่อผู้สร้าง" className="w-full" disabled size="small" />
            </Form.Item>
          </div>

          <Form.Item label="หมายเหตุ :" name="remark" className="mb-0">
            <Input.TextArea rows={2} placeholder="หมายเหตุเพิ่มเติม..." className="w-full" showCount maxLength={250} disabled size="small" />
          </Form.Item>
        </Card>

        <Card title="รายการสินค้าที่ขอ" size="small" bodyStyle={{ padding: "12px" }} headStyle={{ padding: "8px 12px", minHeight: "auto" }}>
          <Form.List name="requestList">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} className="relative p-2 border border-gray-200 rounded-lg bg-white mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Form.Item {...restField} label="รหัสสินค้า" name={[name, "masterProductId"]} className="md:col-span-2 mb-2">
                        <Select placeholder="เลือกสินค้า" options={options} showSearch optionFilterProp="label" allowClear disabled size="small" />
                      </Form.Item>

                      <Form.Item {...restField} label="จำนวน" name={[name, "qty"]} className="mb-2">
                        <InputNumber placeholder="0" min={0} step={1} className="w-full" addonAfter={`${unitNames[index]}`} disabled size="small" />
                      </Form.Item>

                      <Form.Item {...restField} label="ราคา" name={[name, "amount"]} className="mb-2">
                        <InputNumber
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          className="w-full"
                          formatter={(value) => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value: any) => parseFloat(value!.replace(/฿\s?|(,*)/g, "")) || 0}
                          disabled
                          addonAfter={`บาท`}
                          size="small"
                        />
                      </Form.Item>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </Card>

        <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
          <Button size="small" className="" onClick={() => navigate.push("/page/stock/stock-request")}>
            {`ย้อนกลับ`}
          </Button>
          <Button
            type="primary"
            size="small"
            htmlType="submit"
            className=""
            danger
            onClick={() => form.setFieldsValue({ action: "rejected" })}
            disabled={form.getFieldValue("status") !== "new"}>
            {`ไม่อนุมัติ`}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="small"
            className=" bg-blue-600 hover:bg-blue-700"
            onClick={() => form.setFieldsValue({ action: "approved" })}
            disabled={form.getFieldValue("status") !== "new"}>
            {`อนุมัติ`}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ManageRequestDetailPage;
