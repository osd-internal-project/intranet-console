import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input } from "antd";
import React from "react";

const FormManageExperienceInformation = () => {
  return (
    <div>
      <Form.List name="experienceInformations">
        {(fields, { add, remove }) => (
          <>
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}>
                <Card className="mb-1">
                  <div className="grid col-span-4 grid-cols-2 gap-4">
                    <Form.Item {...restField} name={[name, "companyName"]} label={`Previous Company Name `}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "location"]} label={`Designation`}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "jobPosition"]} label={`Position`}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "periodFrom"]} label={`Start Date`}>
                      <DatePicker picker="year" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "periodTo"]} label={`End Date`}>
                      <DatePicker picker="year" className="w-full" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                </Card>
              </div>
            ))}
          </>
        )}
      </Form.List>
    </div>
  );
};

export default FormManageExperienceInformation;
