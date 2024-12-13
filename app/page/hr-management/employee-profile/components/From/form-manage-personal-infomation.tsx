import { Button, DatePicker, Form, Input, Select } from "antd";
import React from "react";

const FormManagePersonalInformation: React.FC = (): React.ReactElement => {
  return (
    <div>
      <Form.List name="personalInformation">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}>
                <div className="grid col-span-4 grid-cols-2 gap-4">
                  <Form.Item {...restField} name={[name, "passportNumber"]} label={`Passport No`}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "passportExpired"]} label={`Passport Expiry Date`}>
                    <DatePicker className="w-full" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "nationality"]} label={`Nationality`}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "religion"]} label={`Religion`}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "maritalStatus"]} label={`Marital status`}>
                    <Select
                      placeholder={"Please Select"}
                      allowClear
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "employmentOfSpouse"]} label={`Employment spouse`}>
                    <Select
                      placeholder={"Please Select"}
                      allowClear
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "children"]} label={`No. of children`}>
                    <Input />
                  </Form.Item>
                </div>
              </div>
            ))}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default FormManagePersonalInformation;
