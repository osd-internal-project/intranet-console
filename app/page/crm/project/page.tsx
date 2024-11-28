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
import ProjectFilterComponent from "./components/project-filter";
import ProjectTableComponent from "./components/project-table";
// import { ITCustomer, ITCustomerForm, ITPagination } from "./common";
// import CrmServices from "./services/index.service";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { checkRule } from "@/app/utils/rules";
import Link from "next/link";
import CrmServices from "./services/index.service";
import { useSession } from "next-auth/react";
import UserServices from "./services/user.service";
import { ITSelectUsers } from "./common";

export default function MaTaskPage() {
  const { data: session } = useSession();
  const rules = {
    ruleProjectShow: checkRule("crm-p-s"),
    ruleProjectAdd: checkRule("crm-p-a"),
    ruleProjectEdit: checkRule("crm-p-e"),
    ruleProjectDelete: checkRule("crm-p-d"),
    ruleProjectTaskAdd: checkRule("crm-pt-a"),
    ruleProjectTaskEdit: checkRule("crm-pt-e"),
    ruleProjectTaskDelete: checkRule("crm-pt-d"),
    ruleTicketAdd: checkRule("crm-t-a"),
    ruleTicketEdit: checkRule("crm-t-e"),
    ruleTicketRequestFilesEdit: checkRule("crm-trf-e"),
    ruleTicketUpdateStatus: checkRule("crm-t-u"),
    ruleTicketHold: checkRule("crm-t-h"),
    ruleTicketComplete: checkRule("crm-t-c"),
  };
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);

  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [search, setSearch] = useState<object>({});

  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    if (session?.user.userId) {
      const skip: number =
        (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take: number = Number(pagination.pageSize);
      const res = await crmServices.findProjectDataTable(
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
                // href: "/page/mantenance-type",
                title: <span>Project</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`PROJECT`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            {rules.ruleProjectShow ? (
              <Card>
                <div className=" grid grid-col-1 space-y-2">
                  <div className=" flex justify-end">
                    {rules.ruleProjectAdd ? (
                      <Link href="/page/crm/project/add-project">
                        <Button size="small" type="primary">
                          Add Project
                        </Button>
                      </Link>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div>
                    <ProjectFilterComponent
                      onSearch={(data) => {
                        setSearch(data);
                        setPagination({ ...pagination, current: 1 });
                        setloading(true);
                      }}
                    />
                  </div>
                  <ProjectTableComponent
                    dataTable={dataTable}
                    changePagination={changePagination}
                    pagination={pagination}
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
