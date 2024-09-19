import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import { ITCustomerSubForm } from "../../common";
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
  showModalCustomerSubEdit: boolean;
  onShowModalCustomerSubEdit: (status: boolean) => void;
  onSaveCustomerSubEdit: (form: ITCustomerSubForm) => void;
  formCustomerSubEdit: FormInstance;
}

const CustomerSubEditComponent: React.FC<props> = ({
  showModalCustomerSubEdit,
  onShowModalCustomerSubEdit,
  onSaveCustomerSubEdit,
  formCustomerSubEdit,
}): React.ReactElement => {
  return (
    <Modal
      open={showModalCustomerSubEdit}
      title={"Edit Customer"}
      footer={[]}
      onCancel={() => {
        onShowModalCustomerSubEdit(false);
      }}
      maskClosable={false}
    >
      <Form
        form={formCustomerSubEdit}
        size="small"
        {...layout}
        onFinish={onSaveCustomerSubEdit}
        autoComplete="off"
      >
        {formCustomerSubEdit.getFieldValue("name")}
        <Form.Item label={"id"} name={"id"} hidden>
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label={"รหัสลูกค้า"}
          name={"code"}
          rules={[{ required: true, message: `กรุณากรอกรหัสลูกค้า` }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"ชื่อลูกค้า"}
          name={"name"}
          rules={[{ required: true, message: `กรุณากรอกชื่อลูกค้า` }]}
        >
          <Input />
        </Form.Item>
        <div className=" flex justify-end space-x-2">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button
            onClick={() => {
              onShowModalCustomerSubEdit(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CustomerSubEditComponent;
