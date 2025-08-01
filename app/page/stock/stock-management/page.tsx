"use client";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Breadcrumb, Card, Col, Divider, Form, message, Row, TablePaginationConfig } from "antd";
import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { ITMasterProduct, ITMasterProductCreateInput } from "./common";
import MasterProductServices from "./services";
import FilterMasterProductPage from "./components/filter-master-product";
import TableMasterProductPage from "./components/table-master-product";
import ManageMasterProductPage from "./components/manage-master-product";
import { useRouter } from "next/navigation";

const StockManagement: React.FC = (): React.ReactElement => {
  const { id24Axios } = useId24();
  const navigate = useRouter();
  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const masterproductServices = MasterProductServices(baseUrlInventory);
  const [form] = Form.useForm();
  const [formManage] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<{ data: ITMasterProduct[]; count: number }>({ data: [], count: 0 });
  const [params, setParams] = useState<{ prdName?: string; updatedBy: string; createdAt?: Dayjs | string | null }>({
    prdName: "",
    updatedBy: "",
    createdAt: null,
  });
  const [openMange, setOpenMange] = useState<{ status: boolean; type: string }>({ status: false, type: "create" });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (loading) {
      fecthData();
    }
  }, [loading]);

  const fecthData = async () => {
    try {
      const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take = Number(pagination.pageSize);
      const { data, count } = await masterproductServices.findMany(params, skip, take);
      setDataSource({ data, count });
      setLoading(false);
    } catch (err) {
      message.error(`error fecth-data 🚀 ${err}`);
    }
  };

  const onFilters = (values: { prdName?: string; updatedBy: string; createdAt?: Dayjs | string }) => {
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

  const handleManage = (status: boolean, type: string, values?: ITMasterProduct) => {
    if (type === "close" || type === "delete") {
      type === "close" ? formManage.resetFields() : formManage.setFieldsValue(values);
      setOpenMange({ status, type });
    } else {
      navigate.push(`/page/stock/stock-management/${type}?prdId=${values?.prdId}`);
    }
  };

  const onFinish = async (values: ITMasterProductCreateInput, type: string) => {
    try {
      const records = formManage.getFieldsValue(true);
      const response = await masterproductServices.delete(records.id);
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
                title: <span>{`หน้าหลัก`}</span>,
              },
              {
                href: "/page/stock",
                title: <span>{`การจัดการสินค้า`}</span>,
              },
              {
                title: <span>{`ตารางรายการสินค้า`}</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>{`ตารางรายการสินค้า`}</span>
          </div>
        </Divider>
      </Row>
      <Card styles={{ body: { padding: "10px" } }}>
        <div>
          <div>
            <FilterMasterProductPage
              onFilters={onFilters}
              form={form}
              handleFilter={handleFilter}
              openFilter={openFilter}
              handleManage={handleManage}
            />
          </div>
          <div>
            <TableMasterProductPage dataSource={dataSource} changePagination={changePagination} pagination={pagination} handleManage={handleManage} />
          </div>
        </div>
      </Card>
      {openMange.status ? (
        <>
          <ManageMasterProductPage openMange={openMange} handleManage={handleManage} formManage={formManage} onFinish={onFinish} />
        </>
      ) : null}
    </div>
  );
};
export default StockManagement;
