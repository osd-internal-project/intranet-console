"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Row,
  Spin,
  TablePaginationConfig,
} from "antd";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
import Link from "next/link";
import CustomerProductServices from "@/app/services/customer-product.service";
import { ITCustomerProduct } from "@/app/common/product";
import ProductTableComponent from "./components/product-table";
import ProductFilterComponent from "./components/product-filter";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";

export default function ProductsPage() {
  const { id24Axios } = useId24();
  const baseUrlCrm = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_CRM);
  const customerProductServices = CustomerProductServices(baseUrlCrm);
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataTable, setDataTable] = useState<ITCustomerProduct[]>([]);
  const [search, setSearch] = useState<object>({});
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    const res = await customerProductServices.findDatatable(search, take, skip);
    setDataTable(res.data);
    setPagination({ ...pagination, total: res.count });
    setloading(false);
  };
  const handdleSearch = (value: object) => {
    setSearch(value);
    setloading(true);
  };
  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link href={"/page"}>Home</Link>,
              },
              {
                title: <span>CRM</span>,
              },
              {
                title: <span>Products</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`Products`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <div className=" flex justify-end mb-2">
                <Link href={"/page/crm/products/add"}>
                  <Button type="primary" size="small">
                    Add Product
                  </Button>
                </Link>
              </div>
              <div>
                <ProductFilterComponent onSearch={handdleSearch} />
              </div>
              <div>
                <ProductTableComponent
                  dataTable={dataTable}
                  pagination={pagination}
                  changePagination={changePagination}
                />
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </Spin>
  );
}
