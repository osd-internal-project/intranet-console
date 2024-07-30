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
  InputNumber,
} from "antd";
import { MaCarBookServices } from "../services/ma-car-book.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MaCarType, MaCarBookType } from "../../common/index";

export interface props {
  maCarData: MaCarType[];

  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MaCarBook: React.FC<props> = ({
  maCarData,
  setLoading,
}: any): React.ReactElement => {
  const router = useRouter();
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [carName, setCarName] = useState<MaCarType[]>([]);

  const [form] = Form.useForm();

  const checkMaCarBookConflict = async (
    carName: string,
    carBookStartDate: Date,
    carBookEndDate: Date
  ) => {
    const userIdData = session?.user.userId;

    const existingMa = await maCarBookServices.getMaCarBookQuery(userIdData);

    return existingMa.some((ma: any) => {
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

  const createMaCarBook: FormProps<MaCarBookType>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);
    const carSelected = [...maCarData]
      .reverse()
      .find((car) => car.carId === values.carId);

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
      carBookApprovedStatus: "Process",
      remark: values.remark || null,
    };

    try {
      const conflict = await checkMaCarBookConflict(
        carSelected?.carName ? carSelected?.carName : "",
        carBookStartDate,
        carBookEndDate
      );

      if (carSelected?.carBookApprovedStatus === "Process") {
        if (conflict) {
          message.error(
            "รถนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่."
          );
          setSubmitLoading(false);
          return;
        }
      }

      const maCarBook = await maCarBookServices.createMaCarBook(data);
      if (maCarBook) {
        message.success("จองรถสำเร็จ");
        form.resetFields();
        router.push("/page/macar/ma-car");
      } else {
        message.error("จองรถไม่สำเร็จ");
      }

      setSubmitLoading(false);
    } catch (error) {
      message.error("จองรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  const { TextArea } = Input;

  const onFinishFailed: FormProps<MaCarBookType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const maCarBookName = () => {
    const createdByName = `${session?.user.firstNameTh || ""} ${
      session?.user.lastNameTh || ""
    }`;
    return createdByName;
  };

  useEffect(() => {
    if (maCarData) {
      setCarName(maCarData);
    }
    form.setFieldsValue({
      createdByName: maCarBookName(),
    });
  }, [maCarData]);

  return (
    <Form
      form={form}
      layout="vertical"
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
          <Form.Item<MaCarBookType>
            name="carId"
            label="ชื่อรถ"
            rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
          >
            <Select placeholder="โปรดเลือกรถ" style={{ width: "100%" }}>
              {carName.map((car, index) => (
                <Select.Option key={index} value={car.carId}>
                  {car.carName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<MaCarBookType>
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
          <Form.Item<MaCarBookType>
            name="carBookPlace"
            label="สถานที่ไป"
            rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
          >
            <Input placeholder="กรอกสถานที่ไป" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<MaCarBookType>
            name="carBookProvince"
            label="จังหวัด"
            rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
          >
            <Input placeholder="กรอกจังหวัด" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<MaCarBookType>
            name="carBookUsers"
            label="จำนวนผู้ใช้"
            rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="กรอกจำนวนผู้ใช้"
              max={12}
              min={1}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item<MaCarBookType>
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
