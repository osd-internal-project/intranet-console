import React, { useState } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Collapse,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from "antd";
import { ITConfigData, ITCustomerForm, ITSelectUsers } from "../../common";

// import "../../style.css";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  rules: any;
  customerGroup: ITConfigData[];
  customerTypes: ITConfigData[];
  customerResponsibles: ITSelectUsers[];
  descriptionForm: FormInstance<ITCustomerForm>;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
  onFinishEdit: (form: ITCustomerForm) => void;
}

const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const DescriptionCustomerForm: React.FC<props> = ({
  rules,
  customerGroup,
  customerTypes,
  customerResponsibles,
  descriptionForm,
  isEdit,
  setIsEdit,
  onFinishEdit,
}): React.ReactElement => {
  return (
    <Collapse
      bordered={true}
      defaultActiveKey={1}
      style={{ backgroundColor: "#fff" }}
      items={[
        {
          key: 1,
          label: (
            <div className=" md:col-span-3 font-bold">ข้อมูลเบื้องต้น </div>
          ),
          children: (
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
                    ) : rules.ruleCustomerBranchEdit ? (
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

                  <Form.Item label={<b>รหัส</b>} name={"customerCode"}>
                    <Input placeholder="Enter Text" maxLength={50} />
                  </Form.Item>
                  <Form.Item
                    label={<b>อ้างอิงรหัสลูกค้า</b>}
                    name={"referenceCode"}
                  >
                    <Input placeholder="Enter Text" maxLength={50} readOnly />
                  </Form.Item>
                  <Form.Item
                    label={<b>Department Code</b>}
                    name={"departmentCode"}
                  >
                    <Input placeholder="Enter Text" maxLength={50} />
                  </Form.Item>
                  <Form.Item label={<b>คำนำหน้า TH</b>} name={"prefixTh"}>
                    <Input placeholder="Enter Text" maxLength={10} />
                  </Form.Item>
                  <Form.Item label={<b>ชื่อ TH</b>} name={"firstNameTh"}>
                    <Input placeholder="Enter Text" maxLength={200} />
                  </Form.Item>
                  <Form.Item label={<b>นามสกุล TH</b>} name={"lastNameTh"}>
                    <Input placeholder="Enter Text" maxLength={200} />
                  </Form.Item>
                  <Form.Item label={<b>คำนำหน้า EN</b>} name={"prefixEn"}>
                    <Input placeholder="Enter Text" maxLength={10} />
                  </Form.Item>
                  <Form.Item label={<b>ชื่อ EN</b>} name={"firstNameEn"}>
                    <Input placeholder="Enter Text" maxLength={200} />
                  </Form.Item>
                  <Form.Item label={<b>นามสกุล EN</b>} name={"lastNameEn"}>
                    <Input placeholder="Enter Text" maxLength={200} />
                  </Form.Item>
                  <Form.Item
                    label={<b>เลขที่ทะเบียนบริษัท</b>}
                    name={"companyRegisNumber"}
                  >
                    <Input placeholder="Enter Text" />
                  </Form.Item>
                  <Form.Item label={<b>วันที่จดทะเบียน</b>} name={"regisDate"}>
                    <DatePicker format={"DD/MM/YYYY"} className=" w-full" />
                  </Form.Item>
                  <Form.Item label={<b>ทุนจดทะเบียน</b>} name={"registration"}>
                    <InputNumber
                      min={0}
                      className=" w-full"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                  <Form.Item label={<b>Type</b>} name={"customerTypeId"}>
                    <Select
                      placeholder="Please Choose"
                      options={customerTypes.map((data) => ({
                        value: data.id,
                        label: data.name,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<b>กลุ่มลูกค้า</b>}
                    name={"customerGroupId"}
                  >
                    <Select
                      placeholder="Please Choose"
                      options={customerGroup.map((data) => ({
                        value: data.id,
                        label: data.name,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item label={<b>Grade</b>} name={"grade"}>
                    <Select
                      style={{ color: "#000", opacity: 1 }}
                      placeholder="Please Choose "
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
                    label={<b>ผู้รับผิดชอบ</b>}
                    name={"responsibleSelect"}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Please Choose"
                      options={customerResponsibles.map((data) => ({
                        value: data.userId,
                        label: `${data.firstNameTh} ${data.lastNameTh}`,
                      }))}
                    />
                  </Form.Item>
                  {/* <Form.Item label={<b>ผู้รับผิดชอบ</b>} name={"responsibleId"}>
                  <Select
                    placeholder="Please Choose"
                    options={[
                      { value: "11", label: "user1" },
                      { value: "22", label: "user2" },
                    ]}
                  />
                </Form.Item> */}
                  {/* <Form.Item
                  label={<b>ผู้รับผิดชอบร่วม</b>}
                  name={"thirdPartyId"}
                >
                  <Select
                    placeholder="Please Choose"
                    options={[
                      { value: "11", label: "user1" },
                      { value: "22", label: "user2" },
                    ]}
                  />
                </Form.Item> */}
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
                  <Form.Item label={<b>โทรศัพท์</b>} name={"notiPhone"}>
                    <Input placeholder="Enter Text" />
                  </Form.Item>
                  <Form.Item label={<b>แฟกซ์</b>} name={"notiFax"}>
                    <Input placeholder="Enter Text" />
                  </Form.Item>
                  <Form.Item label={<b>อีเมล์</b>} name={"notiEmail"}>
                    <Input placeholder="Enter Text" />
                  </Form.Item>
                  <Form.Item label={<b>Map</b>} name={"notiMap"}>
                    <Input placeholder="Enter Text" />
                  </Form.Item>
                  <div className=" md:col-span-4">
                    <Form.Item
                      label={<b>หมวดธุรกิจ</b>}
                      name={"businessCategory"}
                    >
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
          ),
        },
      ]}
    />
  );
};

export default DescriptionCustomerForm;
