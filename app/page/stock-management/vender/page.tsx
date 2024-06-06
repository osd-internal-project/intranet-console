"use client";
import { Breadcrumb, Card, Col, Row, message } from "antd";
import { FilterVender } from "./components/FilterVender";
import { TableVender } from "./components/TableVender";
import { VenderServices } from "./service/vender.service";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useEffect, useState } from "react";
import { typeVender, typeVenderFilter } from "./common";
import { checkRule } from "@/app/utils/rules";
import { useRouter } from "next/navigation";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";

export default function Vender() {
  const stockAuth = useAxiosStock();
  const venderServices = VenderServices(stockAuth);
  const router = useRouter();
  const [getdataallvender, setdataVender] = useState<typeVender[]>([]);
  const [getloading, setLoading] = useState<boolean>(true);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});
  const [paginationConfig, setPaginationConfig] = useState<number>(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    skip: 0,
  });

  useEffect(() => {
    fechtdata();
  }, [getloading]);

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onFilter = async (value: typeVenderFilter) => {
    let search = {};
    if (value.venderName) {
      search = { ...search, venderName: { contains: value.venderName } };
    }
    if (value.description) {
      search = { ...search, description: { contains: value.description } };
    }
    if (value.phoneNumber) {
      search = { ...search, phoneNumber: { contains: value.phoneNumber } };
    }
    if (value.email) {
      search = { ...search, email: { contains: value.email } };
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
  const fechtdata = async () => {
    const getdataAll = await venderServices.getByCondition(search);
    if (getdataAll) {
      setPaginationConfig(getdataAll.length);
      setdataVender(getdataAll);
    }
    setLoading(false);
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
              title: <span>Vender</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`VENDER`}</div>
      </Col>
      <Col span={24}>
        <FilterVender
          setLoading={(e: boolean) => setLoading(e)}
          handleOpenFilter={(e: boolean) => handleOpenFilter(e)}
          openFilter={openFilter}
          onFilter={(e: typeVenderFilter) => onFilter(e)}
        />
      </Col>
      <Col span={24}>
        <Card style={{ height: "100%" }}>
          <TableVender
            getdataallvender={getdataallvender}
            setLoading={(e: boolean) => setLoading(e)}
            getloading={getloading}
            handlerPaginationTable={(e: any) => handlerPaginationTable(e)}
            paginationConfig={paginationConfig}
            pagination={pagination}
          />
        </Card>
      </Col>
    </Row>
  );
}
