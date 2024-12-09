import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input } from "antd";
import React from "react";

const FormMangeEducationInformation: React.FC = ({}): React.ReactElement => {
  return (
    <div>
      <Form.List name="educationInformation">
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
                    <Form.Item {...restField} name={[name, "institution"]} label={`Institution Name`}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "subject"]} label={`Course`}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "startDate"]} label={`Start Date`}>
                      <DatePicker picker="year" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "completeDate"]} label={`End Date`}>
                      <DatePicker picker="year" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "degree"]} label={`Degree`}>
                      <Input />
                    </Form.Item>{" "}
                    <Form.Item {...restField} name={[name, "grade"]} label={`Grade`}>
                      <Input />
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

export default FormMangeEducationInformation;
