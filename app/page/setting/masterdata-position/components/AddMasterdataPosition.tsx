"use client";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Button, Card, Col, Divider, Form, Input, Modal, Row, Select, Typography, message } from "antd";
// import { useRouter } from "next/router";
import React, { useState } from "react";
import { PositionServices } from "../services/position.service";
import { TCreatePositionDto } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { checkRule } from "@/app/utils/rules";
import { TdepartmentFindMany } from "../../department/common";

export interface props {
  departMent: TdepartmentFindMany[];
  setLoading: (value: boolean) => void;
}

export const AddMasterdataPosition: React.FC<props> = ({ departMent, setLoading }) => {
  const userAuth = useAxiosUser();
  const addRule = checkRule("st-p-a");
  const positionServices = PositionServices(userAuth);
  const [FORM] = Form.useForm();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const onfinish = async (event: TCreatePositionDto) => {
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
      <Card className=" grid grid-cols-1 gap-y-2" title={`Add Position`}>
        <Form form={FORM} layout="horizontal" name={`add-position`} onFinish={onfinish} labelAlign="left">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Form.Item name={`nameTh`} label={`Name TH :`} rules={[{ required: true, message: "Please enter name TH" }]}>
                <Input placeholder="Text" />
              </Form.Item>
            </div>
            <div>
              <Form.Item name={`nameEn`} label={`Name EN :`} rules={[{ required: true, message: "Please enter name EN" }]}>
                <Input placeholder="Text" />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end">
            <Form.Item>
              <Button htmlType="submit" type="primary" className="button-blue" loading={buttonLoading}>{`Add Position`}</Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
};
