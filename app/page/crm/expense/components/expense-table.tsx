import React, { useEffect, useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  TableColumnsType,
  TableColumnType,
  TablePaginationConfig,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import {
  countWithCommas,
  dateToStringTh,
  dateToStringThNoTime,
  numberWithCommas,
} from "@/app/utils/format";

import Link from "next/link";
import { ITTicketExpense } from "./../common";

export interface props {
  rules: any;
  pagination: TablePaginationConfig;
  ticketExpense: ITTicketExpense[];
  handdleChangeExpenseStatus: (id: number, status: string) => void;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const ExpenseTableComponent: React.FC<props> = ({
  rules,
  pagination,
  ticketExpense,
  handdleChangeExpenseStatus,
  changePagination,
}): React.ReactElement => {
  const expenseColumn: TableColumnsType<ITTicketExpense> = [
    {
      title: "No.",
      key: "id",
      dataIndex: "id",
      align: "center",
      width: "100px",
      render: (id: number, record, index: number) => index + 1,
    },
    {
      title: "ประเภทค่าใช้จ่าย",
      key: "expenseType",
      dataIndex: ["expenseType", "expenseCode"],
      width: "200px",
    },
    {
      title: "รายการ",
      key: "expenseType",
      dataIndex: ["expenseType", "expenseName"],
      width: "200px",
    },
    {
      title: "รายละเอียด",
      key: "description",
      dataIndex: "description",
      width: "250px",
    },
    {
      title: "จำนวน",
      key: "expenseAmount",
      dataIndex: "expenseAmount",
      align: "right",
      width: "200px",
      render(value, record, index) {
        return countWithCommas(value);
      },
    },

    {
      title: "ราคา/หน่วย",
      key: "expensePrice",
      dataIndex: "expensePrice",
      width: "100px",
      align: "right",
      render(value, record, index) {
        return numberWithCommas(value);
      },
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ราคารวม",
      width: "200px",
      align: "right",
      render: (data: number, record: ITTicketExpense) =>
        numberWithCommas(record.expenseAmount * record.expensePrice),
    },
    {
      key: "processStatus",
      dataIndex: "processStatus",
      title: "ราคารวม",
      width: "200px",
      align: "center",
      render: (data: string) => (
        <>
          {data === "wait" && <Tag color="blue">Wait Approve</Tag>}
          {data === "approved" && <Tag color="green">Approved</Tag>}
          {data === "canceled" && <Tag color="red">Canceled</Tag>}
        </>
      ),
    },
    {
      title: "วันที่ขอเบิก",
      key: "createdAt",
      dataIndex: ["createdAt"],
      width: "200px",
      render: (data: Date) => dateToStringTh(data),
    },
    {
      title: "ผู้ขอเบิก",
      key: "createdAt",
      dataIndex: ["updatedByName"],
      width: "200px",
    },

    {
      key: "id",
      dataIndex: "id",
      title: "Action",
      width: "200px",
      align: "center",
      render: (id: number, record: ITTicketExpense) => {
        return (
          rules.ruleExpenseApprove &&
          record.processStatus === "wait" && (
            <div className=" flex justify-center space-x-2">
              <Button
                type="link"
                onClick={() => handdleChangeExpenseStatus(id, "approved")}
              >
                Approve
              </Button>
              <Button
                type="link"
                onClick={() => handdleChangeExpenseStatus(id, "canceled")}
                danger
              >
                Cancel
              </Button>
            </div>
          )
        );
      },
    },
  ];
  return (
    <>
      <Table
        columns={expenseColumn}
        dataSource={ticketExpense}
        size="small"
        rowKey={(data: any) => data.id}
        onChange={changePagination}
        pagination={pagination}
      />
    </>
  );
};

export default ExpenseTableComponent;
