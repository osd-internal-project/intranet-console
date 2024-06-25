import React, { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
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
import { CloseOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { dateToStringThNoTime } from "@/app/utils/format";

// const { RangePicker } = DatePicker;
const { TextArea } = Input;
const layout = {
  labelCol: {
    xs: { span: 3 },
  },
  wrapperCol: {
    md: { span: 20 },
  },
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
  const onFinishSave = (form: ITProjectTicketEditForm) => {
    onEditProjectTicket(ticketSelectedDetail.id, form);
    setEditTicketStatus(false);
  };
  return (
    <Modal
      title={ticketSelectedDetail?.ticketTitle}
      footer={[]}
      open={ticketSelectedDetail ? true : false}
      onCancel={() => onShowModalProjectTicketDetail(undefined)}
      width={1200}
    >
      <Form
        // name="addTaskForm"
        form={editForm}
        // size="small"
        {...layout}
        onFinish={onFinishSave}
        autoComplete="off"
      >
        {/* <Form.Item label="Title">{ticketSelectedDetail.ticketTitle}</Form.Item> */}
        <Form.Item label="Status">
          {ticketSelectedDetail.status === "new" ? (
            <Tag color="#faad14">New</Tag>
          ) : ticketSelectedDetail.status === "inprogress" ? (
            <Tag color="#1677ff">Inprogress</Tag>
          ) : ticketSelectedDetail.status === "finish" ? (
            <Tag color="#52c41a">Finish</Tag>
          ) : ticketSelectedDetail.status === "cancel" ? (
            <Tag color="#f5222d">Cancel</Tag>
          ) : (
            <></>
          )}
        </Form.Item>
        <Form.Item label="Due Date">
          {dateToStringThNoTime(ticketSelectedDetail.dueDate)}
        </Form.Item>
        <Form.Item label="Detail">
          {ticketSelectedDetail.ticketDetail}
        </Form.Item>
        <Form.Item label="Problem" name={"problem"}>
          {editTicketStatus ? (
            <TextArea />
          ) : ticketSelectedDetail.problem ? (
            ticketSelectedDetail.problem
          ) : (
            " - "
          )}
        </Form.Item>
        <Form.Item label="Solution" name={"solution"}>
          {editTicketStatus ? (
            <TextArea />
          ) : ticketSelectedDetail.solution ? (
            ticketSelectedDetail.solution
          ) : (
            " - "
          )}
        </Form.Item>
        <Form.Item label="Result" name={"result"}>
          {editTicketStatus ? (
            <TextArea />
          ) : ticketSelectedDetail.result ? (
            ticketSelectedDetail.result
          ) : (
            " - "
          )}
        </Form.Item>
        <div className=" flex justify-end space-x-2">
          {ticketSelectedDetail.status === "new" ? (
            <Button
              type="primary"
              onClick={() =>
                updateTicketStatus(ticketSelectedDetail.id, "inprogress")
              }
            >
              Receive
            </Button>
          ) : ticketSelectedDetail.status === "inprogress" ? (
            editTicketStatus ? (
              <>
                <>
                  {" "}
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
                  type="primary"
                  onClick={() => setEditTicketStatus(true)}
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    updateTicketStatus(ticketSelectedDetail.id, "finish")
                  }
                >
                  Close Ticket
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
