"use client";
import { Breadcrumb, Card, Col, Divider, Form, message, Row, TablePaginationConfig } from "antd";
import React, { useEffect, useState } from "react";
import FilterUnitPage from "./components/filter-unit";
import TableUnitPage from "./components/table-unit";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import UnitServices from "./services";
import { ITUnit, ITUnitCreateInput } from "./common";
import { Dayjs } from "dayjs";
import ManageUnit from "./components/manage-unit";

const UnitPage = () => {
  const { id24Axios } = useId24();
  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const unitServices = UnitServices(baseUrlInventory);
  const [form] = Form.useForm();
  const [formManage] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<{ data: ITUnit[]; count: number }>({ data: [], count: 0 });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [params, setParams] = useState<{ unitName?: string; createdAt?: Dayjs | string | null }>({ unitName: "", createdAt: null });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openMange, setOpenMange] = useState<{ status: boolean; type: string }>({ status: false, type: "create" });

  useEffect(() => {
    if (loading) {
      fecthData();
    }
  }, [loading]);

  const fecthData = async () => {
    try {
      const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take = Number(pagination.pageSize);
      const { data, count } = await unitServices.findMany(params, skip, take);
      setDataSource({ data, count });
      setLoading(false);
    } catch (err) {
      message.error(`error fecth-data 🚀 ${err}`);
    }
  };

  const onFilters = (values: { unitName?: string; createdAt?: Dayjs | string }) => {
    setParams(values);
    setLoading(true);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  const handleFilter = (status: boolean) => {
    setOpenFilter(status);
  };

  const handleManage = (status: boolean, type: string, values?: ITUnitCreateInput) => {
    if (type === "close") {
      formManage.resetFields();
    } else {
      formManage.setFieldsValue(values);
    }
    setOpenMange({ status, type });
  };

  const onFinish = async (values: ITUnit, type: string) => {
    try {
      const records = formManage.getFieldsValue(true);
      const response =
        type === "create"
          ? await unitServices.create(values)
          : type === "edit"
          ? await unitServices.update(records.id, values)
          : await unitServices.delete(records.id);
      if (response) {
        formManage.resetFields();
        setLoading(true);
        setOpenMange({ status: false, type: "create" });
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0,
        });
        message.info(type === "create" ? "create success" : type === "edit" ? "edit success" : "delete success");
      }
    } catch (err) {
      message.error(`error manage 🚀 ${err}`);
    }
  };
  return (
    <div>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                href: "/page/setting",
                title: <span>Settings</span>,
              },
              {
                title: <span>การจัดการยูนิตสินค้า</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>การจัดการยูนิตสินค้า</span>
          </div>
        </Divider>
      </Row>
      <Card styles={{ body: { padding: "10px" } }}>
        <div>
          <div>
            <FilterUnitPage onFilters={onFilters} form={form} handleFilter={handleFilter} openFilter={openFilter} handleManage={handleManage} />
          </div>
          <div>
            <TableUnitPage dataSource={dataSource} changePagination={changePagination} pagination={pagination} handleManage={handleManage} />
          </div>
        </div>
      </Card>
      {openMange.status ? (
        <>
          <ManageUnit openMange={openMange} handleManage={handleManage} formManage={formManage} onFinish={onFinish} />
        </>
      ) : null}
    </div>
  );
};

export default UnitPage;
