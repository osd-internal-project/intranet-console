"use client";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "antd";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { LocationServices } from "./services/location.service";

import LocationTable from "./components/LocationTable";
import { AddLocation } from "./components/AddLocation";
import { typeLocation, typeLocationFilter, typeImageslocation } from "./common";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";

export default function UsergroupPage() {
  const stockAuth = useAxiosStock();

  const locationServices = LocationServices(stockAuth);
  const [loading, setLoading] = useState<boolean>(true);
  const [getdataAll, setdataAll] = useState<typeLocation[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});

  useEffect(() => {
    fecthData();
  }, [loading]);

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onFilter = async (value: typeLocationFilter) => {
    let search = {};
    if (value.locationName) {
      search = { ...search, locationName: { contains: value.locationName } };
    }
    if (value.description) {
      search = { ...search, description: { contains: value.description } };
    }
    if (value.locationPlace) {
      search = { ...search, locationPlace: { contains: value.locationPlace } };
    }
    // if (value.numberOfInventory) {
    //   search = { ...search, numberOfInventory: Number(value.numberOfInventory) };
    // }
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
    const result = await locationServices.findByCondition(search);
    if (result) {
      const data = await Promise.all(
        result.map(async (event: typeLocation) => {
          const imageData = await dataImages(event);
          const numberOfInventory = await locationServices.countInventorybyID(
            event.id
          );
          const mapData = {
            ...event,
            numberOfInventory: numberOfInventory,
            imagefile: imageData,
          };
          return mapData;
        })
      );
      setdataAll(data);
    }
    setLoading(false);
  };
  const dataImages = async (e: typeLocation) => {
    if (e.imagesLocation.length >= 1) {
      const getImages = await locationServices.getImages(
        e.imagesLocation[0]?.idfile
      );

      return getImages;
    } else {
      return null;
    }
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
                href: "/page/setting",
                title: <span>Setting</span>,
              },
              {
                title: <span>Location</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`LOCATION`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 space-y-4 ">
            <div>
              <AddLocation
                setLoading={(e: boolean) => setLoading(e)}
                onFilter={(e: typeLocationFilter) => onFilter(e)}
                handleOpenFilter={(e: boolean) => handleOpenFilter(e)}
                openFilter={openFilter}
              />
            </div>
            <div>
              <LocationTable
                loading={loading}
                getdataAll={getdataAll}
                setLoading={(e: boolean) => setLoading(e)}
              />
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
