import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import { ITBranchForm } from "../../common";
import { FormInstance, useForm } from "antd/es/form/Form";
const layout = {
  labelCol: {
    xs: { span: 5 },
  },
  wrapperCol: {
    md: { span: 19 },
  },
};
export interface props {
  showModalBranchEdit: boolean;
  onShowModalBranchEdit: (status: boolean) => void;
  onSaveBranchEdit: (form: ITBranchForm) => void;
  formEdit: FormInstance;
}

const BranchEditComponent: React.FC<props> = ({
  showModalBranchEdit,
  onShowModalBranchEdit,
  onSaveBranchEdit,
  formEdit,
}): React.ReactElement => {
  const [form] = useForm();
  useEffect(() => {
    form.resetFields();
  }, [showModalBranchEdit]);
  return (
    <Modal
      open={showModalBranchEdit}
      title={"แก้ไขข้อมูลสาขา"}
      footer={[]}
      onCancel={() => {
        onShowModalBranchEdit(false);
      }}
    >
      <Form
        form={formEdit}
        name="addBranchForm"
        size="small"
        {...layout}
        onFinish={onSaveBranchEdit}
        autoComplete="off"
      >
        <Form.Item label={"id"} name={"id"} hidden>
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label={"รหัสสาขา"}
          name={"branchCode"}
          rules={[{ required: true, message: `กรุณากรอกรหัสสาขา` }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"ชื่อสาขา"}
          name={"branchName"}
          rules={[{ required: true, message: `กรุณากรอกชื่อสาขา` }]}
        >
          <Input />
        </Form.Item>
        <div className=" flex justify-end space-x-2">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button
            onClick={() => {
              onShowModalBranchEdit(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default BranchEditComponent;
