"use client";
import { Breadcrumb, Button, Card, Checkbox, Col, ConfigProvider, DatePicker, Divider, Form, Input, Modal, Row, Select } from "antd";
import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import LeaveManagementServices from "../../../services/leave-management.service";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { OvertimeShowDetail } from "./components/overtime-show-detail";
import OverTimeServices from "@/app/services/overtime.service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { MaCarServices } from "@/app/services/ma-car.service";
import { notifySuccess } from "@/app/utils/message";
dayjs.locale("th");

export default function OverTimePage() {
  const [createForm] = useForm();
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date") as string;
  const { user } = useContext(UserContext) as UserContectType;
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [loading, setLoading] = useState<boolean>(true);
  const [getHeader, setHeader] = useState<any[]>([]);
  const [getStartTime, setStartTime] = useState<number>(18);
  const [getEndTime, setEndTime] = useState<number>(19);
  const [getCar, setCar] = useState<any[]>([]);
  const [getcarName, setCarName] = useState<string>("");
  const [getSelectCar, setSelectCar] = useState<boolean>(false);
  const [getTime, setTime] = useState<{ value: string; label: string; key: string }[]>([]);

  useEffect(() => {
    if (user && loading) {
      const parsedDate = date && dayjs(date).isValid() ? dayjs(date).startOf("day") : dayjs().startOf("day");
      createForm.setFieldsValue({
        startDate: parsedDate,
        startTime: "18:00",
        endTime: "19:00",
        fullname: `${user.firstNameTh} ${user.lastNameTh}`,
        phoneNumber: user.phoneNumber,
        positionName: user.masterPosition.nameEn,
      });
    }
    if (user && user.userId && loading) {
      fetchData();
    }
    TimeOptions();
  }, [user, loading]);

  useEffect(() => {
    if (getHeader.length > 0) {
      createForm.setFieldsValue({
        ownerGroupId: getHeader.map((user: any) => `คุณ ${user.firstNameTh} ${user.lastNameTh}`).join(" , "),
      });
    }
  }, [getHeader]);

  const fetchData = async () => {
    const HeaderGroup = await LeaveManagementServices(baseUrlIntranet).getHeader();
    setHeader(HeaderGroup);
    const resCar: any = await MaCarServices(baseUrlIntranet).getMaCarQuery();
    setCar(resCar);
    setLoading(false);
  };

  const handleStartTime = (value: string) => {
    let data;
    if (value) {
      data = value.split(":");
    }

    setStartTime(data ? (data[1][0] === "3" ? Number(data[0]) + 0.5 : Number(data[0])) : 18);
  };
  const handleEndTime = (value: string) => {
    let data;
    if (value) {
      data = value.split(":");
    }
    setEndTime(data ? (data[1][0] === "3" ? Number(data[0]) + 0.5 : Number(data[0])) : 19);
  };

  const onFinish = async (values: any) => {
    const res = {
      dateStart: dayjs(values.startDate).toISOString(),
      startTime: values.startTime,
      endTime: values.endTime,
      fullname: values.fullname,
      userId: user?.userId,
      customerName: values.customerName,
      detailWork: values.detailWork,
      partTimeType: values.partTimeType,
      phoneNumber: values.phoneNumber,
      checkTravelUpCountry: values.extension ? values.extension.includes("checkTravelUpCountry") : null,
      checkOvernight: values.extension ? values.extension.includes("checkOvernight") : null,
      checkTravelByCompanyCar: values.extension ? values.extension.includes("checkTravelByCompanyCar") : null,
      checkDistance: values.extension ? values.extension.includes("checkDistance") : null,
      ...(Array.isArray(values.extension) && values.extension.includes("checkTravelByCompanyCar") ? { carId: values?.carName } : null),
      ...(Array.isArray(values.extension) && values.extension.includes("checkTravelByCompanyCar") ? { carName: getcarName } : null),
    };

    Modal.confirm({
      title: "Do you want to create these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk: async () => {
        const resultCreate: any = await OverTimeServices(baseUrlIntranet).create(res);
        if (resultCreate.status === 200) {
          notifySuccess("overtime.create");
          setHeader([]);
          setStartTime(18);
          setEndTime(19);
          setCarName("");
          setSelectCar(false);
          navigate.push(`${window.location.origin}/page/overtime/overtime-calendar`);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleSelectCar = async (value: any) => {
    value.includes("checkTravelByCompanyCar") ? setSelectCar(true) : setSelectCar(false);
  };

  const handleUseCar = async (value: string) => {
    setCarName("");
    const data = getCar.find((events: any) => (events.carId = value));
    setCarName(data.carName);
  };

  const TimeOptions = () => {
    const timeOptions = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        const time = `${hour}:${minute}`;
        timeOptions.push({ value: time, label: time, key: time });
      }
    }
    setTime(timeOptions);
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
            }}
          >
            <Form layout="vertical" size="small" form={createForm} onFinish={onFinish}>
              <div className=" w-full grid  grid-cols-1 md:grid-cols-4 gap-2">
                <div className=" md:col-start-4">
                  <Form.Item label={"วันที่ทำรายการ"} name={"createDate"} initialValue={dayjs()}>
                    <DatePicker className=" w-full" disabled />
                  </Form.Item>
                </div>
                <div className="md:col-span-4 ">
                  <Form.Item
                    label={"เรียน"}
                    name={`ownerGroupId`}
                    initialValue={getHeader.map((user: any) => `คุณ ${user.firstNameTh} ${user.lastNameTh}`).join(" , ")}
                  >
                    <Input disabled multiple />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"ชื่อ - สกุล"} name={"fullname"}>
                    <Input disabled />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"ตำแหน่ง"} name={`positionName`}>
                    <Input disabled />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"เบอร์โทรศัพท์"} name={`phoneNumber`}>
                    <Input disabled />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"ประเภท"} name={`partTimeType`} rules={[{ required: true, message: "กรุณาเลือกประเภท" }]}>
                    <Select
                      placeholder={`Please Select`}
                      options={[
                        { value: "working", label: `ทำงาน` },
                        { value: "driving", label: "ขับรถ" },
                      ]}
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item name={"startDate"} label={"วันที่"} rules={[{ required: true, message: "กรุณาเลือกวันที่" }]}>
                    <DatePicker className=" w-full" />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item name={"startTime"} label={"เวลาเข้า"} rules={[{ required: true, message: "กรุณาเลือกเวลาเข้า" }]}>
                    <Select allowClear placeholder={`Please Select`} options={getTime} onChange={(value) => handleStartTime(value)} />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item name={"endTime"} label={"เวลาออก"} rules={[{ required: true, message: "กรุณาเลือกเวลาออก" }]}>
                    <Select allowClear placeholder={`Please Select`} options={getTime} onChange={(value) => handleEndTime(value)} />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label={"ชื่อลูกค้า"} name={`customerName`} rules={[{ required: true, message: "กรุณากรอกชื่อลูกค้า" }]}>
                    <Input />
                  </Form.Item>
                </div>
                <div className="  md:col-span-4 ">
                  <Form.Item label={"รายละเอียด"} name={`detailWork`}>
                    <TextArea />
                  </Form.Item>
                </div>
                <div className="  md:col-span-2 ">
                  <Form.Item name="extension" label={<div className="text-blue-600 font-bold">เพิ่มเติม</div>}>
                    <Checkbox.Group onChange={handleSelectCar}>
                      <div className="grid grid-cols-2">
                        <Checkbox value="checkTravelUpCountry" style={{ lineHeight: "32px" }}>
                          เดินทางต่างจังหวัด
                        </Checkbox>
                        <Checkbox value="checkOvernight" style={{ lineHeight: "32px" }}>
                          มีการค้างคืน
                        </Checkbox>
                        <Checkbox value="checkTravelByCompanyCar" style={{ lineHeight: "32px" }}>
                          เดินทางด้วยรถบริษัท
                        </Checkbox>
                        <Checkbox value="checkDistance" style={{ lineHeight: "32px" }}>
                          ระยะการเดินทางมากกว่า 350 กม.
                        </Checkbox>
                      </div>
                    </Checkbox.Group>
                  </Form.Item>
                </div>
                <div className="  md:col-span-2 ">
                  {getStartTime && getEndTime ? <OvertimeShowDetail getStartTime={getStartTime} getEndTime={getEndTime} /> : <></>}
                </div>
                <div className="  md:col-span-2 ">
                  {getSelectCar ? (
                    <Form.Item name={`carName`}>
                      <Select
                        placeholder={`Please Select`}
                        allowClear
                        onChange={handleUseCar}
                        options={getCar.map((event: any) => {
                          return { value: event.carId, label: event.carName };
                        })}
                      />
                    </Form.Item>
                  ) : null}
                </div>
                <div className=" col-span-4 flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      navigate.push(`${window.location.origin}/page/overtime/overtime-calendar`);
                      createForm.resetFields();
                    }}
                  >
                    Back
                  </Button>
                  <Button htmlType="submit" type="primary">
                    Create
                  </Button>
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
