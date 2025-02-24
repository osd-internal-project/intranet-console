import { MaCarBookType } from "@/app/page/macar/common";
import { dateFormatTime } from "@/app/utils";
import { Button, Col, DatePicker, Divider, Form, FormInstance, Input, InputNumber, Modal, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";

interface props {
  form: FormInstance<MaCarBookType>;
  status: string;
  onFinish: (status: string, values: any) => void;
  closeModalFecthStatus: () => void;
  openModal: boolean;
  setCheckStatusApproved: (values: string) => void;
}

const ManagementCarBookingModal: React.FC<props> = ({ form, status, onFinish, openModal, closeModalFecthStatus, setCheckStatusApproved }) => {
  return (
    <div>
      <Modal width={900} title="การอนุมัติการจองรถ" open={openModal} onCancel={closeModalFecthStatus} footer={null}>
        <Form form={form} onFinish={(e) => onFinish(status, e)} layout="vertical" size="small" autoComplete="off">
          <Divider orientation="left">
            {status === "return"
              ? "ข้อมูลการคืนรถ"
              : status === "approved"
              ? "ข้อมูลการจองจอง"
              : status === "cancel"
              ? "ข้อมูลการยกเลิกการจองรถ"
              : "ข้อมูลการจอง"}
          </Divider>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<MaCarBookType> name="createdByName" label="ชื่อผู้จอง">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">ข้อมูลการจองรถ</Divider>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<MaCarBookType> name="carName" label="ชื่อรถ :">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarBookType> name="carBookTitle" label="วัตถุประสงค์การใช้งาน :">
                <Input placeholder="กรอกวัตถุประสงค์การใช้งาน" disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarBookType> name="carBookPlace" label="สถานที่ไป : ">
                <Input.TextArea placeholder="กรอกสถานที่ไป" disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<MaCarBookType> name="carBookProvince" label="จังหวัด :">
                <Input placeholder="กรอกจังหวัด" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<MaCarBookType> name="carBookUsers" label="จำนวนผู้ใช้ :">
                <InputNumber style={{ width: "100%" }} placeholder="กรอกจำนวนผู้ใช้" min={1} max={12} disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="carBookStartDate" label="วันที่เริ่มการจอง">
                <DatePicker disabled placeholder="เลือกวันที่เริ่มการจอง" style={{ width: "100%" }} format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="carBookEndDate" label="วันที่สิ้นสุดการจอง" rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มการจอง" }]}>
                <DatePicker disabled placeholder="กรอกวันที่สิ้นสุดการจอง" style={{ width: "100%" }} format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>
          </Row>
          {status === "return" ? (
            <>
              <Col span={12}>
                <Form.Item name="carMile" label="เลขไมล์รถ">
                  <InputNumber style={{ width: "100%" }} placeholder="กรอกเลขไมล์รถ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="ระดับน้ำมันรถ :" name="carPetrol">
                  <Select
                    placeholder="เลือกระดับน้ำมัน"
                    options={[
                      { value: "high", label: "มาก" },
                      { value: "medium", label: "ปานกลาง" },
                      { value: "low", label: "น้อย" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </>
          ) : null}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="detail" label="รายละเอียด">
                <TextArea placeholder="กรอกรายละเอียด" rows={2} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={status === "approved" ? "remark" : status === "cancel" ? "remarkCancel" : "remarkApproved"}
                label={status === "approved" ? "หมายเหตุการจองรถ" : status === "cancel" ? "หมายเหตุยกเลิกการจองรถ" : "หมายเหตุการไม่อนุมัติ"}
                rules={[
                  {
                    required: true,
                    message:
                      status === "approved"
                        ? "กรุณากรอกหมายเหตุการยกเลิก"
                        : status === "cancel"
                        ? "กรุณากรอกหมายเหตุการไม่อนุมัติ"
                        : "กรอกหมายเหตุการจองรถ",
                  },
                ]}>
                <TextArea placeholder="กรอกหมายเหตุการยกเลิก" disabled={status === "approved" ? true : false} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            {status === "approved" ? (
              <>
                <Button type="default" htmlType="submit" onClick={() => setCheckStatusApproved("disable")}>
                  {`ไม่อนุมัติ`}
                </Button>
                <Button type="primary" htmlType="submit" onClick={() => setCheckStatusApproved("approved")}>
                  {`อนุมัติ`}
                </Button>
              </>
            ) : null}
            {status === "return" ? (
              <>
                <Button type="default" onClick={() => closeModalFecthStatus()}>{`ยกเลิก`}</Button>
                <Button type="primary" htmlType="submit">
                  {`รับคืนรถ`}
                </Button>
              </>
            ) : null}
            {status === "delete" ? (
              <Button type="primary" htmlType="submit">
                {`ตกลง`}
              </Button>
            ) : null}
            {status === "cancel" ? (
              <Button type="primary" htmlType="submit">
                {`ตกลง`}
              </Button>
            ) : null}
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagementCarBookingModal;
