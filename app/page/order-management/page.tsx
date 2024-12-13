"use client";
import { Breadcrumb, Col, Divider, Row, Select } from "antd";
import TableOrders from "./components/TableOrders";
import { useEffect, useState } from "react";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import OrderManagementServices from "./services/order-management.service";
import { ITypeMasterLocation, ITypeOption } from "./common";
import { useSearchParams } from "next/navigation";
import { useForm } from "antd/es/form/Form";

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId") as string;
  const stockAuth = useAxiosStock();
  const [searchForm] = useForm();
  const orderManagementService = OrderManagementServices(stockAuth);
  const [location, setLocation] = useState<number>();
  const [option, setOption] = useState<ITypeOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // if (session?.grouplist) {
    //   const locations: ITypeMasterLocation[] = await orderManagementService.getLocationByGroup(session?.grouplist);
    //   const options = locations.map((d: ITypeMasterLocation) => ({
    //     value: d.id,
    //     label: d.locationName,
    //   }));
    //   setOption(options);
    //   setLocation(options.length > 0 ? options[0].value : undefined);
    // }
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
              title: <span>Order Management</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Order Management`}</div>
      </Divider>
      <Col span={24} className=" flex space-x-4">
        <div className="flex space-x-3  items-center">
          <div className="text-lg">Location :</div>
          <Select
            value={location}
            options={option}
            placeholder={"Please Select Location"}
            onChange={(e) => {
              setLocation(e);
            }}
          />
        </div>
      </Col>
      {/* <Col span={24}>
        <TableOrders location={location} grouplist={session?.grouplist} />
      </Col> */}
    </Row>
  );
}
