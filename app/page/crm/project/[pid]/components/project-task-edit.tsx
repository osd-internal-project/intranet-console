import React, { useEffect, useState } from "react";
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
  persentTask: {
    success: number;
    all: number;
  };
}

const ProjectTaskEditComponent: React.FC<props> = ({
  taskId,
  editTaskForm,
  showModalTaskEdit,
  onShowModalProjectTaskEdit,
  onUpdateProjectTask,
  persentTask,
}): React.ReactElement => {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  useEffect(() => {
    if (showModalTaskEdit) {
      const weight = editTaskForm.getFieldValue("weight");
      if (weight) setCurrentWeight(weight);
    }
  }, [showModalTaskEdit]);
  const onFinishEdit = (form: ITProjectTaskForm) => {
    onUpdateProjectTask(taskId, {
      ...form,
    });
  };
  const checkWeightLimit = (rule: any, value: number, callback: any) => {
    if (value + persentTask.all - currentWeight > 100) {
      callback(
        `Weight Limit is 100% (free : ${
          100 - (persentTask.all - currentWeight)
        }% )`
      );
    }
    callback();
  };
  return (
    <Modal
      // open={showModalContactAdd}
      title={"Edit Task"}
      footer={[]}
      open={showModalTaskEdit}
      onCancel={() => onShowModalProjectTaskEdit(false)}
      maskClosable={false}
    >
      <Form
        form={editTaskForm}
        size="small"
        {...layout}
        onFinish={onFinishEdit}
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
