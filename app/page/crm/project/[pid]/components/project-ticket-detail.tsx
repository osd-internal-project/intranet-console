import React, { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Tag,
} from "antd";
import {
  ITBranchContactForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
  ITProjectTicketEditForm,
} from "../../common";
import "../../style.css";
import { CloseOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { dateToStringThNoTime } from "@/app/utils/format";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
const layout = {
  labelCol: {
    xs: { span: 3 },
  },
  // wrapperCol: {
  //   xs: { span: 18 },
  // },
};
export interface props {
  ticketSelectedDetail: ITProjectTicket;
  onShowModalProjectTicketDetail: (id: number | undefined) => void;
  onEditProjectTicket: (
    ticketId: number,
    form: ITProjectTicketEditForm
  ) => void;
  updateTicketStatus: (ticketId: number, status: string) => void;
}

const ProjectTicketDetailComponent: React.FC<props> = ({
  ticketSelectedDetail,
  onShowModalProjectTicketDetail,
  onEditProjectTicket,
  updateTicketStatus,
}): React.ReactElement => {
  const [editForm] = useForm();

  useEffect(() => {
    editForm.resetFields();
  }, [ticketSelectedDetail]);
  const [editTicketStatus, setEditTicketStatus] = useState<boolean>(false);
  const onFinishSave = async (form: ITProjectTicketEditForm) => {
    Modal.confirm({
      title: "Edit Ticket",
      icon: <ExclamationCircleFilled />,
      content: "ยืนยันการแก้ไข ?",
      okText: "Confirm",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        onEditProjectTicket(ticketSelectedDetail.id, form);
        setEditTicketStatus(false);
      },
    });
  };
  return (
    <Modal
      title={ticketSelectedDetail?.ticketTitle}
      footer={[]}
      open={ticketSelectedDetail ? true : false}
      onCancel={() => onShowModalProjectTicketDetail(undefined)}
      width={1500}
      style={{ top: 20 }}
    >
      <Form
        // name="addTaskForm"
        form={editForm}
        size="small"
        {...layout}
        layout="vertical"
        onFinish={onFinishSave}
        autoComplete="off"
      >
        <div className=" grid grid-cols-3 md:grid-cols-6 gap-2">
          {/* <Form.Item label="Title">{ticketSelectedDetail.ticketTitle}</Form.Item> */}
          <Divider
            orientation="left"
            className=" col-span-3 md:col-span-6 p-0 m-0"
          >
            REQUEST DETAIL
          </Divider>
          <div className=" font-bold pl-3 pr-3 text-right">Status :</div>
          <div className=" col-span-2 md:col-span-1">
            {ticketSelectedDetail.status === "new" ? (
              <Tag color="#faad14">New</Tag>
            ) : ticketSelectedDetail.status === "inprogress" ? (
              <Tag color="#1677ff">Inprogress</Tag>
            ) : ticketSelectedDetail.status === "finish" ? (
              <Tag color="#52c41a">Finish</Tag>
            ) : ticketSelectedDetail.status === "cancel" ? (
              <Tag color="#f5222d">Cancel</Tag>
            ) : ticketSelectedDetail.status === "hold" ? (
              <Tag color="#EB5E00">On Hold</Tag>
            ) : ticketSelectedDetail.status === "close" ? (
              <Tag color="#dddd">Close</Tag>
            ) : (
              <></>
            )}
          </div>
          <div className=" font-bold pl-3 pr-3 text-right">Due Date :</div>
          <div className=" col-span-2 md:col-span-3">
            {dateToStringThNoTime(ticketSelectedDetail.dueDate)}
          </div>
          {/* <div className=" md:col-span-2  sm:h"> </div> */}
          <div className=" md:col-span-1 font-bold pl-3 pr-3 text-right">
            Detail:
          </div>
          <div className=" col-span-2 md:col-span-5">
            {ticketSelectedDetail.ticketDetail}
          </div>
          <Divider
            orientation="left"
            className=" col-span-3 md:col-span-6 p-0 m-0"
          >
            CLASSIFIED DETAIL
          </Divider>

          <div className=" font-bold pl-3 pr-3 text-right">Request Type :</div>
          <div className=" col-span-2 md:col-span-1">
            {ticketSelectedDetail.requestTypeName}
          </div>
          <div className=" font-bold pl-3 pr-3 text-right">Job Type :</div>
          <div className=" col-span-2 md:col-span-1">
            {ticketSelectedDetail.jobTypeName}
          </div>
          <div className=" font-bold pl-3 pr-3 text-right">Work Type :</div>
          <div className=" col-span-2 md:col-span-1">
            {ticketSelectedDetail.workTypeName}
          </div>
          <div className=" font-bold pl-3 pr-3 text-right">Channel :</div>
          <div className=" col-span-2 md:col-span-1">
            {ticketSelectedDetail.channelTypeName}
          </div>
          <div className=" font-bold pl-3 pr-3 text-right">Priority :</div>
          <div className=" col-span-2 md:col-span-1">
            {ticketSelectedDetail.priorityName}
          </div>
          <Divider
            orientation="left"
            className=" col-span-3 md:col-span-6 p-0 m-0"
          >
            SUMMARY INFORMATION
          </Divider>
          <div className="col-span-3 md:col-span-6 ml-3 mr-3">
            <Form.Item
              label={<div className=" font-bold text-yellow-700 ">Problem</div>}
              name={"problem"}
            >
              {editTicketStatus ? (
                <TextArea />
              ) : ticketSelectedDetail.problem ? (
                ticketSelectedDetail.problem
              ) : (
                " - "
              )}
            </Form.Item>
            <Form.Item
              label={
                <div className=" font-bold text-indigo-700 ">Solution</div>
              }
              name={"solution"}
            >
              {editTicketStatus ? (
                <TextArea />
              ) : ticketSelectedDetail.solution ? (
                ticketSelectedDetail.solution
              ) : (
                " - "
              )}
            </Form.Item>
            <Form.Item
              label={<div className=" font-bold  text-lime-700">Result</div>}
              name={"result"}
            >
              {editTicketStatus ? (
                <TextArea />
              ) : ticketSelectedDetail.result ? (
                ticketSelectedDetail.result
              ) : (
                " - "
              )}
            </Form.Item>
          </div>
        </div>
        <Divider
          orientation="left"
          className=" col-span-3 md:col-span-6 p-0 m-0"
        >
          TICKET DATE
        </Divider>
        <div className=" grid grid-cols-3 md:grid-cols-8 gap-2">
          <div className=" font-bold pl-3 pr-3 text-right">Create Date :</div>
          <div className=" col-span-3 md:col-span-1">
            {ticketSelectedDetail.createdAt
              ? dateToStringThNoTime(ticketSelectedDetail.createdAt)
              : "-"}
          </div>
          {/* <div className=" font-bold pl-3 pr-3 text-right">
            Appointment Date :
          </div>
          <div className=" col-span-3 md:col-span-1">
            {ticketSelectedDetail.appointmentDate
              ? dateToStringThNoTime(ticketSelectedDetail.appointmentDate)
              : "-"}
          </div> */}
          <div className=" font-bold pl-3 pr-3 text-right">Receive Date :</div>
          <div className=" col-span-3 md:col-span-1">
            {" "}
            {ticketSelectedDetail.reciveDate
              ? dateToStringThNoTime(ticketSelectedDetail.reciveDate)
              : "-"}
          </div>
          <div className=" font-bold pl-3 pr-3 text-right">Finish Date :</div>
          <div className=" col-span-3 md:col-span-1">
            {" "}
            {ticketSelectedDetail.finishDate
              ? dateToStringThNoTime(ticketSelectedDetail.finishDate)
              : "-"}
          </div>
          <div className=" font-bold pl-3 pr-3 text-right">Complete Date:</div>
          <div className=" col-span-3 md:col-span-1">
            {" "}
            {ticketSelectedDetail.completeDate
              ? dateToStringThNoTime(ticketSelectedDetail.completeDate)
              : "-"}
          </div>
        </div>
        <div className=" flex justify-end space-x-2 mt-5">
          {ticketSelectedDetail.status === "new" ? (
            <Button
              type="primary"
              onClick={() =>
                updateTicketStatus(ticketSelectedDetail.id, "inprogress")
              }
            >
              Resume
            </Button>
          ) : ticketSelectedDetail.status === "hold" ? (
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `#ddd`,
                  },
                },
              }}
            >
              <Button
                type="primary"
                onClick={() =>
                  updateTicketStatus(ticketSelectedDetail.id, "inprogress")
                }
              >
                Resume
              </Button>
            </ConfigProvider>
          ) : ticketSelectedDetail.status === "inprogress" ? (
            editTicketStatus ? (
              <>
                <>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </>

                <Button
                  onClick={() => {
                    editForm.setFieldsValue(ticketSelectedDetail);
                    setEditTicketStatus(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  ghost
                  type="primary"
                  onClick={() => setEditTicketStatus(true)}
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    updateTicketStatus(ticketSelectedDetail.id, "hold")
                  }
                >
                  Hold Ticket
                </Button>

                <Button
                  type="primary"
                  onClick={() =>
                    updateTicketStatus(ticketSelectedDetail.id, "finish")
                  }
                >
                  Finish Ticket
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() =>
                    updateTicketStatus(ticketSelectedDetail.id, "cancel")
                  }
                >
                  Cancel Ticket
                </Button>
              </>
            )
          ) : ticketSelectedDetail.status === "finish" ? (
            <Button
              type="primary"
              onClick={() =>
                updateTicketStatus(ticketSelectedDetail.id, "close")
              }
            >
              Close Ticket
            </Button>
          ) : (
            <></>
          )}

          {/* <Button
            onClick={() => {
              onShowModalProjectTicketDetail(undefined);
            }}
          >
            Close
          </Button> */}
        </div>
      </Form>
    </Modal>
  );
};

export default ProjectTicketDetailComponent;
