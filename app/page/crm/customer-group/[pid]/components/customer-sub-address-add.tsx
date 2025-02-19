import React, { useEffect } from "react";
import type { FormInstance } from "antd";
import { Button, Card, Form, Input, Modal, Select } from "antd";

import { CloseOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { ITCustomerDetailSubAddressForm } from "@/app/common/customer";

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
  showModalAddressAdd: boolean;
  customerId: number;
  onShowModalAddressAdd: (status: boolean) => void;
  onSaveCustomerSubAddress: (
    branchId: number,
    form: ITCustomerDetailSubAddressForm,
    customerId: number
  ) => void;
}

const CustomerSubAddressAdd: React.FC<props> = ({
  branchId,
  showModalAddressAdd,
  customerId,
  onShowModalAddressAdd,
  onSaveCustomerSubAddress,
}): React.ReactElement => {
  const [form] = useForm();
  // const addressType = [
  //   { value: "tax", label: "ที่อยู่ใบกำกับภาษี" },
  //   { value: "delivery", label: "ที่อยู่การจัดส่งบริการ" },
  //   { value: "noti", label: "ที่อยู่จัดส่งใบแจ้งบริการ" },
  // ];
  useEffect(() => {
    form.resetFields();
  }, [showModalAddressAdd]);
  const onFinishCustomerSubAddress = (form: ITCustomerDetailSubAddressForm) => {
    // const addressTypeName = addressType.findLast(
    //   (type) => (type.value = form.addressTypeId)
    // );
    onSaveCustomerSubAddress(
      branchId,
      {
        ...form,

        // addressTypeName: addressTypeName?.label ? addressTypeName.label : "",
      },
      customerId
    );
  };
  return (
    <Card
      // open={showModalAddressAdd}
      title={"เพิ่มที่อยู่"}
      // width={1200}
      // footer={[]}
      // onCancel={() => {
      //   onShowModalAddressAdd(false);
      // }}
    >
      <Form
        name="addCustomerSubForm"
        form={form}
        size="small"
        {...layout}
        onFinish={onFinishCustomerSubAddress}
        autoComplete="off"
        initialValues={{
          address: [
            {
              // addressTypeId: undefined,
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
              maplink: undefined,
            },
          ],
        }}
      >
        <div className="grid md:grid-cols-4">
          {/* <Form.Item label="ประเภทที่อยู่" name={"addressTypeId"}>
            <Select options={addressType} placeholder="Please Select" />
          </Form.Item> */}
          <Form.Item label="เลขที่บ้าน" name={"houseNumber"}>
            <Input />
          </Form.Item>
          <Form.Item label="เลขที่ห้อง" name={"roomNumber"}>
            <Input />
          </Form.Item>
          <Form.Item label="อาคาร/หมู่บ้าน" name={"building"}>
            <Input />
          </Form.Item>
          <Form.Item label="ชั้น" name={"floor"}>
            <Input />
          </Form.Item>
          <Form.Item label="ซอย" name={"alley"}>
            <Input />
          </Form.Item>
          <Form.Item label="หมู่ที่" name={"village"}>
            <Input />
          </Form.Item>
          <Form.Item label="ถนน" name={"road"}>
            <Input />
          </Form.Item>
          <Form.Item label="ตำบล/แขวง" name={"subDistrict"}>
            <Input />
          </Form.Item>
          <Form.Item label="อำเภอ/เขต" name={"district"}>
            <Input />
          </Form.Item>
          <Form.Item
            label="จังหวัด"
            name={"province"}
            rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="รหัสไปรษณีย์"
            name={"zipCode"}
            rules={[{ required: true, message: "กรุณากรอกรหัสไปรษณีย์" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="ลิงค์แผนที่" name={"maplink"}>
            <Input />
          </Form.Item>
          <Form.Item label="Remark" name={"remark"}>
            <TextArea />
          </Form.Item>
        </div>
        <div className=" flex justify-end space-x-2">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button
            onClick={() => {
              onShowModalAddressAdd(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CustomerSubAddressAdd;
