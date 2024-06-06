"use client";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "antd";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import GhsServices from "./services/ghs.service";
import dayjs from "dayjs";

import GhsTable from "./components/GhsTable";
import { CreateGhs } from "./components/CreateGhs";
import { typeGHS, typeGHSfilters } from "./common";

export default function ghsPage() {
  const stockAuth = useAxiosStock();
  const ghsServices = GhsServices(stockAuth);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataTable, setDataTable] = useState<typeGHS[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});
  const [paginationConfig, setPaginationConfig] = useState<number>(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    skip: 0,
  });

  useEffect(() => {
    if (loading) loaddata();
  }, [loading]);

  const loaddata = async () => {
    const dataTable = await ghsServices.getMasterGhsAll(search);
    if (dataTable) {
      const data = await Promise.all(
        dataTable.map(async (event: typeGHS) => {
          const imageData = await dataImages(event);
          const mapData = {
            ...event,
            imagefile: imageData,
          };
          return await mapData;
        })
      );
      setPaginationConfig(data.length);
      setDataTable(data);
      setLoading(false);
    }
  };

  const dataImages = async (e: any) => {
    if (e.imagesGhs.length > 0) {
      const getImages = await ghsServices.getImages(e.imagesGhs[0]?.idfile);
      return getImages;
    } else {
      return null;
    }
  };

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onFilter = async (value: typeGHSfilters) => {
    let search = {};
    if (value.nameGhs) {
      search = { ...search, nameGhs: { contains: value.nameGhs } };
    }
    if (value.createdAt) {
      search = {
        ...search,
        createdAt: {
          gte: dayjs(value?.createdAt[0]).startOf("day"),
          lte: dayjs(value?.createdAt[1]).endOf("day"),
        },
      };
    }
    setPagination({
      current: 1,
      pageSize: 10,
      skip: 0,
    });
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };

  const handlerPaginationTable = (paginate: any) => {
    const skip = paginate.current * paginate.pageSize - paginate.pageSize;
    const { current, pageSize } = paginate;
    setPagination((prevState) => ({
      ...prevState,
      skip: skip,
      current: current || 1,
      pageSize: pageSize || 10,
    }));
    setLoading(true);
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
              href: "/page/setting",
              title: <span>Setting</span>,
            },
            {
              title: <span>Set GHS</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`SET GHS`}</div>
      </Col>
      <Col span={24}>
        <div className="grid grid-cols-1 ">
          <div style={{ marginBottom: "10px" }}>
            <CreateGhs
              propLoading={(e: boolean) => setLoading(e)}
              loading={loading}
              handleOpenFilter={(e: boolean) => handleOpenFilter(e)}
              openFilter={openFilter}
              onFilter={(e: typeGHS) => onFilter(e as any)}
            />
          </div>
          <div>
            <GhsTable
              propLoading={(e: boolean) => setLoading(e)}
              loading={loading}
              dataTable={dataTable}
              paginationConfig={paginationConfig}
              filter={pagination}
              handlerPaginationTable={(e: any) => handlerPaginationTable(e)}
              setPagination={(e: any) => setPagination(e)}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}
