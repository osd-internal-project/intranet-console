import React from "react";
import { Button, Form, Input, InputNumber, Switch } from "antd";
import { TdepartmentCreateDto } from "../common";
export interface props {
  createDepartMent: (form: TdepartmentCreateDto) => void;
  form: any;
}

const DepartmentCreateComponent: React.FC<props> = ({ createDepartMent, form }): React.ReactElement => {
  return (
    <>
      <Form form={form} onFinish={createDepartMent}>
        <div className="grid grid-cols-1   md:grid-cols-3 space-x-2">
          <Form.Item label={"DepartMent Id"} name={"departId"} rules={[{ required: true, message: "Plase enter DepartMent Id" }]}>
            <InputNumber />
          </Form.Item>

          <Form.Item label={"DepartMent Name"} name={"departName"} rules={[{ required: true, message: "Plase enter DepartMent Name" }]}>
            <Input />
          </Form.Item>

          <Form.Item className=" md:text-right">
            <Button type="primary" htmlType="submit">
              Add DepartMent
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default DepartmentCreateComponent;
