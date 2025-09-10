import { MaCarBookType } from "@/app/page/macar/common";
import { Button, Col, DatePicker, Form, FormInstance, Input, InputNumber, Modal, Row, Select, Space, Card, Image } from "antd";
import { CarOutlined, UserOutlined, CalendarOutlined, EnvironmentOutlined, FileTextOutlined, DashboardOutlined } from "@ant-design/icons";
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
  const values = form.getFieldsValue(true);

  const getModalTitle = () => {
    return "จัดการการจองรถ";
  };

  const getStatusColor = () => {
    return "#1890ff";
  };

  return (
    <Modal
      width={1000}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CarOutlined style={{ color: getStatusColor() }} />
          <span>{getModalTitle()}</span>
        </div>
      }
      open={openModal}
      onCancel={closeModalFecthStatus}
      footer={null}
      styles={{
        header: {
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: 16,
          marginBottom: 16,
        },
      }}>
      <Form form={form} onFinish={(e) => onFinish(status, e)} layout="vertical" size="middle" autoComplete="off">
        {/* ส่วนข้อมูลผู้จอง */}
        <Card
          size="small"
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UserOutlined style={{ color: "#1890ff" }} />
              <span>ข้อมูลผู้จอง</span>
            </div>
          }
          style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item<MaCarBookType> name="createdByName" label="ชื่อผู้จอง">
                <Input disabled prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ส่วนข้อมูลการจองรถ */}
        <Card
          size="small"
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CarOutlined style={{ color: getStatusColor() }} />
              <span>ข้อมูลการจองรถ</span>
            </div>
          }
          style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item<MaCarBookType> name="carName" label="ชื่อรถ">
                <Input disabled prefix={<CarOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType> name="carBookUsers" label="จำนวนผู้ใช้">
                <InputNumber style={{ width: "100%" }} placeholder="กรอกจำนวนผู้ใช้" min={1} max={12} disabled prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<MaCarBookType> name="carBookProvince" label="จังหวัด">
                <Input placeholder="กรอกจังหวัด" disabled prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item<MaCarBookType> name="carBookTitle" label="วัตถุประสงค์การใช้งาน">
                <Input.TextArea placeholder="กรอกวัตถุประสงค์การใช้งาน" disabled rows={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<MaCarBookType> name="carBookPlace" label="สถานที่ไป">
                <Input.TextArea placeholder="กรอกสถานที่ไป" disabled rows={2} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="carBookStartDate" label="วันที่เริ่มการจอง">
                <DatePicker
                  disabled
                  placeholder="เลือกวันที่เริ่มการจอง"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY HH:mm"}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="carBookEndDate" label="วันที่สิ้นสุดการจอง">
                <DatePicker
                  disabled
                  placeholder="กรอกวันที่สิ้นสุดการจอง"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY HH:mm"}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ส่วนข้อมูลการคืนรถ (แสดงเฉพาะเมื่อ status = return) */}
        {status === "return" && (
          <Card
            size="small"
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DashboardOutlined style={{ color: "#52c41a" }} />
                <span>ข้อมูลการคืนรถ</span>
              </div>
            }
            style={{ marginBottom: 16 }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="carMile" label="เลขไมล์รถ">
                  <InputNumber
                    disabled
                    style={{ width: "100%" }}
                    placeholder="กรอกเลขไมล์รถ"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="ระดับน้ำมันรถ" name="carPetrol">
                  <Select
                    disabled
                    placeholder="เลือกระดับน้ำมัน"
                    options={[
                      { value: "high", label: "🟢 มาก" },
                      { value: "medium", label: "🟡 ปานกลาง" },
                      { value: "low", label: "🔴 น้อย" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                {values.maCarBookImage && values.maCarBookImage.length > 0 ? (
                  <div className="flex justify-center gap-3 mt-2 mb-2">
                    <>{`รูปภาพ`}</>
                    {values.maCarBookImage.map((e: any, index: number) => {
                      return (
                        <Image
                          alt="news"
                          preview={true}
                          crossOrigin="anonymous"
                          src={`${process.env.REACT_APP_API_BASE_URL_INTRANET}/ma-car-booking-images/get-image/${e.idCarBookImage}`}
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </Col>
            </Row>
          </Card>
        )}

        {/* ส่วนรายละเอียดและหมายเหตุ */}
        <Card
          size="small"
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileTextOutlined style={{ color: "#722ed1" }} />
              <span>รายละเอียดเพิ่มเติม</span>
            </div>
          }
          style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="detail" label="รายละเอียด">
                <TextArea placeholder="กรอกรายละเอียด" rows={3} disabled />
              </Form.Item>
            </Col>
            {form.getFieldValue("carBookApprovedStatus") !== "Cancel" ? (
              <Col span={12}>
                <Form.Item name={"remarkApproved"} label={"หมายเหตุ"}>
                  <TextArea placeholder={"กรอกหมายเหตุ"} rows={3} disabled={true} />
                </Form.Item>
              </Col>
            ) : null}
            {form.getFieldValue("carBookApprovedStatus") === "Cancel" ? (
              <Col span={12}>
                <Form.Item name={"remarkCancel"} label={"หมายเหตุยกเลิกการจองรถ"}>
                  <TextArea placeholder={"กรอกหมายเหตุการยกเลิก"} rows={3} disabled={true} />
                </Form.Item>
              </Col>
            ) : null}
          </Row>
        </Card>

        {/* ส่วนปุ่มต่างๆ */}
        <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          {status === "approved" && (
            <Space size="middle">
              <Button type="default" size="large" htmlType="submit" onClick={() => setCheckStatusApproved("disable")} danger>
                ไม่อนุมัติ
              </Button>
              <Button type="primary" size="large" htmlType="submit" onClick={() => setCheckStatusApproved("approved")}>
                อนุมัติ
              </Button>
            </Space>
          )}

          {status === "return" && (
            <Space size="middle">
              <Button type="default" size="large" onClick={() => closeModalFecthStatus()}>
                ยกเลิก
              </Button>
              <Button type="primary" size="large" htmlType="submit">
                รับคืนรถ
              </Button>
            </Space>
          )}

          {status === "delete" && (
            <Button type="primary" size="large" htmlType="submit" danger>
              ลบการจอง
            </Button>
          )}

          {status === "cancel" && (
            <Button type="primary" size="large" htmlType="submit">
              ยืนยันการยกเลิก
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default ManagementCarBookingModal;
