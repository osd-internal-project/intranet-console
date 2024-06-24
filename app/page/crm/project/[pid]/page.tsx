"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, message, Row, UploadFile, Tabs } from "antd";
import DescriptionCustomerComponent from "./components/description-form";
import {
  ITBranchContact,
  ITBranchContactForm,
  ITCustomerProject,
  ITProjectTask,
  ITProjectTaskForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
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

export default function CustomerDetailPage() {
  const { data: session } = useSession();
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const params = useParams<{ pid: string }>();
  const [projectDescription, setProjectDescription] =
    useState<ITCustomerProject>();
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
  const [projectTicketList, setProjecTicketList] = useState<ITProjectTicket[]>(
    []
  );
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
    setProjectDescription(detail);

    setIsEdit(false);
  };
  const fetchProjectTask = async (productId: number) => {
    const tasks = await crmServices.findProjectTaskByProjectId(productId);
    setProjectTaskList(tasks);
  };
  const fetchProjectTicket = async (taskId: number) => {
    setShowModalTicketAdd(false);
    const tickets = await crmServices.findProjectTicketByTaskId(taskId);
    console.log(tickets);
    setProjecTicketList(tickets);
  };

  async function onFinishEdit(data: ITCustomerProject): Promise<void> {
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
    data: ITProjectTicketCreateForm
  ) => {
    const form = {
      ...data,
      status: "process",
      createdById: session?.user.userId,
      groupId: session?.user.ownerGroup,
      createdByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
    };
    console.log(form);
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
                        setProjectTaskSelectId(taskId);
                        fetchProjectTicket(taskId);
                      }}
                      showModalTicketAdd={showModalTicketAdd}
                      onShowModalProjectTicketAdd={function (
                        status: boolean
                      ): void {
                        console.log(status);
                        setShowModalTicketAdd(status);
                      }}
                      onSaveProjectTicket={onSaveProjectTicket}
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
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}
