import { Button, Form, FormInstance, Input, Modal } from "antd";
import React from "react";
import { ITMasterProduct, ITMasterProductCreateInput } from "../../common/master-product";

export interface props {
  openMange: { status: boolean; type: string };
  handleManage: (status: boolean, type: string, values?: ITMasterProduct) => void;
  formManage: FormInstance;
  onFinish: (values: ITMasterProductCreateInput, status: string) => void;
}

const ManageMasterProductPage: React.FC<props> = ({ openMange, handleManage, formManage, onFinish }): React.ReactElement => {
  return (
    <div>
      <Modal
        title={`${openMange.type === "create" ? "เพิ่ม" : openMange.type === "edit" ? "แก้ไข" : "ลบ"}รายการสินค้า`}
        open={openMange.status}
        onCancel={() => handleManage(false, "close", undefined)}
        footer={false}>
        <Form form={formManage} layout="vertical" autoComplete="off" onFinish={(e) => onFinish(e, openMange.type)}>
          <Form.Item label={`Master Product Name`} name={"prdName"} rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}>
            <Input placeholder="Input" disabled={openMange.type === "delete" ? true : false} />
          </Form.Item>
          <Form.Item label={`Description`} name={"description"} rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}>
            <Input placeholder="Input" disabled={openMange.type === "delete" ? true : false} />
          </Form.Item>
          <Form.Item label={`Updated By`} name={"updatedBy"} rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}>
            <Input placeholder="Input" disabled={openMange.type === "delete" ? true : false} />
          </Form.Item>
          <Form.Item label={`Expired Date`} name={"expired"} rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}>
            <Input placeholder="Input" disabled={openMange.type === "delete" ? true : false} />
          </Form.Item>
          <div className="flex justify-end">
            <Button htmlType="submit" type="primary" danger={openMange.type === "delete" ? true : false}>{`ยืนยัน`}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageMasterProductPage;
