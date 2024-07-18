import React, { useEffect } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Switch,
} from "antd";
import { ITBranchContactForm } from "../../common";
import { CloseOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

// const { RangePicker } = DatePicker;
const { TextArea } = Input;
const layout = {
  labelCol: {
    xs: { span: 10 },
  },
  wrapperCol: {
    md: { span: 15 },
  },
};
export interface props {
  branchId: number;
  showModalContactAdd: boolean;
  onShowModalContactAdd: (status: boolean) => void;
  onSaveBranchContact: (branchId: number, form: ITBranchContactForm) => void;
}

const BranchContactAddComponent: React.FC<props> = ({
  branchId,
  showModalContactAdd,
  onShowModalContactAdd,
  onSaveBranchContact,
}): React.ReactElement => {
  const [form] = useForm();

  useEffect(() => {
    form.resetFields();
  }, [showModalContactAdd]);
  const onFinishBranchContact = (form: ITBranchContactForm) => {
    onSaveBranchContact(branchId, {
      ...form,
    });
  };
  return (
    <Card
      // open={showModalContactAdd}
      title={"เพิ่มผู้ติดต่อ"}
      // width={1200}
      // footer={[]}
      // onCancel={() => {
      //   onShowModalContactAdd(false);
      // }}
    >
      <Form
        name="addBranchForm"
        form={form}
        size="small"
        {...layout}
        onFinish={onFinishBranchContact}
        autoComplete="off"
        initialValues={{
          address: [
            {
              addressTypeId: undefined,
              alley: undefined,
              building: undefined,
              district: undefined,
              floor: undefined,
              houseNumber: undefined,
              province: undefined,
              road: undefined,
              roomNumber: undefined,
              subDistrict: undefined,
              village: undefined,
              zipCode: undefined,
            },
          ],
        }}
      >
        <div className="grid md:grid-cols-4">
          <Form.Item label="ชื่อ" name={"name"}>
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item label="ชื่อเล่น" name={"nickName"}>
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item label="ตำแหน่ง" name={"position"}>
            <Input maxLength={150} />
          </Form.Item>
          <Form.Item label="เบอร์มือถือ" name={"phone"}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="เบอร์ออฟฟิศ" name={"officePhone"}>
            <Input maxLength={150} />
          </Form.Item>
          <Form.Item label="เบอร์แฟกซ์" name={"fax"}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="อีเมล" name={"email"}>
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item label="วันเกิด" name={"birthday"}>
            <DatePicker format={"DD/MM/YYYY"} />
          </Form.Item>
          {/* <Form.Item
            label={"Status"}
            valuePropName="checked"
            initialValue={true}
            name={"activeStatus"}
          >
            <Switch
              size="default"
              unCheckedChildren={"Not Active"}
              checkedChildren={"Active"}
            />
          </Form.Item> */}
        </div>
        <div className=" flex justify-end space-x-2">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button
            onClick={() => {
              onShowModalContactAdd(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default BranchContactAddComponent;
