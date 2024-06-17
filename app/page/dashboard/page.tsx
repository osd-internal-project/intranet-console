"use client";
import { Breadcrumb, Col, Row } from "antd";
import { DepartmentOverview } from "./components/DepartmentOverview";
import { ProductSummary } from "./components/ProductSummary";
import { ChartCountPerMonth } from "./components/ChartCountPerMonth";
import { ChartAmountperMonth } from "./components/ChartAmountperMonth";
import { MostOrderOfDepartment } from "./components/MostOrderOfDepartment";
import { MostOrderOfProducts } from "./components/MostOrderOfProducts";
import { useAxiosReport, useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import DashboardServices from "./services/dashboard.service";
import { useEffect, useState } from "react";
import { ITypeDepartment } from "./common";

export default function Dashboard() {
  const stockAuth = useAxiosStock();
  const reportAuth = useAxiosReport();
  const dashboardservices = DashboardServices(stockAuth);
  const dashboardsServices2 = DashboardServices(reportAuth);
  const [loading, setLoading] = useState<boolean>(true);
  const [countVender, setCountVender] = useState<number>(0);
  const [countMasterproduct, setCountMasterproduct] = useState<number>(0);
  const [countMasterInventory, setCountMasterInventory] = useState<number>(0);
  const [countstatusPay, setCountstatusPay] = useState<number>(0);
  const [countstatusRecieve, setCountstatusRecieve] = useState<number>(0);
  const [countCost, setCountcost] = useState<number>(0);
  const [mostOrderOfDepartment, setMostOrderOfDepartment] = useState<ITypeDepartment[]>([]);
  const [countPerMonthData, setCountPerMonthData] = useState<any[]>([]);
  const [amountPerMonthData, setAmountPerMonthData] = useState<any[]>([]);
  const [mostOrder, setMostOrder] = useState<any[]>([]);

  const [countOutofstock, setCountOutofstock] = useState<number>(0);

  useEffect(() => {
    if (loading) {
      fecthdatacountproductsummary();
      fethdatadepartmentoverview();
      fecthdataMostOrderOfDepartment();
      fecthdataChartCountPerMonth();
      fecthdataChartAmountPerMonth();
      fecthdataMostOrders();
    }
  }, [loading]);

  const fecthdatacountproductsummary = async () => {
    const getcountvender = await dashboardservices.countVenders();
    const getcountmasterproduct = await dashboardservices.countMasterProduct();
    const getcountmasterInventory = await dashboardservices.countMasterInventory();
    setCountVender(getcountvender);
    setCountMasterproduct(getcountmasterproduct);
    setCountMasterInventory(getcountmasterInventory);
    setLoading(false);
  };

  const fethdatadepartmentoverview = async () => {
    const getcountstatusPay = await dashboardservices.countStatusDepartmentOverview("pay");
    const getcountstatusRecieve = await dashboardservices.countStatusDepartmentOverview("recieve");
    const getcountCost = await dashboardservices.countCostDepartmentOverview();
    console.log(getcountCost);

    const getcountOutofstock = await dashboardservices.countOutofstockDepartmentOverview();
    setCountstatusPay(getcountstatusPay);
    setCountstatusRecieve(getcountstatusRecieve);
    setCountcost(getcountCost);
    setCountOutofstock(getcountOutofstock);
    setLoading(false);
  };
  const fecthdataChartCountPerMonth = async () => {
    const data = await dashboardsServices2.findCountStockPerMonth();
    // console.log(department);
    setCountPerMonthData(data);
  };
  const fecthdataChartAmountPerMonth = async () => {
    const data = await dashboardsServices2.findAmountStockPerMonth();
    // console.log(department);
    setAmountPerMonthData(data);
  };
  const fecthdataMostOrderOfDepartment = async () => {
    const department = await dashboardsServices2.findMostOrderOfDepartment();
    console.log(department);
    setMostOrderOfDepartment(department);
    setLoading(false);
  };
  const fecthdataMostOrders = async () => {
    const mostOrders = await dashboardsServices2.findMostOrder();
    setMostOrder(mostOrders);
    setLoading(false);
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/dashboard",
                title: <span>Home</span>,
              },
              {
                title: <span>Dashboard</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className=" grid grid-cols-1 md:grid-cols-5 gap-4 ">
            <div className=" md:col-span-3">
              <DepartmentOverview
                countstatusPay={countstatusPay}
                countstatusRecieve={countstatusRecieve}
                countCost={countCost}
                countOutofstock={countOutofstock}
              />
            </div>
            <div className=" md:col-span-2">
              <ProductSummary countVender={countVender} countMasterproduct={countMasterproduct} countMasterInventory={countMasterInventory} />
            </div>
            <div className=" md:col-span-3">
              <ChartCountPerMonth countPerMonthData={countPerMonthData} />
            </div>
            <div className=" md:col-span-2">
              <ChartAmountperMonth amountPerMonthData={amountPerMonthData} />
            </div>
            <div className=" md:col-span-3">
              <MostOrderOfDepartment datalist={mostOrderOfDepartment} />
            </div>
            <div className=" md:col-span-2">
              <MostOrderOfProducts mostOrder={mostOrder} />
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
