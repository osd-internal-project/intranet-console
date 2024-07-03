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
import {
  ITBranchContactForm,
  ITProjectTaskForm,
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
  projectId: number;
  showModalTaskAdd: boolean;
  onShowModalProjectTaskAdd: (status: boolean) => void;
  onSaveProjectTask: (projectId: number, form: ITProjectTaskForm) => void;
}

const ProjectTaskAddComponent: React.FC<props> = ({
  projectId,
  showModalTaskAdd,
  onShowModalProjectTaskAdd,
  onSaveProjectTask,
}): React.ReactElement => {
  const [form] = useForm();

  useEffect(() => {
    form.resetFields();
  }, [showModalTaskAdd]);
  const onFinishSave = (form: ITProjectTaskForm) => {
    onSaveProjectTask(projectId, {
      ...form,
    });
  };
  return (
    <Modal
      // open={showModalContactAdd}
      title={"Add Task"}
      footer={[]}
      open={showModalTaskAdd}
      onCancel={() => onShowModalProjectTaskAdd(false)}
      // width={1200}
      // footer={[]}
      // onCancel={() => {
      //   onShowModalContactAdd(false);
      // }}
    >
      <Form
        name="addTaskForm"
        form={form}
        size="small"
        {...layout}
        onFinish={onFinishSave}
        autoComplete="off"
      >
        <Form.Item label="Task Title" name={"taskTitle"}>
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item label="Start Date" name={"startDate"}>
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>
        <Form.Item label="End Date" name={"endDate"}>
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>

        <div className=" flex justify-end space-x-2">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button
            onClick={() => {
              onShowModalProjectTaskAdd(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProjectTaskAddComponent;
