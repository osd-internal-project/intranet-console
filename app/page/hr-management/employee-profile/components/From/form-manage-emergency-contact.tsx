import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import React from "react";

const FormManageEmergencyContact: React.FC = (): React.ReactElement => {
  return (
    <div>
      <Form.List name="emergencyContact">
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
                    <Form.Item {...restField} name={[name, "fullname"]} label={`Name`}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "relationship"]} label={`Relationship`}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "phoneNumber"]} label={`Phone No`}>
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

export default FormManageEmergencyContact;
