"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  message,
  Row,
  UploadFile,
  Tabs,
  Modal,
  Input,
  Form,
} from "antd";
import DescriptionCustomerComponent from "./components/description-form";
import {
  ITBranchContact,
  ITBranchContactForm,
  ITProject,
  ITProjectTask,
  ITProjectTaskForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
  ITProjectTicketEditForm,
  ITSelectUsers,
  ITTicketConfigs,
  ITTicketHistoryLog,
  ITTicketHistoryLogForm,
} from "../common";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import CrmServices from "../services/index.service";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { dateToStringThNoTime } from "@/app/utils/format";
import TicketComponent from "./components/project-ticket";
import TaskComponent from "./components/project-task";
import { group } from "console";
import ProjectTicketDetailComponent from "./components/project-ticket-detail";
import { ExclamationCircleFilled } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import UserServices from "../services/user.service";
import { FormInstance } from "antd/lib";
import { checkRule } from "@/app/utils/rules";

export default function CustomerDetailPage() {
  const { data: session } = useSession();
  const rules = {
    ruleProjectShow: checkRule("crm-p-s"),
    ruleProjectTaskAdd: checkRule("crm-pt-a"),
    ruleProjectTaskEdit: checkRule("crm-pt-e"),
    ruleProjectTaskDelete: checkRule("crm-pt-d"),
    ruleTicketAdd: checkRule("crm-t-a"),
    ruleTicketEdit: checkRule("crm-t-e"),
    ruleTicketRequestFilesEdit: checkRule("crm-trf-e"),
    ruleTicketUpdateStatus: checkRule("crm-t-u"),
    ruleTicketHold: checkRule("crm-t-h"),
    ruleTicketClose: checkRule("crm-t-c"),
  };
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const userAuth = useAxiosUser();
  const userServices = UserServices(userAuth);
  const params = useParams<{ pid: string }>();
  const [summaryForm] = useForm();
  const [editTaskForm] = useForm();
  const [projectDescription, setProjectDescription] = useState<ITProject>();
  const [contactDescription, setContactDescription] = useState<
    ITBranchContact | undefined
  >();
  const [loading, setloading] = useState<boolean>(true);
  const [showModalTaskAdd, setShowModalTaskAdd] = useState<boolean>(false);
  const [showModalTaskEdit, setShowModalTaskEdit] = useState<boolean>(false);
  const [showModalTicketAdd, setShowModalTicketAdd] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState(false);
  const [projectTaskList, setProjectTaskList] = useState<ITProjectTask[]>([]);
  const [projectTaskSelectId, setProjectTaskSelectId] = useState<
    number | undefined
  >();
  const [tabActiveKey, setTabActiveKey] = useState<string>("Task");
  const [projectTicketList, setProjecTicketList] = useState<ITProjectTicket[]>(
    []
  );
  // const [summaryTicketInput, setSummaryTicketInput] = useState<string>("");
  const [projectTicketDetail, setProjectTicketDetail] = useState<
    ITProjectTicket | undefined
  >(undefined);
  // const [ticketHistoryLogs, setTicketHistoryLogs] = useState<
  //   ITTicketHistoryLog[]
  // >([]);
  const [ticketConfigs, setTicketConfigs] = useState<ITTicketConfigs>({
    channelTypeList: [],
    jobTypeList: [],
    priorityList: [],
    workTypeList: [],
    requestTypeList: [],
  });
  const [usersList, setUsersList] = useState<ITSelectUsers[]>([]);
  // const [data, setData] = useState<ITCustomer>();
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);
  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchData = async () => {
    await fetchConfigs();
    await fetchDescription();
    setloading(false);
  };

  const fetchUserList = async () => {
    if (session?.user.userId) {
      const usersList = await userServices.findOrganizeUserByUserId(
        session?.user.userId
      );
      setUsersList(usersList);
    }

    setloading(false);
  };
  const fetchConfigs = async () => {
    const ticketConfigs = await crmServices.findConfigsForTicket();
    if (ticketConfigs) {
      setTicketConfigs(ticketConfigs);
    }
  };
  const fetchDescription = async () => {
    const detail = await crmServices.findProjectDetailById(+params.pid);
    if (detail.contactId) {
      const contact = await crmServices.findContactlById(+detail.contactId);
      setContactDescription(contact);
    }
    if (detail.id) {
      fetchProjectTask(detail.id);
    }

    if (projectTaskSelectId && tabActiveKey === "Task") {
      fetchProjectTicket(projectTaskSelectId);
    } else if (tabActiveKey === "Ticket") {
      const tickets = await crmServices.findProjectTicketByProjectId(
        +params.pid
      );
      setProjecTicketList(tickets);
    } else {
      setProjecTicketList([]);
    }
    setProjectDescription(detail);
    setIsEdit(false);
  };
  const fetchProjectTask = async (productId: number) => {
    const tasks = await crmServices.findProjectTaskByProjectId(productId);
    setProjectTaskList(tasks);
  };

  const fetchProjectTicket = async (id: number) => {
    const tickets = await crmServices.findProjectTicketByTaskId(id);
    setProjecTicketList(tickets);
  };
  // const fetchProjectTicketUnTask = async (taskId: number) => {
  //   setShowModalTicketAdd(false);
  //   const tickets = await crmServices.findProjectTicketByProjectId(+params.pid);
  //   setProjecTicketList(tickets);
  // };

  async function onFinishEdit(data: ITProject): Promise<void> {
    setloading(true);
  }

  async function onSaveProjectTask(
    projectId: number,
    form: ITProjectTaskForm
  ): Promise<void> {
    await crmServices
      .createProjectTask(+projectId, form)
      .then(() => {
        setShowModalTaskAdd(false);
        message.success("สร้าง Task สำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
  }
  const onSaveProjectTicket = async (
    projectId: number,
    taskId: number | undefined,
    data: ITProjectTicketCreateForm,
    attendFiles: UploadFile[]
  ) => {
    let form = {
      ...data,
      status: "new",
      createdById: session?.user.userId,
      // groupId: session?.user.ownerGroup,
      createdByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
    };
    if (form.requestTypeId) {
      const selected = ticketConfigs.requestTypeList.findLast(
        (config) => config.id === form.requestTypeId
      );
      if (selected?.name) {
        form = {
          ...form,
          requestTypeName: selected.name,
        };
      }
    }
  };
  const onUpdateProjectTask = async (
    taskId: number | undefined,
    form: ITProjectTaskForm
  ) => {
    if (taskId) {
      await crmServices
        .updateProjectTask(+taskId, form)
        .then(async (data) => {
          setShowModalTaskEdit(false);
          message.success("อัพเดท Task สำเร็จ");
        })
        .catch(() => {
          message.error("ผิดพลาด กรุณาลองใหม่");
        });
    }
    setloading(true);
  };
  function changeTabs(activeKey: string): void {
    setTabActiveKey(activeKey);
    if (activeKey === "Task") {
      setProjectTaskSelectId(undefined);
      setProjecTicketList([]);
    }
    setloading(true);
  }

  async function onShowModalProjectTicketDetail(
    ticketId: number | undefined
  ): Promise<void> {
    if (ticketId) {
      const detail = await crmServices.findProjectTicketDetailById(ticketId);

      // setTicketHistoryLogs([]);
      setProjectTicketDetail(detail);
    } else {
      setProjectTicketDetail(undefined);
    }
  }
  async function onEditProjectTicket(
    ticketId: number,
    form: ITProjectTicketEditForm,
    attendFiles: UploadFile[]
  ) {
    await crmServices
      .updateProjectTicket(+ticketId, form)
      .then(async (data) => {
        if (data.id && attendFiles.length > 0) {
          attendFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "update-attend");
            formData.append("files", file.originFileObj);
            await crmServices.uploadFiles(data.id, formData);
          });
        }
        setShowModalTicketAdd(false);
        message.success("อัพเดท Ticket สำเร็จ");
        await onSaveHistoryLogs(ticketId, "update");
        await onShowModalProjectTicketDetail(ticketId);
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });

    setloading(true);
  }

  async function updateTicketStatus(
    ticketId: number,
    status: string,
    action: string
  ): Promise<void> {
    let form = {};
    let title = "";
    let content = <></>;
    if (status === "inprogress") {
      title = "Receive Ticket";
      content = <>ยืนยันการรับงาน ?</>;
      form = {
        receiveDate: new Date(),
      };
    } else if (status === "hold") {
      title = "Hold Ticket";
      content = <>ยืนยันการ Hold ?</>;
    } else if (status === "finish") {
      title = "Finish Ticket";
      content = <>ยืนยันการปิดงาน ?</>;
      form = {
        finishDate: new Date(),
      };
    } else if (status === "cancel") {
      title = "Cancel Ticket";
      content = <>ยืนยันการยกเลิกงาน ?</>;
      form = {
        finishDate: new Date(),
      };
    } else if (status === "close") {
      summaryForm.resetFields();
      title = "Close Ticket";
      content = (
        <>
          <Form form={summaryForm}>
            <Form.Item
              name={"summary"}
              rules={[{ required: true, message: "กรุณากรอก Summary" }]}
            >
              <TextArea showCount={true} maxLength={200} />
            </Form.Item>
          </Form>
        </>
      );

      form = {
        completeDate: new Date(),
      };
    }
    Modal.confirm({
      title: title,
      icon: <ExclamationCircleFilled />,
      content: content,
      okText: "Confirm",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        if (status === "close") {
          const summary = summaryForm.getFieldValue("summary");
          form = { ...form, summary: summary };
        }
        await crmServices
          .updateStatusProjectTicket(+ticketId, status, form)
          .then(async () => {
            setShowModalTicketAdd(false);
            message.success("อัพเดท Ticket สำเร็จ");
            await onSaveHistoryLogs(ticketId, action);
            await onShowModalProjectTicketDetail(ticketId);
          })
          .catch(() => {
            message.error("ผิดพลาด กรุณาลองใหม่");
          });
        setloading(true);
      },
    });
  }
  const onSaveHistoryLogs = async (ticketId: number, action: string) => {
    let type = "";
    let detail = "";
    if (action === "create") {
      type = "Create";
      detail = "Create";
    } else if (action === "receive") {
      type = "Receive";
      detail = "Receive";
    } else if (action === "update") {
      type = "Update Progress Info";
      detail = "Update Progress Info";
    } else if (action === "finish") {
      type = "Finish";
      detail = "Finish";
    } else if (action === "cancel") {
      type = "Cancel";
      detail = "Cancel";
    } else if (action === "hold") {
      type = "Hold";
      detail = "Hold";
    } else if (action === "resume") {
      type = "Resume";
      detail = "Resume";
    } else if (action === "close") {
      type = "Complete";
      detail = summaryForm.getFieldValue("summary");
    } else if (action === "deleteFile") {
      type = "Update Progress Info";
      detail = "Delete Attend File";
    }
    const form: ITTicketHistoryLogForm = {
      customerProjectTicketId: ticketId,
      updatedAt: new Date(),
      type: type,
      updatedById: session?.user.userId ? session?.user.userId : "",
      updatedByName: session?.user.firstNameTh
        ? `${session?.user.firstNameTh} ${session?.user.lastNameTh} `
        : "",
      detail: detail,
    };
    await crmServices.createTicketHistoryLogs(form);
  };

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await crmServices.downloadFile(id);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  async function onDeleteTicketFile(fileId: number, ticketId: number) {
    await crmServices
      .deleteTicketFile(fileId)
      .then(async () => {
        await onSaveHistoryLogs(ticketId, "deleteFile");
        await onShowModalProjectTicketDetail(ticketId);
      })
      .catch(() => {
        message.error("ไม่สามารถลบไฟล์ได้");
      });
  }
  async function saveRequestTicketFile(
    ticketId: number,
    reqFiles: UploadFile[]
  ) {
    if (ticketId && reqFiles.length > 0) {
      reqFiles.forEach(async (file) => {
        const formData: any = new FormData();
        formData.append("type", "create-attend");
        formData.append("files", file.originFileObj);
        await crmServices.uploadFiles(ticketId, formData);
      });
    }
    setShowModalTicketAdd(false);
    message.success("อัพเดท Ticket สำเร็จ");
    await onSaveHistoryLogs(ticketId, "update");
    await onShowModalProjectTicketDetail(ticketId);

    setloading(true);
  }
  return projectDescription ? (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>CRM</span>,
              },
              {
                href: "/page/crm/project",
                title: <span>Project</span>,
              },
              {
                title: <span>Project Description</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`PROJECT DESCRIPTION`}</div>
        </Col>
        {rules.ruleProjectShow ? (
          <>
            <Col span={24}>
              <DescriptionCustomerComponent
                // descriptionForm={descriptionForm}
                projectDescription={projectDescription}
                contactDescription={contactDescription}
                isEdit={isEdit}
                setIsEdit={(e: boolean) => setIsEdit(e)}
                onFinishEdit={onFinishEdit}
              />
            </Col>
            <Col span={24}>
              <Card>
                <Tabs
                  destroyInactiveTabPane={true}
                  onChange={changeTabs}
                  items={[
                    {
                      key: "Task",
                      label: "Task",
                      children: (
                        <TaskComponent
                          rules={rules}
                          projectId={projectDescription.id}
                          loading={loading}
                          showModalTaskAdd={showModalTaskAdd}
                          setLoading={function (loading: boolean): void {
                            setloading(loading);
                          }}
                          onShowModalProjectTaskAdd={function (
                            status: boolean
                          ): void {
                            setShowModalTaskAdd(status);
                          }}
                          onSaveProjectTask={onSaveProjectTask}
                          projectTaskList={projectTaskList}
                          projectTaskSelectId={projectTaskSelectId}
                          projectTicketList={projectTicketList}
                          onSetProjectTaskSelectId={function (
                            taskId: number
                          ): void {
                            console.log(taskId);
                            setProjectTaskSelectId(taskId);
                            fetchProjectTicket(taskId);
                          }}
                          showModalTicketAdd={showModalTicketAdd}
                          onShowModalProjectTicketAdd={function (
                            status: boolean
                          ): void {
                            setShowModalTicketAdd(status);
                          }}
                          onSaveProjectTicket={onSaveProjectTicket}
                          onShowModalProjectTicketDetail={
                            onShowModalProjectTicketDetail
                          }
                          ticketConfigs={ticketConfigs}
                          usersList={usersList}
                          showModalTaskEdit={showModalTaskEdit}
                          editTaskForm={editTaskForm}
                          onShowModalProjectTaskEdit={function (
                            status: boolean
                          ): void {
                            setShowModalTaskEdit(status);
                          }}
                          onUpdateProjectTask={onUpdateProjectTask}
                        />
                      ),
                    },
                    {
                      key: "Ticket",
                      label: "Ticket",
                      children: (
                        <TicketComponent
                          projectTaskSelectId={undefined}
                          projectTicketList={projectTicketList}
                          showModalTicketAdd={showModalTicketAdd}
                          onShowModalProjectTicketAdd={function (
                            status: boolean
                          ): void {
                            setShowModalTicketAdd(status);
                          }}
                          onSaveProjectTicket={onSaveProjectTicket}
                          projectId={+params.pid}
                          onShowModalProjectTicketDetail={
                            onShowModalProjectTicketDetail
                          }
                          ticketConfigs={ticketConfigs}
                          usersList={usersList}
                          rules={rules}
                        />
                      ),
                    },
                  ]}
                />
              </Card>
              {projectTicketDetail ? (
                <ProjectTicketDetailComponent
                  rules={rules}
                  ticketSelectedDetail={projectTicketDetail}
                  onShowModalProjectTicketDetail={
                    onShowModalProjectTicketDetail
                  }
                  updateTicketStatus={updateTicketStatus}
                  onEditProjectTicket={onEditProjectTicket}
                  // ticketHistoryLogs={ticketHistoryLogs}
                  downloadFile={downloadFile}
                  onDeleteTicketFile={onDeleteTicketFile}
                  usersList={usersList}
                  saveRequestTicketFile={saveRequestTicketFile}
                />
              ) : (
                <></>
              )}
            </Col>
          </>
        ) : (
          <></>
        )}
      </Row>
    </div>
  ) : (
    ""
  );
}
