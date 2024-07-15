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
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";

interface MaCarType {
  id: string; // รหัส
  carId: string; // รหัสรถ
  carName: string; // ชื่อรถ
  carPetrol: string; // ระดับน้ำมัน
  detail: string; // รายละเอียด
  remark: string; //
  status: string; // สถานะ
  createdAt: Date; // วันที่สร้าง
  createdById: string; // รหัสผู้สร้าง
  createdByName: string; // ชื่อผู้สร้าง
  updatedAt: Date; // วันที่แก้ไขล่าสุด
  updatedById: string; // รหัสผู้แก้ไข
  updatedByName: string; // ชื่อผู้แก้ไข
  carBookProvince: string; // จังหวัดที่จองรถ
  carBookPlace: string; // สถานที่จองรถ
  carBookUsers: number; // จำนวนผู้ใช้ที่จองรถ
  carBookStartDate: Date; // วันที่เริ่มการจองรถ
  carBookEndDate: Date; // วันที่สิ้นสุดการจองรถ
  carBookTitle: string;
  // carBookStartDate: string; // วันที่เริ่มการจองรถ   71,91
  // carBookEndDate: string; // วันที่สิ้นสุดการจองรถ
  carBookApprovedDate?: Date; // วันที่อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
  carBookApprovedById?: string; // รหัสผู้อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
  carBookApprovedByName?: string; // ชื่อผู้อนุมัติการจองรถ (อาจจะไม่มีในกรณีที่ยังไม่ได้อนุมัติ)
}

const MaCarBook: React.FC = () => {
  const { data: session } = useSession();
  // const [isModaMa, setIsModaMa] = useState(false);
  const intraAuth = useAxiosIntranet();
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [form] = Form.useForm();
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const checkMaCarBookConflict = async (
    carName: string,
    carBookStartDate: Date,
    carBookEndDate: Date
  ) => {
    const existingMa = await maCarBookServices.getMaCarQuery();
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
    console.log(values);

    const carSelected = maCarData.findLast((car) => car.carId === values.carId);

    setSubmitLoading(true);
    const carName = values.carName as string;
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
      // carName: values.carName,
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
        // carName,
        carBookStartDate,
        carBookEndDate
      );
      if (conflict) {
        message.error(
          "ห้องนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่."
        );
        setSubmitLoading(false);
        return;
      }

      const maCarBook = await maCarBookServices.createMaCarBook(data);
      console.log(maCarBook);
      if (maCarBook) {
        message.success("จองห้องสำเร็จ");
        form.resetFields();
        // setIsModalma(false);
      } else {
        message.error("จองห้องไม่สำเร็จ");
      }
      setSubmitLoading(false);
      fetchData();
    } catch (error) {
      message.error("จองห้องไม่สำเร็จ");
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
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
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
    if (loading === true) fetchData();
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
      <Col span={24}></Col>
      <Col span={24}>
        <Divider orientation="left">ข้อมูลผู้จอง</Divider>
      </Col>
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

      <Col span={24}>
        <Divider orientation="left">ข้อมูลการจองรถ</Divider>
      </Col>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item<MaCarType>
            name="carId"
            label="ชื่อรถ"
            rules={[{ required: true, message: "กรุณากรอกชื่อรถ" }]}
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
