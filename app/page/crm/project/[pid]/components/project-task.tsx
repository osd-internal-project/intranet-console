import React, { useEffect, useState } from "react";
import type { FormInstance, UploadFile } from "antd";
import {
  Button,
  Card,
  ConfigProvider,
  Flex,
  Input,
  Progress,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
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
import ProjectTaskEditComponent from "./project-task-edit";
import moment from "moment";
// const { RangePicker } = DatePicker;
const { TextArea } = Input;
export interface props {
  rules: any;
  setLoading: (loading: boolean) => void;
  editTaskForm: FormInstance<ITProjectTaskForm>;
  projectId: number;
  loading: boolean;
  showModalTaskAdd: boolean;
  onShowModalProjectTaskAdd: (status: boolean) => void;
  showModalTaskEdit: boolean;
  onShowModalProjectTaskEdit: (status: boolean) => void;
  onSaveProjectTask: (projectId: number, form: ITProjectTaskForm) => void;
  projectTaskSelectId: number | undefined;
  projectTaskList: ITProjectTask[];
  onSetProjectTaskSelectId: (taskId: number) => void;
  projectTicketList: ITProjectTicket[];
  showModalTicketAdd: boolean;
  ticketConfigs: ITTicketConfigs;
  usersList: ITSelectUsers[];
  persentTask: {
    success: number;
    all: number;
  };
  onShowModalProjectTicketAdd: (status: boolean) => void;
  onShowModalProjectTicketDetail: (id: number | undefined) => void;
  onSaveProjectTicket: (
    projectId: number,
    taskId: number | undefined,
    form: ITProjectTicketCreateForm,
    attendFiles: UploadFile[]
  ) => void;
  onUpdateProjectTask: (taskId: number, form: ITProjectTaskForm) => void;
}
const layout = {
  labelCol: {},
  wrapperCol: {
    md: { span: 22 },
  },
};

const TaskComponent: React.FC<props> = ({
  rules,
  loading,
  editTaskForm,
  projectId,

  setLoading,
  showModalTaskAdd,
  onShowModalProjectTaskAdd,
  showModalTaskEdit,
  onShowModalProjectTaskEdit,
  onSaveProjectTask,
  projectTaskList,
  projectTaskSelectId,
  projectTicketList,
  ticketConfigs,
  usersList,
  persentTask,
  onSetProjectTaskSelectId,
  showModalTicketAdd,
  onShowModalProjectTicketAdd,
  onShowModalProjectTicketDetail,
  onSaveProjectTicket,
  onUpdateProjectTask,
}): React.ReactElement => {
  const [taskIdSelect, setTaskIdSelect] = useState<number>();

  return (
    <>
      <div className=" grid grid-cols-3 gap-3 ">
        <div>
          <div className=" flex justify-between ">
            <div className=" font-bold pl-2">Task List</div>
            {rules.ruleProjectTaskAdd ? (
              <Button
                size="small"
                type="primary"
                onClick={() => onShowModalProjectTaskAdd(true)}
              >
                Add Task
              </Button>
            ) : (
              <></>
            )}
            <></>
          </div>
          <div className=" flex">
            <div className=" text-xs pr-1 pl-1 ">Progress </div>
            <Progress
              percent={Number(persentTask.all.toFixed(2))}
              success={{
                percent: Number(persentTask.success.toFixed(2)),
                strokeColor: persentTask.success !== 100 ? "#1677ff" : "",
              }}
              strokeColor={"#aaa"}
              format={(persent) => (
                <div className="text-xs">
                  {persentTask.success ? persentTask.success.toFixed(2) : "- "}%
                  จาก
                  {persentTask.all ? persentTask.all.toFixed(2) : " - "}%
                </div>
              )}
            />
          </div>
          <div className="overflow-y-auto">
            {projectTaskList.map((task: ITProjectTask, index: number) => {
              const taskSum = task.customerProjectTicket
                ? task.customerProjectTicket.filter(
                    (data) =>
                      data.status === "finish" ||
                      data.status === "complete" ||
                      data.status === "cancel"
                  ).length
                : 0;
              const taskAll = task.customerProjectTicket
                ? task.customerProjectTicket?.length
                : 0;
              return (
                <Card
                  key={index}
                  className={`m-2 cursor-pointer hover:shadow-md ${
                    task.id === projectTaskSelectId
                      ? " border-2 border-blue-500"
                      : ""
                  }`}
                  styles={{ body: { padding: 12 } }}
                  style={{ zIndex: 1 }}
                  onClick={() => {
                    onSetProjectTaskSelectId(task.id);
                  }}
                >
                  <div className=" flex justify-between mb-2">
                    <div className="  font-bold">
                      {index + 1}.{task.taskTitle}
                    </div>
                    {rules.ruleProjectTaskEdit ? (
                      <Button
                        style={{ zIndex: 2 }}
                        size="small"
                        ghost
                        type="primary"
                        onClick={() => {
                          setTaskIdSelect(task.id);
                          const form = {
                            taskTitle: task.taskTitle,
                            startDate: dayjs(task.startDate),
                            endDate: dayjs(task.endDate),
                            weight: task.weight,
                          };
                          editTaskForm.setFieldsValue(form);
                          onShowModalProjectTaskEdit(true);
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className=" grid grid-cols-2">
                    <div>
                      Start date : {dateToStringThNoTime(task.startDate)}
                    </div>
                    <div>End date : {dateToStringThNoTime(task.endDate)}</div>
                    <div>Weight : {task.weight} %</div>
                    <div>
                      Total : {taskSum}
                      {"/"}
                      {taskAll}
                    </div>
                  </div>
                  <Progress
                    percent={Number(((taskSum * 100) / taskAll).toFixed(2))}
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
              );
            })}
          </div>
        </div>

        <div className=" col-span-2">
          {projectTaskSelectId ? (
            <div>
              <TicketComponent
                rules={rules}
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
        persentTask={persentTask}
      />
      {taskIdSelect ? (
        <ProjectTaskEditComponent
          editTaskForm={editTaskForm}
          showModalTaskEdit={showModalTaskEdit}
          onShowModalProjectTaskEdit={onShowModalProjectTaskEdit}
          taskId={taskIdSelect}
          onUpdateProjectTask={onUpdateProjectTask}
          persentTask={persentTask}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default TaskComponent;
