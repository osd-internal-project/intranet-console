import React from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Divider,
  Select,
  DatePicker,
  FormInstance,
} from "antd";
import { MaCarBookType, MaCarType, ProvincesType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
import { RangePickerProps } from "antd/es/date-picker";

interface props {
  formUser: FormInstance<MaCarBookType>;
  createMaCarBook: (e: MaCarBookType) => void;
  carName: MaCarType[];
  dataoptionsProvinces: ProvincesType[];
  disabledDate: RangePickerProps["disabledDate"];
  submitLoading: boolean;
}

export const CarBookForm: React.FC<props> = ({
  formUser,
  createMaCarBook,
  carName,
  dataoptionsProvinces,
  disabledDate,
  submitLoading,
}) => {
  return (
    <>
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
    </>
  );
};
