import React, { useEffect, useState } from "react";
import type { FormInstance, UploadFile, UploadProps } from "antd";
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Upload,
} from "antd";
import {
  ITBranchContactForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
  ITProjectTicketEditForm,
  ITTicketHistoryLog,
} from "./../common";
import "./../style.css";
import {
  CloseOutlined,
  ExclamationCircleFilled,
  PaperClipOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { dateToStringThNoTime } from "@/app/utils/format";
import TicketHistoryTableComponent from "./ticket-history-table";
import { RcFile } from "antd/es/upload";
import { deleteIcon } from "@/components/icon";
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
    form: ITProjectTicketEditForm,
    attendFiles: UploadFile[]
  ) => void;
  saveRequestTicketFile: (ticketId: number, requestFiles: UploadFile[]) => void;
  updateTicketStatus: (
    ticketId: number,
    status: string,
    action: string
  ) => void;
  downloadFile: (id: number, name: string) => void;
  onDeleteTicketFile: (fileId: number, ticketId: number) => void;
}

const ProjectTicketDetailComponent: React.FC<props> = ({
  ticketSelectedDetail,
  onShowModalProjectTicketDetail,
  onEditProjectTicket,
  saveRequestTicketFile,
  updateTicketStatus,
  downloadFile,
  onDeleteTicketFile,
}): React.ReactElement => {
  const [editForm] = useForm();
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [requestFiles, setRequestFiles] = useState<UploadFile[]>([]);
  const [editTicketStatus, setEditTicketStatus] = useState<boolean>(false);
  useEffect(() => {
    editForm.setFieldsValue(ticketSelectedDetail);
    setAttendFiles([]);
    setRequestFiles([]);
  }, [ticketSelectedDetail]);

  const onFinishSave = async (form: ITProjectTicketEditForm) => {
    Modal.confirm({
      title: "Edit Ticket",
      icon: <ExclamationCircleFilled />,
      content: "ยืนยันการแก้ไข ?",
      okText: "Confirm",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        onEditProjectTicket(ticketSelectedDetail.id, form, attendFiles);
        setEditTicketStatus(false);
      },
    });
  };

  const onSaveRequestTicketFile = async () => {
    Modal.confirm({
      title: "Save File Ticket",
      icon: <ExclamationCircleFilled />,
      content: "ยืนยันการเพิ่มไฟล์ ?",
      okText: "Confirm",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        saveRequestTicketFile(ticketSelectedDetail.id, requestFiles);
      },
    });
  };
  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setAttendFiles(newFileList);
  };
  const handleChangeRequestFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setRequestFiles(newFileList);
  };
  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };
  const beforeUploadRequestFiles = (file: RcFile) => {
    if (requestFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };
  function deleteTicketFile(
    id: number,
    fileName: string,
    ticketId: number
  ): void {
    Modal.confirm({
      title: "Delete File Ticket",
      icon: <ExclamationCircleFilled />,
      content: `ยืนยันการลบไฟล์ ${fileName} ?`,
      okText: "Confirm",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        onDeleteTicketFile(id, ticketId);
      },
    });
  }

  return (
    <Modal
      title={ticketSelectedDetail?.ticketTitle}
      footer={[]}
      open={ticketSelectedDetail ? true : false}
      onCancel={() => onShowModalProjectTicketDetail(undefined)}
      width={1500}
      style={{ top: 20 }}
    >
      <Tabs
        destroyInactiveTabPane={true}
        items={[
          {
            key: "info",
            label: "Info",
            children: (
              <>
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
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Status :
                    </div>
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
                        <Tag color="#aB5E00">On Hold</Tag>
                      ) : ticketSelectedDetail.status === "close" ? (
                        <Tag color="#aaa">Close</Tag>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Request Date :
                    </div>
                    <div className=" col-span-2 md:col-span-1">
                      {ticketSelectedDetail.requestDate
                        ? dateToStringThNoTime(ticketSelectedDetail.requestDate)
                        : ""}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Due Date :
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      {ticketSelectedDetail.dueDate
                        ? dateToStringThNoTime(ticketSelectedDetail.dueDate)
                        : ""}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Appointment Date :
                    </div>
                    <div className=" col-span-2 md:col-span-5">
                      {ticketSelectedDetail.appointmentDate
                        ? dateToStringThNoTime(
                            ticketSelectedDetail.appointmentDate
                          )
                        : ""}
                    </div>
                    {/* <div className=" md:col-span-2  sm:h"> </div> */}
                    <div className=" md:col-span-1 font-bold pl-3 pr-3 text-right">
                      Detail:
                    </div>
                    <div className=" col-span-1 md:col-span-1">
                      {ticketSelectedDetail.ticketDetail}
                    </div>
                    <div className=" col-span-2 md:col-span-4"></div>
                    <div className="md:col-span-1  font-bold pl-3 pr-3 text-right">
                      Attend Files
                    </div>

                    <div className=" col-span-2 md:col-span-5">
                      <div className="flex space-x-2 ">
                        <Upload
                          fileList={requestFiles}
                          onChange={handleChangeRequestFiles}
                          beforeUpload={beforeUploadRequestFiles}
                          multiple={true}
                          maxCount={10}
                        >
                          <Button icon={<UploadOutlined />}>
                            Click to upload
                          </Button>
                        </Upload>
                        {requestFiles.length > 0 ? (
                          <>
                            <Button
                              type="primary"
                              onClick={() => onSaveRequestTicketFile()}
                            >
                              Save
                            </Button>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      {ticketSelectedDetail.createFiles?.map((file, index) => (
                        <div key={index} className="flex items-center">
                          <Button
                            type="link"
                            onClick={() => downloadFile(file.id, file.fileName)}
                          >
                            <Space>
                              <PaperClipOutlined />
                              {file.fileName}
                            </Space>
                          </Button>
                          <Button
                            type="link"
                            onClick={() =>
                              deleteTicketFile(
                                file.id,
                                file.fileName,
                                ticketSelectedDetail.id
                              )
                            }
                            danger
                          >
                            {deleteIcon}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Divider
                      orientation="left"
                      className=" col-span-3 md:col-span-6 p-0 m-0"
                    >
                      CLASSIFIED DETAIL
                    </Divider>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Request Type :
                    </div>
                    <div className=" col-span-2 md:col-span-1">
                      {ticketSelectedDetail.requestTypeName}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Job Type :
                    </div>
                    <div className=" col-span-2 md:col-span-1">
                      {ticketSelectedDetail.jobTypeName}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Work Type :
                    </div>
                    <div className=" col-span-2 md:col-span-1">
                      {ticketSelectedDetail.workTypeName}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Channel :
                    </div>
                    <div className=" col-span-2 md:col-span-1">
                      {ticketSelectedDetail.channelTypeName}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Priority :
                    </div>
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
                        label={
                          <div className=" font-bold text-yellow-700 ">
                            Problem
                          </div>
                        }
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
                          <div className=" font-bold text-indigo-700 ">
                            Solution
                          </div>
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
                        label={
                          <div className=" font-bold  text-lime-700">
                            Result
                          </div>
                        }
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
                      <Form.Item
                        label={
                          <div className=" font-bold  text-purple-700">
                            Attach File
                          </div>
                        }
                        valuePropName="fileList"
                      >
                        {editTicketStatus ? (
                          <>
                            <Upload
                              fileList={attendFiles}
                              onChange={handleChangeAttendFiles}
                              beforeUpload={beforeUploadAttendFiles}
                              multiple={true}
                              maxCount={10}
                            >
                              <Button icon={<UploadOutlined />}>
                                Click to upload
                              </Button>
                            </Upload>

                            <div className=" p-2 text-slate-500">
                              Existing files
                            </div>
                            {ticketSelectedDetail.updateFiles?.map(
                              (file, index) => (
                                <Space
                                  key={index}
                                  className="flex items-center"
                                >
                                  <Button
                                    type="link"
                                    onClick={() =>
                                      downloadFile(file.id, file.fileName)
                                    }
                                  >
                                    <Space>
                                      <PaperClipOutlined />
                                      {file.fileName}
                                    </Space>
                                  </Button>
                                  <Button
                                    type="link"
                                    onClick={() =>
                                      deleteTicketFile(
                                        file.id,
                                        file.fileName,
                                        ticketSelectedDetail.id
                                      )
                                    }
                                    danger
                                  >
                                    {deleteIcon}
                                  </Button>
                                </Space>
                              )
                            )}
                          </>
                        ) : (
                          ticketSelectedDetail.updateFiles?.map(
                            (file, index) => (
                              <div key={index}>
                                <Button
                                  type="link"
                                  onClick={() =>
                                    downloadFile(file.id, file.fileName)
                                  }
                                >
                                  <Space>
                                    <PaperClipOutlined />
                                    {file.fileName}
                                  </Space>
                                </Button>
                              </div>
                            )
                          )
                        )}
                      </Form.Item>
                      <Form.Item
                        label={
                          <div className=" font-bold text-slate-600">
                            SUMMARY DETAIL
                          </div>
                        }
                      >
                        {ticketSelectedDetail.summary}
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
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Create Date :
                    </div>
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
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Receive Date :
                    </div>
                    <div className=" col-span-3 md:col-span-1">
                      {ticketSelectedDetail.receiveDate
                        ? dateToStringThNoTime(ticketSelectedDetail.receiveDate)
                        : "-"}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Finish Date :
                    </div>
                    <div className=" col-span-3 md:col-span-1">
                      {ticketSelectedDetail.finishDate
                        ? dateToStringThNoTime(ticketSelectedDetail.finishDate)
                        : "-"}
                    </div>
                    <div className=" font-bold pl-3 pr-3 text-right">
                      Complete Date:
                    </div>
                    <div className=" col-span-3 md:col-span-1">
                      {ticketSelectedDetail.completeDate
                        ? dateToStringThNoTime(
                            ticketSelectedDetail.completeDate
                          )
                        : "-"}
                    </div>
                  </div>
                  <div className=" flex justify-end space-x-2 mt-5">
                    {ticketSelectedDetail.status === "new" ? (
                      <Button
                        type="primary"
                        onClick={() =>
                          updateTicketStatus(
                            ticketSelectedDetail.id,
                            "inprogress",
                            "receive"
                          )
                        }
                      >
                        Resume
                      </Button>
                    ) : ticketSelectedDetail.status === "hold" ? (
                      <Button
                        type="primary"
                        onClick={() =>
                          updateTicketStatus(
                            ticketSelectedDetail.id,
                            "inprogress",
                            "resume"
                          )
                        }
                      >
                        Resume
                      </Button>
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
                              updateTicketStatus(
                                ticketSelectedDetail.id,
                                "hold",
                                "hold"
                              )
                            }
                          >
                            Hold Ticket
                          </Button>

                          <Button
                            type="primary"
                            onClick={() =>
                              updateTicketStatus(
                                ticketSelectedDetail.id,
                                "finish",
                                "finish"
                              )
                            }
                          >
                            Finish Ticket
                          </Button>
                          <Button
                            type="primary"
                            danger
                            onClick={() =>
                              updateTicketStatus(
                                ticketSelectedDetail.id,
                                "cancel",
                                "cancel"
                              )
                            }
                          >
                            Cancel Ticket
                          </Button>
                        </>
                      )
                    ) : ticketSelectedDetail.status === "finish" ||
                      ticketSelectedDetail.status === "cancel" ? (
                      <Button
                        type="primary"
                        onClick={() =>
                          updateTicketStatus(
                            ticketSelectedDetail.id,
                            "close",
                            "close"
                          )
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
              </>
            ),
          },
          {
            key: "histoeryLogs",
            label: "Histoery Logs",
            children: (
              <TicketHistoryTableComponent
                ticketHistoryLogs={
                  ticketSelectedDetail.ticketHistoryLogs
                    ? ticketSelectedDetail.ticketHistoryLogs
                    : []
                }
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default ProjectTicketDetailComponent;
