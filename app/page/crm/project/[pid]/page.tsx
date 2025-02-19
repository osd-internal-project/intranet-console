"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  message,
  Row,
  UploadFile,
  Tabs,
  Modal,
  Form,
  InputNumber,
} from "antd";
import DescriptionCustomerComponent from "./components/description-form";

import ProjectServices from "@/app/services/customer-project.service";
import UserServices from "@/app/services/user.service";
import { useParams } from "next/navigation";
import { useForm } from "antd/es/form/Form";
import TicketComponent from "./components/project-ticket";
import TaskComponent from "./components/project-task";
import ProjectTicketDetailComponent from "./components/project-ticket-detail";
import { ExclamationCircleFilled } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea"; 
import { UserContectType, UserContext } from "@/app/config/userContext";
import {
  ITCustomerDetailSubContact,
  ITExpenseType,
  ITProject,
  ITProjectTask,
  ITProjectTaskForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
  ITProjectTicketEditForm,
  ITSelectUsers,
  ITTicketConfigs,
  ITTicketExpense,
  ITTicketHistoryLogForm,
} from "@/app/common/project";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export default function CustomerDetailPage() {
  const { user, roles } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };

  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlCrm = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_CRM);
  const userServices = UserServices(baseUrlUser);
  const projectServices = ProjectServices(baseUrlCrm);

  const params = useParams<{ pid: string }>();
  const [summaryForm] = useForm();
  const [finishForm] = useForm();

  const [editTaskForm] = useForm();
  const [projectDescription, setProjectDescription] = useState<ITProject>();
  const [contactDescription, setContactDescription] = useState<
    ITCustomerDetailSubContact | undefined
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
  const [persentTask, setPersentTask] = useState<{
    success: number;
    all: number;
  }>({
    success: 0,
    all: 0,
  });
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
  const [expenseType, setExpenseType] = useState<ITExpenseType[]>([]);
  // const [data, setData] = useState<ITCustomer>();
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);
  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    let totalSum = 0;
    let totalAll = 0;
    let totalWeight = 0;
    projectTaskList.map((task) => {
      const { weight, customerProjectTicket } = task;
      const sum = customerProjectTicket
        ? customerProjectTicket.filter(
            (data) =>
              data.status === "finish" ||
              data.status === "complete" ||
              data.status === "cancel"
          ).length
        : 0;
      const all = customerProjectTicket ? customerProjectTicket.length : 0;
      totalSum += all > 0 ? (weight * sum) / all : 0;
      totalWeight += weight;
    });
    const persent = totalSum;
    setPersentTask({ success: persent, all: totalWeight });
  }, [projectTaskList]);
  const fetchData = async () => {
    await fetchConfigs();
    await fetchDescription();
    setloading(false);
  };

  const fetchUserList = async () => {
    if (user?.userId) {
      const usersList = await userServices.findUsersFormEngineerProjectModule();
      setUsersList(usersList);
    }

    setloading(false);
  };
  const fetchConfigs = async () => {
    const expenseTyoe = await projectServices.findExpenseType();
    setExpenseType(expenseTyoe);
    const ticketConfigs = await projectServices.findConfigsForTicket();
    if (ticketConfigs) {
      setTicketConfigs(ticketConfigs);
    }
  };
  const fetchDescription = async () => {
    const detail = await projectServices.findProjectDetailById(+params.pid);

    if (detail.id) {
      fetchProjectTask(detail.id);
      if (detail.contactId) {
        const contact = await projectServices.findContactlById(
          +detail.contactId
        );
        setContactDescription(contact);
      }
    }

    if (projectTaskSelectId && tabActiveKey === "Task") {
      fetchProjectTicket(projectTaskSelectId);
    } else if (tabActiveKey === "Ticket") {
      const tickets = await projectServices.findProjectTicketByProjectId(
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
    const tasks = await projectServices.findProjectTaskByProjectId(productId);
    setProjectTaskList(tasks);
  };

  const fetchProjectTicket = async (id: number) => {
    const tickets = await projectServices.findProjectTicketByTaskId(id);
    setProjecTicketList(tickets);
  };
  // const fetchProjectTicketUnTask = async (taskId: number) => {
  //   setShowModalTicketAdd(false);
  //   const tickets = await projectServices.findProjectTicketByProjectId(+params.pid);
  //   setProjecTicketList(tickets);
  // };

  async function onFinishEdit(data: ITProject): Promise<void> {
    setloading(true);
  }

  async function onSaveProjectTask(
    projectId: number,
    form: ITProjectTaskForm
  ): Promise<void> {
    await projectServices
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
      createdById: user?.userId,
      createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
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
    if (form.jobTypeId) {
      const selected = ticketConfigs.jobTypeList.findLast(
        (config) => config.id === form.jobTypeId
      );
      if (selected?.name) {
        form = {
          ...form,
          jobTypeName: selected.name,
        };
      }
    }
    if (form.workTypeId) {
      const selected = ticketConfigs.workTypeList.findLast(
        (config) => config.id === form.workTypeId
      );
      if (selected?.name) {
        form = {
          ...form,
          workTypeName: selected.name,
        };
      }
    }
    if (form.assignId) {
      const selected = usersList.findLast(
        (user) => user.userId === form.assignId
      );

      if (selected) {
        form = {
          ...form,
          assignName: `${selected.firstNameTh ? selected.firstNameTh : ""} ${
            selected.lastNameTh ? selected.lastNameTh : ""
          }`,
        };
      }
    }

    if (form.channelTypeId) {
      const selected = ticketConfigs.channelTypeList.findLast(
        (config) => config.id === form.channelTypeId
      );
      if (selected?.name) {
        form = {
          ...form,
          channelTypeName: selected.name,
        };
      }
    }
    if (form.priorityId) {
      const selected = ticketConfigs.priorityList.findLast(
        (config) => config.id === form.priorityId
      );
      if (selected?.name) {
        form = {
          ...form,
          priorityName: selected.name,
        };
      }
    }
    if (taskId) {
      form = { ...form, customerProjectTaskId: taskId };
    }
    await projectServices
      .createProjectTicket(projectId, form)
      .then(async (data) => {
        if (data.id && attendFiles.length > 0) {
          attendFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "create-attend");
            formData.append("files", file.originFileObj);
            await projectServices.uploadFiles(data.id, formData);
          });
        }
        setShowModalTicketAdd(false);
        message.success("สร้าง Ticket สำเร็จ");
        await onSaveHistoryLogs(data.id, "create");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
  };
  const onUpdateProjectTask = async (
    taskId: number | undefined,
    form: ITProjectTaskForm
  ) => {
    if (taskId) {
      await projectServices
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
      const detail = await projectServices.findProjectTicketDetailById(
        ticketId
      );

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
    await projectServices
      .updateProjectTicket(+ticketId, form)
      .then(async (data) => {
        if (data.id && attendFiles.length > 0) {
          attendFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "update-attend");
            formData.append("files", file.originFileObj);
            await projectServices.uploadFiles(data.id, formData);
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
    if (status === "inprogress" && action === "receive") {
      title = "Receive Ticket";
      content = <>ยืนยันการรับงาน ?</>;
      form = {
        receiveDate: new Date(),
      };
    } else if (status === "inprogress" && action === "resume") {
      title = "Resume Ticket";
      content = <>ยืนยันการคืนงาน ?</>;
    } else if (status === "inprogress" && action === "rollback") {
      title = "Rollback Ticket";
      content = <>ยืนยันการคืนงาน ?</>;
    } else if (status === "hold") {
      title = "Hold Ticket";
      content = <>ยืนยันการ Hold ?</>;
    } else if (status === "finish") {
      finishForm.resetFields();
      title = "Finish Ticket";
      content = (
        <>
          <Form form={finishForm}>
            <Form.Item
              label={"man-hour"}
              name={"manhour"}
              rules={[{ required: true, message: "กรุณากรอก Manhour" }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </Form>
        </>
      );
      form = {
        finishDate: new Date(),
      };
    } else if (status === "cancel") {
      title = "Cancel Ticket";
      content = <>ยืนยันการยกเลิกงาน ?</>;
      form = {
        finishDate: new Date(),
      };
    } else if (status === "complete") {
      summaryForm.resetFields();
      title = "Complete Ticket";
      content = (
        <>
          <Form form={summaryForm}>
            <Form.Item
              name={"summary"}
              rules={[{ required: true, message: "กรุณากรอก Summary" }]}
            >
              <TextArea showCount={true} />
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
        if (status === "complete") {
          const summary = summaryForm.getFieldValue("summary");
          form = { ...form, summary: summary };
        } else if (status === "finish") {
          const finish = finishForm.getFieldsValue();
          finishForm.submit();
          form = { ...form, ...finish };
        }
        await projectServices
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
      const manhour = finishForm.getFieldValue("manhour");
      type = "Finish";
      detail = `Finish Manhour : ${manhour} ชั่วโมง`;
    } else if (action === "cancel") {
      type = "Cancel";
      detail = "Cancel";
    } else if (action === "hold") {
      type = "Hold";
      detail = "Hold";
    } else if (action === "resume") {
      type = "";
      detail = "Resume";
    } else if (action === "complete") {
      type = "Complete";
      detail = summaryForm.getFieldValue("summary");
    } else if (action === "deleteFile") {
      type = "Update Progress Info";
      detail = "Delete Attach File";
    } else if (action === "rollback") {
      type = "Rollback";
      detail = "Rollback";
    } else if (action === "add-expense") {
      type = "Add Expense";
      detail = "เพิ่มรายการขอเบิก";
    } else if (action === "edit-expense") {
      type = "Edit Expense";
      detail = "แก้ไขรายการขอเบิก";
    } else if (action === "delete-expense") {
      type = "Delete Expense";
      detail = "ลบรายการขอเบิก";
    }

    const form: ITTicketHistoryLogForm = {
      customerProjectTicketId: ticketId,
      updatedAt: new Date(),
      type: type,
      updatedById: user?.userId ? user?.userId : "",
      updatedByName: user?.firstNameTh
        ? `${user?.firstNameTh} ${user?.lastNameTh} `
        : "",
      detail: detail,
    };
    await projectServices.createTicketHistoryLogs(form);
  };

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await projectServices.downloadFile(id);
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
    await projectServices
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
        await projectServices.uploadFiles(ticketId, formData);
      });
    }
    setShowModalTicketAdd(false);
    message.success("อัพเดท Ticket สำเร็จ");
    await onSaveHistoryLogs(ticketId, "update");
    await onShowModalProjectTicketDetail(ticketId);

    setloading(true);
  }
  async function handleAddTicketExpense(value: ITTicketExpense) {
    if (projectTicketDetail?.id) {
      const ticketId = projectTicketDetail.id;
      await projectServices
        .updateProjectTicket(ticketId, {
          ticketExpense: {
            create: {
              ...value,
              processStatus: "wait",
              updatedById: user?.userId,
              updatedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
            },
          },
        })
        .then(async (data) => {
          message.success("สำเร็จ");
          await onSaveHistoryLogs(ticketId, "add-expense");
          await onShowModalProjectTicketDetail(ticketId);
          setloading(true);
        })
        .catch(() => {
          message.error("ผิดพลาด กรุณาลองใหม่");
        });
    }
  }
  async function handleEditTicketExpense(
    expenseId: number,
    value: ITTicketExpense
  ) {
    if (projectTicketDetail?.id) {
      const ticketId = projectTicketDetail.id;
      await projectServices
        .updateProjectTicketExpense(expenseId, value)
        .then(async (data) => {
          message.success("สำเร็จ");
          await onSaveHistoryLogs(ticketId, "edit-expense");
          await onShowModalProjectTicketDetail(ticketId);
          setloading(true);
        })
        .catch(() => {
          message.error("ผิดพลาด กรุณาลองใหม่");
        });
    }
  }
  async function handleDeleteTicketExpense(expenseId: number) {
    if (projectTicketDetail?.id) {
      const ticketId = projectTicketDetail.id;
      Modal.confirm({
        title: "ลบการขอเบิก",
        icon: <ExclamationCircleFilled />,
        content: "ยืนยันการลบการขอเบิก ?",
        okText: "Confirm",
        okButtonProps: { type: "primary", danger: true },
        cancelText: "Cancel",
        onOk: async () => {
          const dataResult = await projectServices.deleteProjectTicketExpense(
            expenseId
          );
          if (dataResult) {
            message.success("สำเร็จ");
            await onSaveHistoryLogs(ticketId, "delete-expense");
            await onShowModalProjectTicketDetail(ticketId);
            setloading(true);
          }
        },
      });
    }
  }
  return projectDescription ? (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
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
        {roles?.crmProjectShow ? (
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
              {/* <ProjuctComponent
                // descriptionForm={descriptionForm}
                projectDescription={projectDescription}
                contactDescription={contactDescription}
                isEdit={isEdit}
                setIsEdit={(e: boolean) => setIsEdit(e)}
                onFinishEdit={onFinishEdit}
              /> */}
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
                          roles={roles}
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
                          persentTask={persentTask}
                        />
                      ),
                    },
                    {
                      key: "Ticket",
                      label: "Ticket",
                      children: (
                        <TicketComponent
                          roles={roles}
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
                        />
                      ),
                    },
                  ]}
                />
              </Card>
              {projectTicketDetail ? (
                <ProjectTicketDetailComponent
                  roles={roles}
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
                  expenseType={expenseType}
                  handleAddTicketExpense={handleAddTicketExpense}
                  handleEditTicketExpense={handleEditTicketExpense}
                  handleDeleteTicketExpense={handleDeleteTicketExpense}
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
