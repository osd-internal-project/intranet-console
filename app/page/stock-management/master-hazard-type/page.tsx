"use client";
import { Breadcrumb, Card, Col, Divider, Row } from "antd";
import { CreateMasterHazardtype } from "./components/CreateMasterHazardtype";
import { TableMasterHazardtype } from "./components/TableMasterHazardtype";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import MasterHazardTypeService from "./services/index.service";

export default function MasterHazardType() {
  const stockAuth = useAxiosStock();
  const Masterhazardtype = MasterHazardTypeService(stockAuth);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataTable, setDataTable] = useState<any[]>([]);
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
    const dataTable = await Masterhazardtype.getdataAll(search);
    if (dataTable) {
      setPaginationConfig(dataTable.length);
      setDataTable(dataTable);
      setLoading(false);
    }
  };

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const onFilter = async (value: any) => {
    let search = {};
    if (value.nameHazard) {
      search = { ...search, nameHazard: { contains: value.nameHazard } };
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
                title: <span>Set Hazard Type</span>,
              },
            ]}
          />
        </Col>

        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Set Hazard Type`}</div>
        </Divider>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <CreateMasterHazardtype
                propLoading={(e: boolean) => setLoading(e)}
                loading={loading}
                handleOpenFilter={(e: boolean) => handleOpenFilter(e)}
                openFilter={openFilter}
                onFilter={(e: any) => onFilter(e as any)}
              />
              <TableMasterHazardtype
                propLoading={(e: boolean) => setLoading(e)}
                loading={loading}
                dataTable={dataTable}
                paginationConfig={paginationConfig}
                filter={pagination}
                handlerPaginationTable={(e: any) => handlerPaginationTable(e)}
                setPagination={(e: any) => setPagination(e)}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
