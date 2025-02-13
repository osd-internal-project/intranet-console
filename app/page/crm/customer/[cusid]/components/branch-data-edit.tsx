import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Switch } from "antd";
import { ITCustomerDetailSubForm } from "../../common";
import { FormInstance, useForm } from "antd/es/form/Form";
const { TextArea } = Input;
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
  onSaveBranchEdit: (form: ITCustomerDetailSubForm) => void;
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
      title={"Edit Sub Customer/Branch"}
      footer={[]}
      onCancel={() => {
        onShowModalBranchEdit(false);
      }}
      maskClosable={false}
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
          name={"code"}
          rules={[{ required: true, message: `กรุณากรอกรหัสสาขา` }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"ชื่อสาขา"}
          name={"name"}
          rules={[{ required: true, message: `กรุณากรอกชื่อสาขา` }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          valuePropName="checked"
          label={"สถานะ"}
          name={"activeStatus"}
        >
          <Switch size="default" />
        </Form.Item>
        <Form.Item label={"Remark"} name={"remark"}>
          <TextArea rows={4} />
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
