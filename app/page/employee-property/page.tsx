"use client";
import type { ITEmployeePropertyCommon } from "@/app/common/epmployee-property";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import employeePropertyService from "@/app/services/employee-property.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  Tabs,
  Upload,
  type GetProp,
  type UploadProps,
} from "antd";
import { useContext, useEffect, useState } from "react";
import EmployeePropertyTable from "./components/employee-property-table";
import EmployeePropertyTeamsTable from "./components/employee-property-table-teams";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { handleCompress } from "@/app/utils";
import type { RcFile } from "antd/es/upload";
import EmployeePropertyAllUsersTable from "./components/employee-property-table-all";
import React from "react";
import UserServices from "@/app/services/user.service";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const nameOptions = [
  { label: "Notebook", value: "Notebook", type: "computer_equipment" },
  { label: "PC", value: "PC", type: "computer_equipment" },
  { label: "Monitor", value: "Monitor", type: "computer_equipment" },
  { label: "Keyboard", value: "Keyboard", type: "computer_equipment" },
  { label: "Mouse", value: "Mouse", type: "computer_equipment" },
  { label: "Other", value: "Other", type: "computer_equipment" },
  { label: "IP Phone", value: "IP Phone", type: "office_equipment" },
  { label: "Hard Phone", value: "Hard Phone", type: "office_equipment" },
  { label: "Adapter", value: "Adapter", type: "office_equipment" },
  { label: "Charger", value: "Charger", type: "office_equipment" },
  { label: "โต๊ะประชุม", value: "โต๊ะประชุม", type: "office_equipment" },
  { label: "โต๊ะทำงานส่วนตัว", value: "โต๊ะทำงานส่วนตัว", type: "office_equipment" },
  { label: "เก้าอี้ส่วนกลาง", value: "เก้าอี้ส่วนกลาง", type: "office_equipment" },
  { label: "เก้าอี้ทำงานส่วนตัว", value: "เก้าอี้ทำงานส่วนตัว", type: "office_equipment" },
  { label: "ตู้เก็บเอกสาร", value: "ตู้เก็บเอกสาร", type: "office_equipment" },
  { label: "เครื่องถ่ายเอกสาร", value: "เครื่องถ่ายเอกสาร", type: "office_equipment" },
  { label: "เครื่องย่อยกระดาษ", value: "เครื่องย่อยกระดาษ", type: "office_equipment" },
  { label: "เครื่องฟอกอากาศ", value: "เครื่องฟอกอากาศ", type: "office_equipment" },
  { label: "TV", value: "TV", type: "office_equipment" },
  { label: "Other", value: "Other", type: "office_equipment" },
  { label: "Mobile Phone", value: "Mobile Phone", type: "other_asset" },
  { label: "Sim Moblie", value: "Sim Moblie", type: "other_asset" },
  { label: "Pocket Wifi", value: "Pocket Wifi", type: "other_asset" },
  { label: "Other", value: "Other", type: "other_asset" },
];

export default function Page() {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const [api, contextHolder] = notification.useNotification();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const employeepropertyservice = employeePropertyService(baseUrIntranet);
  const userservices = UserServices(baseUrlUser);
  const [openModal, setOpen] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [form] = Form.useForm();
  const [attendFiles, setAttendFiles] = useState<UploadFile[][]>([]);
  const [dropdownUser, setDropdownUser] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fecthMasterData();
  }, []);

  const fecthMasterData = async () => {
    const masterData = await userservices.getUsersAllDropdown();
    const mappedNameOptions = masterData.map((option: ITUser) => {
      return {
        value: option.userId,
        label: `${option.firstNameTh} ${option.lastNameTh}`,
      };
    });
    setDropdownUser(mappedNameOptions);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values: { items: ITEmployeePropertyCommon[] }) => {
    if (!user) return;
    try {
      const formData = new FormData();
      formData.append("items", JSON.stringify(values.items));
      attendFiles.forEach((fileList) => {
        const file = fileList?.[0];
        if (file) {
          formData.append("files", file.originFileObj as RcFile);
        }
      });
      await employeepropertyservice.create(formData);
      api.success({
        message: "บันทึกสำเร็จ",
        description: "เพิ่มข้อมูลทรัพย์สินเรียบร้อยแล้ว",
        placement: "topRight",
      });
      setOpen(false);
      form.resetFields();
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const getUploadProps = (name: number): UploadProps => ({
    beforeUpload: async (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not a png file`);
        return Upload.LIST_IGNORE;
      }
      const compressed = await handleCompress(file);
      return compressed;
    },
    onChange: (info) => {
      const newFiles = [...attendFiles];
      newFiles[name] = info.fileList;

      form.setFieldValue(["items", name, "pathImage"], info.fileList);
      setAttendFiles(newFiles);
    },
  });

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div>
      {contextHolder}
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>{`หน้าหลัก`}</span>,
              },
              {
                title: <span>{`ข้อมูลการจัดการทรัพย์สินพนักงาน`}</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>{`ข้อมูลการจัดการทรัพย์สินพนักงาน`}</span>
          </div>
        </Divider>
        <div className="flex justify-end w-full mb-2">
          <Button onClick={handleOpen}>{`เพิ่มข้อมูล`}</Button>
        </div>
        <Col span={24}>
          <Card>
            <Tabs
              tabPosition="left"
              type="card"
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: "อุปกรณ์ของตนเอง",
                  children: (
                    <>
                      <EmployeePropertyTable reloadKey={reloadKey} setReloadKey={setReloadKey} dropdownUser={dropdownUser} />
                    </>
                  ),
                },
                {
                  key: "2",
                  label: "อุปกรณ์ของทีม",
                  children: (
                    <>
                      <EmployeePropertyTeamsTable reloadKey={reloadKey} dropdownUser={dropdownUser} />
                    </>
                  ),
                },
                {
                  key: "3",
                  label: "อุปกรณ์ของทุกคน",
                  children: (
                    <>
                      <EmployeePropertyAllUsersTable reloadKey={reloadKey} dropdownUser={dropdownUser} />
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
      <Modal title="เพิ่มอุปกรณ์" open={openModal} onCancel={handleCancel} footer={null} width={1500}>
        <Form
          form={form}
          name="create-employee-property-form"
          initialValues={{
            items: [
              {
                userId: user?.userId,
                createdBy: user?.userId,
              },
            ],
          }}
          onFinish={onFinish}
          className="w-full"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
          autoComplete="off"
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <div key={key}>
                      <Card
                        className="mb-1"
                        title={
                          <div className="flex justify-end items-center ">
                            <Button
                              danger
                              type="link"
                              icon={<MinusCircleOutlined />}
                              onClick={() => {
                                remove(name);

                                setAttendFiles((prev) => {
                                  const newFiles = [...prev];
                                  newFiles.splice(name, 1);
                                  return newFiles;
                                });
                              }}
                            />
                          </div>
                        }
                      >
                        <Form.Item {...restField} name={[name, "createdBy"]} hidden initialValue={user?.userId}>
                          <Input />
                        </Form.Item>
                        <Row gutter={[8, 8]}>
                          <Col span={24}>
                            <Form.Item {...restField} name={[name, "pathImage"]} label="Image" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                              <Upload
                                {...getUploadProps(name)}
                                fileList={attendFiles[name] || []}
                                listType="picture-card"
                                maxCount={1}
                                onPreview={onPreview}
                              >
                                {(attendFiles[name]?.length || 0) < 1 && "+ Upload"}
                              </Upload>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...restField} name={[name, "type"]} label="ประเภททรัพย์สิน" rules={[{ required: true }]}>
                              <Select
                                showSearch
                                allowClear
                                optionFilterProp="label"
                                placeholder="Please Select"
                                onChange={() => {
                                  form.setFieldValue(["items", name, "name"], undefined);
                                }}
                                options={[
                                  { label: "อุปกรณ์คอมพิวเตอร์", value: "computer_equipment" },
                                  { label: "อุปกรณ์สำนักงาน", value: "office_equipment" },
                                  { label: "อื่นๆ", value: "other_asset" },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              noStyle
                              shouldUpdate={(prev, cur) =>
                                prev.items?.[name]?.type !== cur.items?.[name]?.type || prev.items?.[name]?.name !== cur.items?.[name]?.name
                              }
                            >
                              {({ getFieldValue }) => {
                                const selectedType = getFieldValue(["items", name, "type"]);
                                const selectedName = getFieldValue(["items", name, "name"]);

                                if (selectedName === "Other") {
                                  return (
                                    <Form.Item {...restField} name={[name, "nameOther"]} label="ชื่อทรัพย์สินอื่นๆ" rules={[{ required: true }]}>
                                      <Input placeholder="คีย์บอร์ด" />
                                    </Form.Item>
                                  );
                                }
                                return (
                                  <Form.Item {...restField} name={[name, "name"]} label="ชื่อทรัพย์สิน">
                                    <Select
                                      showSearch
                                      allowClear
                                      optionFilterProp="label"
                                      placeholder="Please Select"
                                      options={nameOptions.filter((opt) => opt.type === selectedType)}
                                      onChange={(val) => {
                                        if (val !== "Other") {
                                          form.setFieldValue(["items", name, "nameOther"], undefined);
                                        }
                                      }}
                                    />
                                  </Form.Item>
                                );
                              }}
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...restField} name={[name, "userId"]} label="เจ้าของทรัพย์สิน" rules={[{ required: true }]}>
                              <Select showSearch allowClear optionFilterProp="label" placeholder="Please Select" options={dropdownUser} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...restField} name={[name, "brand"]} label="ยี่ห้อ">
                              <Input placeholder="Please Input" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...restField} name={[name, "serial"]} label="Serial">
                              <Input placeholder="SN-20240201-001" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...restField} name={[name, "assetNumber"]} label="Asset Number">
                              <Input placeholder="Please Input" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...restField} name={[name, "address"]} label="ที่ตั้ง">
                              <Input placeholder="ห้องประชุม Alpha " />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...restField} name={[name, "assetStatus"]} label="สถานะ">
                              <Input placeholder="ชำรุด หรือ ใช้งานได้ปกติ" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...restField} name={[name, "common"]} label="อุปกรณ์ส่วนกลาง" valuePropName="checked">
                              <Checkbox>{`ใช่`}</Checkbox>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item {...restField} name={[name, "spec"]} label="รายละเอียด" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                              <Input.TextArea placeholder="Please Input" showCount maxLength={500} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  );
                })}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="w-full my-2">
                  เพิ่มทรัพย์สิน
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item className="flex justify-center">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
