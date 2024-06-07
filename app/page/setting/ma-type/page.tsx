"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row, Spin } from "antd";
import MaTypeCreateComponent from "./components/MaTypeCreate";
import MaTypeTableComponent from "./components/MaTypeTable";
import { ITMaType, ITMaTypeForm, ITPagination } from "./common";
import MaTypeServices from "./services/ma.service";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";

import { checkRule } from "@/app/utils/rules";
export default function MaTaskPage() {
  const intranetAuth = useAxiosIntranet();
  const maTypeServices = MaTypeServices(intranetAuth);
  const addRule = checkRule("ma-type-add");
  const showRule = checkRule("ma-type-show");

  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<ITPagination>({ current: 1, pageSize: 10 });
  const [dataTable, setDataTable] = useState<ITMaType[]>([]);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);
  const fetchData = async () => {
    const data = await maTypeServices.findMaTypeAll();
    setDataTable(data);
    setloading(false);
  };
  const changePagination = (page: ITPagination) => {
    console.log(page);
  };
  async function createMaType(form: ITMaTypeForm): Promise<void> {
    await maTypeServices.create(form);
    setloading(true);
  }

  async function editMaType(id: number, data: ITMaTypeForm): Promise<void> {
    await maTypeServices.update(id, data);
    setloading(true);
  }

  async function deleteMaType(id: number): Promise<void> {
    await maTypeServices.delete(id);
    setloading(true);
  }

  return (
    <Spin spinning={loading}>
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
                href: "/page/ma-type",
                title: <span>Set MA Type</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`SET MA TYPE`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <MaTypeCreateComponent createMaType={createMaType} />
            </Card>
            <Card>
              <MaTypeTableComponent
                dataTable={dataTable}
                loading={loading}
                setLoading={(e: boolean) => setloading(e)}
                pagination={pagination}
                changePagination={changePagination}
                editMaType={editMaType}
                deleteMaType={deleteMaType}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </Spin>
  );
}
