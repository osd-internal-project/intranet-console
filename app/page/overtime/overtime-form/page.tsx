"use client";
import { Breadcrumb, Button, Card, Checkbox, Col, ConfigProvider, DatePicker, Divider, Form, Input, Radio, Row, Select, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useSearchParams } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import UserServices from "@/app/services/user.service";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
export default function OverTimePage() {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const { user } = useContext(UserContext) as UserContectType;
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId") as string;
  const [createForm] = useForm();
  useEffect(() => {
    if (user && user.userId) {
      fetchData();
    }
  }, [user]);
  const fetchData = async () => {
    if (!user) return;
    const headers = await UserServices(baseUrlUser).findHeaderUserByUserId(user.userId);
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              title: <span>Over Time</span>,
            },
            {
              title: <span>แบบฟอร์มขอเบิกค่าทำงานล่วงเวลา</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`แบบฟอร์มขอเบิกค่าทำงานล่วงเวลา`}</div>
      </Divider>
      <Col span={24} className=" flex space-x-4">
        <Card className=" w-full">
          <ConfigProvider
            theme={{
              components: {
                Input: { colorBgContainerDisabled: "#fff" },
                DatePicker: { colorBgContainerDisabled: "#fff" },
                Form: { itemMarginBottom: 1 },
              },
            }}>
            <Form layout="vertical" size="small" form={createForm}>
              <div className=" w-full grid  grid-cols-1 md:grid-cols-4 gap-2">
                <div className=" md:col-start-4">
                  <Form.Item label={"วันที่ทำรายการ"} name={"createDate"} initialValue={dayjs()}>
                    <DatePicker className=" w-full" disabled />
                  </Form.Item>
                </div>
                <div className="  md:col-span-4 ">
                  <Form.Item label={"เรียน"}>
                    <Input disabled />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"ชื่อ"}>
                    <Input disabled />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"นามสกุล"}>
                    <Input disabled />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"ตำแหน่ง"}>
                    <Input disabled />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"เบอร์โทรศัพท์"}>
                    <Input disabled />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"ประเภท"}>
                    <Select />
                  </Form.Item>
                </div>{" "}
                <div>
                  <Form.Item label={"วันที่"}>
                    <DatePicker className=" w-full" />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"เวลาเข้า"}>
                    <Select />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"เวลาออก"}>
                    <Select />
                  </Form.Item>
                </div>
                <div className="  md:col-span-4 ">
                  <Form.Item label={"ชื่อลูกค้า"}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="  md:col-span-4 ">
                  <Form.Item label={"รายละเอียด"}>
                    <TextArea />
                  </Form.Item>
                </div>
                <div className="  md:col-span-2 ">
                  <Form.Item name={"extension"} label={<div className="text-blue-600 font-bold"> เพิ่มเติม</div>}>
                    <div className="grid grid-cols-2">
                      <Checkbox value="travelTo" style={{ lineHeight: "32px" }}>
                        เดินทางไป
                      </Checkbox>
                      <Checkbox value="return" style={{ lineHeight: "32px" }}>
                        เดินทางกลับ
                      </Checkbox>
                      <Checkbox value="otherProvinces" style={{ lineHeight: "32px" }}>
                        เดินทางต่างจังหวัด
                      </Checkbox>
                      <Checkbox value="overnightStay" style={{ lineHeight: "32px" }}>
                        มีการค้างคืน
                      </Checkbox>
                      <Checkbox value="company" style={{ lineHeight: "32px" }}>
                        เดินทางด้วยรถบริษัท
                      </Checkbox>
                      <Checkbox value="over350km" style={{ lineHeight: "32px" }}>
                        ระยะการเดินทางมากกว่า 350 กม.
                      </Checkbox>
                    </div>
                  </Form.Item>
                </div>
                <div className="  md:col-span-2 ">
                  <Card>
                    <div className=" text-blue-600  text-base font-bold">คำนวณเวลา</div>
                    <div className=" flex ">
                      <div className=" w-28">เวลาทั้งหมด (ช.ม.)</div>
                      <div className=" ml-2 font-bold text-base"> : {2}</div>
                    </div>
                    <div className=" flex ">
                      <div className=" w-28">เวลาพัก (ช.ม.) </div>
                      <div className=" ml-2 font-bold text-base"> : {2}</div>
                    </div>
                    <div className=" flex">
                      <div className=" w-28">สรุปเวลา (ช.ม.) </div>
                      <div className=" ml-2 font-bold  text-base"> : {2}</div>
                    </div>
                  </Card>
                </div>
                <div className=" col-span-4 flex justify-end space-x-2">
                  <Button>Back</Button> <Button type="primary">Create</Button>
                </div>
              </div>
            </Form>
          </ConfigProvider>
        </Card>
      </Col>
      <Col span={24}></Col>
    </Row>
  );
}
