"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import AddComponent from "./components/AddOrder";
import { Row, Col, Breadcrumb, Select, Form } from "antd";
import OrderManagementServices from "../services/order-management.service";
import { useEffect, useState } from "react";
import {
  ITypeMasterLocation,
  ITypeOption,
  ITypeMasterLocationByGroup,
  ITypeOrderLotForm,
} from "../common";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
export default function AddOrder() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId") as string;
  const stockAuth = useAxiosStock();
  const orderManagementService = OrderManagementServices(stockAuth);
  const [location, setLocation] = useState<ITypeMasterLocationByGroup[]>();
  const [locationSelected, setLocationSelected] = useState<ITypeOption>();
  const [locationOption, setLocationOption] = useState<ITypeOption[]>([]);
  const [inventoryOption, setInventoryOption] = useState<ITypeOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const ioption: ITypeOption[] = [];
    if (locationSelected) {
      location
        ?.filter(
          (d: ITypeMasterLocationByGroup) => d.id === locationSelected.value
        )
        .map((d: ITypeMasterLocationByGroup) => {
          d.inventory
            ?.filter((d: any) => d.status == true)
            .map((i: { id: number; inventoryName: string }) => {
              ioption.push({ value: i.id, label: i.inventoryName });
            });
        });
      setInventoryOption(ioption);
    }
  }, [locationSelected]);

  const fetchData = async () => {
    if (session?.grouplist) {
      const locations: ITypeMasterLocationByGroup[] =
        await orderManagementService.getLocationByGroup(session?.grouplist);
      const doptions = locations.map((d: ITypeMasterLocation) => ({
        value: d.id,
        label: d.locationName,
      }));
      setLocation(locations);
      setLocationOption(doptions);
      if (locationId) {
        const selectedInventory = doptions.find(
          (option) => option.value === Number(locationId)
        );
        setLocationSelected(selectedInventory);
      }
    }
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>Home</span>,
            },
            {
              href: "/page/order-management",
              title: <span>Order Mnagement</span>,
            },
            {
              title: <span>Add Order</span>,
            },
          ]}
        />
      </Col>
      <Col span={24} className=" flex space-x-4">
        <div className="title-page-font  ">{`ORDER MANAGEMENT`}</div>
        <div className="flex space-x-3  items-center">
          <div className="text-lg">Location :</div>
          <Select
            options={locationOption}
            placeholder={"Please Select Location"}
            value={locationSelected?.value}
            onChange={(e) => {
              const selectedInventory = locationOption.find(
                (option) => option.value === e
              );
              setLocationSelected(selectedInventory);
            }}
            // style={{ width: "200px" }}
          />
        </div>
      </Col>
      <Col span={24}>
        <AddComponent location={locationSelected} inventory={inventoryOption} />
      </Col>
    </Row>
  );
}
