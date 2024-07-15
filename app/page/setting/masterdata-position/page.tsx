"use client";

import { Breadcrumb, Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import { AddMasterdataPosition } from "./components/AddMasterdataPosition";
import { TableMasterdataPosition } from "./components/TableMasterdataPosition";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { PositionServices } from "./services/position.service";
import { ITypeGetdataAll } from "./common";
import DepartmentServices from "../department/services/department.service";
import { TdepartmentFindMany } from "../department/common";

export default function MasterDataPositionPage() {
  const userAuth = useAxiosUser();
  const intranetAuth = useAxiosIntranet();
  const positionServices = PositionServices(userAuth);
  const departmentServices = DepartmentServices(intranetAuth);
  const [getloading, setLoading] = useState<boolean>(true);
  const [getdataAll, setdataAll] = useState<ITypeGetdataAll[]>([]);
  const [departMent, setDepartMent] = useState<TdepartmentFindMany[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});

  useEffect(() => {
    fecthData();
  }, [getloading]);

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const onFilter = async (value: any) => {
    let search = {};
    if (value.nameTh) {
      search = { ...search, nameTh: { contains: value.nameTh } };
    }
    if (value.nameEn) {
      search = { ...search, nameEn: { contains: value.nameEn } };
    }
    if (value.createdAt) {
      search = {
        ...search,
        createdAt: {
          gte: value.createdAt[0].startOf("day"),
          lte: value.createdAt[1].endOf("day"),
        },
      };
    }
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };

  const fecthData = async () => {
    const result = await positionServices.findMany(search);
    const resDepartment = await departmentServices.findMany();
    setDepartMent(resDepartment);
    if (result) {
      setdataAll(result);
      setLoading(false);
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Setting</span>,
              },
              {
                title: <span>Set Position</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Set Position`}</div>
        </Divider>
      </Row>
      <Col span={24}>
        <div className="title-page-font">
          <AddMasterdataPosition departMent={departMent} setLoading={(e: boolean) => setLoading(e)} />
        </div>
      </Col>
      <Col span={24}>
        <div className="grid grid-cols-1 ">
          <TableMasterdataPosition
            getloading={getloading}
            getdataAll={getdataAll}
            setLoading={(e: boolean) => setLoading(e)}
            handleOpenFilter={(e: boolean) => handleOpenFilter(e)}
            openFilter={openFilter}
            onFilter={(e: any) => onFilter(e)}
          />
        </div>
      </Col>
    </>
  );
}
