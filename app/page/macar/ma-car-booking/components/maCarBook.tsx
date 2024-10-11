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
} from "antd";
import { MaCarBookServices } from "../services/ma-car-book.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MaCarType, MaCarBookType, ProvincesType } from "../../common/index";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
export interface props {
  maCarData: MaCarType[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dataoptionsProvinces: ProvincesType[];
}

const MaCarBook: React.FC<props> = ({
  maCarData,
  setLoading,
  dataoptionsProvinces,
}: any): React.ReactElement => {
  const router = useRouter();
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [carName, setCarName] = useState<MaCarType[]>([]);
  const [formUser] = Form.useForm();
  const { TextArea } = Input;

  useEffect(() => {
    if (maCarData) {
      setCarName(maCarData);
    }
    formUser.setFieldsValue({
      userName: `${session?.user.firstNameTh || ""} ${
        session?.user.lastNameTh || ""
      }`,
      phoneNumber: session?.user.phoneNumber,
    });
  }, [maCarData]);

  const checkMaCarBookConflict = async (
    carName: string,
    carBookStartDate: Date,
    carBookEndDate: Date
  ) => {
    const existingMa = await maCarBookServices.getMaCarBookCheck();

    return existingMa.some((record: any) => {
      return (
        record.carName === carName &&
        ((new Date(carBookStartDate) >= new Date(record.carBookStartDate) &&
          new Date(carBookStartDate) < new Date(record.carBookEndDate)) ||
          (new Date(carBookEndDate) > new Date(record.carBookStartDate) &&
            new Date(carBookEndDate) <= new Date(record.carBookEndDate)) ||
          (new Date(carBookStartDate) <= new Date(record.carBookStartDate) &&
            new Date(carBookEndDate) >= new Date(record.carBookEndDate)))
      );
    });
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };
  const createMaCarBook: FormProps<MaCarBookType>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);
    const carSelected = [...maCarData]
      .reverse()
      .find((car): car is any => car.carId === values.carId);
    if (carSelected.status === false) {
      message.warning("รถคันนี้ไม่พร้อมใช้งาน");
      setSubmitLoading(false);
      return;
    }
    const carBookStartDate = values.carBookStartDate as Date;
    const carBookEndDate = values.carBookEndDate as Date;
    const today = new Date();
    if (new Date(carBookStartDate) < today) {
      message.error("ไม่สามารถจองในวันที่ผ่านมาได้");
      setSubmitLoading(false);
      return;
    }
    const selectedOptionProvinces = dataoptionsProvinces.find(
      (option: ProvincesType) => option.value === values.idProvinces
    );
    if (new Date(carBookEndDate) < new Date(carBookStartDate)) {
      message.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
      setSubmitLoading(false);
      return;
    }
    const data = {
      carId: values.carId,
      carName: carSelected?.carName,
      createdById: session?.user.userId,
      createdByName: `${session?.user.firstNameTh || ""} ${
        session?.user.lastNameTh || ""
      }`,
      carBookProvince: selectedOptionProvinces
        ? selectedOptionProvinces.label
        : undefined,
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
      if (carSelected) {
        const hasProcessStatus = carSelected.maCarBook.some(
          (item: MaCarBookType) =>
            item.carBookApprovedStatus === "Process" ||
            item.carBookApprovedStatus === "Approve"
        );
        if (hasProcessStatus) {
          const conflict = await checkMaCarBookConflict(
            carSelected.carName || "",
            carBookStartDate,
            carBookEndDate
          );
          if (conflict) {
            message.error("รถคันนี้มีการจองในช่วงเวลาที่คุณเลือกแล้ว !");
            setSubmitLoading(false);
            return;
          }
        }
        if (hasProcessStatus) {
          const conflict = await checkMaCarBookConflict(
            carSelected.carName || "",
            carBookStartDate,
            carBookEndDate
          );
          if (conflict) {
            message.error(
              "รถนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่."
            );
            setSubmitLoading(false);
            return;
          }
        }
      }
      const maCarBook = await maCarBookServices.createMaCarBook(data);
      if (maCarBook) {
        message.success("จองรถสำเร็จ");
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

  return (
    <Form
      form={formUser}
      layout="vertical"
      onFinish={createMaCarBook}
      size="small"
    >
      <Divider orientation="left">ข้อมูลผู้จอง</Divider>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item name="userName" label="ชื่อผู้จอง">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="phoneNumber" label="เบอร์โทรศัทร์">
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">ข้อมูลการจองรถ</Divider>

      <Row gutter={24}>
        <Col span={6}>
          <Form.Item<MaCarBookType>
            name="carId"
            label="ชื่อรถ"
            rules={[{ required: true, message: "กรุณาเลือกรถ" }]}
          >
            <Select placeholder="โปรดเลือกรถ" style={{ width: "100%" }}>
              {carName.map((car, index) => (
                <Select.Option
                  key={index}
                  value={car.carId}
                  showSearch
                  optionFilterProp="label"
                >
                  {car.carName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
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
        <Col span={6}>
          <Form.Item<MaCarBookType>
            name="carBookPlace"
            label="สถานที่ไป"
            rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
          >
            <Input placeholder="กรอกสถานที่ไป" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<MaCarBookType>
            name="idProvinces"
            label="จังหวัด"
            rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
          >
            <Select
              placeholder={`กรอกจังหวัด`}
              options={dataoptionsProvinces}
              allowClear
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item<MaCarBookType>
            name="carBookUsers"
            label="จำนวนผู้ใช้"
            rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
          >
            <Input
              placeholder="กรอกจำนวนผู้ใช้"
              maxLength={2}
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                  event.preventDefault();
                }
              }}
              suffix={<span>คน</span>}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item<MaCarBookType>
            name="carBookStartDate"
            label="วันที่เริ่มการจอง"
            rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มจอง!" }]}
          >
            <DatePicker
              placeholder="กรอกวันที่เริ่มการจอง"
              showTime
              disabledDate={disabledDate}
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="carBookEndDate"
            label="วันที่สิ้นสุดการจอง"
            rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด" }]}
          >
            <DatePicker
              placeholder="กรอกวันที่สิ้นสุดการจอง"
              showTime
              disabledDate={disabledDate}
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name="detail" label="รายละเอียด">
            <TextArea placeholder="กรอกรายละเอียด" rows={2} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="remark" label="หมายเหตุการจองรถ">
            <TextArea placeholder="หมายเหตุการจองรถ" />
          </Form.Item>
        </Col>
      </Row>
      <Col span={24} style={{ textAlign: "center" }}>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitLoading}
            size="middle"
          >
            ทำการจองรถ
          </Button>
        </Form.Item>
      </Col>
    </Form>
  );
};

export default MaCarBook;
