import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  message,
} from "antd";
import { ITypeCreateBodyBrands, ITypeCreateBrands } from "../common/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BrandService } from "../services/brand.service";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { checkRule } from "@/app/utils/rules";

export interface props {
  onCloseDialog: (dataField: boolean) => void;
}

export const FilterBrand: React.FC<props> = ({
  onCloseDialog,
}): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const addRule = checkRule("sm-brand-a");
  const brandservice = BrandService(stockAuth);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [FORM] = Form.useForm();
  const onfinish = (event: ITypeCreateBrands) => {
    const bodyjson: ITypeCreateBodyBrands = {
      data: {
        name: event.name,
        status: true,
      },
    };
    setbuttonLoading(true);
    Modal.confirm({
      title: "Add Customer",
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
        const ResultData = await brandservice.create(bodyjson);
        if (ResultData) {
          message.success(`Add success`);
          onCloseDialog(true);
          FORM.resetFields();
        }
        setbuttonLoading(false);
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };
  return (
    <div>
      <Card className=" grid grid-cols-1 gap-y-2" title="Add Brand">
        {addRule ? (
          <div>
            <Form
              form={FORM}
              layout="horizontal"
              name={`add-brand`}
              onFinish={onfinish}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              labelAlign="left"
            >
              <Row gutter={[32, 8]}>
                <Col span={8}>
                  <Form.Item
                    name={`name`}
                    label={`Brand Name:`}
                    rules={[
                      { required: true, message: "Please enter brand name" },
                    ]}
                  >
                    <Input placeholder="Text" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="primary"
                      className="button-blue"
                      disabled={buttonLoading}
                    >{`Add Brand`}</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
};
