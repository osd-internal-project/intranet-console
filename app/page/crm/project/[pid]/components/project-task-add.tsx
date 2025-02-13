import React, { useEffect } from "react";
import type { FormInstance } from "antd";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
} from "antd";
import {
  ITCustomerDetailSubContactForm,
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
  persentTask: {
    success: number;
    all: number;
  };
}

const ProjectTaskAddComponent: React.FC<props> = ({
  projectId,
  showModalTaskAdd,
  onShowModalProjectTaskAdd,
  onSaveProjectTask,
  persentTask,
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
  const checkWeightLimit = (rule: any, value: number, callback: any) => {
    if (value + persentTask.all > 100) {
      callback(`Weight Limit is 100% (free : ${100 - persentTask.all}% )`);
    }
    callback();
  };
  return (
    <Modal
      // open={showModalContactAdd}
      title={"Add Task"}
      footer={[]}
      open={showModalTaskAdd}
      onCancel={() => onShowModalProjectTaskAdd(false)}
      maskClosable={false}
    >
      <Form
        name="addTaskForm"
        form={form}
        size="small"
        {...layout}
        onFinish={onFinishSave}
        autoComplete="off"
      >
        <Form.Item
          label="Task Title"
          name={"taskTitle"}
          rules={[{ required: true, message: "กรุณาเลือก Task Title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name={"startDate"}
          rules={[{ required: true, message: "กรุณาเลือก Start Date" }]}
        >
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>
        <Form.Item
          label="End Date"
          name={"endDate"}
          rules={[{ required: true, message: "กรุณาเลือก End Date" }]}
        >
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>
        <Form.Item
          label="Weight (%) "
          name={"weight"}
          rules={[
            { required: true, message: "กรุณากรอก Weight" },
            { validator: checkWeightLimit },
          ]}
        >
          <InputNumber min={0} />
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
