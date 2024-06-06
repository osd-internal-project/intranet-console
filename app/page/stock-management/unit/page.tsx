"use client";

import { Breadcrumb, Card, Col, Row, Typography } from "antd";

import { AddUnit } from "./components/AddUnit";
import { TableUnit } from "./components/TableUnit";
import { useEffect, useState } from "react";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { UnitServices } from "./services/unit.service";
import { ITypeGetdataAll } from "./common";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";

export default function UnitPage() {
  const stockAuth = useAxiosStock();
  const unitServices = UnitServices(stockAuth);
  const [getloading, setLoading] = useState<boolean>(true);
  const [getdataAll, setdataAll] = useState<ITypeGetdataAll[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});
  const [paginationConfig, setPaginationConfig] = useState<number>(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    skip: 0,
  });

  useEffect(() => {
    fecthData();
  }, [getloading]);

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onFilter = async (value: any) => {
    let search = {};
    if (value.unitName) {
      search = { ...search, unitName: { contains: value.unitName } };
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
    setPagination({
      current: 1,
      pageSize: 10,
      skip: 0,
    });
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };

  const fecthData = async () => {
    const result = await unitServices.findMany(search);
    if (result) {
      setPaginationConfig(result.length);
      setdataAll(result);
      setLoading(false);
    }
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
    <>
      <Row gutter={[8, 8]}>
        <Col span={24} style={{ marginBottom: "20px" }}>
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
                title: <span>Set Unit </span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`SET UNIT`}</div>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <div className="title-page-font">
            <AddUnit setLoading={(e: boolean) => setLoading(e)} />
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <TableUnit
              getloading={getloading}
              getdataAll={getdataAll}
              setLoading={(e: boolean) => setLoading(e)}
              handleOpenFilter={(e: boolean) => handleOpenFilter(e)}
              openFilter={openFilter}
              onFilter={(e: any) => onFilter(e)}
              paginationConfig={paginationConfig}
              pagination={pagination}
              handlerPaginationTable={(e: any) => handlerPaginationTable(e)}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}
