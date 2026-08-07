"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tag,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { MaCarType } from "../../../../common";
import { ManageCarServices } from "../../../services/manage-car.service";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { numberWithCommas } from "@/app/utils/format";

import { notifyError, notifySuccess } from "@/app/utils/message";
/** สไตล์ช่องแบบอ่านอย่างเดียว (เส้นใต้บาง) ใช้ตอนยังไม่กดแก้ไข — เลียนแบบ ShowDetailComponent */
const readOnlyInputStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 0,
  boxShadow: "none",
  background: "transparent",
  padding: "4px 0",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
  color: "#374151",
};

/** ตัวเลือกระดับน้ำมันในถัง — ตรงกับที่ใช้ในฟอร์มเพิ่ม/แก้รถของโมดูล */
const PETROL_OPTIONS = [
  { value: "high", label: "มาก", color: "green" },
  { value: "medium", label: "ปานกลาง", color: "orange" },
  { value: "low", label: "น้อย", color: "red" },
] as const;

export interface CarDetailCardProps {
  car: MaCarType;
  /** ตัวเลือกประเภทรถจาก master (เลี้ยง Select ช่องประเภทรถ) */
  vehicleTypeOptions: { label: string; value: string }[];
  /** เรียกหลังบันทึกสำเร็จ เพื่อให้หน้าหลัก refetch ข้อมูลรถ */
  onSaved: () => void;
}

/**
 * การ์ดรายละเอียดรถด้านบนสุด — แสดงข้อมูลรถแบบอ่านอย่างเดียว และสลับเป็นฟอร์มแก้ไขได้ในที่เดิม
 * @param car ข้อมูลรถที่จะแสดง/แก้ไข
 * @param vehicleTypeOptions ตัวเลือกประเภทรถ
 * @param onSaved callback เมื่อบันทึกสำเร็จ
 */
const CarDetailCard: React.FC<CarDetailCardProps> = ({
  car,
  vehicleTypeOptions,
  onSaved,
}): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );
  const manageCarServices = ManageCarServices(baseUrIntranet);

  const [form] = useForm();
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // sync ค่าในฟอร์มทุกครั้งที่ข้อมูลรถเปลี่ยน (โหลดครั้งแรก / หลังบันทึก)
  useEffect(() => {
    form.setFieldsValue(car);
  }, [car, form]);

  /** เปิดโหมดแก้ไข — เติมค่าปัจจุบันกลับเข้าฟอร์มกันค่าค้างจากการยกเลิกครั้งก่อน */
  const handleEdit = () => {
    form.setFieldsValue(car);
    setEditing(true);
  };

  /** ยกเลิกการแก้ไข — คืนค่าเดิมทั้งหมด */
  const handleCancel = () => {
    form.setFieldsValue(car);
    setEditing(false);
  };

  /**
   * บันทึกการแก้ไข — ส่งเฉพาะฟิลด์ที่แก้ได้ พร้อมประทับผู้แก้ไข แล้วให้หน้าหลัก refetch
   */
  const handleSave = async (values: Partial<MaCarType>) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        updatedAt: dayjs().toISOString(),
        updatedById: user?.userId,
        updatedByName: user
          ? `${user.firstNameTh} ${user.lastNameTh}`
          : undefined,
      };
      const result = await manageCarServices.updateMaCar(car.carId, payload);
      if (result) {
        notifySuccess("car.update");
        setEditing(false);
        onSaved();
      } else {
        notifyError(undefined, "car.update");
      }
    } catch (error) {
      console.error("Failed to update car", error);
      notifyError(error, "car.update");
    } finally {
      setSaving(false);
    }
  };

  const petrol = PETROL_OPTIONS.find(
    (option) => option.value === car.carPetrol,
  );
  const hasFleetCard = car.fuelCardStatus === "active";

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSave}
      autoComplete="off"
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className="title-page-font"
          style={{ display: "flex", alignItems: "left" }}
        >
          <span style={{ marginRight: "8px" }}>
            {car.carName || "รายละเอียดรถ"}
          </span>
          <span>
            <Tag
              bordered={false}
              color={car.status ? "green" : "red"}
              className="!m-0"
            >
              {car.status ? "ใช้งานได้ปกติ" : "ไม่สามารถใช้งานได้"}
            </Tag>
          </span>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button
              size="small"
              type="text"
              onClick={handleCancel}
              disabled={saving}
            >
              ยกเลิก
            </Button>
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              loading={saving}
              onClick={() => form.submit()}
            >
              ยืนยัน
            </Button>
          </div>
        ) : (
          <Button size="small" type="text" onClick={handleEdit}>
            แก้ไข
          </Button>
        )}
      </div>
        {/* สรุปย่อ — เลขไมล์ / ระดับน้ำมัน / Fleet Card แบบเรียบ */}
        <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Card size="small" className="border border-gray-200">
            <div className="text-xs text-gray-400">เลขไมล์ปัจจุบัน</div>
            <div className="text-lg font-semibold text-gray-800">
              {numberWithCommas(car.carMile ?? 0)}
              <span className="ml-1 text-xs font-normal text-gray-400">
                กม.
              </span>
            </div>
          </Card>
          <Card size="small" className="border border-gray-200">
            <div className="text-xs text-gray-400">ระดับน้ำมัน</div>
            <div className="pt-1">
              {petrol ? (
                <Tag bordered={false} color={petrol.color} className="!m-0">
                  {petrol.label}
                </Tag>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
          </Card>
          <Card size="small" className="border border-gray-200">
            <div className="text-xs text-gray-400">Fleet Card คงเหลือ</div>
            <div className="text-lg font-semibold text-gray-800">
              {hasFleetCard ? (
                <>
                  {numberWithCommas(car.fuelMonthlyRemaining ?? 0)}
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    / {numberWithCommas(car.fuelMonthlyLimit ?? 0)}
                  </span>
                </>
              ) : (
                <span className="text-base font-normal text-gray-400">
                  ไม่มี
                </span>
              )}
            </div>
          </Card>
        </div>

      <Card
        className="border border-gray-200"
        styles={{ body: { padding: 24 }, header: { borderBottom: "none" } }}
      >
      
        {/* ข้อมูลทะเบียน/ตัวรถ */}
        <div className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-400">
          ข้อมูลรถ
        </div>
        <Row gutter={16}>
          <Col xs={24} md={6} lg={6}>
            <Form.Item
              label="ชื่อรถ"
              name="carName"
              className="mb-3"
              rules={[{ required: editing, message: "กรุณากรอกชื่อรถ" }]}
            >
              <Input
                disabled={!editing}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item label="ทะเบียนรถ" name="licensePlate" className="mb-3">
              <Input
                disabled={!editing}
                placeholder={editing ? "เช่น 2ฒร 424" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item label="ประเภทรถ" name="carType" className="mb-3">
              <Select
                disabled={!editing}
                options={vehicleTypeOptions}
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder={editing ? "เลือกประเภทรถ" : undefined}
                variant={editing ? "outlined" : "borderless"}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item
              label="ลักษณะ/ตัวถัง"
              name="carCategory"
              className="mb-3"
            >
              <Input
                disabled={!editing}
                placeholder={editing ? "เช่น กระบะ, เก๋ง, ตู้" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item label="ยี่ห้อ" name="brand" className="mb-3">
              <Input
                disabled={!editing}
                placeholder={editing ? "เช่น Toyota" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item label="รุ่น" name="model" className="mb-3">
              <Input
                disabled={!editing}
                placeholder={editing ? "เช่น Revo" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item label="เชื้อเพลิง" name="fuelType" className="mb-3">
              <Input
                disabled={!editing}
                placeholder={editing ? "เช่น ดีเซล" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item label="สี" name="color" className="mb-3">
              <Input
                disabled={!editing}
                placeholder={editing ? "เช่น ขาว" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item label="ปีรุ่น" name="modelYear" className="mb-3">
              <Input
                disabled={!editing}
                placeholder={editing ? "เช่น 2020" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item
              label="ผู้ถือกรรมสิทธิ์"
              name="ownerName"
              className="mb-3"
            >
              <Input
                disabled={!editing}
                placeholder={editing ? "เช่น CDN" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item label="เลขตัวถัง" name="chassisNumber" className="mb-3">
              <Input
                disabled={!editing}
                placeholder={editing ? "เลขตัวถัง / VIN" : undefined}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item
              label="เลขไมล์รถ"
              name="carMile"
              className="mb-3"
              rules={[{ required: editing, message: "กรุณากรอกเลขไมล์รถ" }]}
            >
              <InputNumber<number>
                disabled={!editing}
                className="w-full"
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  value ? Number(value.replace(/,/g, "")) : 0
                }
                style={
                  editing
                    ? { width: "100%" }
                    : { ...readOnlyInputStyle, width: "100%" }
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* สถานะ/ระดับน้ำมัน/รายละเอียด */}
        <div className="mb-4 mt-6 text-xs font-medium uppercase tracking-wide text-gray-400">
          สถานะและรายละเอียด
        </div>
        <Row gutter={16}>
          <Col xs={24} md={6} lg={6}>
            <Form.Item
              label="ระดับของน้ำมัน"
              name="carPetrol"
              className="mb-3"
              rules={[{ required: editing, message: "กรุณาเลือกระดับน้ำมัน" }]}
            >
              <Select
                disabled={!editing}
                placeholder={editing ? "เลือกระดับน้ำมัน" : undefined}
                variant={editing ? "outlined" : "borderless"}
                options={PETROL_OPTIONS.map(({ value, label }) => ({
                  value,
                  label,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={6}>
            <Form.Item
              label="สถานะรถ"
              name="status"
              className="mb-3"
              rules={[{ required: editing, message: "กรุณาเลือกสถานะรถ" }]}
            >
              <Select
                disabled={!editing}
                placeholder={editing ? "เลือกสถานะรถ" : undefined}
                variant={editing ? "outlined" : "borderless"}
                options={[
                  { value: true, label: "ใช้งานได้ปกติ" },
                  { value: false, label: "ไม่สามารถใช้งานได้" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="รายละเอียด" name="detail" className="mb-1">
              <Input.TextArea
                disabled={!editing}
                rows={editing ? 3 : 2}
                style={editing ? undefined : readOnlyInputStyle}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default CarDetailCard;
