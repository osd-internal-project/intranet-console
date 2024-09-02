import React from "react";
import type {
  FormInstance,
  TableColumnsType,
  TablePaginationConfig,
} from "antd";
import { Button, Input, Table, Tag } from "antd";
// import ProjectTicketAddComponent from "./project-ticket-add";
import {
  ITProjectTaskForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
  ITTicketConfigs,
} from "./../common";
import Link from "next/link";
import { dateToStringThNoTime } from "@/app/utils/format";
import { EditOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib";

// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  // loading: boolean;
  // setLoading: (loading: boolean) => void;
  projectTaskSelectId: number | undefined;
  projectTicketList: ITProjectTicket[];
  showModalTicketAdd: boolean;
  ticketConfigs: ITTicketConfigs;
  onShowModalProjectTicketAdd: (status: boolean) => void;
  onShowModalProjectTicketDetail: (id: number | undefined) => void;
  onSaveProjectTicket: (
    taskId: number | undefined,
    form: ITProjectTicketCreateForm,
    attendFiles: UploadFile[]
  ) => void;
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
}

const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const TicketComponent: React.FC<props> = ({
  projectTaskSelectId,
  projectTicketList,
  showModalTicketAdd,
  onShowModalProjectTicketAdd,
  onShowModalProjectTicketDetail,
  onSaveProjectTicket,
  ticketConfigs,
  pagination,
  changePagination,
}): React.ReactElement => {
  const ticketColumns: TableColumnsType<ITProjectTicket> = [
    {
      key: "id",
      dataIndex: "id",
      title: "No.",
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
      render: (status) => {
        return status === "new" ? (
          <Tag color="#faad14">New</Tag>
        ) : status === "inprogress" ? (
          <Tag color="#1677ff">Inprogress</Tag>
        ) : status === "finish" ? (
          <Tag color="#52c41a">Finish</Tag>
        ) : status === "cancel" ? (
          <Tag color="#f5222d">Cancel</Tag>
        ) : status === "hold" ? (
          <Tag color="#aB5E00">On Hold</Tag>
        ) : status === "complete" ? (
          <Tag color="#aaa">Complete</Tag>
        ) : (
          <></>
        );
      },
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Create Date",
      width: "200px",
      render: (data: Date) => (data ? dateToStringThNoTime(data) : ""),
    },
    {
      key: "createdByName",
      dataIndex: "createdByName",
      title: "Created By",
      width: "200px",
    },
    {
      key: "assignName",
      dataIndex: "assignName",
      title: "Assign To ",
      width: "200px",
    },
    {
      key: "dueDate",
      dataIndex: "dueDate",
      title: "Due Date",
      width: "200px",
      render: (data: Date) => (data ? dateToStringThNoTime(data) : ""),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ดำเนินการ",
      width: "200px",
      align: "center",
      render: (data: number) => (
        <Button
          type="link"
          onClick={() => (data ? onShowModalProjectTicketDetail(data) : {})}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ];
  return (
    <>
      {/* <div className=" flex justify-end mb-4">
        <Button
          size="small"
          type="primary"
          onClick={() => {
            onShowModalProjectTicketAdd(true);
          }}
        >
          Add Ticket
        </Button>
      </div> */}
      <div className=" flex justify-end"></div>
      <div>
        <Table
          size="small"
          columns={ticketColumns}
          dataSource={projectTicketList}
          rowKey={(row) => row.id}
          pagination={pagination}
          onChange={changePagination}
        />
      </div>

      {/* <ProjectTicketAddComponent
        projectTaskSelectId={projectTaskSelectId}
        showModalTicketAdd={showModalTicketAdd}
        onShowModalProjectTicketAdd={onShowModalProjectTicketAdd}
        onSaveProjectTicket={onSaveProjectTicket}
        ticketConfigs={ticketConfigs}
      /> */}
    </>
  );
};

export default TicketComponent;
