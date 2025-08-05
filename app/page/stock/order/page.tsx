"use client";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Breadcrumb, Card, Col, Divider, Form, message, Row, TablePaginationConfig } from "antd";
import React, { useEffect, useState } from "react";
import OrderServices from "../services/order.service";
import { Dayjs } from "dayjs";
import { OrderTablePage } from "./components/order-table";
import MasterProductServices from "../services/stock.service";
import { ITMasterProduct } from "../common/master-product";

const OrderPage: React.FC = (): React.ReactElement => {
  const { id24Axios } = useId24();

  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const orderServices = OrderServices(baseUrlInventory);
  const masterproductServices = MasterProductServices(baseUrlInventory);
  const [form] = Form.useForm();
  const [formManage] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<{ data: ITMasterProduct[]; count: number }>({ data: [], count: 0 });
  const [params, setParams] = useState<{ createdAt?: Dayjs | string | null }>({
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
      console.log(`data 🚀 ~`, data);
      console.log(`count 🚀 ~`, count);
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
                title: <span>{`นำเข้าสินค้า`}</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>{`นำเข้าสินค้า`}</span>
          </div>
        </Divider>
      </Row>
      <Card styles={{ body: { padding: "10px" } }}>
        <div>
          <div>
            {/* <FilterMasterProductPage
              onFilters={onFilters}
              form={form}
              handleFilter={handleFilter}
              openFilter={openFilter}
              handleManage={handleManage}
            /> */}
          </div>
          <div>
            <OrderTablePage dataSource={dataSource} changePagination={changePagination} pagination={pagination} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderPage;
