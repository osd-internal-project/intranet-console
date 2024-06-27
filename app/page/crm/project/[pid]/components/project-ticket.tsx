import React from "react";
import type { FormInstance, TableColumnsType } from "antd";
import { Button, Input, Table, Tag } from "antd";
import ProjectTicketAddComponent from "./project-ticket-add";
import {
  ITProjectTaskForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
  ITTicketConfigs,
} from "../../common";
import Link from "next/link";
import { dateToStringThNoTime } from "@/app/utils/format";
import { EditOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib";

// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  // loading: boolean;
  // setLoading: (loading: boolean) => void;
  projectId: number;
  projectTaskSelectId: number | undefined;
  projectTicketList: ITProjectTicket[];
  showModalTicketAdd: boolean;
  ticketConfigs: ITTicketConfigs;
  onShowModalProjectTicketAdd: (status: boolean) => void;
  onShowModalProjectTicketDetail: (id: number | undefined) => void;
  onSaveProjectTicket: (
    projectId: number,
    taskId: number | undefined,
    form: ITProjectTicketCreateForm,
    attendFiles: UploadFile[]
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
  onShowModalProjectTicketDetail,
  onSaveProjectTicket,
  ticketConfigs,
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
        ) : status === "close" ? (
          <Tag color="#aaa">Close</Tag>
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
      <div className=" flex justify-end mb-4">
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
        ticketConfigs={ticketConfigs}
      />
    </>
  );
};

export default TicketComponent;
