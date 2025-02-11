import React, { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Card,
  Collapse,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
} from "antd";
import {
  ITConfigData,
  ITCustomerForm,
  ITSelectUsers,
} from "@/app/common/customer";
import { TUserRoles } from "@/app/config/user-roles";

// import "../../style.css";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  roles: TUserRoles | null;
  openCustomerUpdateId: number | undefined;
  customerTypeGroup: ITConfigData[];
  customerTypes: ITConfigData[];
  customerResponsibles: ITSelectUsers[];
  descriptionForm: FormInstance<ITCustomerForm>;
  onCloseUpdate: () => void;
  onFinishEdit: (form: ITCustomerForm) => void;
}

const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const CusomterEditForm: React.FC<props> = ({
  roles,
  openCustomerUpdateId,
  customerTypeGroup,
  customerTypes,
  customerResponsibles,
  descriptionForm,
  onCloseUpdate,
  onFinishEdit,
}): React.ReactElement => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [customerType, setCustomerType] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    const type = descriptionForm.getFieldValue("customerTypeId");
    if (type) {
      setCustomerType(type);
    }
  }, [customerTypes]);

  return (
    <Modal
      open={openCustomerUpdateId ? true : false}
      title={"ข้อมูล Customer"}
      width={"1800px"}
      mask={false}
      onCancel={onCloseUpdate}
      footer={[]}
    >
      <ConfigProvider
        theme={{
          token: {
            colorTextDisabled: "rgba(0, 0, 0, 1)",
            colorTextLabel: "rgba(0, 0, 0, 0.6)",
          },
          components: {
            Select: {
              multipleItemBg: "rgba(0, 0, 0, 0.06)",
              multipleSelectorBgDisabled: "transparent",
            },

            Form: {
              itemMarginBottom: 2,
            },
          },
        }}
      >
        <Form
          style={{ color: "#000" }}
          form={descriptionForm}
          size="small"
          layout="vertical"
          onFinish={onFinishEdit}
          disabled={!isEdit}
          autoComplete="off"
          variant={isEdit ? "outlined" : "borderless"}
          className="custom-disabled-form"
          {...layout}
        >
          <div className="fix-form grid md:ml-4 grid-cols-2 md:grid-cols-4 md:mb-0 md:mt-0">
            <div className=" col-span-2 md:col-span-4 flex  justify-end">
              {isEdit ? (
                <div className=" space-x-2">
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEdit(!isEdit)}
                    type="primary"
                    ghost
                    disabled={false}
                  >
                    Cancel
                  </Button>
                </div>
              ) : roles?.crmCustomerEdit ? (
                <Button
                  type="primary"
                  onClick={() => setIsEdit(!isEdit)}
                  disabled={false}
                >
                  Edit
                </Button>
              ) : (
                <></>
              )}
            </div>
            <Form.Item
              label="Type"
              name={"customerTypeId"}
              rules={[{ required: true, message: "กรุณาเลือก" }]}
            >
              <Select
                allowClear
                placeholder="Please Choose"
                onChange={(value) => setCustomerType(value)}
                options={customerTypes.map((data) => ({
                  value: data.customerTypeId,
                  label: data.name,
                }))}
              />
            </Form.Item>

            {customerType === "natural" ? (
              <div className=" col-span-3 grid grid-cols-3">
                <Form.Item
                  label={<b>คำนำหน้า TH</b>}
                  name={["details", "prefixTh"]}
                  rules={[{ required: true, message: "Please Enter" }]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
                <Form.Item
                  label={<b>ชื่อ TH</b>}
                  name={["details", "firstNameTh"]}
                  rules={[{ required: true, message: "Please Enter" }]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
                <Form.Item
                  label={<b>นามสกุล TH</b>}
                  name={["details", "lastNameTh"]}
                  rules={[{ required: true, message: "Please Enter" }]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
                <Form.Item
                  label={<b>คำนำหน้า EN</b>}
                  name={["details", "prefixEn"]}
                  rules={[{ required: true, message: "Please Enter" }]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
                <Form.Item
                  label={<b>ชื่อ EN</b>}
                  name={["details", "firstNameEn"]}
                  rules={[{ required: true, message: "Please Enter" }]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
                <Form.Item
                  label={<b>นามสกุล EN</b>}
                  name={["details", "lastNameEn"]}
                  rules={[{ required: true, message: "Please Enter" }]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
              </div>
            ) : customerType === "juristic" ? (
              <div className=" col-span-3 grid grid-cols-3">
                <Form.Item
                  label={<b>ชื่อลูกค้า TH</b>}
                  name={["details", "customerNameTh"]}
                  rules={[{ required: true, message: "Please Enter" }]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
                <Form.Item
                  label={<b>ชื่อลูกค้า EN</b>}
                  name={["details", "customerNameEn"]}
                  rules={[{ required: true, message: "Please Enter" }]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
                <Form.Item
                  label={<b>ชื่อย่อ</b>}
                  name={["details", "initials"]}
                >
                  <Input placeholder="Enter Text" />
                </Form.Item>
              </div>
            ) : (
              <div className=" col-span-2 grid grid-cols-2"></div>
            )}
            <Form.Item
              label={<b>เลขประจำตัวผู้เสียภาษี</b>}
              name={["details", "identificationNo"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" />
            </Form.Item>
            <Form.Item
              label={<b>รหัส</b>}
              name={"customerCode"}
              rules={[{ required: true, message: "Plese Enter" }]}
            >
              <Input placeholder={isEdit ? "Enter Text" : ""} />
            </Form.Item>
            <Form.Item label={<b>รหัสอ้างอิงลูกค้า</b>} name={"referenceCode"}>
              <Input placeholder={isEdit ? "Enter Text" : ""} readOnly />
            </Form.Item>
            <Form.Item label={<b>Department Code</b>} name={"departmentCode"}>
              <Input placeholder={isEdit ? "Enter Text" : ""} />
            </Form.Item>

            <Form.Item
              label={<b>เลขที่ทะเบียนบริษัท</b>}
              name={"companyRegisNumber"}
            >
              <Input placeholder={isEdit ? "Enter Text" : ""} />
            </Form.Item>
            {customerType === "juristic" && (
              <Form.Item
                label="วันที่จดทะเบียน"
                rules={[{ required: true, message: "Please Enter" }]}
              >
                <DatePicker format={"DD/MM/YYYY"} className=" w-full" />
              </Form.Item>
            )}
            {customerType === "juristic" && (
              <Form.Item
                label="ทุนจดทะเบียน"
                name={"registration"}
                rules={[{ required: true, message: "Please Enter" }]}
              >
                <InputNumber
                  min={0}
                  className=" w-full"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            )}
            <Form.Item label={<b>Type</b>} name={"customerTypeId"}>
              <Select
                placeholder={isEdit ? "Plese Choose" : ""}
                options={customerTypes.map((data) => ({
                  value: data.customerTypeId,
                  label: data.name,
                }))}
              />
            </Form.Item>
            <Form.Item label={<b>กลุ่มลูกค้า</b>} name={"customerTypeGroupId"}>
              <Select
                placeholder={isEdit ? "Plese Choose" : ""}
                options={customerTypeGroup.map((data) => ({
                  value: data.id,
                  label: data.name,
                }))}
              />
            </Form.Item>
            <Form.Item label={<b>Grade</b>} name={"grade"}>
              <Select
                style={{ color: "#000", opacity: 1 }}
                placeholder="Plese Choose "
                options={[
                  { value: "A" },
                  { value: "B" },
                  { value: "C" },
                  { value: "D" },
                  { value: "N" },
                ]}
              />
            </Form.Item>
            <Form.Item name={"responsible"} hidden></Form.Item>
            <Form.Item
              label={<b>พนักงานขาย</b>}
              name={"responsibleId"}
              rules={[{ required: true, message: "กรุณาเลือก" }]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder={isEdit ? "Plese Choose" : ""}
                options={customerResponsibles.map((data) => ({
                  value: data.userId,
                  label: `${data.firstNameTh} ${data.lastNameTh}`,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={<b>Status</b>}
              valuePropName="checked"
              name={"activeStatus"}
            >
              <Switch
                size="default"
                unCheckedChildren={"Not Active"}
                checkedChildren={"Active"}
              />
            </Form.Item>
            <Form.Item
              label={<b>โทรศัพท์</b>}
              name={"notiPhone"}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder={isEdit ? "Enter Text" : ""} />
            </Form.Item>
            <Form.Item label={<b>แฟกซ์</b>} name={"notiFax"}>
              <Input placeholder={isEdit ? "Enter Text" : ""} />
            </Form.Item>
            <Form.Item label={<b>อีเมล์</b>} name={"notiEmail"}>
              <Input placeholder={isEdit ? "Enter Text" : ""} />
            </Form.Item>
            <Form.Item label={<b>Map</b>} name={"notiMap"}>
              <Input placeholder={isEdit ? "Enter Text" : ""} />
            </Form.Item>
            {customerType === "juristic" && (
              <Form.Item
                label={<b>Domain @</b>}
                name={["details", "notiDomain"]}
              >
                <Input placeholder="Enter Text" />
              </Form.Item>
            )}
            {customerType === "juristic" && (
              <Form.Item
                label={<b>Website</b>}
                name={["details", "notiWebsite"]}
              >
                <Input placeholder="Enter Text" />
              </Form.Item>
            )}
            <div className=" md:col-span-4">
              <Form.Item label={<b>หมวดธุรกิจ</b>} name={"businessCategory"}>
                <TextArea />
              </Form.Item>
            </div>
            <div className=" md:col-span-4">
              <Form.Item label={<b>วัตถุประสงค์</b>} name={"objective"}>
                <TextArea />
              </Form.Item>
            </div>
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
};

export default CusomterEditForm;
