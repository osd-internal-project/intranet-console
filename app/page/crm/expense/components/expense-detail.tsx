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
  data: any;
  showState: boolean;
  handdleShowState: (state: boolean) => void;
}

const ExpenseDetailComponent: React.FC<props> = ({
  rules,
  data,
  showState,
  handdleShowState,
}): React.ReactElement => {
  return (
    <Modal
      title={"ข้อมูลการเบิก"}
      open={showState}
      onCancel={() => handdleShowState(false)}
      maskClosable={false}
    >
      11
    </Modal>
  );
};

export default ExpenseDetailComponent;
