"use client";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Divider, Row, Select, Space } from "antd";

import ProductList from "./components/TableProductList";

import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import ProductListServices from "./services/product-list.service";
import { ITypeMasterLocation, ITypeMasterProduct, ITypeMasterProductForm, ITypeOption, filterproductlist, typeImages, typeImagesGHS } from "./common";
// import GhsServices from "../stock-management/ghs/services/ghs.service";
import { InventoryStockServices } from "../inventory/services/inventory-stock.service";

export default function ProductListPage() {
  const stockAuth = useAxiosStock();
  const productListService = ProductListServices(stockAuth);
  const inventorystockservices = InventoryStockServices(stockAuth);
  // const ghsServices = GhsServices(stockAuth);
  const [dataTable, setDataTable] = useState<ITypeMasterProduct[]>([]);
  const [search, setSearch] = useState<object>({});
  const [loading, setLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [location, setLocation] = useState<number>();
  const [option, setOption] = useState<ITypeOption[]>([]);
  const [getswitch, setSwitch] = useState<boolean>(false);
  useEffect(() => {
    if (loading === true) loadData();
    fetchData();
  }, [loading, location]);

  const onFilter = async (value: filterproductlist) => {
    let search = {};
    if (value.productName) {
      search = {
        ...search,
        masterProductDetails: {
          some: { name: { contains: value.productName } },
        },
      };
    }
    if (value.chemicalFormula) {
      search = {
        ...search,
        chemicalFormula: { contains: value.chemicalFormula },
      };
    }
    if (value.casNo) {
      search = { ...search, casNo: { contains: value.casNo } };
    }
    if (value.unitName) {
      search = { ...search, unit: { unitName: { contains: value.unitName } } };
    }

    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };

  const fetchData = async () => {
    const locations: ITypeMasterLocation[] = await productListService.getLocation();
    const options = locations.map((d: ITypeMasterLocation) => ({
      value: d.id,
      label: d.locationName,
    }));
    setOption(options);
  };

  const loadData = async () => {
    const data = await productListService.getMasterProductsByLocationId(location, search, getswitch);
    const tranfers: ITypeMasterProduct[] = await Promise.all(
      data.map(async (event: ITypeMasterProduct) => {
        let expiredRemain = 0;
        if (event?.inventoryStock.length > 0) {
          await Promise.all(
            event?.inventoryStock.map(async (e: any) => {
              const expired = await inventorystockservices.getExpiredRemain(e.id);
              expiredRemain += expired ? expired : 0;
            }),
          );
        }
        const images = await dataImages(event?.masterProductImages as any);
        const imagesGHS = await await dataImagesGHS(event?.masterProductGhsMap as any);
        const mapData = {
          ...event,
          images: images,
          imagesGhs: imagesGHS,
          expiredRemain: expiredRemain,
        };
        return mapData;
      }),
    );
    setDataTable(tranfers);
    setLoading(false);
  };

  const dataImagesGHS = async (event: typeImagesGHS[]) => {
    if (event.length > 0) {
      const data = await Promise.all(
        event.map(async (r: typeImagesGHS, i: number) => {
          if (r?.masterGhsType?.imagesGhs.length !== 0) {
            // const getImages = await ghsServices.getImages(
            //   r.masterGhsType.imagesGhs[0]?.idfile
            // );
            // const mapData = {
            //   imagefile: getImages,
            // };
            // return mapData;
          } else {
            return null;
          }
        }),
      );
      return data;
    } else {
      return null;
    }
  };

  const dataImages = async (e: typeImages[]) => {
    if (e.length >= 1) {
      const getImages = await productListService.getImages(e[0].idfile);
      return getImages;
    } else {
      return null;
    }
  };

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onChangeLocation = async (value: number) => {
    await setLocation(value);
    setLoading(true);
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
              title: <span>Product List</span>,
            },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Product List`}</div>
      </Divider>

      <Col span={24} className=" flex space-x-4">
        <div className="flex space-x-3  items-center">
          <div className="text-lg">Location :</div>
          <Select
            allowClear
            options={option}
            placeholder={"Please Select Location"}
            style={{ width: "350px" }}
            onChange={(value: number) => onChangeLocation(value)}
          />
        </div>
      </Col>

      <Col span={24}>
        <ProductList
          dataTable={dataTable}
          openFilter={openFilter}
          onFilter={(value: filterproductlist) => onFilter(value)}
          handleOpenFilter={(value: boolean) => handleOpenFilter(value)}
          loading={loading}
          getswitch={getswitch}
          setSwitch={(value: boolean) => setSwitch(value)}
        />
      </Col>
    </Row>
  );
}
