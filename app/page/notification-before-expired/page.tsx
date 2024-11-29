"use client";
import { Breadcrumb, Col, Row, Select } from "antd";
import { NotificationTable } from "./components/NotificationTable";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useState, useEffect, useContext } from "react";
import { ITypeOption, ITypeMasterLocation } from "./common";
import OrderManagementServices from "./services/index.service";
import { UserContectType, UserContext } from "@/app/config/userContext";

export default function Notification() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const stockAuth = useAxiosStock();
  const orderManagementService = OrderManagementServices(stockAuth);
  const [location, setLocation] = useState<number[]>([]);
  const [option, setOption] = useState<ITypeOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    // if (user?.userMapGroup) {
    //   const locations: ITypeMasterLocation[] = await orderManagementService.getLocationByGroup(user?.userMapGroup);
    //   const options = locations.map((d: ITypeMasterLocation) => ({
    //     value: d.id,
    //     label: d.locationName,
    //   }));
    //   setOption(options);
    //   setLocation(options.map((d) => d.value));
    //   // setLocation(options.map((d) => d.value));
    // }
  };
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Expiry Date Notification</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className=" md:flex md:space-x-4 ">
            <div className="title-page-font">{`EXPIRY DATE NOTIFICATION`}</div>
            <div className="flex space-x-3  items-center">
              {/* <Form form={searchForm} className="flex  items-center">
            <Form.Item name="locationId" label={<div className=" text-lg">Location</div>}> */}

              <div className=" text-lg">Location :</div>
              <Select
                options={option}
                placeholder={"All"}
                onChange={(e) => {
                  if (e) {
                    setLocation([e]);
                  } else {
                    setLocation(option.map((d) => d.value));
                  }
                }}
                allowClear
                // mode="multiple"
                style={{ width: "200px" }}
              />
              {/* </Form.Item>
          </Form> */}
            </div>
          </div>
        </Col>
        <Col span={24}>
          <div className=" grid grid-cols-1 gap-y-2">
            <div>
              <NotificationTable location={location} />
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
