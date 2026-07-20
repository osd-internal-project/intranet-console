import { Button, Form, FormInstance, Input, Modal, Select, Switch } from "antd";
import React from "react";

export interface props {
  form: FormInstance;
  checkType: string;
  handleCancel: () => void;
  openModal: boolean;
  onFinish: (status: string, values: any) => void;
  /** ตัวเลือกกลุ่มประเภทรถ (optional) */
  groupOptions?: { label: string; value: number }[];
}

const ManagementVehicleTypeManage: React.FC<props> = ({
  form,
  checkType,
  handleCancel,
  openModal,
  onFinish,
  groupOptions = [],
}): React.ReactElement => {
  const disabled = checkType === "delete";
  return (
    <div>
      <Modal
        width={450}
        title={checkType === "create" ? "สร้างประเภทรถ" : "แก้ไขข้อมูล"}
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="vehicle-type"
          onFinish={(e) => onFinish(checkType, e)}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item
            name="typeName"
            label={"ประเภทรถ :"}
            rules={[{ required: true, message: "กรุณากรอกประเภทรถ" }]}
          >
            <Input
              placeholder="เช่น รถ 4 ล้อ"
              showCount
              maxLength={150}
              disabled={disabled}
            />
          </Form.Item>
          <Form.Item name="maVehicleTypeGroupId" label={"กลุ่มประเภทรถ :"}>
            <Select
              placeholder="เลือกกลุ่มประเภทรถ (ถ้ามี)"
              options={groupOptions}
              allowClear
              showSearch
              optionFilterProp="label"
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

export default ManagementVehicleTypeManage;
