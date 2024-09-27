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
import { ITExpenseType, ITTicketExpense } from "../../common";
import { PlusOutlined } from "@ant-design/icons";
import TicketExpenseAdd from "./ticket-expense-add";
import { useForm } from "antd/es/form/Form";
import TicketExpenseEdit from "./ticket-expense-edit";

export interface props {
  ticketExpense: ITTicketExpense[];
  ticketId: number;
  expenseType: ITExpenseType[];
  handleAddTicketExpense: (value: ITTicketExpense) => void;
  handleEditTicketExpense: (expenseId: number, value: ITTicketExpense) => void;
  handleDeleteTicketExpense: (expenseId: number) => void;
}

const TicketExpense: React.FC<props> = ({
  ticketExpense,
  ticketId,
  expenseType,
  handleAddTicketExpense,
  handleEditTicketExpense,
  handleDeleteTicketExpense,
}): React.ReactElement => {
  const [addform] = useForm();
  const [editform] = useForm();
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    setShowModalAdd(false);
    setEditExpenseId(undefined);
    addform.resetFields();
    editform.resetFields();
  }, [ticketExpense]);
  const customerColumns: TableColumnsType<ITTicketExpense> = [
    {
      title: "No.",
      key: "id",
      dataIndex: "id",
      align: "center",
      width: "100px",
      render: (id: number, record, index: number) => index + 1,
    },
    {
      title: "ประเภทการเบิก",
      key: "formType",
      dataIndex: "formType",
      width: "200px",
      align: "center",
      render: (data: string) =>
        data === "normal" ? (
          <div className="font-bold text-sky-700">Normal</div>
        ) : data === "advance" ? (
          <div className=" font-bold  text-orange-600">Advance</div>
        ) : (
          <></>
        ),
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
      key: "id",
      dataIndex: "id",
      title: "Action",
      width: "200px",
      align: "center",
      render: (id: number, record: ITTicketExpense) => {
        return (
          record.processStatus === "wait" && (
            <div className=" flex justify-center space-x-2">
              <Button
                type="link"
                onClick={() => {
                  editform.setFieldsValue(record);
                  setEditExpenseId(id);
                }}
              >
                Edit
              </Button>
              <Button
                type="link"
                danger
                onClick={() => handleDeleteTicketExpense(id)}
              >
                Delete
              </Button>
            </div>
          )
        );
      },
    },
  ];

  return (
    <>
      <div className=" flex justify-between mb-2">
        <div className=" font-bold text-lg">รายการขอเบิก</div>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost={!showModalAdd}
          onClick={() => setShowModalAdd(!showModalAdd)}
        >
          Add
        </Button>
      </div>
      <Table
        columns={customerColumns}
        dataSource={ticketExpense}
        size="small"
        rowKey={(data: any) => data.id}
        pagination={false}
      />
      {showModalAdd && (
        <TicketExpenseAdd
          addform={addform}
          ticketId={ticketId}
          showModalAdd={showModalAdd}
          closeAddModal={() => setShowModalAdd(false)}
          expenseType={expenseType}
          handleAddTicketExpense={handleAddTicketExpense}
        />
      )}
      {editExpenseId && (
        <TicketExpenseEdit
          editform={editform}
          ticketId={ticketId}
          editExpenseId={editExpenseId}
          closeEditModal={() => setEditExpenseId(undefined)}
          expenseType={expenseType}
          handleEditTicketExpense={handleEditTicketExpense}
        />
      )}
    </>
  );
};

export default TicketExpense;
