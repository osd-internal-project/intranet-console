import React, { useState } from "react";
import type { FormInstance, UploadFile } from "antd";
import { Button, Card, ConfigProvider, Input, Progress, Table } from "antd";
import TicketComponent from "./project-ticket";
import ProjectTaskAddComponent from "./project-task-add";
import {
  ITBranchContactForm,
  ITProjectTask,
  ITProjectTaskForm,
  ITProjectTicket,
  ITProjectTicketCreateForm,
  ITSelectUsers,
  ITTicketConfigs,
} from "../../common";
import { dateToStringThNoTime } from "@/app/utils/format";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  projectId: number;
  loading: boolean;
  showModalTaskAdd: boolean;
  setLoading: (loading: boolean) => void;
  onShowModalProjectTaskAdd: (status: boolean) => void;
  onSaveProjectTask: (projectId: number, form: ITProjectTaskForm) => void;
  projectTaskSelectId: number | undefined;
  projectTaskList: ITProjectTask[];
  onSetProjectTaskSelectId: (taskId: number) => void;
  projectTicketList: ITProjectTicket[];
  showModalTicketAdd: boolean;
  ticketConfigs: ITTicketConfigs;
  usersList: ITSelectUsers[];
  onShowModalProjectTicketAdd: (status: boolean) => void;
  onShowModalProjectTicketDetail: (id: number | undefined) => void;
  onSaveProjectTicket: (
    projectId: number,
    taskId: number | undefined,
    form: ITProjectTicketCreateForm,
    attendFiles: UploadFile[]
  ) => void;
}
const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const TaskComponent: React.FC<props> = ({
  loading,
  projectId,
  setLoading,
  showModalTaskAdd,
  onShowModalProjectTaskAdd,
  onSaveProjectTask,
  projectTaskList,
  projectTaskSelectId,
  projectTicketList,
  ticketConfigs,
  usersList,
  onSetProjectTaskSelectId,
  showModalTicketAdd,
  onShowModalProjectTicketAdd,
  onShowModalProjectTicketDetail,
  onSaveProjectTicket,
}): React.ReactElement => {
  return (
    <>
      <div className=" grid grid-cols-3 gap-3 ">
        <div>
          <div className=" flex justify-between ">
            <div className=" font-bold pl-2">Task List</div>
            <Button
              size="small"
              type="primary"
              onClick={() => onShowModalProjectTaskAdd(true)}
            >
              Add Task
            </Button>
          </div>
          <div className="overflow-y-auto">
            {projectTaskList.map((task: ITProjectTask, index: number) => (
              <Card
                key={index}
                className={`m-2 cursor-pointer hover:shadow-md   ${
                  task.id === projectTaskSelectId
                    ? " border-2 border-blue-500"
                    : ""
                }`}
                styles={{ body: { padding: 12 } }}
                onClick={() => {
                  onSetProjectTaskSelectId(task.id);
                }}
              >
                <div className=" font-bold">
                  {index + 1}.{task.taskTitle}
                </div>
                <div className=" grid grid-cols-2">
                  <div>start date : {dateToStringThNoTime(task.startDate)}</div>
                  <div>end date : {dateToStringThNoTime(task.endDate)}</div>
                </div>
                <Progress
                  percent={
                    task.customerProjectTicket &&
                    task.customerProjectTicket.length > 0
                      ? Number(
                          (
                            (task.customerProjectTicket.filter(
                              (data) =>
                                data.status === "finish" ||
                                data.status === "close" ||
                                data.status === "cancel"
                            ).length *
                              100) /
                            task.customerProjectTicket.length
                          ).toFixed(2)
                        )
                      : 0
                  }
                  size="small"
                />
                {/* <Progress
                percent={
                  task.customerProjectTicket &&
                  task.customerProjectTicket.length > 0
                    ? (task.customerProjectTicket.filter(
                        (data) => data.status !== "process"
                      ).length *
                        100) /
                      task.customerProjectTicket.length
                    : 0
                }
                // percentPosition={{ align: "center", type: "inner" }}
                size="small"
                // size={[300, 15]}
                // strokeColor="#B7EB8F"
              /> */}
              </Card>
            ))}
          </div>
        </div>

        <div className=" col-span-2">
          {projectTaskSelectId ? (
            <div>
              <TicketComponent
                projectId={projectId}
                projectTaskSelectId={projectTaskSelectId}
                projectTicketList={projectTicketList}
                showModalTicketAdd={showModalTicketAdd}
                onShowModalProjectTicketAdd={onShowModalProjectTicketAdd}
                onSaveProjectTicket={onSaveProjectTicket}
                onShowModalProjectTicketDetail={onShowModalProjectTicketDetail}
                ticketConfigs={ticketConfigs}
                usersList={usersList}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <ProjectTaskAddComponent
        projectId={projectId}
        showModalTaskAdd={showModalTaskAdd}
        onShowModalProjectTaskAdd={onShowModalProjectTaskAdd}
        onSaveProjectTask={onSaveProjectTask}
      />
    </>
  );
};

export default TaskComponent;
