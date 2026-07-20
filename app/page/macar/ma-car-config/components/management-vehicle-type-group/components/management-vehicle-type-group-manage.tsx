import { Button, Form, FormInstance, Input, Modal, Switch } from "antd";
import React from "react";

export interface props {
  form: FormInstance;
  checkType: string;
  handleCancel: () => void;
  openModal: boolean;
  onFinish: (status: string, values: any) => void;
}

const ManagementVehicleTypeGroupManage: React.FC<props> = ({
  form,
  checkType,
  handleCancel,
  openModal,
  onFinish,
}): React.ReactElement => {
  const disabled = checkType === "delete";
  return (
    <div>
      <Modal
        width={450}
        title={checkType === "create" ? "สร้างกลุ่มประเภทรถ" : "แก้ไขข้อมูล"}
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="vehicle-type-group"
          onFinish={(e) => onFinish(checkType, e)}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item
            name="groupName"
            label={"กลุ่มประเภทรถ :"}
            rules={[{ required: true, message: "กรุณากรอกกลุ่มประเภทรถ" }]}
          >
            <Input
              placeholder="เช่น รถยนต์นั่ง"
              showCount
              maxLength={150}
              disabled={disabled}
            />
          </Form.Item>
          <Form.Item name="detail" label={"รายละเอียด :"}>
            <Input.TextArea
              rows={3}
              placeholder="รายละเอียด (ถ้ามี)"
              showCount
              maxLength={150}
              disabled={disabled}
            />
          </Form.Item>
          <Form.Item name="status" label={"สถานะ :"}>
            <Switch
              checkedChildren="เปิดการมอง"
              unCheckedChildren="ปิดการมอง"
              defaultChecked={true}
              disabled={disabled}
            />
          </Form.Item>
          {disabled ? (
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

export default ManagementVehicleTypeGroupManage;
