import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Switch } from "antd";
import { ITCustomerDetailSubForm } from "@/app/common/customer";
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
  openCustomerSubUpdateId: number;
  onCloseUpdate: () => void;
  onUpdateCustomerSub: (form: ITCustomerDetailSubForm) => void;
  customerBrahEditForm: FormInstance;
}

const CustomerSubEdit: React.FC<props> = ({
  openCustomerSubUpdateId,
  onCloseUpdate,
  onUpdateCustomerSub,
  customerBrahEditForm,
}): React.ReactElement => {
  return (
    <Modal
      open={openCustomerSubUpdateId ? true : false}
      title={"Edit Sub Customer/CustomerSub"}
      footer={[]}
      onCancel={() => {
        onCloseUpdate();
      }}
      maskClosable={false}
    >
      <Form
        form={customerBrahEditForm}
        name="addCustomerSubForm"
        size="small"
        {...layout}
        onFinish={onUpdateCustomerSub}
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
              onCloseUpdate();
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CustomerSubEdit;
