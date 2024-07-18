"use client";

import React, { useState, useEffect } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import {
  Col,
  Row,
  Button,
  message,
  Form,
  Input,
  FormProps,
  Divider,
  Select,
  DatePicker,
  TablePaginationConfig,
} from "antd";
import { MaCarBookServices } from "../services/ma-car-book.service";
import { useSession } from "next-auth/react";

interface MaCarType {
  id: string;
  carId: string;
  carName: string;
  carPetrol: string;
  detail: string;
  remark: string;
  status: string;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  carBookProvince: string;
  carBookPlace: string;
  carBookUsers: number;
  carBookStartDate: Date;
  carBookEndDate: Date;
  carBookTitle: string;
  carBookApprovedDate?: Date;
  carBookApprovedById?: string;
  carBookApprovedByName?: string;
}

const MaCarBook: React.FC = () => {
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [form] = Form.useForm();
  const [loading, setloading] = useState<boolean>(true);

  const checkMaCarBookConflict = async (
    carName: string,
    carBookStartDate: Date,
    carBookEndDate: Date
  ) => {
    const userIdData = session?.user.userId;

    const existingMa = await maCarBookServices.getMaCarBookQuery(userIdData);
    console.log(existingMa);
    return existingMa.some((ma: any) => {
      console.log(ma);
      return (
        ma.carName === carName &&
        ((new Date(carBookStartDate) >= new Date(ma.carBookStartDate) &&
          new Date(carBookStartDate) < new Date(ma.carBookEndDate)) ||
          (new Date(carBookEndDate) > new Date(ma.carBookStartDate) &&
            new Date(carBookEndDate) <= new Date(ma.carBookEndDate)) ||
          (new Date(carBookStartDate) <= new Date(ma.carBookStartDate) &&
            new Date(carBookEndDate) >= new Date(ma.carBookEndDate)))
      );
    });
  };

  const createMaCarBook: FormProps<MaCarType>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    const carSelected = maCarData.findLast((car) => car.carId === values.carId);
    const carBookStartDate = values.carBookStartDate as Date;
    const carBookEndDate = values.carBookEndDate as Date;
    const today = new Date();
    if (new Date(carBookStartDate) < today) {
      message.error("ไม่สามารถจองในวันที่ผ่านมาได้");
      setSubmitLoading(false);
      return;
    }
    if (new Date(carBookStartDate) < new Date(carBookStartDate)) {
      message.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
      setSubmitLoading(false);
      return;
    }

    const data = {
      carId: values.carId,
      carName: carSelected?.carName,
      createdById: session?.user.userId,
      createdByName: values.createdByName,
      carBookProvince: values.carBookProvince,
      carBookPlace: values.carBookPlace,
      carBookUsers: Number(values.carBookUsers),
      carBookStartDate: values.carBookStartDate,
      carBookEndDate: values.carBookEndDate,
      detail: values.detail,
      carBookTitle: values.carBookTitle,
      carBookApprovedStatus: "process",
      remark: values.remark || null,
    };
    try {
      const conflict = await checkMaCarBookConflict(
        carSelected?.carName ? carSelected?.carName : "",
        carBookStartDate,
        carBookEndDate
      );
      console.log(conflict);

      if (conflict) {
        message.error(
          "รถนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่."
        );
        setSubmitLoading(false);
        return;
      }

      const maCarBook = await maCarBookServices.createMaCarBook(data);
      if (maCarBook) {
        message.success("จองรถสำเร็จ");
        form.resetFields();
      } else {
        message.error("จองรถไม่สำเร็จ");
      }

      setSubmitLoading(false);
      fetchData();
    } catch (error) {
      message.error("จองรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
  };

  const { TextArea } = Input;

  const onFinishFailed: FormProps<MaCarType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const fetchData = async () => {
    form.setFieldsValue({
      createdByName: `${session?.user.firstNameTh || ""} ${
        session?.user.lastNameTh || ""
      }`,
    });

    try {
      const maCar = await maCarBookServices.getMaCarQuery();
      setMaCarData(maCar);

      setloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ remember: true }}
      onFinish={createMaCarBook}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Divider orientation="left">ข้อมูลผู้จอง</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item<MaCarType>
            name="createdByName"
            label="ชื่อผู้จอง"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้จอง" }]}
          >
            <Input disabled placeholder="กรอกชื่อผู้จอง" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">ข้อมูลการจองรถ</Divider>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item<MaCarType>
            name="carId"
            label="ชื่อรถ"
            rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
          >
            <Select placeholder="โปรดเลือกรถ" style={{ width: "100%" }}>
              {maCarData.map((car, index) => (
                <Select.Option key={index} value={car.carId}>
                  {car.carName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<MaCarType>
            name="carBookTitle"
            label="วัตถุประสงค์การใช้งาน"
            rules={[
              { required: true, message: "กรุณากรอกวัตถุประสงค์การใช้งาน" },
            ]}
          >
            <Input placeholder="กรอกวัตถุประสงค์การใช้งาน" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<MaCarType>
            name="carBookPlace"
            label="สถานที่ไป"
            rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
          >
            <Input placeholder="กรอกสถานที่ไป" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<MaCarType>
            name="carBookProvince"
            label="จังหวัด"
            rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
          >
            <Input placeholder="กรอกจังหวัด" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<MaCarType>
            name="carBookUsers"
            label="จำนวนผู้ใช้"
            rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
          >
            <Input placeholder="กรอกจำนวนผู้ใช้" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item<MaCarType>
            name="carBookStartDate"
            label="วันที่เริ่มการจอง"
            rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" }]}
          >
            <DatePicker
              placeholder="กรอกวันที่เริ่มการจอง"
              showTime
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="carBookEndDate"
            label="วันที่สิ้นสุดการจอง"
            rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด" }]}
          >
            <DatePicker
              placeholder="กรอกวันที่สิ้นสุดการจอง"
              showTime
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={16}>
          <Form.Item name="detail" label="รายยละเอียด">
            <TextArea placeholder="กรอกรายยละเอียด" rows={2} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="remark" label="หมายเหตุ">
            <Input placeholder="กรอกหมายเหตุ" />
          </Form.Item>
        </Col>
      </Row>
      <Col span={24} style={{ textAlign: "center" }}>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            ทำการจองรถ
          </Button>
        </Form.Item>
      </Col>
    </Form>
  );
};

export default MaCarBook;
