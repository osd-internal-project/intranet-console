"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Button, Card, Col, Form, Input, Modal, Row, Typography, message } from "antd";
// import { useRouter } from "next/router";
import React, { useState } from "react";
import { UnitServices } from "../services/unit.service";
import { addUnit } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { checkRule } from "@/app/utils/rules";

export interface props {
  setLoading: (value: boolean) => void;
}

export const AddUnit: React.FC<props> = ({ setLoading }) => {
  const stockAuth = useAxiosStock();
  const addRule = checkRule("mp-unit-add");
  const unitServices = UnitServices(stockAuth);
  const [FORM] = Form.useForm();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const onfinish = async (event: addUnit) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Add Unit ",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to add this ?",
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df",
          borderColor: "#00a1df",
        },
      },
      onOk: async () => {
        const result = await unitServices.create(event);
        if (result) {
          message.success(`Add success`);
          FORM.resetFields();
          setLoading(true);
          setbuttonLoading(false);
        }
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };

  return (
    <div>
      <Card className=" grid grid-cols-1 gap-y-2">
        <Typography className="title-page-font">{`Set Unit`}</Typography>
        <Form
          form={FORM}
          layout="horizontal"
          name={`add-unit`}
          onFinish={onfinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          <Row gutter={[32, 8]}>
            <Col span={8}>
              <Form.Item name={`name`} label={`Unit :`} rules={[{ required: true, message: "Please enter unit name" }]}>
                <Input placeholder="Text" />
              </Form.Item>
            </Col>
            <Col>
              {addRule ? (
                <Form.Item>
                  <Button htmlType="submit" type="primary" disabled={buttonLoading} className="button-blue">{`Add Unit`}</Button>
                </Form.Item>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};
