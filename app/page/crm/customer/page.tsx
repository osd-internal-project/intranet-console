"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  message,
  Row,
  Spin,
  TablePaginationConfig,
} from "antd";
import CustomerFilterComponent from "./components/customer-filter";
import CustomerTableComponent from "./components/customer-table";
import { ITCustomer, ITCustomerForm, ITPagination } from "./common";
import CrmServices from "./services/index.service";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";

import Link from "next/link";
import { UserContectType, UserContext } from "@/app/config/userContext";

export default function MaTaskPage() {
  const { user, roles } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };

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
    if (user?.userId) {
      const skip: number =
        (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take: number = Number(pagination.pageSize);
      const res = await crmServices.findCustomerDataTable(
        search,
        take,
        skip,
        user?.userId
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
    await crmServices.delete(id).then((data) => {
      message.success("ลบสำเร็จ");
    });
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
                title: <span>CRM</span>,
              },
              {
                title: <span>Customer</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`CUSTOMER GROUP`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            {roles?.crmCustomerShow ? (
              <Card>
                <div className=" grid grid-col-1 space-y-2">
                  <div className=" flex justify-end">
                    {roles.crmCustomerShow ? (
                      <Link href="/page/crm/customer/add-customer">
                        <Button size="small" type="primary">
                          Add Customer GROUP
                        </Button>
                      </Link>
                    ) : (
                      <></>
                    )}
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
                    roles={roles}
                    dataTable={dataTable}
                    loading={loading}
                    setLoading={(e: boolean) => setloading(e)}
                    pagination={pagination}
                    changePagination={changePagination}
                    deleteCustomer={deleteCustomer}
                  />
                </div>
              </Card>
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
    </Spin>
  );
}
