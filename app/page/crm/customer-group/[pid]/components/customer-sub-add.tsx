import React, { useEffect } from "react";
import type { FormInstance } from "antd";
import { Button, Card, Form, Input, Modal, Select, Switch } from "antd";
import { ITCustomerDetailSubForm } from "@/app/common/customer";
import { CloseOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

// const { RangePicker } = DatePicker;
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
  customerDetailSubActive: {
    customerDetailSubId: number | undefined;
    customerId: number | undefined;
    status?: "create" | "update";
  };
  onShowModalCustomerSubAdd: (status: boolean) => void;
  onCreateCustomerSub: (form: ITCustomerDetailSubForm) => void;
}

const CustomerSubAdd: React.FC<props> = ({
  customerDetailSubActive,
  onShowModalCustomerSubAdd,
  onCreateCustomerSub,
}): React.ReactElement => {
  const [form] = useForm();
  useEffect(() => {
    form.resetFields();
  }, [customerDetailSubActive]);

  return (
    <Modal
      open={customerDetailSubActive.customerId ? true : false}
      title={"Add Sub Customer/Branch"}
      // width={1000}
      footer={[]}
      onCancel={() => {
        onShowModalCustomerSubAdd(false);
      }}
    >
      <Form
        name="addCustomerSubForm"
        form={form}
        size="small"
        {...layout}
        onFinish={onCreateCustomerSub}
        autoComplete="off"
      >
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
          initialValue={true}
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
              onShowModalCustomerSubAdd(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CustomerSubAdd;
