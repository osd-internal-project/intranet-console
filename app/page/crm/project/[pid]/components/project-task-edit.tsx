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
  ITProjectTask,
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
  taskId: number;
  editTaskForm: FormInstance<ITProjectTaskForm>;
  showModalTaskEdit: boolean;
  onShowModalProjectTaskEdit: (status: boolean) => void;
  onUpdateProjectTask: (taskId: number, form: ITProjectTaskForm) => void;
}

const ProjectTaskEditComponent: React.FC<props> = ({
  taskId,
  editTaskForm,
  showModalTaskEdit,
  onShowModalProjectTaskEdit,
  onUpdateProjectTask,
}): React.ReactElement => {
  useEffect(() => {}, [showModalTaskEdit]);
  const onFinishEdit = (form: ITProjectTaskForm) => {
    onUpdateProjectTask(taskId, {
      ...form,
    });
  };
  return (
    <Modal
      // open={showModalContactAdd}
      title={"Edit Task"}
      footer={[]}
      open={showModalTaskEdit}
      onCancel={() => onShowModalProjectTaskEdit(false)}
      // width={1200}
      // footer={[]}
      // onCancel={() => {
      //   onShowModalContactAdd(false);
      // }}
    >
      <Form
        form={editTaskForm}
        size="small"
        {...layout}
        onFinish={onFinishEdit}
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
              onShowModalProjectTaskEdit(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProjectTaskEditComponent;
