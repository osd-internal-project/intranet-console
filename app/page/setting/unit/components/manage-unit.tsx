import { Button, Form, FormInstance, Input, Modal, Switch } from "antd";
import React from "react";
import { ITUnit, ITUnitCreateInput } from "../common";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export interface props {
  openMange: { status: boolean; type: string };
  handleManage: (status: boolean, type: string, values?: ITUnitCreateInput) => void;
  formManage: FormInstance;
  onFinish: (values: ITUnit, status: string) => void;
}

const ManageUnit: React.FC<props> = ({ openMange, handleManage, formManage, onFinish }): React.ReactElement => {
  return (
    <div>
      <Modal
        title={`${openMange.type === "create" ? "เพิ่ม" : openMange.type === "edit" ? "แก้ไข" : "ลบ"}`}
        open={openMange.status}
        onCancel={() => handleManage(false, "close", undefined)}
        footer={false}>
        <Form form={formManage} layout="vertical" autoComplete="off" onFinish={(e) => onFinish(e, openMange.type)}>
          <Form.Item label={`Name Unit`} name={"unitName"} rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}>
            <Input placeholder="Input" disabled={openMange.type === "delete" ? true : false} />
          </Form.Item>
          {openMange.type === "edit" ? (
            <>
              <Form.Item label={`Status`} name={"status"}>
                <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
              </Form.Item>
            </>
          ) : null}
          <div className="flex justify-end">
            <Button htmlType="submit" type="primary" danger={openMange.type === "delete" ? true : false}>{`ยืนยัน`}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUnit;
