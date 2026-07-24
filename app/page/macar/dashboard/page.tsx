"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  DatePicker,
  Divider,
  Result,
  Row,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import {
  DashboardServices,
  DashboardOverview,
  EMPTY_OVERVIEW,
  TrendBucket,
} from "./services/dashboard.service";
import KpiTiles from "./components/kpi-tiles";
import { DonutCard, HBarCard, TrendCard } from "./components/charts";
import PerVehicleTable from "./components/per-vehicle-table";
import DocExpiryCard from "./components/doc-expiry-card";

/** ป้ายสถานะการจอง (ไทย) */
const STATUS_LABEL: Record<string, string> = {
  Process: "รออนุมัติ",
  Approve: "อนุมัติ",
  Completed: "รับคืนแล้ว",
  Return: "แจ้งคืน",
  Cancel: "ยกเลิก",
  DisapProved: "ปฏิเสธ",
};

/** แดชบอร์ดฟลีต (admin) — ภาพรวมการใช้รถ + ค่าใช้จ่าย + อันดับ */
export default function MacarDashboardPage() {
  const { accessRole } = (useContext(UserContext) as UserContectType) || {
    accessRole: () => false,
  };
  const isAdmin = accessRole(["admin"]);

  const { id24Axios } = useId24();
  const services = DashboardServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET),
  );

  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [overview, setOverview] = useState<DashboardOverview>(EMPTY_OVERVIEW);
  const [trend, setTrend] = useState<TrendBucket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    (async () => {
      setLoading(true);
      const data = await services.getOverview(
        range[0].format("YYYY-MM-DD"),
        range[1].format("YYYY-MM-DD"),
      );
      if (active) {
        setOverview(data);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    services.getBookingTrend().then(setTrend);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const bookerData = useMemo(
    () =>
      overview.topBookers.map((b) => ({
        label: b.name,
        value: b.count,
        days: b.days,
      })),
    [overview.topBookers],
  );
  const vehicleData = useMemo(
    () =>
      overview.topVehicles.map((v) => ({
        label: v.carName,
        value: v.count,
        days: v.days,
      })),
    [overview.topVehicles],
  );
  const destData = useMemo(
    () => overview.destinations.map((d) => ({ label: d.place, value: d.count })),
    [overview.destinations],
  );
  const statusData = useMemo(
    () =>
      overview.statusBreakdown.map((s) => ({
        name: STATUS_LABEL[s.status] ?? s.status,
        value: s.count,
      })),
    [overview.statusBreakdown],
  );
  const compositionData = useMemo(
    () =>
      overview.fleetComposition.map((c) => ({ name: c.type, value: c.count })),
    [overview.fleetComposition],
  );

  return (
    <div>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              { href: "/page/home", title: <span>หน้าหลัก</span> },
              { title: <span>ระบบรถ</span> },
              { title: <span>แดชบอร์ด</span> },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">แดชบอร์ดฟลีต</div>
        </Divider>
      </Row>

      {!isAdmin ? (
        <Card>
          <Result
            status="403"
            title="403"
            subTitle="เฉพาะผู้ดูแลระบบเท่านั้นที่เข้าถึงหน้านี้ได้"
          />
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">ช่วงเวลา:</span>
            <DatePicker.RangePicker
              value={range}
              allowClear={false}
              format="DD/MM/YYYY"
              onChange={(v) => v && setRange(v as [Dayjs, Dayjs])}
            />
          </div>

          <KpiTiles kpis={overview.kpis} />

          <Row gutter={[12, 12]}>
            <Col xs={24} lg={12}>
              <HBarCard
                title="อันดับผู้จองรถมากที่สุด"
                data={bookerData}
                loading={loading}
                color="#1677ff"
                showDays
              />
            </Col>
            <Col xs={24} lg={12}>
              <HBarCard
                title="รถที่ถูกใช้มากที่สุด"
                data={vehicleData}
                loading={loading}
                color="#52c41a"
                showDays
              />
            </Col>
          </Row>

          <Row gutter={[12, 12]}>
            <Col xs={24} lg={14}>
              <TrendCard title="แนวโน้มการจองรายเดือน (12 เดือน)" data={trend} />
            </Col>
            <Col xs={24} lg={10}>
              <DonutCard title="สถานะการจอง" data={statusData} loading={loading} />
            </Col>
          </Row>

          <PerVehicleTable data={overview.perVehicle} loading={loading} />

          <Row gutter={[12, 12]}>
            <Col xs={24} lg={8}>
              <HBarCard
                title="จุดหมายปลายทางยอดนิยม"
                data={destData}
                loading={loading}
                color="#13c2c2"
              />
            </Col>
            <Col xs={24} lg={8}>
              <DonutCard
                title="องค์ประกอบฟลีต"
                data={compositionData}
                loading={loading}
              />
            </Col>
            <Col xs={24} lg={8}>
              <DocExpiryCard data={overview.docExpiry} />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
