"use client";
import React, { useEffect, useState } from "react";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useParams, useRouter } from "next/navigation";
import { VenderServices } from "../service/vender.service";
import { Breadcrumb, Button, Card, Col, Divider, Form, Input, Row, Space, Spin, Switch, Typography, message } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { typeVender } from "../common";

const EditVender: React.FC<{}> = (): React.ReactElement => {
  const router = useRouter();
  const params = useParams();
  const userid = params?.uid as string;
  const stockAuth = useAxiosStock();
  const venderServices = VenderServices(stockAuth);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const [loading, setloading] = useState<boolean>(true);
  const [number, setNumber] = useState<number>(0);

  const [venderID, setIDcard] = useState<string>("");
  const [switchChecked, setSwitchChecked] = useState<boolean>();
  const [FORM] = Form.useForm();

  useEffect(() => {
    if (loading === true) data();
  }, [loading, userid]);

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const data = async () => {
    const result = await venderServices.getById(userid);
    if (result) {
      FORM.setFieldValue("status", result.status);
      FORM.setFieldValue("venderName", result.venderName);
      FORM.setFieldValue("description", result.description);
      FORM.setFieldValue("house_number", result.house_number);
      FORM.setFieldValue("group", result.group);
      FORM.setFieldValue("village", result.village);
      FORM.setFieldValue("alley", result.alley);
      FORM.setFieldValue("road", result.road);
      FORM.setFieldValue("sub_district", result.sub_district);
      FORM.setFieldValue("district", result.district);
      FORM.setFieldValue("province", result.province);
      FORM.setFieldValue("post_code", result.post_code);
      FORM.setFieldValue("phoneNumber", result.phoneNumber);
      FORM.setFieldValue("fax_number", result.fax_number);
      FORM.setFieldValue("email", result.email);
      FORM.setFieldValue("IDcard", result.IDcard);
      FORM.setFieldValue("contact", result.contact);
      setIDcard(result.venderID);
      setSwitchChecked(result.status);
    }
    setloading(false);
  };

  const onfinish = async (event: typeVender) => {
    setbuttonLoading(true);
    const res = await venderServices.updatedata({ ...event, status: switchChecked }, venderID);
    if (res) {
      message.success(`Edit success`);
      router.push("/page/setting/vender");
      FORM.resetFields();
      setSwitchChecked(false);
      setbuttonLoading(false);
    }
  };

  return loading ? (
    <Spin></Spin>
  ) : (
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
                href: "/page/setting/vender",
                title: <span>Vender </span>,
              },
              {
                title: <span>Edit Vender</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <Form form={FORM} name={`create-vender`} style={{ width: "100%" }} layout="horizontal" labelAlign="right" onFinish={onfinish}>
            <Card style={{ width: "100%", marginBottom: "20px" }}>
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <Typography className="title-page-font">{`Edit Vender`}</Typography>
                </Col>
                <Col span={24}>
                  <Row gutter={[8, 8]} style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
                    <Col>
                      <Typography.Text>{`${dayjs(new Date()).format("DD/MM/YYYY HH:mm ")}`}</Typography.Text>
                    </Col>
                    <Col>
                      <Form.Item name={"status"}>
                        <Switch
                          checkedChildren="Active"
                          unCheckedChildren="Inactive"
                          checked={switchChecked}
                          onChange={handleChange}
                          className={switchChecked === true ? "active-switch" : "inactive-switch"}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`venderName`}
                    label={`Vender Company :`}
                    wrapperCol={{ offset: 1 }}
                    rules={[{ required: true, message: "Please enter vender company" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={16} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`description`}
                    label={`รายละเอียด :`}
                    labelCol={{ span: 5 }}
                    // wrapperCol={{ offset: 1 }}
                    rules={[{ required: true, message: "Please enter description" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card style={{ width: "100%", marginBottom: "20px" }}>
              <Col span={24}>
                <Typography.Text style={{ fontSize: "18px", fontWeight: "bold" }}>{`Address`}</Typography.Text>
              </Col>
              <Row gutter={[8, 8]}>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`house_number`}
                    label={`เลขที่ :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter house number" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item name={`group`} label={`หมู่ :`} labelCol={{ span: 10 }} rules={[{ required: true, message: "Please enter group" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`village`}
                    label={`อาคาร/หมู่บ้าน :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter village" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item name={`alley`} label={`ซอย :`} labelCol={{ span: 10 }} rules={[{ required: true, message: "Please enter alley" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item name={`road`} label={`ถนน :`} labelCol={{ span: 10 }} rules={[{ required: true, message: "Please enter road" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`sub_district`}
                    label={`ตำบล/แขวง :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter sub district" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`district`}
                    label={`อำเภอ/เขต :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter district" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`province`}
                    label={`จังหวัด :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter province" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`post_code`}
                    label={`รหัสไปษณีย์ :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter postcode" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`phoneNumber`}
                    label={`เบอร์โทรศัพท์ :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter phone number" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`fax_number`}
                    label={`เบอร์ FAX :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter fax number" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item name={`email`} label={`E-mail :`} labelCol={{ span: 10 }} rules={[{ required: true, message: "Please enter email" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ marginTop: "10px" }}>
                  <Form.Item
                    name={`IDcard`}
                    label={`เลขประจำตัวผู้เสียภาษี :`}
                    labelCol={{ span: 10 }}
                    rules={[{ required: true, message: "Please enter ID card" }]}
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
                      <div style={{ width: "100%", justifyContent: "space-between", display: "flex" }}>
                        <Col style={{ width: "100%", display: "flex", height: "100%" }}>
                          <Typography.Text style={{ fontSize: "18px", fontWeight: "bold" }}>{`Contact`}</Typography.Text>
                        </Col>
                        <Col>
                          <Form.Item>
                            <Button type="default" onClick={() => add()} style={{ width: "100%", color: "#00a1df", borderColor: "#00a1df" }}>
                              <Space>{`Add Contact`}</Space>
                            </Button>
                          </Form.Item>
                        </Col>
                      </div>
                      {fields?.map(({ name, key, ...restField }, index) => {
                        return (
                          <div key={index}>
                            <Row gutter={[8, 8]}>
                              <Col span={8} style={{ marginTop: "10px" }}>
                                <Form.Item
                                  key={index}
                                  name={[index, "contact_name"]}
                                  label={`ชื่อผู้ติดต่อ ${index + 1} :`}
                                  labelCol={{ span: 10 }}
                                  rules={[{ required: true, message: "Please enter name" }]}
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
                                  rules={[{ required: true, message: "Please enter phone number" }]}
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
                                  rules={[{ required: true, message: "Please enter fax number" }]}
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
                                  rules={[{ required: true, message: "Please enter email" }]}
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
                                  rules={[{ required: true, message: "Please enter description" }]}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              {fields.length >= 1 ? (
                                <MinusCircleOutlined
                                  style={{ width: "100%", color: "red", borderColor: "red" }}
                                  className="dynamic-delete-button"
                                  onClick={() => remove(index)}
                                />
                              ) : null}
                              <Divider />
                            </Row>
                          </div>
                        );
                      })}
                    </>
                  )}
                </Form.List>
              </Row>
            </Card>
            <div style={{ width: "100%", justifyContent: "end", display: "flex" }}>
              <Space>
                <Form.Item>
                  <Button
                    danger
                    type="primary"
                    onClick={() => {
                      FORM.resetFields();
                      setSwitchChecked(false);
                      router.push("/page/setting/vender");
                    }}
                    ghost
                  >{`Cancel`}</Button>
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary" loading={buttonLoading}>{`Save Change`}</Button>
                </Form.Item>
              </Space>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
};
export default EditVender;
