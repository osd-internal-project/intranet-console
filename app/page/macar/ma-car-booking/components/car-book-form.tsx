import React from "react";
import { Button, Row, Col, Form, Input, Divider, Select, DatePicker, FormInstance } from "antd";
import { MaCarBookType, MaCarType, ProvincesType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
import { RangePickerProps } from "antd/es/date-picker";
import { MaCarServices } from "../../../../services/ma-car.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

interface props {
  formUser: FormInstance<MaCarBookType>;
  createMaCarBook: (e: MaCarBookType) => void;
  maCarData: MaCarType[];
  masterDataProvinces: ProvincesType[];
  disabledDate: RangePickerProps["disabledDate"];
}

export const CarBookForm: React.FC<props> = ({ formUser, createMaCarBook, maCarData, masterDataProvinces, disabledDate }) => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const macarervices = MaCarServices(baseUrIntranet);

  const validateCarSelect = async (rule: any, value: string) => {
    const dataCar = await macarervices.getMaCarById(value);
    if (dataCar.status === false) {
      throw new Error("รถคันนี้ไม่พร้อมใช้งาน");
    }
  };

  return (
    <>
      <Form form={formUser} layout="vertical" onFinish={createMaCarBook} size="small">
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
              rules={[{ required: true, message: "กรุณาเลือกรถ" }, { validator: validateCarSelect }]}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="โปรดเลือกรถ"
                style={{ width: "100%" }}
                options={maCarData.map((car, index) => {
                  return { value: car.carId, label: car.carName, key: index };
                })}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType>
              name="carBookTitle"
              label="วัตถุประสงค์การใช้งาน"
              rules={[{ required: true, message: "กรุณากรอกวัตถุประสงค์การใช้งาน" }]}>
              <Input placeholder="กรอกวัตถุประสงค์การใช้งาน" showCount maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookPlace" label="สถานที่ไป" rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}>
              <Input.TextArea placeholder="กรอกสถานที่ไป" showCount maxLength={250} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="idProvinces" label="จังหวัด" rules={[{ required: true, message: "กรุณาเลือกจังหวัด" }]}>
              <Select allowClear placeholder={`เลือกจังหวัด`} options={masterDataProvinces} showSearch optionFilterProp="label" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookUsers" label="จำนวนผู้ใช้" rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}>
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
              rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มการจอง" }]}>
              <DatePicker
                disabledDate={disabledDate}
                placeholder="เลือกวันที่เริ่มการจอง"
                showTime
                style={{ width: "100%" }}
                format={"YYYY-MM-DD HH:mm"}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="carBookEndDate" label="วันที่สิ้นสุดการจอง" rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุดการจอง" }]}>
              <DatePicker
                placeholder="เลือกวันที่สิ้นสุดการจอง"
                disabledDate={disabledDate}
                showTime
                format={"YYYY-MM-DD HH:mm"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="detail" label="รายละเอียด">
              <TextArea placeholder="กรอกรายละเอียด" rows={2} showCount maxLength={250} />
            </Form.Item>
          </Col>
        </Row>
        <Col span={24} style={{ textAlign: "center" }}>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="middle">
              {`ทำการจองรถ`}
            </Button>
          </Form.Item>
        </Col>
      </Form>
    </>
  );
};
