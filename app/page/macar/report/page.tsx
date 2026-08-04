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
  Select,
  Alert,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import {
  ReportServices,
  CostSummary,
  CostTrendRow,
  FuelBudget,
  RenewalForecast,
  EMPTY_SUMMARY,
  EMPTY_FUEL_BUDGET,
  EMPTY_FORECAST,
  CATEGORY_LABEL,
} from "./services/report.service";
import CostKpiTiles from "./components/cost-kpi-tiles";
import { CostTrendCard } from "./components/cost-charts";
import TcoTable from "./components/tco-table";
import FuelBudgetCard from "./components/fuel-budget-card";
import RenewalForecastCard from "./components/renewal-forecast-card";
import { DonutCard, HBarCard } from "../dashboard/components/charts";

/** จำนวนปีย้อนหลังที่ให้เลือกในกราฟแนวโน้ม */
const TREND_YEAR_RANGE = 5;

/** รายงานค่าใช้จ่ายรถยนต์ — สำหรับผู้บริหารและฝ่ายบัญชี */
export default function MacarReportPage() {
  const { accessRole } = (useContext(UserContext) as UserContectType) || {
    accessRole: () => false,
  };
  const canView = accessRole(["admin", "account", "maUser"]);

  const { id24Axios } = useId24();
  const services = ReportServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET),
  );

  // ค่าเริ่มต้นเป็น "ทั้งปีปัจจุบัน" เพราะรายงานบัญชีอ่านเป็นรายปีเป็นหลัก
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("year"),
    dayjs().endOf("year"),
  ]);
  const [trendYear, setTrendYear] = useState<number>(dayjs().year());
  const [budgetMonth, setBudgetMonth] = useState<Dayjs>(dayjs());

  const [summary, setSummary] = useState<CostSummary>(EMPTY_SUMMARY);
  const [trend, setTrend] = useState<CostTrendRow[]>([]);
  const [fuelBudget, setFuelBudget] = useState<FuelBudget>(EMPTY_FUEL_BUDGET);
  const [forecast, setForecast] = useState<RenewalForecast>(EMPTY_FORECAST);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [loadingBudget, setLoadingBudget] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);

  useEffect(() => {
    if (!canView) return;
    let active = true;
    (async () => {
      setLoadingSummary(true);
      const data = await services.getCostSummary(
        range[0].format("YYYY-MM-DD"),
        range[1].format("YYYY-MM-DD"),
      );
      if (active) {
        setSummary(data);
        setLoadingSummary(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, canView]);

  useEffect(() => {
    if (!canView) return;
    let active = true;
    (async () => {
      setLoadingTrend(true);
      const data = await services.getCostTrend(trendYear);
      if (active) {
        setTrend(data);
        setLoadingTrend(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendYear, canView]);

  useEffect(() => {
    if (!canView) return;
    let active = true;
    (async () => {
      setLoadingBudget(true);
      const data = await services.getFuelBudget(
        budgetMonth.year(),
        budgetMonth.month() + 1,
      );
      if (active) {
        setFuelBudget(data);
        setLoadingBudget(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetMonth, canView]);

  useEffect(() => {
    if (!canView) return;
    let active = true;
    (async () => {
      setLoadingForecast(true);
      const data = await services.getRenewalForecast();
      if (active) {
        setForecast(data);
        setLoadingForecast(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  const breakdownData = useMemo(
    () =>
      summary.breakdown.map((b) => ({
        name: CATEGORY_LABEL[b.category],
        value: b.amount,
      })),
    [summary.breakdown],
  );

  const topVehicleData = useMemo(
    () =>
      summary.topVehicles.map((v) => ({ label: v.carName, value: v.total })),
    [summary.topVehicles],
  );

  const topVendorData = useMemo(
    () => summary.topVendors.map((v) => ({ label: v.vender, value: v.amount })),
    [summary.topVendors],
  );

  const yearOptions = useMemo(() => {
    const current = dayjs().year();
    return Array.from({ length: TREND_YEAR_RANGE }, (_, i) => ({
      value: current - i,
      label: `${current - i}`,
    }));
  }, []);

  const rangeLabel = `${range[0].format("DDMMYYYY")}-${range[1].format(
    "DDMMYYYY",
  )}`;

  return (
    <div>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              { href: "/page/home", title: <span>หน้าหลัก</span> },
              { title: <span>ระบบรถ</span> },
              { title: <span>รายงานค่าใช้จ่าย</span> },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">รายงานค่าใช้จ่ายรถยนต์</div>
        </Divider>
      </Row>

      {!canView ? (
        <Card>
          <Result
            status="403"
            title="403"
            subTitle="เฉพาะผู้ดูแลระบบ ฝ่ายบัญชี และผู้ดูแลระบบรถเท่านั้นที่เข้าถึงหน้านี้ได้"
          />
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500">ช่วงเวลา:</span>
            <DatePicker.RangePicker
              value={range}
              allowClear={false}
              format="DD/MM/YYYY"
              onChange={(v) => v && setRange(v as [Dayjs, Dayjs])}
            />
          </div>

          {summary.docsWithoutPaidDate ? (
            <Alert
              type="warning"
              showIcon
              closable
              message={`มีเอกสาร ${summary.docsWithoutPaidDate} รายการที่ยังไม่ระบุวันที่ชำระ`}
              description="รายการเหล่านี้ถูกตัดค่าใช้จ่ายตามวันที่เริ่มคุ้มครองแทน อาจทำให้ยอดคลาดเคลื่อนจากเกณฑ์เงินสด"
            />
          ) : null}

          <CostKpiTiles
            kpis={summary.kpis}
            previousKpis={summary.previousKpis}
            activeCars={summary.activeCars}
          />

          <Row gutter={[12, 12]}>
            <Col xs={24} lg={16}>
              <CostTrendCard
                title="แนวโน้มค่าใช้จ่ายรายเดือน"
                data={trend}
                loading={loadingTrend}
                extra={
                  <Select
                    value={trendYear}
                    options={yearOptions}
                    onChange={setTrendYear}
                    style={{ width: 100 }}
                  />
                }
              />
            </Col>
            <Col xs={24} lg={8}>
              <DonutCard
                title="สัดส่วนค่าใช้จ่ายตามหมวด"
                data={breakdownData}
                loading={loadingSummary}
              />
            </Col>
          </Row>

          <TcoTable
            data={summary.perVehicle}
            loading={loadingSummary}
            rangeLabel={rangeLabel}
          />

          <Row gutter={[12, 12]}>
            <Col xs={24} lg={12}>
              <HBarCard
                title="รถที่มีค่าใช้จ่ายสูงสุด"
                data={topVehicleData}
                loading={loadingSummary}
                color="#f5222d"
                valueUnit="บาท"
              />
            </Col>
            <Col xs={24} lg={12}>
              <HBarCard
                title="ผู้ให้บริการซ่อมบำรุงที่มียอดสูงสุด"
                data={topVendorData}
                loading={loadingSummary}
                color="#722ed1"
                valueUnit="บาท"
              />
            </Col>
          </Row>

          <FuelBudgetCard
            data={fuelBudget}
            loading={loadingBudget}
            month={budgetMonth}
            onMonthChange={setBudgetMonth}
          />

          <RenewalForecastCard data={forecast} loading={loadingForecast} />
        </div>
      )}
    </div>
  );
}
