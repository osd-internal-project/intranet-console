"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { VenderServices } from "../service/vender.service";
import { CloseOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { typeVender } from "../common";

export default function CreateVender() {
  const router = useRouter();
  const stockAuth = useAxiosStock();
  const venderServices = VenderServices(stockAuth);
  const [FORM] = Form.useForm();
  const [switchChecked, setSwitchChecked] = useState(true);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const onfinish = async (event: typeVender) => {
    setbuttonLoading(true);
    const res = await venderServices.createVender({
      ...event,
      status: switchChecked,
    });
    if (res) {
      message.success(`Add success`);
      router.push("/page/stock-management/vender");
      FORM.resetFields();
      setSwitchChecked(false);
      setbuttonLoading(false);
    }
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                href: "/page/setting",
                title: <span>Setting</span>,
              },
              {
                href: "/page/stock-management/vender",
                title: <span>Vender </span>,
              },
              {
                title: <span>Add Vender</span>,
              },
            ]}
          />
        </Col>

        <Col span={24}>
          <Form
            name={`create-vender`}
            form={FORM}
            style={{ width: "100%" }}
            layout="horizontal"
            labelAlign="right"
            onFinish={onfinish}
          >
            <Card style={{ width: "100%", marginBottom: "20px" }}>
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <Typography className="title-page-font">{`Add Vender`}</Typography>
                </Col>
                <Col span={24}>
                  <Row
                    gutter={[8, 8]}
                    style={{
                      justifyContent: "space-between",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <Col>
                      <Typography.Text>{`${dayjs(new Date()).format(
                        "DD/MM/YYYY HH:mm "
                      )}`}</Typography.Text>
                    </Col>
                    <Col>
                      <Form.Item name={"status"}>
                        <Switch
                          checkedChildren="Active"
                          unCheckedChildren="Inactive"
                          checked={switchChecked}
                          onChange={handleChange}
                          className={
                            switchChecked === true
                              ? "active-switch"
                              : "inactive-switch"
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`venderName`}
                    label={`Vender Company :`}
                    rules={[
                      {
                        required: true,
                        message: "Please enter vender company",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={16} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`description`}
                    labelCol={{ span: 5 }}
                    label={`รายละเอียด :`}
                    rules={[
                      { required: true, message: "Please enter description" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card style={{ width: "100%", marginBottom: "20px" }}>
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <Typography.Text
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >{`Address`}</Typography.Text>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`house_number`}
                    label={`เลขที่ :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter house number" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`group`}
                    label={`หมู่ :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter group" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`village`}
                    label={`อาคาร/หมู่บ้าน :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter village" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`alley`}
                    label={`ซอย :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter alley" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`road`}
                    label={`ถนน :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter road" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`sub_district`}
                    label={`ตำบล/แขวง :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter sub district" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`district`}
                    label={`อำเภอ/เขต :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter district" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`province`}
                    label={`จังหวัด :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter province" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`post_code`}
                    label={`รหัสไปษณีย์ :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter postcode" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`phoneNumber`}
                    label={`เบอร์โทรศัพท์ :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter phone number" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`fax_number`}
                    label={`เบอร์ FAX :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter fax number" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`email`}
                    label={`E-mail :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter email" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`IDcard`}
                    label={`เลขประจำตัวผู้เสียภาษี :`}
                    labelCol={{ span: 10 }}
                    rules={[
                      { required: true, message: "Please enter ID card" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card style={{ width: "100%", marginBottom: "20px" }}>
              <Row gutter={[8, 8]}>
                <Form.List name="contact">
                  {(fields, { add, remove }) => (
                    <>
                      <div
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <Col
                          style={{
                            width: "100%",
                            display: "flex",
                            height: "100%",
                          }}
                        >
                          <Typography.Text
                            style={{ fontSize: "18px", fontWeight: "bold" }}
                          >{`Contact`}</Typography.Text>
                        </Col>
                        <Col>
                          <Form.Item>
                            <Button
                              type="default"
                              onClick={() => add()}
                              style={{
                                width: "100%",
                                color: "#00a1df",
                                borderColor: "#00a1df",
                              }}
                            >
                              <Space>{`Add Contact`}</Space>
                            </Button>
                          </Form.Item>
                        </Col>
                      </div>
                      {fields?.map(({ name, key, ...restField }, index) => {
                        return (
                          <div key={index}>
                            <div className=" flex  ">
                              <div className="  w-5/6">
                                <Row gutter={[8, 8]}>
                                  <Col span={8} style={{ marginTop: "10px" }}>
                                    <Form.Item
                                      name={[index, "contact_name"]}
                                      label={`ชื่อผู้ติดต่อ ${index + 1} :`}
                                      labelCol={{ span: 10 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter name",
                                        },
                                      ]}
                                      {...restField}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={8} style={{ marginTop: "10px" }}>
                                    <Form.Item
                                      name={[index, "phoneNumber"]}
                                      label={`เบอร์โทรศัพท์ :`}
                                      labelCol={{ span: 10 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter phone number",
                                        },
                                      ]}
                                      {...restField}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={8} style={{ marginTop: "10px" }}>
                                    <Form.Item
                                      {...restField}
                                      name={[index, "fax_number"]}
                                      label={`เบอร์ FAX :`}
                                      labelCol={{ span: 10 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter fax number",
                                        },
                                      ]}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={8} style={{ marginTop: "10px" }}>
                                    <Form.Item
                                      {...restField}
                                      name={[index, "email"]}
                                      label={`E-mail :`}
                                      labelCol={{ span: 10 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter email",
                                        },
                                      ]}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={16} style={{ marginTop: "10px" }}>
                                    <Form.Item
                                      {...restField}
                                      name={[index, "description"]}
                                      label={`หมายเหตุ :`}
                                      labelCol={{ span: 5 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please enter description",
                                        },
                                      ]}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </div>
                              <div
                                className="w-1/6  flex justify-center"
                                style={{ alignItems: "center" }}
                              >
                                {fields.length >= 1 ? (
                                  <Button
                                    icon={<CloseOutlined />}
                                    danger
                                    type="link"
                                    onClick={() => remove(index)}
                                  >
                                    Remove
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                            <Divider />
                          </div>
                        );
                      })}
                    </>
                  )}
                </Form.List>
              </Row>
            </Card>
            <div
              style={{ width: "100%", justifyContent: "end", display: "flex" }}
            >
              <Space>
                <Form.Item>
                  <Button
                    ghost
                    danger
                    type="primary"
                    onClick={() => {
                      FORM.resetFields();
                      setSwitchChecked(false);
                      router.push("/page/stock-management/vender");
                    }}
                  >{`Cancel`}</Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    loading={buttonLoading}
                  >{`Add`}</Button>
                </Form.Item>
              </Space>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}
