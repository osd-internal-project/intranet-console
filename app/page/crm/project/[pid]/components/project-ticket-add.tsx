import React, { useEffect } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Switch,
} from "antd";
import {
  ITBranchContactForm,
  ITProjectTicketCreateForm,
  ITTicketConfigs,
} from "../../common";
import { CloseOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

// const { RangePicker } = DatePicker;
const { TextArea } = Input;
const layout = {
  labelCol: {
    xs: { span: 5 },
  },
  wrapperCol: {
    md: { span: 18 },
  },
};
export interface props {
  projectTaskSelectId: number | undefined;
  projectId: number;
  showModalTicketAdd: boolean;
  ticketConfigs: ITTicketConfigs;
  onShowModalProjectTicketAdd: (status: boolean) => void;
  onSaveProjectTicket: (
    projectId: number,
    taskId: number | undefined,
    form: ITProjectTicketCreateForm
  ) => void;
}

const ProjectTicketAddComponent: React.FC<props> = ({
  projectTaskSelectId,
  projectId,
  showModalTicketAdd,
  ticketConfigs,
  onShowModalProjectTicketAdd,
  onSaveProjectTicket,
}): React.ReactElement => {
  const [form] = useForm();

  useEffect(() => {
    form.resetFields();
  }, [showModalTicketAdd]);

  const onFinishSave = (form: ITProjectTicketCreateForm) => {
    onSaveProjectTicket(projectId, projectTaskSelectId, {
      ...form,
    });
  };
  return (
    <Modal
      title={"Add Ticket"}
      footer={[]}
      open={showModalTicketAdd}
      onCancel={() => onShowModalProjectTicketAdd(false)}
      width={1200}
      style={{ top: 20 }}
      // footer={[]}
    >
      <Form
        name="addTaskForm"
        form={form}
        size="small"
        {...layout}
        onFinish={onFinishSave}
        autoComplete="off"
        // layout="vertical"
      >
        <div className="gap-3">
          <Form.Item label="Title" name={"ticketTitle"}>
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item label="Due Date" name={"dueDate"}>
            <DatePicker className=" w-full" format={"DD/MM/YYYY"} />
          </Form.Item>
          <Form.Item label="Assign To" name={"dueDate"}>
            <Select
              className=" w-full"
              allowClear
              placeholder="Please Select"
            />
          </Form.Item>
          <Form.Item
            label="Detail"
            name={"ticketDetail"}
            className=" col-span-4"
          >
            <TextArea maxLength={200} showCount />
          </Form.Item>
          <Divider orientation="left" className="  p-0 m-0">
            CLASSIFIED DETAIL
          </Divider>
          <Form.Item label="Request Type" name={"requestTypeId"}>
            <Select
              className=" w-full"
              allowClear
              placeholder="Please Select"
              options={ticketConfigs.requestTypeList.map((data) => ({
                value: data.id,
                label: data.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Job Type" name={"jobTypeId"}>
            <Select
              className=" w-full"
              allowClear
              placeholder="Please Select"
              options={ticketConfigs.jobTypeList.map((data) => ({
                value: data.id,
                label: data.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Work Type" name={"workTypeId"}>
            <Select
              className=" w-full"
              allowClear
              placeholder="Please Select"
              options={ticketConfigs.workTypeList.map((data) => ({
                value: data.id,
                label: data.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Channel" name={"channelTypeId"}>
            <Select
              className=" w-full"
              allowClear
              placeholder="Please Select"
              options={ticketConfigs.channelTypeList.map((data) => ({
                value: data.id,
                label: data.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Priority" name={"priorityId"}>
            <Select
              className=" w-full"
              allowClear
              placeholder="Please Select"
              options={ticketConfigs.priorityList.map((data) => ({
                value: data.id,
                label: data.name,
              }))}
            />
          </Form.Item>
        </div>
        <div className=" flex justify-end space-x-2">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button
            onClick={() => {
              onShowModalProjectTicketAdd(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProjectTicketAddComponent;
