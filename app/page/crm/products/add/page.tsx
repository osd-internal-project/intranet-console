"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  MenuProps,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  TablePaginationConfig,
} from "antd";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
import { checkRule } from "@/app/utils/rules";
import Link from "next/link";
import { useSession } from "next-auth/react";
const { TextArea } = Input;
import {
  ExclamationCircleFilled,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CrmServices from "@/app/services/customer-product.service";
import { ITCustomerProduct } from "@/app/common/product";
import { useRouter } from "next/navigation";
const { useForm } = Form;
export default function ProductsAddPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form] = useForm();
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const [loading, setloading] = useState<boolean>(true);

  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    setloading(false);
  };

  const addFormDetails = (type: string) => {
    const details = form.getFieldValue("details");
    console.log(details);
    if (details) {
      form.setFieldValue("details", [
        ...details,
        { label: undefined, value: undefined, type: type },
      ]);
    } else {
      form.setFieldValue("details", [
        { label: undefined, value: undefined, type: type },
      ]);
    }
  };
  async function handdleSaveProduct(values: any): Promise<void> {
    await crmServices
      .create(values)
      .then((data) => {
        message.success("สำเร็จ");
        router.push("/page/crm/products");
      })
      .catch((err) => message.error("ผิดพลาด"));
  }

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link href={"/page"}>Home</Link>,
              },
              {
                title: <span>CRM</span>,
              },
              { title: <Link href={"/page/crm/products"}>Products</Link> },
              {
                title: <span>Add</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`Add Product`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <Form form={form} layout="vertical" onFinish={handdleSaveProduct}>
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-2 ">
                  <Form.Item
                    label="Name"
                    name={"name"}
                    className=" col-span-2 "
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Status"
                    name={"activeStatus"}
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </Form.Item>
                </div>

                <Form.Item label="Description" name={"description"}>
                  <TextArea rows={4} />
                </Form.Item>
                <Card className=" mb-4">
                  <Form.List name="details">
                    {(fields, { add, remove }) => (
                      <>
                        <div className=" flex justify-between mb-2">
                          <div className="  text-lg">ข้อมูลผลิตภัณฑ์</div>
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: 1,
                                  label: (
                                    <a onClick={() => addFormDetails("string")}>
                                      string
                                    </a>
                                  ),
                                },
                                {
                                  key: 2,
                                  label: (
                                    <a onClick={() => addFormDetails("number")}>
                                      number
                                    </a>
                                  ),
                                },
                                {
                                  key: 3,
                                  label: (
                                    <a onClick={() => addFormDetails("date")}>
                                      date
                                    </a>
                                  ),
                                },
                              ],
                            }}
                            placement="bottomRight"
                          >
                            <Button type="primary" ghost size="small">
                              Add
                            </Button>
                          </Dropdown>
                        </div>
                        {fields.map(({ name, key, ...restField }) => {
                          const type = form.getFieldValue([
                            "details",
                            name,
                            "type",
                          ]);
                          return (
                            <Space
                              key={name}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[key, "label"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing first name",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="หัวข้อ"
                                  style={{ width: "200px" }}
                                />
                              </Form.Item>
                              <Form.Item {...restField} name={[key, "type"]}>
                                {type === "string" && (
                                  <Input value={"string"} readOnly />
                                )}
                                {type === "number" && (
                                  <Input value={"number"} readOnly />
                                )}
                                {type === "date" && (
                                  <Input value={"date"} readOnly />
                                )}
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[key, "value"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing last name",
                                  },
                                ]}
                              >
                                {type === "string" && (
                                  <Input
                                    placeholder="Value"
                                    style={{ width: "200px" }}
                                  />
                                )}
                                {type === "number" && (
                                  <InputNumber
                                    placeholder="Value"
                                    style={{ width: "200px" }}
                                  />
                                )}
                                {type === "date" && (
                                  <DatePicker
                                    placeholder="Value"
                                    style={{ width: "200px" }}
                                  />
                                )}
                              </Form.Item>
                              <Button
                                danger
                                type="primary"
                                onClick={() => remove(key)}
                                size="small"
                              >
                                ลบ
                              </Button>
                            </Space>
                          );
                        })}
                      </>
                    )}
                  </Form.List>
                </Card>
                <Card className=" mb-4">
                  <Form.List name="fields">
                    {(fields, { add, remove }) => (
                      <>
                        <div className=" flex justify-between  mb-2">
                          <div className="  text-lg">
                            ข้อมูลผลิตภัณฑ์แต่ละโปรเจก
                          </div>

                          <Button
                            type="primary"
                            ghost
                            size="small"
                            onClick={() => add()}
                          >
                            Add
                          </Button>
                        </div>
                        {fields.map(({ key, name, ...restField }) => {
                          return (
                            <Space
                              key={key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "label"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing first name",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="หัวข้อ"
                                  style={{ width: "200px" }}
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing first name",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Field Name"
                                  style={{ width: "200px" }}
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "type"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing first name",
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="Type"
                                  style={{ width: "200px" }}
                                  options={[
                                    { value: "string", label: "string" },
                                    { value: "number", label: "number" },
                                    { value: "date", label: "date" },
                                    { value: "text", label: "text" },
                                  ]}
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "lenght"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing first name",
                                  },
                                ]}
                              >
                                <InputNumber
                                  placeholder="Lenght"
                                  style={{ width: "200px" }}
                                />
                              </Form.Item>
                              <Button
                                danger
                                type="primary"
                                onClick={() => remove(name)}
                                size="small"
                              >
                                ลบ
                              </Button>
                            </Space>
                          );
                        })}
                      </>
                    )}
                  </Form.List>
                </Card>
                <div className=" flex justify-end">
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </Spin>
  );
}
