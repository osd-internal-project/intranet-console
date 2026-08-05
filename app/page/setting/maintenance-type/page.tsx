"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, Row, Spin } from "antd";
import MaTypeCreateComponent from "./components/MaTypeCreate";
import MaTypeTableComponent from "./components/MaTypeTable";
import { ITMaType, ITMaTypeForm, ITPagination } from "./common";
import MaintenanceTypeServices from "../../../services/maintenance-type.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

import { notifySuccess } from "@/app/utils/message";
export default function Page() {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const maintenancetypeservices = MaintenanceTypeServices(baseUrIntranet);

  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<ITPagination>({
    current: 1,
    pageSize: 10,
  });
  const [dataTable, setDataTable] = useState<ITMaType[]>([]);

  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const data = await maintenancetypeservices.findMaTypeAll();
    setDataTable(data);
    setloading(false);
  };

  const changePagination = (page: ITPagination) => {
    console.log(page);
  };

  async function createMaType(form: ITMaTypeForm): Promise<void> {
    await maintenancetypeservices.create(form);
    notifySuccess("setting.maintenancetype.create");
    setloading(true);
  }

  async function editMaType(id: number, data: ITMaTypeForm): Promise<void> {
    await maintenancetypeservices.update(id, data);
    setloading(true);
  }

  async function deleteMaType(id: number): Promise<void> {
    await maintenancetypeservices.delete(id);
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
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>ตั้งค่า</span>,
              },
              {
                title: <span>จัดการการบำรุงรักษา</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`จัดการการบำรุงรักษา`}</div>
        </Divider>
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
