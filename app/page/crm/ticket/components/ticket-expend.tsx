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
import { ITExpendType, ITTicketExpend } from "./../common";
import { PlusOutlined } from "@ant-design/icons";
import TicketExpendAdd from "./ticket-expend-add";
import { useForm } from "antd/es/form/Form";
import TicketExpendEdit from "./ticket-expend-edit";

export interface props {
  ticketExpends: ITTicketExpend[];
  ticketId: number;
  expendType: ITExpendType[];
  handleAddTicketExpend: (value: ITTicketExpend) => void;
  handleEditTicketExpend: (expendId: number, value: ITTicketExpend) => void;
  handleDeleteTicketExpend: (expendId: number) => void;
}

const TicketExpend: React.FC<props> = ({
  ticketExpends,
  ticketId,
  expendType,
  handleAddTicketExpend,
  handleEditTicketExpend,
  handleDeleteTicketExpend,
}): React.ReactElement => {
  const [addform] = useForm();
  const [editform] = useForm();
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [editExpendId, setEditExpendId] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    setShowModalAdd(false);
    setEditExpendId(undefined);
    addform.resetFields();
    editform.resetFields();
  }, [ticketExpends]);
  const customerColumns: TableColumnsType<ITTicketExpend> = [
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
      key: "expendType",
      dataIndex: ["expendType", "expendCode"],
      width: "200px",
    },
    {
      title: "รายการ",
      key: "expendType",
      dataIndex: ["expendType", "expendName"],
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
      key: "expendAmount",
      dataIndex: "expendAmount",
      align: "right",
      width: "200px",
      render(value, record, index) {
        return countWithCommas(value);
      },
    },

    {
      title: "ราคา/หน่วย",
      key: "expendPrice",
      dataIndex: "expendPrice",
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
      render: (data: number, record: ITTicketExpend) =>
        numberWithCommas(record.expendAmount * record.expendPrice),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Action",
      width: "200px",
      align: "center",
      render: (id: number, record: ITTicketExpend) => (
        <div className=" flex justify-center space-x-2">
          <Button
            type="link"
            onClick={() => {
              console.log(record);
              editform.setFieldsValue(record);
              setEditExpendId(id);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteTicketExpend(id)}
          >
            Delete
          </Button>
        </div>
      ),
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
        dataSource={ticketExpends}
        size="small"
        rowKey={(data: any) => data.id}
        pagination={false}
      />
      {showModalAdd && (
        <TicketExpendAdd
          addform={addform}
          ticketId={ticketId}
          showModalAdd={showModalAdd}
          closeAddModal={() => setShowModalAdd(false)}
          expendType={expendType}
          handleAddTicketExpend={handleAddTicketExpend}
        />
      )}
      {editExpendId && (
        <TicketExpendEdit
          editform={editform}
          ticketId={ticketId}
          editExpendId={editExpendId}
          closeEditModal={() => setEditExpendId(undefined)}
          expendType={expendType}
          handleEditTicketExpend={handleEditTicketExpend}
        />
      )}
    </>
  );
};

export default TicketExpend;
