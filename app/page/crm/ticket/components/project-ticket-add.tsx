import React, { useEffect, useState } from "react";
import type { FormInstance, UploadFile, UploadProps } from "antd";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
  Upload,
} from "antd";
import {
  ITBranchContactForm,
  ITProjectTicketCreateForm,
  ITTicketConfigs,
} from "./../common";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";

import { RcFile } from "antd/es/upload";
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
  showModalTicketAdd: boolean;
  ticketConfigs: ITTicketConfigs;
  onShowModalProjectTicketAdd: (status: boolean) => void;
  onSaveProjectTicket: (
    taskId: number | undefined,
    dataForm: ITProjectTicketCreateForm,
    attendFiles: UploadFile[]
  ) => void;
}

const ProjectTicketAddComponent: React.FC<props> = ({
  projectTaskSelectId,
  showModalTicketAdd,
  ticketConfigs,
  onShowModalProjectTicketAdd,
  onSaveProjectTicket,
}): React.ReactElement => {
  const [addform] = useForm();
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  useEffect(() => {
    addform.resetFields();
    setAttendFiles([]);
  }, [showModalTicketAdd]);

  const onFinishSave = (form: ITProjectTicketCreateForm) => {
    onSaveProjectTicket(
      projectTaskSelectId,
      {
        ...form,
      },
      attendFiles
    );
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setAttendFiles(newFileList);
  };
  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };
  return (
    <Modal
      forceRender
      title={"Add Ticket"}
      footer={[]}
      open={showModalTicketAdd}
      onCancel={() => onShowModalProjectTicketAdd(false)}
      width={1200}
      style={{ top: 20 }}
      maskClosable={false}
    >
      <Form
        name="addTaskForm"
        form={addform}
        size="small"
        {...layout}
        onFinish={onFinishSave}
        autoComplete="off"
        // layout="vertical"
      >
        <div className="gap-3">
          <Form.Item label="Product" name={"customerProjectId"}>
            <Select />
          </Form.Item>
          <Form.Item label="Title" name={"ticketTitle"}>
            <Input />
          </Form.Item>
          <Form.Item label="Request Date" name={"requestDate"}>
            <DatePicker className=" w-full" format={"DD/MM/YYYY"} />
          </Form.Item>
          <Form.Item label="Due Date" name={"dueDate"}>
            <DatePicker className=" w-full" format={"DD/MM/YYYY"} />
          </Form.Item>
          <Form.Item label="Appointment Date" name={"appointmentDate"}>
            <DatePicker className=" w-full" format={"DD/MM/YYYY"} />
          </Form.Item>
          <Form.Item label="Assign To" name={"assignId"}>
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
            <TextArea showCount />
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
          <Form.Item label={<div>Attach File</div>} valuePropName="fileList">
            <Upload
              fileList={attendFiles}
              onChange={handleChangeAttendFiles}
              beforeUpload={beforeUploadAttendFiles}
              multiple={true}
              maxCount={10}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
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
