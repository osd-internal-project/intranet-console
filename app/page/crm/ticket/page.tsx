"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  message,
  Row,
  UploadFile,
  Modal,
  Form,
  TablePaginationConfig,
  InputNumber,
  Button,
} from "antd";
import {
  ITBranchContact,
  ITExpenseType,
  ITProject,
  ITProjectTask,
  ITProjectTaskForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
  ITProjectTicketEditForm,
  ITTicketConfigs,
  ITTicketExpense,
  ITTicketHistoryLogForm,
} from "./common";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import CrmServices from "./services/index.service";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import TicketComponent from "./components/project-ticket";
import ProjectTicketDetailComponent from "./components/project-ticket-detail";
import { ExclamationCircleFilled } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import ProjectTicketFilterComponent from "./components/project-ticket-filter";
import UserServices from "./services/user.service";
import { checkRule } from "@/app/utils/rules";
import ProjectTicketAddComponent from "./components/project-ticket-add";

export default function CustomerDetailPage() {
  const { data: session } = useSession();
  const rules = {
    ruleTicketShow: checkRule("crm-t-s"),
    ruleTicketAdd: checkRule("crm-t-a"),
    ruleTicketEdit: checkRule("crm-t-e"),
    ruleTicketRequestFilesEdit: checkRule("crm-trf-e"),
    ruleTicketUpdateStatus: checkRule("crm-t-u"),
    ruleTicketHold: checkRule("crm-t-h"),
    ruleTicketComplete: checkRule("crm-t-c"),
  };
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const userAuth = useAxiosUser();
  const userServices = UserServices(userAuth);
  const [finishForm] = useForm();
  const [summaryForm] = useForm();
  const [search, setSearch] = useState<object>({});
  const [loading, setloading] = useState<boolean>(true);
  const [showModalTicketAdd, setShowModalTicketAdd] = useState<boolean>(false);
  const [expenseType, setExpenseType] = useState<ITExpenseType[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [projectTicketList, setProjecTicketList] = useState<ITProjectTicket[]>(
    []
  );
  const [projectTicketDetail, setProjectTicketDetail] = useState<
    ITProjectTicket | undefined
  >(undefined);

  const [ticketConfigs, setTicketConfigs] = useState<ITTicketConfigs>({
    channelTypeList: [],
    jobTypeList: [],
    priorityList: [],
    workTypeList: [],
    requestTypeList: [],
  });

  // const [data, setData] = useState<ITCustomer>();
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);
  // useEffect(() => {
  //   fetchConfigs();
  // }, []);
  // const fetchConfigs = async () => {
  //   if (session?.user.userId) {
  //     const usersList = await userServices.findOrganizeUserByUserId(
  //       session?.user.userId
  //     );
  //   }

  //   setloading(false);
  // };
  const fetchData = async () => {
    await fetchConfigs();
    await fetchDataTable();
    setloading(false);
  };
  async function fetchConfigs() {
    const expenseTyoe = await crmServices.findExpenseType();
    setExpenseType(expenseTyoe);
  }
  const fetchDataTable = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);

    if (session?.user.userId) {
      const tickets = await crmServices.findProjectTicketTableByUserId(
        session?.user.userId,
        search,
        skip,
        take
      );
      if (tickets) {
        setProjecTicketList(tickets.data);
        setPagination({ ...pagination, total: tickets.total });
      }
    }
    setIsEdit(false);
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

  const onSaveProjectTicket = async (
    taskId: number | undefined,
    data: ITProjectTicketCreateForm,
    attendFiles: UploadFile[]
  ) => {
    let form = {
      ...data,
      status: "new",
      createdById: session?.user.userId,
      groupId: session?.user.ownerGroup,
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
    await crmServices
      .createProjectTicket(form)
      .then(async (data) => {
        if (data.id && attendFiles.length > 0) {
          attendFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "create-attend");
            formData.append("files", file.originFileObj);
            await crmServices.uploadFiles(data.id, formData);
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

  async function onShowModalProjectTicketDetail(
    ticketId: number | undefined
  ): Promise<void> {
    if (ticketId) {
      const detail = await crmServices.findProjectTicketDetailById(ticketId);
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
        message.success("อัพเดท Ticket สำเร็จ");
        await onSaveHistoryLogs(ticketId, "update");
        await onShowModalProjectTicketDetail(ticketId);
        setloading(true);
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
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
              label={"Manhour"}
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
        await crmServices
          .updateStatusProjectTicket(+ticketId, status, form)
          .then(async () => {
            setShowModalTicketAdd(false);
            message.success("อัพเดท Ticket สำเร็จ");
            await onSaveHistoryLogs(ticketId, action);
            await onShowModalProjectTicketDetail(ticketId);
            setloading(true);
          })
          .catch(() => {
            message.error("ผิดพลาด กรุณาลองใหม่");
          });
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
      type = "Resume";
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
  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };

  const onSearch = (data: object) => {
    setSearch(data);
    setPagination({ ...pagination, current: 1 });
    setloading(true);
  };
  async function handleAddTicketExpense(value: ITTicketExpense) {
    if (projectTicketDetail?.id) {
      const ticketId = projectTicketDetail.id;
      await crmServices
        .updateProjectTicket(ticketId, {
          ticketExpense: {
            create: {
              ...value,
              processStatus: "wait",
              updatedById: session?.user.userId,
              updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
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
      await crmServices
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
          const dataResult = await crmServices.deleteProjectTicketExpense(
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
  return (
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
                title: <span>Ticket</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`TICKET`}</div>
        </Col>

        <Col span={24}>
          {rules.ruleTicketShow ? (
            <Card>
              <div className=" space-y-2">
                <ProjectTicketFilterComponent onSearch={onSearch} />

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
                  onShowModalProjectTicketDetail={
                    onShowModalProjectTicketDetail
                  }
                  ticketConfigs={ticketConfigs}
                  changePagination={changePagination}
                  pagination={pagination}
                />
              </div>
            </Card>
          ) : (
            <></>
          )}
          {projectTicketDetail ? (
            <div>
              <ProjectTicketDetailComponent
                rules={rules}
                ticketSelectedDetail={projectTicketDetail}
                onShowModalProjectTicketDetail={onShowModalProjectTicketDetail}
                updateTicketStatus={updateTicketStatus}
                onEditProjectTicket={onEditProjectTicket}
                saveRequestTicketFile={saveRequestTicketFile}
                downloadFile={downloadFile}
                onDeleteTicketFile={onDeleteTicketFile}
                expenseType={expenseType}
                handleAddTicketExpense={handleAddTicketExpense}
                handleEditTicketExpense={handleEditTicketExpense}
                handleDeleteTicketExpense={handleDeleteTicketExpense}
              />
            </div>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </div>
  );
}
