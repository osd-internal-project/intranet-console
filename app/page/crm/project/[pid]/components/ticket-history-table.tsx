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
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";

import Link from "next/link";
import { ITTicketHistoryLog } from "../../common";

export interface props {
  ticketHistoryLogs: ITTicketHistoryLog[];
}

const TicketHistoryTableComponent: React.FC<props> = ({
  ticketHistoryLogs,
}): React.ReactElement => {
  const customerColumns: TableColumnsType<any> = [
    {
      key: "updatedAt",
      dataIndex: "updatedAt",
      title: "Action Date",
      width: "200px",
      render: (data: Date) => dateToStringTh(data),
    },
    {
      key: "type",
      dataIndex: "type",
      title: "Type",
      width: "200px",
    },
    {
      key: "updatedByName",
      dataIndex: "updatedByName",
      title: "Action By",
      width: "200px",
    },

    {
      key: "detail",
      dataIndex: "detail",
      title: "Detail",
      width: "200px",
    },
  ];

  return (
    <>
      <Table
        columns={customerColumns}
        dataSource={ticketHistoryLogs}
        size="small"
        rowKey={(data: any) => data.id}
        pagination={false}
      />
    </>
  );
};

export default TicketHistoryTableComponent;
