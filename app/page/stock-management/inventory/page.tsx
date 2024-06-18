"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, Row } from "antd";
import { useSearchParams } from "next/navigation";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { InventoryServices } from "./services/inventory.service";
import { AddInventory } from "./components/AddInventory";
import { TableInventory } from "./components/TableInventory";
import { typeInventory, typeInventoryFIlters } from "./common";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";

const Inventory = () => {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId") as string;
  const stockAuth = useAxiosStock();
  const inventoryServices = InventoryServices(stockAuth);
  const [loading, setLoading] = useState<boolean>(true);
  const [getdataAll, setdataAll] = useState<typeInventory[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});

  useEffect(() => {
    fecthData();
  }, [loading, locationId]);

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onFilter = async (value: typeInventoryFIlters) => {
    let search = {};
    if (value.inventoryName) {
      search = { ...search, inventoryName: { contains: value.inventoryName } };
    }
    if (value.locationPlace) {
      search = { ...search, locationPlace: { contains: value.locationPlace } };
    }
    if (value.phoneNumber) {
      search = { ...search, phoneNumber: { contains: value.phoneNumber } };
    }
    if (value.createdAt) {
      search = {
        ...search,
        createdAt: {
          gte: dateToStartofDay(value.createdAt[0]),
          lte: dateToEndofDay(value.createdAt[1]),
        },
      };
    }
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };

  const fecthData = async () => {
    let result: typeInventory[] = [];
    if (locationId === null) {
      result = await inventoryServices.findinventorybyID(null, search);
      result ? setdataAll(result) : {};
    } else {
      result = await inventoryServices.findinventorybyID(Number(locationId), search);
      result ? setdataAll(result) : {};
    }
    setLoading(false);
  };
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                href: "/page/stock-management",
                title: <span>Stock Management</span>,
              },
              {
                title: <span>Inventory Store</span>,
              },
            ]}
          />
        </Col>

        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Inventory Store`}</div>
        </Divider>
      </Row>
      <div>
        <Card>
          <AddInventory
            setLoading={(e: boolean) => setLoading(e)}
            locationId={locationId}
            handleOpenFilter={(e: boolean) => handleOpenFilter(e)}
            openFilter={openFilter}
            onFilter={(e: typeInventoryFIlters) => onFilter(e)}
          />
          <TableInventory loading={loading} getdataAll={getdataAll} setLoading={(e: boolean) => setLoading(e)} />
        </Card>
      </div>
    </>
  );
};
export default Inventory;
