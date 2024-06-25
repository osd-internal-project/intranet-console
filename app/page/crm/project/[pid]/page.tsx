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
} from "../common";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
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

export default function CustomerDetailPage() {
  const { data: session } = useSession();
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const params = useParams<{ pid: string }>();
  const [projectDescription, setProjectDescription] = useState<ITProject>();
  const [contactDescription, setContactDescription] = useState<
    ITBranchContact | undefined
  >();
  const [loading, setloading] = useState<boolean>(true);
  const [showModalTaskAdd, setShowModalTaskAdd] = useState<boolean>(false);
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
  const [projectTicketDetail, setProjectTicketDetail] = useState<
    ITProjectTicket | undefined
  >(undefined);
  // const [data, setData] = useState<ITCustomer>();
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    await fetchDescription();
    setloading(false);
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
    data: ITProjectTicketCreateForm
  ) => {
    let form = {
      ...data,
      status: "new",
      createdById: session?.user.userId,
      groupId: session?.user.ownerGroup,
      createdByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
    };
    if (taskId) {
      form = { ...form, customerProjectTaskId: taskId };
    }
    await crmServices
      .createProjectTicket(+projectId, form)
      .then(() => {
        setShowModalTicketAdd(false);
        message.success("สร้าง Ticket สำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
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
      setProjectTicketDetail(detail);
    } else {
      setProjectTicketDetail(undefined);
    }
  }
  async function onEditProjectTicket(
    ticketId: number,
    form: ITProjectTicketEditForm
  ) {
    Modal.confirm({
      title: "Edit Ticket",
      icon: <ExclamationCircleFilled />,
      content: "ยืนยันการแก้ไข ?",
      okText: "Confirm",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        await crmServices
          .updateProjectTicket(+ticketId, form)
          .then(() => {
            setShowModalTicketAdd(false);
            message.success("อัพเดท Ticket สำเร็จ");
            onShowModalProjectTicketDetail(ticketId);
          })
          .catch(() => {
            message.error("ผิดพลาด กรุณาลองใหม่");
          });
        setloading(true);
      },
    });
  }

  async function updateTicketStatus(
    ticketId: number,
    status: string
  ): Promise<void> {
    let title = "";
    let content = "";
    if (status === "inprogress") {
      title = "Receive Ticket";
      content = "ยืนยันการรับงาน ?";
    } else if (status === "finish") {
      title = "Close Ticket";
      content = "ยืนยันการรับงาน ?";
    } else if (status === "cancel") {
      title = "Cancel Ticket";
      content = "ยืนยันการรับงาน ?";
    }
    Modal.confirm({
      title: title,
      icon: <ExclamationCircleFilled />,
      content: content,
      okText: "Confirm",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        await crmServices
          .updateStatusProjectTicket(+ticketId, status)
          .then(() => {
            setShowModalTicketAdd(false);
            message.success("อัพเดท Ticket สำเร็จ");
            onShowModalProjectTicketDetail(ticketId);
          })
          .catch(() => {
            message.error("ผิดพลาด กรุณาลองใหม่");
          });
        setloading(true);
      },
    });
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
                    />
                  ),
                },
              ]}
            />
          </Card>
          {projectTicketDetail ? (
            <ProjectTicketDetailComponent
              ticketSelectedDetail={projectTicketDetail}
              onShowModalProjectTicketDetail={onShowModalProjectTicketDetail}
              updateTicketStatus={updateTicketStatus}
              onEditProjectTicket={onEditProjectTicket}
            />
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}
