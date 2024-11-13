import { Button, Form, FormInstance, Input, Modal, Switch } from "antd";
import React from "react";

export interface props {
  form: FormInstance;
  checkType: string;
  handleCancel: () => void;
  openModal: boolean;
  onFinish: (status: string, values: any) => void;
}

const ManagementCarMasterdataManage: React.FC<props> = ({ form, checkType, handleCancel, openModal, onFinish }): React.ReactElement => {
  return (
    <div>
      <Modal
        width={450}
        title={checkType === "create" ? "สร้างประเภทการตรวจสภาพ" : "แก้ไขข้อมูล"}
        open={openModal}
        onCancel={handleCancel}
        footer={null}>
        <Form name="basic" onFinish={(e) => onFinish(checkType, e)} autoComplete="off" layout="vertical" form={form}>
          <Form.Item name="typeName" label={"ประเภทการตรวจสภาพ :"} rules={[{ required: true, message: "กรุณากรอกประเภทการตรวจสภาพ" }]}>
            <Input placeholder="ประเภทการตรวจสภาพ" showCount maxLength={50} disabled={checkType === "delete" ? true : false} />
          </Form.Item>
          <Form.Item name="detail" label={"รายละเอียดการตรวจสภาพ :"} rules={[{ required: true, message: "กรุณากรอกรายละเอียดการตรวจสภาพ" }]}>
            <Input.TextArea rows={4} placeholder="รายละเอียดการตรวจสภาพ" showCount maxLength={150} disabled={checkType === "delete" ? true : false} />
          </Form.Item>
          <Form.Item name="status" label={"สถานะ :"}>
            <Switch
              checkedChildren="เปิดการมอง"
              unCheckedChildren="ปิดการมอง"
              defaultChecked={true}
              disabled={checkType === "delete" ? true : false}
            />
          </Form.Item>
          {checkType === "delete" ? (
            <div className="flex justify-end w-full space-x-1">
              <Button type="primary" htmlType="submit" danger>
                {`ลบ`}
              </Button>
            </div>
          ) : (
            <div className="flex justify-end w-full space-x-1">
              <Button type="default" onClick={handleCancel}>
                {`ยกเลิก`}
              </Button>
              <Button type="primary" htmlType="submit">
                {`ตกลง`}
              </Button>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ManagementCarMasterdataManage;
