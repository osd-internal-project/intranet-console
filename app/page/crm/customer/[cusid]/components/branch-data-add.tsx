import React, { useEffect } from "react";
import type { FormInstance } from "antd";
import { Button, Card, Form, Input, Modal, Select } from "antd";
import { ITBranchForm } from "../../common";
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
  onSaveBranch: (form: ITBranchForm) => void;
}

const BranchAddComponent: React.FC<props> = ({
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
        {/* <Form.List name="address">
          {(fields, { add, remove }) => (
            <div
              style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`ที่อยู่ ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >
                  <div className="grid md:grid-cols-2">
                    <Form.Item
                      label="ประเภท"
                      name={[field.name, "addressTypeId"]}
                    >
                      <Select />
                    </Form.Item>
                    <Form.Item
                      label="เลขที่บ้าน"
                      name={[field.name, "houseNumber"]}
                    >
                      <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item
                      label="เลขที่ห้อง"
                      name={[field.name, "roomNumber"]}
                    >
                      <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item
                      label="อาคาร/หมู่บ้าน"
                      name={[field.name, "building"]}
                    >
                      <Input maxLength={150} />
                    </Form.Item>
                    <Form.Item label="ชั้น" name={[field.name, "floor"]}>
                      <Input maxLength={5} />
                    </Form.Item>
                    <Form.Item label="ซอย" name={[field.name, "alley"]}>
                      <Input maxLength={150} />
                    </Form.Item>
                    <Form.Item label="หมู่ที่" name={[field.name, "village"]}>
                      <Input maxLength={5} />
                    </Form.Item>
                    <Form.Item label="ถนน" name={[field.name, "road"]}>
                      <Input maxLength={150} />
                    </Form.Item>
                    <Form.Item label="ตำบล" name={[field.name, "subDistrict"]}>
                      <Input maxLength={150} />
                    </Form.Item>
                    <Form.Item label="อำเภอ/เขต" name={[field.name, "district"]}>
                      <Input maxLength={150} />
                    </Form.Item>
                    <Form.Item label="จังหวัด" name={[field.name, "province"]}>
                      <Input maxLength={150} />
                    </Form.Item>
                    <Form.Item
                      label="รหัสไปรษณีย์"
                      name={[field.name, "zipCode"]}
                    >
                      <Input maxLength={10} />
                    </Form.Item>
                  </div>
                </Card>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + เพิ่มที่อยู่
              </Button>
            </div>
          )}
        </Form.List> */}
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

export default BranchAddComponent;
