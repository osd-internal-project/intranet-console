"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  CarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { MaCarBookServices } from "@/app/services/ma-car-book.service";
import { MaCarType } from "../../common";
import { numberWithCommas } from "@/app/utils/format";

interface props {
  dataProvinces: { value: string; label: string }[];
  /** เรียกหลังจองสำเร็จ — ให้หน้าแม่สลับไปแท็บตาราง + refetch */
  onBooked: () => void;
}

/** พาเนลหัวข้อ — กรอบบางๆ + หัวข้อมีไอคอน ให้ฟอร์มดูเป็นสัดส่วน อ่านง่าย */
const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  extra?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ icon, title, extra, className, children }) => (
  <div
    className={`rounded-xl border border-gray-200 bg-white p-4 sm:p-5 ${className ?? ""}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <span className="text-blue-500">{icon}</span>
        <span>{title}</span>
      </div>
      {extra}
    </div>
    {children}
  </div>
);

/** ระดับน้ำมันในถัง → ป้ายสี ตามคอนเวนชันเดิมของโมดูล (มาก/ปานกลาง/น้อย) */
const PETROL_META: Record<string, { label: string; color: string }> = {
  high: { label: "มาก", color: "green" },
  medium: { label: "ปานกลาง", color: "orange" },
  low: { label: "น้อย", color: "red" },
};

/**
 * ป้ายระดับน้ำมันของรถ 1 คัน — คืน null เมื่อไม่มี/ไม่รู้จักค่า จะได้ไม่แสดงป้ายว่าง
 * @param carPetrol ค่าระดับน้ำมัน (high/medium/low)
 */
const renderPetrol = (carPetrol?: string): React.ReactNode => {
  const meta = carPetrol ? PETROL_META[carPetrol] : undefined;
  if (!meta) return null;
  return (
    <Tag color={meta.color} className="!mr-0 !px-1.5 !py-0 !text-[11px] !leading-5">
      น้ำมัน: {meta.label}
    </Tag>
  );
};

/** 1 บรรทัดใน tooltip — ข้ามฟิลด์ที่ว่างเพื่อไม่ให้ tooltip รก */
const TooltipRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) =>
  value === undefined || value === null || value === "" ? null : (
    <div>
      <span className="text-gray-400">{label}:</span> {value}
    </div>
  );

/**
 * เนื้อหา tooltip รายละเอียดรถ 1 คัน (แสดงตอน hover การ์ด) — ข้ามฟิลด์ที่ไม่มีค่า
 * @param car ข้อมูลรถ
 */
const renderCarTooltip = (car: MaCarType): React.ReactNode => {
  const spec = [car.brand, car.model, car.carType, car.carCategory]
    .filter(Boolean)
    .join(" · ");
  const petrol = car.carPetrol ? PETROL_META[car.carPetrol]?.label : undefined;
  return (
    <div className="text-xs leading-5">
      <div className="font-medium">
        {car.carName}
        {car.licensePlate ? ` · ${car.licensePlate}` : ""}
      </div>
      <TooltipRow label="ยี่ห้อ/รุ่น" value={spec} />
      <TooltipRow label="สี" value={car.color} />
      <TooltipRow label="เชื้อเพลิง" value={car.fuelType} />
      <TooltipRow label="ระดับน้ำมัน" value={petrol} />
      <TooltipRow
        label="เลขไมล์"
        value={car.carMile ? `${numberWithCommas(car.carMile)} กม.` : undefined}
      />
      <TooltipRow
        label="Fleet Card คงเหลือ"
        value={
          car.fuelCardStatus === "active"
            ? numberWithCommas(car.fuelMonthlyRemaining || 0)
            : undefined
        }
      />
      <TooltipRow label="รายละเอียด" value={car.detail} />
    </div>
  );
};

/**
 * แบบฟอร์มจองรถ (ดีไซน์ใหม่) — เลือกช่วงเวลาก่อน แล้วโชว์การ์ดรถที่ว่างให้คลิกเลือก
 * ฟิลด์ข้อมูลคงเดิม (วัตถุประสงค์/สถานที่/จังหวัด/จำนวนผู้ใช้/รายละเอียด)
 */
const CarBookNew: React.FC<props> = ({ dataProvinces, onBooked }) => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const services = MaCarBookServices(baseUrIntranet);

  const [form] = Form.useForm();
  const [availableCars, setAvailableCars] = useState<MaCarType[]>([]);
  const [availLoading, setAvailLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // เวลาจองใน form ใช้ watch เพื่อ trigger ค้นหารถว่าง
  const startDate: Dayjs | undefined = Form.useWatch("carBookStartDate", form);
  const endDate: Dayjs | undefined = Form.useWatch("carBookEndDate", form);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        userName: `${user?.firstNameTh} ${user?.lastNameTh}`,
        phoneNumber: user?.phoneNumber,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ครบช่วงเวลา + end > start → ค้นหารถว่าง
  useEffect(() => {
    if (!startDate || !endDate || !endDate.isAfter(startDate)) {
      setSearched(false);
      setAvailableCars([]);
      return;
    }
    let active = true;
    const fetchAvailable = async () => {
      setAvailLoading(true);
      setSearched(true);
      const cars: MaCarType[] = await services.getMaCarBookAvailable(
        startDate.toISOString(),
        endDate.toISOString()
      );
      if (!active) return;
      setAvailableCars(cars ?? []);
      // ถ้าคันที่เลือกไว้ไม่อยู่ในรายการใหม่ → เคลียร์
      setSelectedCarId((prev) =>
        prev && (cars ?? []).some((c) => c.carId === prev) ? prev : undefined
      );
      setAvailLoading(false);
    };
    fetchAvailable();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const onFinish = async (values: any) => {
    if (!selectedCarId) {
      message.error("กรุณาเลือกรถที่ต้องการจอง");
      return;
    }
    setSubmitting(true);
    try {
      const car = availableCars.find((c) => c.carId === selectedCarId);
      const data = {
        carId: selectedCarId,
        carName: car?.carName,
        createdById: user?.userId,
        createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
        carBookProvince: values.idProvinces,
        carBookPlace: values.carBookPlace,
        carBookUsers: Number(values.carBookUsers),
        carBookStartDate: dayjs(values.carBookStartDate).toISOString(),
        carBookEndDate: dayjs(values.carBookEndDate).toISOString(),
        detail: values.detail,
        carBookTitle: values.carBookTitle,
        carBookApprovedStatus: "Process",
        remark: values.remark,
      };
      const result = await services.createMaCarBook(data);
      if (result) {
        message.success("จองรถสำเร็จ");
        form.resetFields();
        if (user) {
          form.setFieldsValue({
            userName: `${user?.firstNameTh} ${user?.lastNameTh}`,
            phoneNumber: user?.phoneNumber,
          });
        }
        setSelectedCarId(undefined);
        setAvailableCars([]);
        setSearched(false);
        onBooked();
      } else {
        message.error("จองรถไม่สำเร็จ");
      }
    } catch (error) {
      message.error("จองรถไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  const carList = !searched ? (
    <div className="text-sm text-gray-400 py-8 text-center">
      เลือกช่วงเวลาก่อน เพื่อดูรถที่ว่างในช่วงนั้น
    </div>
  ) : availLoading ? (
    <div className="flex justify-center py-10">
      <Spin />
    </div>
  ) : availableCars.length === 0 ? (
    <Empty description="ไม่มีรถว่างในช่วงเวลานี้" className="py-6" />
  ) : (
    /* 1 แถว/คัน — คลิกเลือกได้ทั้งแถว, เลื่อนดูได้เมื่อมีหลายคัน */
    <div className="flex flex-col py-2 gap-1.5 max-h-[26rem] overflow-y-auto pr-1">
      {availableCars.map((car) => {
        const selected = car.carId === selectedCarId;
        return (
          <Tooltip
            key={car.carId}
            placement="left"
            mouseEnterDelay={0.3}
            title={renderCarTooltip(car)}
          >
            <div
              onClick={() => setSelectedCarId(car.carId)}
              className={[
                "flex items-center gap-2.5 px-2.5 py-1.5 border rounded-lg cursor-pointer transition-colors",
                selected
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-400"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50",
              ].join(" ")}
            >
              {/* ไอคอนนำ — ช่วยจัดวางให้เป็นระเบียบและบอกสถานะเลือกด้วยสี */}
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm",
                  selected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500",
                ].join(" ")}
              >
                <CarOutlined />
              </span>

              {/* ชื่อรถ + ทะเบียน — เป็นตัวระบุหลัก, ชื่อยาวจะย่อด้วย truncate */}
              <span className="font-medium text-sm text-gray-800 truncate min-w-0 flex-1">
                {car.carName}
              </span>
              {car.licensePlate && (
                <Tag className="!mr-0 !px-1.5 !py-0 !text-[11px] !leading-5 shrink-0">
                  {car.licensePlate}
                </Tag>
              )}

              {/* ระดับน้ำมัน + วงเงิน Fleet Card + เครื่องหมายถูกเมื่อเลือก */}
              {renderPetrol(car.carPetrol)}
              {car.fuelCardStatus === "active" && (
                <span className="hidden sm:inline text-[11px] text-gray-500 whitespace-nowrap shrink-0">
                  ฿{numberWithCommas(car.fuelMonthlyRemaining || 0)}
                </span>
              )}
              {selected && (
                <CheckCircleFilled className="text-blue-500 shrink-0" />
              )}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="pt-1">
      <Row gutter={[24, 16]}>
        {/* ซ้าย: ข้อมูลการจอง */}
        <Col xs={24} xl={15}>
          <div className="space-y-4">
            <Section icon={<ClockCircleOutlined />} title="ผู้จอง & ช่วงเวลาที่ใช้รถ">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="userName" label="ผู้จอง" className="!mb-3">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="phoneNumber" label="เบอร์โทรศัพท์" className="!mb-3">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="carBookStartDate"
                    label="วันที่/เวลา เริ่มใช้รถ"
                    className="!mb-0"
                    rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มการจอง" }]}
                  >
                    <DatePicker
                      showTime
                      className="w-full"
                      format="DD/MM/YYYY HH:mm"
                      placeholder="เลือกวัน-เวลาเริ่ม"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="carBookEndDate"
                    label="วันที่/เวลา สิ้นสุด"
                    className="!mb-0"
                    rules={[
                      { required: true, message: "กรุณาเลือกวันที่สิ้นสุดการจอง" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const start = getFieldValue("carBookStartDate");
                          if (!value || !start || value.isAfter(start)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("เวลาสิ้นสุดต้องหลังเวลาเริ่ม")
                          );
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      showTime
                      className="w-full"
                      format="DD/MM/YYYY HH:mm"
                      placeholder="เลือกวัน-เวลาสิ้นสุด"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Section>

            <Section icon={<FileTextOutlined />} title="รายละเอียดการจอง">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="carBookTitle"
                    label="วัตถุประสงค์การใช้งาน"
                    className="!mb-3"
                    rules={[{ required: true, message: "กรุณากรอกวัตถุประสงค์การใช้งาน" }]}
                  >
                    <Input placeholder="เช่น ไปประชุมนอกสถานที่" showCount maxLength={150} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="carBookUsers"
                    label="จำนวนผู้โดยสาร"
                    className="!mb-3"
                    rules={[{ required: true, message: "กรุณากรอกจำนวนผู้ใช้" }]}
                  >
                    <Input
                      placeholder="จำนวนผู้โดยสาร"
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
                <Col xs={24} md={16}>
                  <Form.Item
                    name="carBookPlace"
                    label="สถานที่ปลายทาง"
                    className="!mb-3"
                    rules={[{ required: true, message: "กรุณากรอกสถานที่ไป" }]}
                  >
                    <Input placeholder="กรอกสถานที่ปลายทาง" showCount maxLength={250} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="idProvinces"
                    label="จังหวัด"
                    className="!mb-3"
                    rules={[{ required: true, message: "กรุณาเลือกจังหวัด" }]}
                  >
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      placeholder="เลือกจังหวัด"
                      options={dataProvinces}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="detail" label="รายละเอียดเพิ่มเติม" className="!mb-0">
                    <Input.TextArea
                      placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                      rows={2}
                      showCount
                      maxLength={1000}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Section>
          </div>
        </Col>

        {/* ขวา: เลือกรถที่ว่าง (ค้างไว้ระหว่างเลื่อน) */}
        <Col xs={24} xl={9}>
          <Section
            icon={<CarOutlined />}
            title="เลือกยานพาหนะ"
            className="xl:sticky xl:top-2"
            extra={
              searched && !availLoading ? (
                <Tag color="blue" className="!mr-0">
                  ว่าง {availableCars.length} คัน
                </Tag>
              ) : undefined
            }
          >
            {carList}
          </Section>
        </Col>
      </Row>

      {/* แถบส่งฟอร์ม */}
      <div className="mt-5 flex justify-center">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={submitting}
          className="min-w-[220px]"
        >
          ส่งคำขอจองรถ
        </Button>
      </div>
    </Form>
  );
};

export default CarBookNew;
