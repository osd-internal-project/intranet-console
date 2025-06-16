import React from "react";
import { Button, Row, Col, Form, Input, Divider, Select, DatePicker, FormInstance } from "antd";
import { MaCarBookType, MaCarType, ProvincesType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarServices } from "../../../../services/ma-car.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

interface props {
  formUser: FormInstance<MaCarBookType>;
  createMaCarBook: (e: MaCarBookType) => void;
  carName: MaCarType[];
  dataoptionsProvinces: ProvincesType[];
  disabledDate: RangePickerProps["disabledDate"];
  submitLoading: boolean;
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
}

export const CarBookForm: React.FC<props> = ({
  formUser,
  createMaCarBook,
  carName,
  dataoptionsProvinces,
  disabledDate,
  submitLoading,
  setStartDate,
  setEndDate,
}) => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const macarervices = MaCarServices(baseUrIntranet);
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const startDate = date.startOf("day");
      setStartDate(startDate);
    }
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const endDate = date.endOf("day");
      setEndDate(endDate);
    }
  };

  const validateCarSelect = async (rule: any, value: string) => {
    const dataCar = await macarervices.getMaCarById(value);
    if (dataCar.status === false) {
      throw new Error("ขณะนี้รถมีการใช้งานอยู่");
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
                options={carName.map((car, index) => {
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
              <Select allowClear placeholder={`เลือกจังหวัด`} options={dataoptionsProvinces} showSearch optionFilterProp="label" />
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
                onChange={handleStartDateChange}
                disabledDate={disabledDate}
                placeholder="เลือกวันที่เริ่มการจอง"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="carBookEndDate" label="วันที่สิ้นสุดการจอง" rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุดการจอง" }]}>
              <DatePicker
                onChange={handleEndDateChange}
                placeholder="เลือกวันที่สิ้นสุดการจอง"
                disabledDate={disabledDate}
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
            <Button type="primary" htmlType="submit" loading={submitLoading} size="middle">
              {`ทำการจองรถ`}
            </Button>
          </Form.Item>
        </Col>
      </Form>
    </>
  );
};
