import React from "react";
import type { FormInstance, TableColumnsType } from "antd";
import { Button, Input, Table } from "antd";
import ProjectTicketAddComponent from "./project-ticket-add";
import {
  ITProjectTaskForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
} from "../../common";
import Link from "next/link";
import { dateToStringThNoTime } from "@/app/utils/format";

// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  // loading: boolean;
  // setLoading: (loading: boolean) => void;
  projectId: number;
  projectTaskSelectId: number | undefined;
  projectTicketList: ITProjectTicket[];
  showModalTicketAdd: boolean;
  onShowModalProjectTicketAdd: (status: boolean) => void;
  onSaveProjectTicket: (
    projectId: number,
    form: ITProjectTicketCreateForm
  ) => void;
}

const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const TicketComponent: React.FC<props> = ({
  projectId,
  projectTaskSelectId,
  projectTicketList,
  showModalTicketAdd,
  onShowModalProjectTicketAdd,
  onSaveProjectTicket,
}): React.ReactElement => {
  const ticketColumns: TableColumnsType<ITProjectTicket> = [
    {
      key: "No.",
      dataIndex: "No.",
      title: "Project Code",
      width: "100px",
      align: "center",
      render: (data: Date, record: ITProjectTicket, index: number) => index + 1,
    },
    {
      key: "ticketTitle",
      dataIndex: "ticketTitle",
      title: "Title",
      width: "200px",
    },

    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      width: "200px",
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Create Date",
      width: "200px",
      render: (data: Date) => dateToStringThNoTime(data),
    },
    {
      key: "createdByName",
      dataIndex: "createdByName",
      title: "Created By",
      width: "200px",
    },

    {
      key: "id",
      dataIndex: "id",
      title: "ตรวจสอบ",
      width: "200px",
      align: "center",
    },
  ];
  return (
    <>
      <div className=" flex justify-end">
        <Button
          size="small"
          type="primary"
          onClick={() => {
            onShowModalProjectTicketAdd(true);
          }}
        >
          Add Ticket
        </Button>
      </div>
      <div className=" flex justify-end"></div>
      <div>
        <Table
          columns={ticketColumns}
          dataSource={projectTicketList}
          rowKey={(data, index) => data.id}
        />
      </div>

      <ProjectTicketAddComponent
        projectTaskSelectId={projectTaskSelectId}
        projectId={projectId}
        showModalTicketAdd={showModalTicketAdd}
        onShowModalProjectTicketAdd={onShowModalProjectTicketAdd}
        onSaveProjectTicket={onSaveProjectTicket}
      />
    </>
  );
};

export default TicketComponent;
