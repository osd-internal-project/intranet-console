"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Skeleton,
  Tabs,
} from "antd";
import type { TabsProps } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MaCarType } from "../../../common";
import { ManageCarServices } from "../../services/manage-car.service";
import { MaVehicleTypeServices } from "../../../ma-car-config/services/ma-vehicle-type.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import CarDetailCard from "./components/car-detail-card";
import CarDocumentsPanel from "./components/car-documents-panel";
import CarMaTable from "./components/car-ma-table";
import CarBookingTable from "./components/car-booking-table";
import CarInfoPanel from "./components/car-info-panel";
import CarActivityTimeline from "./components/car-activity-timeline";

/** ตรวจว่าเป็นข้อมูลรถจริง (service คืน [] เมื่อ error จึงต้องกันกรณีไม่ใช่ object) */
const isValidCar = (data: unknown): data is MaCarType =>
  typeof data === "object" &&
  data !== null &&
  !Array.isArray(data) &&
  typeof (data as MaCarType).carId === "string";

/**
 * หน้ารายละเอียดรถ 1 คัน — รายละเอียดด้านบน (แก้ไขในที่ได้), เอกสารด้านซ้าย,
 * และแท็บประวัติตรวจสภาพ / การจอง / ข้อมูลอื่น ๆ ด้านขวา
 */
export default function CarDetailPage(): React.ReactElement {
  const params = useParams();
  const carId = params.id as string;

  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );
  const manageCarServices = ManageCarServices(baseUrIntranet);
  const vehicleTypeServices = MaVehicleTypeServices(baseUrIntranet);

  const [car, setCar] = useState<MaCarType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);

  /** โหลด/รีโหลดข้อมูลรถตาม carId — เรียกซ้ำได้หลังบันทึกแก้ไข */
  const fetchCar = useCallback(async () => {
    setLoading(true);
    const data = await manageCarServices.getMaCarQueryByCarId(carId);
    setCar(isValidCar(data) ? data : null);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  // ตัวเลือกประเภทรถจาก master — โหลดครั้งเดียว เลี้ยง Select ในการ์ดแก้ไข
  useEffect(() => {
    vehicleTypeServices.getMaVehicleTypeQuery().then((res: unknown) => {
      const list = (Array.isArray(res) ? res : []) as {
        typeName: string;
        status?: boolean;
      }[];
      setVehicleTypeOptions(
        list
          .filter((type) => type.status !== false)
          .map((type) => ({ label: type.typeName, value: type.typeName })),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabItems: TabsProps["items"] = car
    ? [
        {
          key: "ma",
          label: "ประวัติตรวจสภาพ",
          children: <CarMaTable carId={car.carId} />,
        },
        {
          key: "booking",
          label: "การจองรถ",
          children: <CarBookingTable carId={car.carId} />,
        },
        {
          key: "activity",
          label: "ประวัติกิจกรรม",
          children: <CarActivityTimeline carId={car.carId} />,
        },
        {
          key: "info",
          label: "ข้อมูลอื่น ๆ",
          children: <CarInfoPanel car={car} />,
        },
      ]
    : [];

  return (
    <div>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              { href: "/page/home", title: <span>หน้าหลัก</span> },
              {
                href: "/page/macar/ma-car-management",
                title: <span>การจัดการรถยนต์</span>,
              },
              { title: <span>{car?.carName ?? carId}</span> },
            ]}
          />
        </Col>

        {/* <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font" style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 8 }}>{car?.carName ?? "รายละเอียดรถ"}</span>
          {car?.licensePlate ? (
            <span className="text-grey" style={{ fontSize: 18 }}>
              · {car.licensePlate}
            </span>
          ) : null}
        </div>
      </Divider> */}
      </Row>
      <Row>
        <Col span={24}>
          {loading ? (
            <Card className="shadow-sm border border-gray-200">
              <Skeleton active paragraph={{ rows: 8 }} />
            </Card>
          ) : !car ? (
            <Card className="shadow-sm border border-gray-200">
              <Empty description="ไม่พบข้อมูลรถคันนี้">
                <Link href="/page/macar/ma-car-management">
                  กลับไปหน้าการจัดการรถยนต์
                </Link>
              </Empty>
            </Card>
          ) : (
            <div className="space-y-4">
              <CarDetailCard
                car={car}
                vehicleTypeOptions={vehicleTypeOptions}
                onSaved={fetchCar}
              />

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={8}>
                  <CarDocumentsPanel carId={car.carId} />
                </Col>
                <Col xs={24} lg={16}>
                  <Card
                    className="shadow-sm border border-gray-200"
                    styles={{ body: { padding: 16 } }}
                  >
                    <Tabs defaultActiveKey="ma" items={tabItems} />
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
