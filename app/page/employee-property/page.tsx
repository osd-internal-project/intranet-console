"use client";
import type { ITEmployeePropertyCommon } from "@/app/common/epmployee-property";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import employeePropertyService from "@/app/services/employee-property.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Breadcrumb, Button, Card, Col, Divider, Form, Input, message, Modal, Row, Select, Tabs, Upload, type GetProp, type UploadProps } from "antd";
import { useContext, useState } from "react";
import EmployeePropertyTable from "./components/employee-property-table";
import EmployeePropertyTeamsTable from "./components/employee-property-table-teams";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { handleCompress } from "@/app/utils";
import type { RcFile } from "antd/es/upload";
import { intersection } from "lodash";
import EmployeePropertyAllUsersTable from "./components/employee-property-table-all";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function Page() {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios, tokenAccess } = useId24();
  const sideMenuGroups =
    tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];
  const isHr = intersection(sideMenuGroups, ["hr"]).length > 0;
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const employeepropertyservice = employeePropertyService(baseUrIntranet);
  const [openModal, setOpen] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [form] = Form.useForm();
  const [attendFiles, setAttendFiles] = useState<UploadFile[][]>([]);

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
      const response = await employeepropertyservice.create(formData);
      console.log(response);

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
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>ข้อมูลการจัดการทรัพย์สินพนักงาน</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>ข้อมูลการจัดการทรัพย์สินพนักงาน</span>
          </div>
        </Divider>
        <div className="flex justify-end w-full mb-2">
          <Button onClick={handleOpen}>เพิ่มข้อมูล</Button>
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
                      <EmployeePropertyTable reloadKey={reloadKey} setReloadKey={setReloadKey} />
                    </>
                  ),
                },
                {
                  key: "2",
                  label: "อุปกรณ์ของทีม",
                  children: (
                    <>
                      <EmployeePropertyTeamsTable reloadKey={reloadKey} />
                    </>
                  ),
                },
                ...(isHr
                  ? [
                      {
                        key: "3",
                        label: "อุปกรณ์ของทุกคน",
                        children: (
                          <>
                            <EmployeePropertyAllUsersTable reloadKey={reloadKey} />
                          </>
                        ),
                      },
                    ]
                  : []),
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
              },
            ],
          }}
          onFinish={onFinish}
          className="w-full"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
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
                      <Form.Item {...restField} name={[name, "userId"]} hidden initialValue={user?.userId}>
                        <Input />
                      </Form.Item>
                      <Row gutter={[8, 8]}>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "type"]} label="ประเภททรัพย์สิน" rules={[{ required: true }]}>
                            <Select
                              showSearch
                              allowClear
                              optionFilterProp="label"
                              placeholder="Please Select"
                              options={[
                                { label: "อุปกรณ์คอมพิวเตอร์", value: "computer_equipment" },
                                { label: "อุปกรณ์สำนักงาน", value: "office_equipment" },
                                { label: "อื่นๆ", value: "other_asset" },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "name"]} label="ชื่อทรัพย์สิน" rules={[{ required: true }]}>
                            <Input placeholder="Please Input" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "brand"]} label="ยี่ห้อ">
                            <Input placeholder="Please Input" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "serial"]} label="Serial">
                            <Input placeholder="Please Input" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "assetNumber"]} label="Asset Number">
                            <Input placeholder="Please Input" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "address"]} label="ที่ตั้ง">
                            <Input placeholder="Please Input" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "assetStatus"]} label="สถานะ">
                            <Input placeholder="Please Input" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, "pathImage"]} label="Image">
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
                      </Row>
                    </Card>
                  </div>
                ))}
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
