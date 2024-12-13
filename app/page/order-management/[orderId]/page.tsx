"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import ShowOrder from "./components/ShowOrder";
import { Row, Col, Breadcrumb, Input, Divider } from "antd";
import OrderManagementServices from "../services/order-management.service";
import { useEffect, useState } from "react";
import { ITypeOrderShow } from "../common";
import { useParams, useSearchParams } from "next/navigation";
export default function AddOrder() {
  const params = useParams();
  const orderId = params.orderId as string;
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId") as string;
  const stockAuth = useAxiosStock();
  const orderManagementService = OrderManagementServices(stockAuth);
  const [order, setOrder] = useState<ITypeOrderShow>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);
  const fetchData = async () => {
    if (orderId) {
      const order = await orderManagementService.findDetailByid(Number(orderId));
      setOrder(order);
      setLoading(false);
    }
  };
  const propData = (e: { loading: boolean }) => {
    setLoading(e.loading);
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              href: "/page/order-management",
              title: <span>Order Mnagement</span>,
            },
            {
              title: <span>Detail Order</span>,
            },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Detail Order`}</div>
      </Divider>
      <Col span={24} className=" flex space-x-4">
        <div className="flex space-x-3  items-center">
          <div className=" text-lg">Location :</div>
          <Input style={{ width: "200px" }} className=" read-only-input-disable font-bold" value={order?.locationName} disabled />
        </div>
      </Col>
      <Col span={24}>{order ? <ShowOrder order={order} propData={propData} /> : <></>}</Col>
    </Row>
  );
}
