import React from "react";
import { Row, Col, Form, Input, Divider, ConfigProvider, Select, InputNumber, DatePicker, FormInstance } from "antd";
import { MaCarBookType, MaCarType } from "../../common/index";
import TextArea from "antd/es/input/TextArea";
import "../../common/style.css";
import { dateFormatTime } from "@/app/utils";

interface props {
  formBookData: FormInstance<MaCarBookType>;
  statusApprove: any;
}

export const CarReturnForm: React.FC<props> = ({ formBookData, statusApprove }) => {
  return (
    <>
      <Form form={formBookData} layout="vertical" initialValues={{ remember: true }} autoComplete="off" size="small">
        <Divider orientation="left">ข้อมูลผู้จอง</Divider>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item<MaCarType> name="createdByName" label="ชื่อผู้จอง :">
              <Input disabled className={"read-only-input"} />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">ข้อมูลการจองรถ</Divider>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Form.Item name="carName" label="ชื่อรถ :">
              <Input disabled className="read-only-input" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookTitle" label="วัตถุประสงค์การใช้งาน :">
              <Input disabled className="read-only-input" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookPlace" label="สถานที่ไป :">
              <Input.TextArea  disabled className="read-only-input" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookProvince" label="จังหวัด :">
              <Input disabled className="read-only-input" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item<MaCarBookType> name="carBookUsers" label="จำนวนผู้ใช้ :">
              <Input disabled className="read-only-input" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="carBookStartDate" label="วันที่เริ่มการจอง :">
              <DatePicker
                className="read-only-input"
                format={dateFormatTime(formBookData.getFieldValue("carBookStartDate"))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="carBookEndDate" label="วันที่สิ้นสุดการจอง :">
              <DatePicker
                className="read-only-input"
                format={dateFormatTime(formBookData.getFieldValue("carBookEndDate"))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={9}>
            <Form.Item name="detail" label="รายละเอียด :">
              <TextArea disabled rows={1} className="read-only-input" />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item name="remark" label="หมายเหตุการจองรถ :">
              <TextArea disabled rows={1} className="read-only-input" />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">ข้อมูลสถานะการจองรถ</Divider>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="statusApprove" label="สถานะการจองรถ :">
              <Input disabled className="read-only-input" />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item name="remarkApproved" label="หมายเหตุการไม่อนุมัติการจองรถ :">
              <TextArea disabled rows={1} className="read-only-input" />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item name="remarkCancel" label="หมายเหตุการยกเลิก :">
              <TextArea disabled rows={1} className="read-only-input" />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">ข้อมูลการคืนรถ</Divider>
        {(statusApprove === "Return" || statusApprove === "Completed") && (
          <>
            <Row gutter={24}>
              <Col span={8}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgContainerDisabled: "#fff",
                      colorTextDisabled: "#000",
                    },
                    components: {
                      Select: { colorBorder: "#fff" },
                    },
                  }}>
                  <Form.Item<MaCarType> name="status" label="สถานนะรถ :">
                    <Select className="read-only-input">
                      <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                      <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
                    </Select>
                  </Form.Item>
                </ConfigProvider>
              </Col>
              <Col span={8}>
                <Form.Item name="carMile" label="เลขไมล์รถ :">
                  <InputNumber disabled style={{ width: "100%" }} className="read-only-input" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgContainerDisabled: "#fff",
                      colorTextDisabled: "#000",
                    },
                    components: {
                      Select: { colorBorder: "#fff" },
                    },
                  }}>
                  <Form.Item name="carPetrol" label="ระดับนํ้ามันรถ :">
                    <Select className="read-only-input">
                      <Select.Option value="high">มาก</Select.Option>
                      <Select.Option value="medium">ปานกลาง</Select.Option>
                      <Select.Option value="low">น้อย</Select.Option>
                    </Select>
                  </Form.Item>
                </ConfigProvider>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="returnNotifAt" label="วันที่แจ้งคืน :">
                  <DatePicker
                    className="read-only-input"
                    format={dateFormatTime(formBookData.getFieldValue("returnNotifAt"))}
                    placeholder="รออนุมัติรับคืนรถ"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgContainerDisabled: "#fff",
                      colorTextDisabled: "#000",
                    },
                    components: {
                      Select: { colorBorder: "#fff" },
                    },
                  }}>
                  <Form.Item name="carBookApprovedStatus" label="สถานนะการคืนรถ :">
                    <Select placeholder="รออนุมัติรับคืนรถ" className="read-only-input">
                      <Select.Option value="Process">กำลังรออนุมัติ</Select.Option>
                      <Select.Option value="Approve">อนุมัติแล้ว</Select.Option>
                      <Select.Option value="Cancel">ยกเลิกการจอง</Select.Option>
                      <Select.Option value="Return">แจ้งคืนรถแล้ว</Select.Option>
                      <Select.Option value="Completed">คืนรถสำเร็จ</Select.Option>
                    </Select>
                  </Form.Item>
                </ConfigProvider>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="recipientName" label="ผู้รับคืนรถ :">
                  <Input disabled className="read-only-input" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="returnAt" label="วันที่รับคืน :">
                  <DatePicker className="read-only-input" format={dateFormatTime(formBookData.getFieldValue("returnAt"))} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </>
  );
};
