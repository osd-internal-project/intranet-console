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
  ITConfigData,
  ITProjectTicketCreateForm,
  ITSelectUsers,
  ITTicketConfigs,
} from "../../common";
import { UploadOutlined } from "@ant-design/icons";

import { RcFile } from "antd/es/upload";
import { useForm } from "antd/es/form/Form";
import { Label } from "recharts";

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
  usersList: ITSelectUsers[];
  onShowModalProjectTicketAdd: (status: boolean) => void;
  onSaveProjectTicket: (
    projectId: number,
    taskId: number | undefined,
    dataForm: ITProjectTicketCreateForm,
    attendFiles: UploadFile[]
  ) => void;
}

const ProjectTicketAddComponent: React.FC<props> = ({
  projectTaskSelectId,
  projectId,
  showModalTicketAdd,
  ticketConfigs,
  usersList,
  onShowModalProjectTicketAdd,
  onSaveProjectTicket,
}): React.ReactElement => {
  const [addform] = useForm();
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [jobTypes, setJobTypes] = useState<ITConfigData[]>([]);
  useEffect(() => {
    addform.resetFields();
    setAttendFiles([]);
  }, [showModalTicketAdd]);

  const onFinishSave = (form: ITProjectTicketCreateForm) => {
    onSaveProjectTicket(
      projectId,
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

  function handdleChangeRequestType(rid: number): void {
    addform.setFieldValue("jobTypeId", undefined);
    const selected = ticketConfigs.requestTypeList.find(
      (request) => request.id === rid
    );
    const jobtypes = selected?.customerJobType ? selected?.customerJobType : [];
    setJobTypes(jobtypes);
  }

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
          <Form.Item
            label="Title"
            name={"ticketTitle"}
            rules={[{ required: true, message: "กรุณาเลือก Title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Request Date" name={"requestDate"}>
            <DatePicker className=" w-full" format={"DD/MM/YYYY"} />
          </Form.Item>
          <Form.Item
            label="Due Date"
            name={"dueDate"}
            rules={[{ required: true, message: "กรุณาเลือก Due Date" }]}
          >
            <DatePicker className=" w-full" format={"DD/MM/YYYY"} />
          </Form.Item>
          <Form.Item label="Appointment Date" name={"appointmentDate"}>
            <DatePicker className=" w-full" format={"DD/MM/YYYY"} />
          </Form.Item>
          <Form.Item
            label="Assign To"
            name={"assignId"}
            rules={[{ required: true, message: "กรุณาเลือก Assign To" }]}
          >
            <Select
              className=" w-full"
              allowClear
              placeholder="Please Select"
              options={usersList.map((data) => ({
                value: data.userId,
                label: `${data.firstNameTh} ${data.lastNameTh}`,
              }))}
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
              onChange={handdleChangeRequestType}
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
              options={jobTypes.map((type) => ({
                value: type.id,
                label: type.name,
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
