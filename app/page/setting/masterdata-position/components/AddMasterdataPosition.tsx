"use client";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Button, Card, Col, Form, Input, Modal, Row, Typography, message } from "antd";
// import { useRouter } from "next/router";
import React, { useState } from "react";
import { PositionServices } from "../services/position.service";
import { addPosition } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { checkRule } from "@/app/utils/rules";

export interface props {
  setLoading: (value: boolean) => void;
}

export const AddMasterdataPosition: React.FC<props> = ({ setLoading }) => {
  const userAuth = useAxiosUser();
  const addRule = checkRule("user-position-add");
  const positionServices = PositionServices(userAuth);
  const [FORM] = Form.useForm();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const onfinish = async (event: addPosition) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Add Postion",
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
        const result = await positionServices.create(event);
        if (result) {
          message.success(`Add success`);
          FORM.resetFields();
          setLoading(true);
          setbuttonLoading(false);
        }
      },
      onCancel() {
        // FORM.resetFields();
        setbuttonLoading(false);
      },
    });
  };

  return (
    <div>
      <Card className=" grid grid-cols-1 gap-y-2">
        <Typography className="title-page-font">{`Set Position`}</Typography>
        {addRule ? (
          <Form
            form={FORM}
            layout="horizontal"
            name={`add-position`}
            onFinish={onfinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
          >
            <Row gutter={[32, 8]}>
              <Col span={8}>
                <Form.Item name={`nameTh`} label={`Name TH :`} rules={[{ required: true, message: "Please enter name TH" }]}>
                  <Input placeholder="Text" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={`nameEn`} label={`Name EN :`} rules={[{ required: true, message: "Please enter name EN" }]}>
                  <Input placeholder="Text" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button htmlType="submit" type="primary" className="button-blue" loading={buttonLoading}>{`Add Position`}</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
};
