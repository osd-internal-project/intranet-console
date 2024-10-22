import React from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Divider,
  InputNumber,
  DatePicker,
  FormInstance,
} from "antd";
import { MaCarBookType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
import { dateFormatTime } from "@/app/utils";

interface props {
  form: FormInstance<MaCarBookType>;
  onFinishApprove: (e: any) => void;
  onFinishFailed: (e: any) => void;
  setModalDisapProved: React.Dispatch<React.SetStateAction<boolean>>;
  carBookApprovedStatus: string;
  submitLoading: boolean;
}

export const CarApproveForm: React.FC<props> = ({
  form,
  onFinishApprove,
  onFinishFailed,
  setModalDisapProved,
  carBookApprovedStatus,
  submitLoading,
}) => {
  return (
    <>
      <Form
        form={form}
        onFinish={onFinishApprove}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        size="small"
        autoComplete="off"
      >
        <Divider orientation="left">ข้อมูลผู้จอง</Divider>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="createdByName" label="ชื่อผู้จอง">
              <Input disabled className="read-only-input" />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">ข้อมูลการจองรถ</Divider>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carName" label="ชื่อรถ :">
              <Input disabled className="read-only-input" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType>
              name="carBookTitle"
              label="วัตถุประสงค์การใช้งาน :"
            >
              <Input
                placeholder="กรอกวัตถุประสงค์การใช้งาน"
                disabled
                className="read-only-input"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookPlace" label="สถานที่ไป : ">
              <Input
                placeholder="กรอกสถานที่ไป"
                disabled
                className="read-only-input"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookProvince" label="จังหวัด :">
              <Input
                placeholder="กรอกจังหวัด"
                disabled
                className="read-only-input"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookUsers" label="จำนวนผู้ใช้ :">
              <InputNumber
                style={{ width: "100%" }}
                placeholder="กรอกจำนวนผู้ใช้"
                min={1}
                max={12}
                disabled
                className="read-only-input"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="carBookStartDate" label="วันที่เริ่มการจอง">
              <DatePicker
                className="read-only-input"
                format={dateFormatTime(form.getFieldValue("carBookStartDate"))}
                placeholder="กรอกวันที่เริ่มการจอง"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="carBookEndDate"
              label="วันที่สิ้นสุดการจอง"
              rules={[
                { required: true, message: "กรุณาเลือกวันที่สิ้นสุดการจอง!" },
              ]}
            >
              <DatePicker
                className="read-only-input"
                format={dateFormatTime(form.getFieldValue("carBookEndDate"))}
                placeholder="กรอกวันที่สิ้นสุดการจอง"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="detail" label="รายละเอียด">
              <TextArea
                placeholder="กรอกรายละเอียด"
                rows={2}
                className="read-only-input"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="remark" label="หมายเหตุการจองรถ">
              <TextArea
                placeholder="กรอกหมายเหตุการจองรถ"
                rows={2}
                className="read-only-input"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          {(carBookApprovedStatus === "Approve" ||
            carBookApprovedStatus === "Process") && (
            <Button
              type="default"
              onClick={() => setModalDisapProved(true)}
              loading={submitLoading}
              style={{ marginRight: "16px", marginTop: "16px" }}
            >
              ไม่อนุมัติ
            </Button>
          )}

          {carBookApprovedStatus === "Process" && (
            <Button
              type="primary"
              htmlType="submit"
              disabled={carBookApprovedStatus !== "Process"}
              loading={submitLoading}
              style={{ marginTop: "16px" }}
            >
              อนุมัติ
            </Button>
          )}
        </Row>
      </Form>
    </>
  );
};
