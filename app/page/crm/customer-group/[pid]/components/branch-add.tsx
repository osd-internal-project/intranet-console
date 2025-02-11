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
  showModalBranchAdd: boolean;
  onShowModalBranchAdd: (status: boolean) => void;
  onSaveBranch: (form: ITCustomerDetailSubForm) => void;
}

const BranchAdd: React.FC<props> = ({
  showModalBranchAdd,
  onShowModalBranchAdd,
  onSaveBranch,
}): React.ReactElement => {
  const [form] = useForm();
  useEffect(() => {
    form.resetFields();
  }, [showModalBranchAdd]);

  return (
    <Modal
      open={showModalBranchAdd}
      title={"Add Sub Customer/Branch"}
      // width={1000}
      footer={[]}
      onCancel={() => {
        onShowModalBranchAdd(false);
      }}
    >
      <Form
        name="addBranchForm"
        form={form}
        size="small"
        {...layout}
        onFinish={onSaveBranch}
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
              onShowModalBranchAdd(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default BranchAdd;
