import React from "react";
import { Button, Card, DatePicker, Form, Input, Select } from "antd";
import { ITMaType, ITMaCreateForm } from "../../common";
import TextArea from "antd/es/input/TextArea";

export interface props {
  maTypes: ITMaType[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  createMa: (data: ITMaCreateForm) => void;
  userAll: any[];
}

const MaTaskCreateComponent: React.FC<props> = ({ maTypes, loading, setLoading, createMa, userAll }): React.ReactElement => {
  return (
    <Card>
      <Form labelCol={{ span: 8 }} layout="vertical" onFinish={createMa}>
        <div className="grid  grid-cols-1 md:grid-cols-3 gap-2">
          <Form.Item name={"maCategory"} label={"ประเภท MA"} rules={[{ required: true }]}>
            <Select
              placeholder={`Please Select`}
              allowClear
              options={[
                { value: "MA", label: "MA" },
                { value: "CM", label: "CM" },
              ]}
            />
          </Form.Item>
          <Form.Item name={"maTypeId"} label={"เรื่อง MA"} rules={[{ required: true }]}>
            <Select placeholder={`Please Select`} options={maTypes ? maTypes.map((type) => ({ value: type.id, label: type.name })) : []} />
          </Form.Item>
          <Form.Item name={"maName"} label={"หัวข้อ MA"} rules={[{ required: true }]}>
            <Input placeholder={`Please Input`} />
          </Form.Item>
          <Form.Item name={"maDate"} label={"วันนัดหมาย"} rules={[{ required: true }]}>
            <DatePicker showTime={true} className=" w-full" format={"DD/MM/YYYY HH:mm"} />
          </Form.Item>
          <Form.Item name={"contact"} label={"ผู้นัดหมาย"}>
            <Input />
          </Form.Item>
          <Form.Item name={"assignUserId"} label={"มอบหมาย"} rules={[{ required: true }]}>
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder={`Please Select`}
              options={
                userAll ? userAll.map((user) => ({ value: user.userId, label: `${user.firstNameTh} ${user.lastNameTh} (${user.username})` })) : []
              }
            />
          </Form.Item>
          <Form.Item labelCol={{}} name={"detail"} label={"เนื้อหา"} className="md:col-span-3">
            <TextArea maxLength={255} showCount={true} />
          </Form.Item>

          <div className="  md:col-span-3 text-right">
            <Button type="primary" htmlType="submit">
              เพิ่ม MA
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default MaTaskCreateComponent;
