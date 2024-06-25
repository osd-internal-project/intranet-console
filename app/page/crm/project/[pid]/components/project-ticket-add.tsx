import React, { useEffect } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Switch,
} from "antd";
import { ITBranchContactForm, ITProjectTicketCreateForm } from "../../common";
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
      // width={1200}
      // footer={[]}
    >
      <Form
        name="addTaskForm"
        form={form}
        size="small"
        {...layout}
        onFinish={onFinishSave}
        autoComplete="off"
      >
        <Form.Item label="Title" name={"ticketTitle"}>
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item label="Due Date" name={"dueDate"}>
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>
        <Form.Item label="Detail" name={"ticketDetail"}>
          <TextArea maxLength={200} showCount />
        </Form.Item>

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
