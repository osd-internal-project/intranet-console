import React from "react";

import { Button, Row, Col, Form, Input, Divider, Select, InputNumber, DatePicker, FormInstance } from "antd";
import { MaCarBookType, MaCarType, ProvincesType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
import { dateFormatTime } from "@/app/utils";

interface props {
  form: FormInstance<MaCarBookType>;
  updatedMaCarBook: (values: MaCarBookType) => void;
  editState: boolean;
  isSelectDisabled: (status: string) => boolean;
  carBookApprovedStatus: any;
  maCarData: MaCarType[];
  dataProvinces: ProvincesType[];
  handleEditMaCancel: () => void;
  submitLoading: boolean;
}

export const CarForm: React.FC<props> = ({
  form,
  updatedMaCarBook,
  editState,
  isSelectDisabled,
  carBookApprovedStatus,
  maCarData,
  dataProvinces,
  handleEditMaCancel,
  submitLoading,
}) => {
  return (
    <>
      <Form form={form} layout="vertical" name="editMaCarBook" onFinish={updatedMaCarBook} autoComplete="off" size="small">
        <Divider orientation="left">ข้อมูลผู้จอง</Divider>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="createdByName" label="ชื่อผู้จอง :">
              <Input className={"read-only-input"} />
            </Form.Item>
          </Col>
          <Divider orientation="left">ข้อมูลการจองรถ</Divider>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carId" label="ชื่อรถ :" rules={[{ required: editState, message: "กรุณาเลือกรถ" }]}>
              <Select placeholder="โปรดเลือกรถ" style={{ width: "100%" }} disabled={true}>
                {maCarData.map((car: any, index: number) => (
                  <Select.Option key={index} value={car.carId} allowClear showSearch optionFilterProp="label">
                    {car.carName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType>
              name="carBookTitle"
              label="วัตถุประสงค์การใช้งาน :"
              rules={[
                {
                  required: !editState,
                  message: "กรุณากรอกวัตถุประสงค์การใช้งาน",
                },
              ]}>
              <Input placeholder="กรอกวัตถุประสงค์การใช้งาน" showCount maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookPlace" label="สถานที่ไป :" rules={[{ required: !editState, message: "กรุณากรอกสถานที่ไป" }]}>
              <Input.TextArea
                placeholder="กรอกสถานที่ไป"
                disabled={isSelectDisabled(carBookApprovedStatus)}
                className={editState ? "read-only-input" : ""}
                showCount
                maxLength={250}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookProvince" label="จังหวัด :" rules={[{ required: !editState, message: "กรุณาเลือกจังหวัด" }]}>
              <Select placeholder={`เลือกจังหวัด`} options={dataProvinces} allowClear showSearch optionFilterProp="label" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookUsers" label="จำนวนผู้ใช้ :" rules={[{ required: !editState, message: "กรุณากรอกจำนวนผู้ใช้" }]}>
              <InputNumber style={{ width: "100%" }} placeholder="กรอกจำนวนผู้ใช้" min={1} max={12} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="carBookStartDate" label="วันที่เริ่มการจอง :">
              <DatePicker
                disabled={!editState}
                format={dateFormatTime(form.getFieldValue("carBookStartDate"))}
                placeholder="เลือกวันที่เริ่มการจอง :"
                style={{ width: "100%" }}
                className={editState ? "read-only-input" : ""}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="carBookEndDate" label="วันที่สิ้นสุดการจอง :">
              <DatePicker
                disabled={!editState}
                format={dateFormatTime(form.getFieldValue("carBookEndDate"))}
                placeholder="กรอกวันที่สิ้นสุดการจอง :"
                style={{ width: "100%" }}
                className={editState ? "read-only-input" : ""}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="detail" label="รายละเอียด :">
              <TextArea
                placeholder={!editState ? "กรอกรายละเอียด" : ""}
                rows={2}
                disabled={isSelectDisabled(carBookApprovedStatus)}
                className={editState ? "read-only-input" : ""}
                showCount
                maxLength={250}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="remark" label="หมายเหตุการจองรถ :">
              <TextArea
                placeholder={!editState ? "กรอกหมายเหตุการจองรถ" : ""}
                rows={2}
                disabled={isSelectDisabled(carBookApprovedStatus)}
                className={editState ? "read-only-input" : ""}
                showCount
                maxLength={250}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Row justify="end" gutter={16}>
            {!editState && (
              <>
                <Button type="default" onClick={handleEditMaCancel} style={{ marginRight: "16px" }}>
                  ยกเลิก
                </Button>
                <Button type="primary" htmlType="submit" loading={submitLoading}>
                  ตกลง
                </Button>
              </>
            )}
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};
