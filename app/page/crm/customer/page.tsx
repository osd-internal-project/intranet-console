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
import CustomerFilterComponent from "./components/customer-filter";
import CustomerTableComponent from "./components/customer-table";
import { ITCustomer, ITCustomerForm, ITPagination } from "./common";
import CrmServices from "./services/index.service";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
import { checkRule } from "@/app/utils/rules";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MaTaskPage() {
  const { data: session } = useSession();
  const intranetAuth = useAxiosCrm();
  const crmServices = CrmServices(intranetAuth);
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataTable, setDataTable] = useState<ITCustomer[]>([]);
  const [search, setSearch] = useState<object>({});
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    if (session?.user.userId) {
      const skip: number =
        (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take: number = Number(pagination.pageSize);
      const res = await crmServices.findCustomerDataTable(
        search,
        take,
        skip,
        session?.user.userId
      );
      setDataTable(res.data);
      setPagination({ ...pagination, total: res.count });
    }
    setloading(false);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };

  // async function editCustomer(id: number, data: ITCustomerForm): Promise<void> {
  //   await maTypeServices.update(id, data);
  //   setloading(true);
  // }

  async function deleteCustomer(id: number): Promise<void> {
    await crmServices.delete(id);
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
                href: "/page/customer",
                title: <span>CRM</span>,
              },
              {
                title: <span>Customer</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`CUSTOMER`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <div className=" grid grid-col-1 space-y-2">
                <div className=" flex justify-end">
                  <Link href="/page/crm/customer/add-customer">
                    <Button size="small" type="primary">
                      Add Customer
                    </Button>
                  </Link>
                </div>
                <div>
                  <CustomerFilterComponent
                    onSearch={(data) => {
                      setSearch(data);
                      setPagination({ ...pagination, current: 1 });
                      setloading(true);
                    }}
                  />
                </div>
                <CustomerTableComponent
                  dataTable={dataTable}
                  loading={loading}
                  setLoading={(e: boolean) => setloading(e)}
                  pagination={pagination}
                  changePagination={changePagination}
                  deleteCustomer={deleteCustomer}
                />
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </Spin>
  );
}
