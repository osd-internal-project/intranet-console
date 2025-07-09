import { MaCarBookType } from "@/app/page/macar/common";
import { dateFormatTime } from "@/app/utils";
import { Button, Col, DatePicker, Divider, Form, FormInstance, Input, InputNumber, Modal, Row, Select, Space, Card } from "antd";
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
  const getModalTitle = () => {
    const titles = {
      return: "รับคืนรถ",
      approved: "อนุมัติการจองรถ",
      cancel: "ยกเลิกการจองรถ",
      delete: "ลบการจองรถ",
    };
    return "จัดการการจองรถ";
  };

  // const getSectionTitle = () => {
  //   const titles = {
  //     return: "ข้อมูลการคืนรถ",
  //     approved: "ข้อมูลการจองรถ",
  //     cancel: "ข้อมูลการยกเลิกการจองรถ",
  //     delete: "ข้อมูลการลบการจองรถ",
  //   };
  //   return titles[status] || "ข้อมูลการจอง";
  // };

  const getStatusColor = () => {
    const colors = {
      return: "#52c41a",
      approved: "#1890ff",
      cancel: "#ff4d4f",
      delete: "#ff4d4f",
    };
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
                  format={"DD/MM/YYYY"}
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
                  format={"DD/MM/YYYY"}
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
                    placeholder="เลือกระดับน้ำมัน"
                    options={[
                      { value: "high", label: "🟢 มาก" },
                      { value: "medium", label: "🟡 ปานกลาง" },
                      { value: "low", label: "🔴 น้อย" },
                    ]}
                  />
                </Form.Item>
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
            <Col span={12}>
              <Form.Item
                name={status === "approved" ? "remark" : status === "cancel" ? "remarkCancel" : "remarkApproved"}
                label={status === "approved" ? "หมายเหตุการจองรถ" : status === "cancel" ? "หมายเหตุยกเลิกการจองรถ" : "หมายเหตุ"}>
                <TextArea
                  placeholder={status === "approved" ? "กรอกหมายเหตุการจองรถ" : status === "cancel" ? "กรอกหมายเหตุการยกเลิก" : "กรอกหมายเหตุ"}
                  rows={3}
                  disabled={status === "approved"}
                />
              </Form.Item>
            </Col>
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
