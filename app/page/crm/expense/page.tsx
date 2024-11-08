"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  message,
  Modal,
  Row,
  Spin,
  TablePaginationConfig,
} from "antd";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
import { checkRule } from "@/app/utils/rules";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ExpenseTableComponent from "./components/expense-table";
import { ITExpenseType, ITTicketExpense } from "./common";
import CrmServices from "./services/index.service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ExpenseFilterComponent from "./components/expense-filter";
import ExpenseDetailComponent from "./components/expense-detail";
export default function MaTaskPage() {
  const rules = {
    ruleExpenseShow: checkRule("crm-ex"),
    ruleExpenseApprove: checkRule("crm-ex-approve"),
  };

  const { data: session } = useSession();
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [expenseType, setExpenseType] = useState<ITExpenseType[]>([]);
  const [dataTable, setDataTable] = useState<ITTicketExpense[]>([]);
  const [search, setSearch] = useState<object>({});
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const expenseTyoe = await crmServices.findExpenseType();
    setExpenseType(expenseTyoe);
    if (session?.user.userId) {
      const skip: number =
        (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take: number = Number(pagination.pageSize);
      const res = await crmServices.findByUserId(
        session.user.userId,
        search,
        take,
        skip
      );
      setDataTable(res.data);
      setPagination({ ...pagination, total: res.count });
    }
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
  function handdleChangeExpenseStatus(id: number, status: string): void {
    Modal.confirm({
      title: "ดำเนินการขอเบิก",
      icon: <ExclamationCircleFilled />,
      content: `ยืนยันการเปลี่ยนสถานะการขอเบิกเป็น ${status}?`,
      okText: "Confirm",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await crmServices.updateProjectTicketExpense(id, {
          processStatus: status,
        });
        if (dataResult) {
          setloading(true);
        } else {
          message.error("ผิดพลาด");
        }
      },
    });
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
                title: <span>รายการขอเบิกค่าใช้จ่าย</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`รายการขอเบิกค่าใช้จ่าย`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            {rules.ruleExpenseShow ? (
              <Card>
                <ExpenseFilterComponent
                  onSearch={handdleSearch}
                  expenseType={expenseType}
                />
                <ExpenseTableComponent
                  rules={rules}
                  ticketExpense={dataTable}
                  pagination={pagination}
                  handdleChangeExpenseStatus={handdleChangeExpenseStatus}
                  changePagination={changePagination}
                />
                <ExpenseDetailComponent
                  rules={rules}
                  data={undefined}
                  showState={false}
                  handdleShowState={function (state: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                />
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
