"use client";
import React, { useEffect, useState } from "react";
import {
  App,
  Breadcrumb,
  Col,
  Divider,
  Modal,
  Row,
  UploadFile,
  message,
  Form,
} from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import {
  useAxiosIntranet,
  useAxiosUser,
} from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../services/index.service";
import {
  IDataUser,
  ISelect,
  ITypeDataLeave,
  ITypetypeleave,
  ITypeDataLeaveCreate,
  UserGroupType,
  MasterTypeleaveType,
} from "../common";
import { CreateOnlineLeave } from "./components/create-online-leave";
import { TableOnlineDetailLeave } from "./components/table-online-detail-leave";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { RcFile, UploadProps } from "antd/es/upload";
import { calculateTime } from "../common/function-data-leave";

export default function Page() {
  const router = useRouter();
  const Auth = useAxiosIntranet();
  const AuthUser = useAxiosUser();
  const dataleaveservice = DataLeaveService(Auth);
  const dataleaveserviceUser = DataLeaveService(AuthUser);
  const { data: session } = useSession();
  const [getUser] = useState<IDataUser | null>(session ? session?.user : null);
  const [getUserOwner, setUserOwner] = useState<IDataUser | null>({});
  const [getTypeLeaveOption, setTypeLeaveOption] = useState<ISelect[]>([]);
  const [getTypeLeave, setTypeLeave] = useState<ITypetypeleave[]>([]);
  const [typeLeaveTable, setTypeLeaveTable] = useState<ITypetypeleave[]>([]);
  const [groupDetail, setGroupDetail] = useState<UserGroupType[]>([]);
  const [groupUserId, setDataGroupUserId] = useState<any>();
  const [getStartDate, setStartDate] = useState<Date>();
  const [getEndDate, setEndDate] = useState<Date>();
  const [checkSwitch, setCheckSwitch] = useState<boolean>(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createdataleaveForm] = Form.useForm();
  const [messages, messageHeader] = message.useMessage();
  const [Modals, modelsHeader] = Modal.useModal();
  const [typeLeaveTableAll, setTypeLeaveTableAll] = useState<ITypetypeleave[]>(
    []
  );
  const [params, setParams] = useState<any>({
    typeId: null,
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    lengthDate: 0,
    lengthTime: 0,
  });

  useEffect(() => {
    if (loading) loadDataTypeLeave();
  }, [loading, params]);

  const loadDataTypeLeave = async () => {
    const res = await dataleaveservice.getdataAll();
    const resTableDeatilTypeLeave =
      await dataleaveservice.findDetailTypeLeaveByUserId(getUser?.userId);
    const resTableUserTypeLeave = await dataleaveservice.findUserByUserId(
      getUser?.userId
    );
    const options = res.map((event: ITypetypeleave) => {
      return { value: event.typeId, label: event.typeName };
    });
    const groupId = session?.user.ownerGroup;
    if (groupId) {
      const dataGroupDetail = await dataleaveserviceUser.getUserGroupByGroupId(
        groupId
      );
      const dataUserById = await dataleaveserviceUser.getUsersByUserId(
        dataGroupDetail.headId
      );
      setUserOwner(dataUserById);
      setGroupDetail(dataGroupDetail);
    }
    const dataGroupUserId = await dataleaveservice.getdataLeaveByUserId(
      session?.user.userId
    );
    setDataGroupUserId(dataGroupUserId);
    setTypeLeaveTable(resTableDeatilTypeLeave);
    setTypeLeaveTableAll(resTableUserTypeLeave.typeLeaveDisabledMap);
    setTypeLeaveOption(options);
    setTypeLeave(res);
    setLoading(false);
  };

  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      messages.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };

  const rowClassName = (record: any) => {
    return typeLeaveTableAll.some((e: any) => record.id === e.masterTypeleaveId)
      ? "disabled-row"
      : "";
  };

  const onChangeParams = (value: any, type: string) => {
    if (type === "type") {
      setParams((e: any) => ({ ...e, typeId: value }));
    }
    if (type === "startDate") {
      setParams((e: any) => ({ ...e, startDate: value }));
    } else if (type === "endDate" && params.startDate) {
      checklenghtDay(params.startDate, value);
    }
    if (type === "endDate") {
      setParams((e: any) => ({ ...e, endDate: value }));
    } else if (type === "startDate" && params.endDate) {
      checklenghtDay(value, params.endDate);
    }
    if (type === "selectStartTime") {
      setParams((e: any) => ({ ...e, startTime: value }));
    } else if (type === "selectEndTime" && params.startTime) {
      checklenghtTime(params.startTime, value);
    }
    if (type === "selectEndTime") {
      setParams((e: any) => ({ ...e, endTime: value }));
    } else if (type === "selectStartTime" && params.endTime) {
      checklenghtTime(value, params.endTime);
    }
    if (value === true) {
      setParams((e: any) => ({ ...e, lengthDate: 1 }));
    } else if (value === false) {
      setParams((e: any) => ({ ...e, lengthDate: value }));
    }
    setLoading(true);
  };

  const checklenghtDay = async (value1: any, value2: any) => {
    const startDate = value1 ? dayjs(value1).startOf("day") : null;
    const endDate = value2 ? dayjs(value2).endOf("day") : null;
    const totalDays =
      startDate && endDate ? endDate.diff(startDate, "days").toFixed(0) : "0";
    setParams((e: any) => ({
      ...e,
      lengthDate:
        totalDays !== "0"
          ? Number(totalDays)
          : createdataleaveForm.getFieldValue("time_start_check")
          ? 1
          : 0,
    }));
  };

  const checklenghtTime = async (value1: any, value2: any) => {
    const startTime = dayjs(value1, "HH:mm");
    const endTime = dayjs(value2, "HH:mm");
    const breakStart = dayjs("12:00", "HH:mm");
    const breakEnd = dayjs("13:00", "HH:mm");
    let totalHours =
      startTime && endTime ? endTime.diff(startTime, "hour", true) : 0;
    if (startTime.isBefore(breakEnd) && endTime.isAfter(breakStart)) {
      const overlapStart = startTime.isBefore(breakStart)
        ? breakStart
        : startTime;
      const overlapEnd = endTime.isAfter(breakEnd) ? breakEnd : endTime;
      const breakDuration = overlapEnd.diff(overlapStart, "hour", true);
      totalHours -= breakDuration;
    }
    totalHours = totalHours > 0 ? parseFloat(totalHours.toFixed(1)) : 0;
    setParams((e: any) => ({
      ...e,
      lengthTime: totalHours ? Number(totalHours) : 1,
    }));
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setAttendFiles(newFileList);
  };

  const checkDataLeaveConflict = async (
    userId: string,
    startDate: Date,
    endDate: Date
  ) => {
    const existingDataLeave = await dataleaveservice.getdataLeaveAll();
    return existingDataLeave.some((record: any) => {
      return (
        record.userId === userId &&
        ((new Date(startDate) >= new Date(record.startDate) &&
          new Date(startDate) < new Date(record.endDate)) ||
          (new Date(endDate) > new Date(record.startDate) &&
            new Date(endDate) <= new Date(record.endDate)) ||
          (new Date(startDate) <= new Date(record.startDate) &&
            new Date(endDate) >= new Date(record.endDate)))
      );
    });
  };

  const checkLeaveConflict = async (
    userId: string,
    startDate: Date,
    endDate: Date
  ) => {
    const conflict = await checkDataLeaveConflict(userId, startDate, endDate);
    if (conflict) {
      messages.warning("คุณลาในช่วงเวลานี้แล้ว กรุณาเลือกช่วงเวลาใหม่.");
      return true;
    }
    return false;
  };

  const checkLeaveCancel = async (type_id: number) => {
    try {
      const typeLeaveDisabledMap = session?.user.typeLeaveDisabledMap;
      if (!typeLeaveDisabledMap || !typeLeaveDisabledMap.length) {
        return false;
      }
      const user_id = session?.user.typeLeaveDisabledMap[0].userId;
      const existingLeave = await dataleaveservice.getdataTypeLeaveMap(user_id);
      return existingLeave.some((record: any) => {
        if (
          record.masterTypeleaveId === undefined ||
          record.masterTypeleaveId === null
        ) {
          return false;
        }
        return record.masterTypeleaveId === type_id;
      });
    } catch (error) {}
  };

  const checkDataLeaveCancel = async (type_id: number) => {
    const conflict = await checkLeaveCancel(type_id);
    if (conflict) {
      messages.error("คุณไม่มีสิทธิลาประเภทการลานี้!");
      return true;
    }
    return false;
  };

  const checkLeaveHour = async (
    type_id: number,
    value: any
  ): Promise<boolean> => {
    try {
      const MasterTypeLeave =
        await dataleaveservice.getdataMasterTypeLeaveAll();
      const MasterLeaves = MasterTypeLeave.filter(
        (e: any) => e.typeId === type_id
      ).map((e: any) => {
        return {
          typeId: e.typeId,
          limitLeave: e.limitLeaveOne,
        };
      });
      if (MasterLeaves.length > 0) {
        const LimitLeave = MasterLeaves[0].limitLeave;
        let limitDataLeave = LimitLeave * 8;
        const dataLeaveUserById = await dataleaveservice.getdataLeaveUserById(
          value.userId
        );
        const dataLeaveTypeId = dataLeaveUserById.filter(
          (typeId: MasterTypeleaveType) => typeId.typeId === type_id
        );
        const hasLeaveHour = dataLeaveTypeId.map(
          (leaveTime: any) => leaveTime.leaveHour
        );
        const totalLeaveHours = hasLeaveHour.reduce(
          (total: number, hour: number) => total + (Number(hour) || 0),
          0
        );
        if (totalLeaveHours < limitDataLeave) {
          if (typeof value === "object" && value !== null) {
            let totalHourvalue = 0;
            for (const data in value) {
              if (value.hasOwnProperty(data)) {
                const hour = value;
                if (hour.startDate && hour.endDate) {
                  const startDate = new Date(hour.startDate);
                  const endDate = new Date(hour.endDate);
                  if (
                    !isNaN(startDate.getTime()) &&
                    !isNaN(endDate.getTime())
                  ) {
                    const differenceInMilliseconds =
                      endDate.getTime() - startDate.getTime();
                    const differenceInHours =
                      differenceInMilliseconds / (1000 * 60 * 60);
                    totalHourvalue = differenceInHours;
                  } else {
                    messages.error("ตรวจสอบจำนวนเวลาลาไม่สำเร็จ");
                  }
                }
              }
            }
            const hourvalue = (totalHourvalue / 24) * 8;
            if (!dataLeaveTypeId || dataLeaveTypeId.length === 0) {
            } else {
              if (hourvalue > limitDataLeave) {
                return true;
              }
            }
            const totalMinute = calculateTime(value.startTime, value.endTime);
            const dataleaveHour = dataLeaveTypeId.map((e: any) => e.leaveHour);
            const totalLeaveHour = dataleaveHour.reduce(
              (accumulator: number, currentValue: number) =>
                accumulator + currentValue,
              0
            );
            const totalSeconds = totalLeaveHour + totalMinute;
            const totalAll = totalSeconds + hourvalue;
            if (totalAll <= limitDataLeave) {
              return false;
            }
            return true;
          }
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkDataLeaveHour = async (
    type_id: number,
    value: any
  ): Promise<boolean> => {
    const conflict = await checkLeaveHour(type_id, value);
    if (conflict) {
      messages.warning({
        content: "คุณใช้สิทธิ์การลาประเภทนี้ครบหรือเกินจำนวนที่กำหนด",
        duration: 5,
      });
      return true;
    }
    return false;
  };

  const onfinishCreate = async (values: ITypeDataLeaveCreate) => {
    const userId = values.userId as string;
    const leaveStartDate = values.startDate as Date;
    const leaveEndDate = values.endDate as Date;
    const leaveStartTime = values.startTime as string;
    const leaveEndTime = values.endTime as string;
    const today = new Date() as Date;
    const type_id = values.type_id as number;
    const id = values.id as number;
    const twoDayAdvance = new Date(today);
    twoDayAdvance.setDate(today.getDate() + 2);
    const fiveDayAdvance = new Date(today);
    fiveDayAdvance.setDate(today.getDate() + 5);
    const fifteenDayAdvance = new Date(today);
    fifteenDayAdvance.setDate(today.getDate() + 15);
    const thirtyDayAdvance = new Date(today);
    thirtyDayAdvance.setDate(today.getDate() + 30);

    const startDate = values.startDate
      ? dayjs(values.startDate).startOf("day")
      : null;
    const endDate = values.endDate ? dayjs(values.endDate).endOf("day") : null;

    const totalDays =
      startDate && endDate ? endDate.diff(startDate, "days").toFixed(0) : 0;
    const selectedOption = getTypeLeaveOption.find(
      (option) => option.value === values.type_id
    );

    const breakStart = dayjs("12:00", "HH:mm");
    const breakEnd = dayjs("13:00", "HH:mm");
    const startTime = values.startTime
      ? dayjs(values.startTime, "HH:mm")
      : null;
    const endTime = values.endTime ? dayjs(values.endTime, "HH:mm") : null;

    let adjustedEndTime = endTime;
    if (startTime && endTime) {
      if (startTime.isBefore(breakEnd) && endTime.isAfter(breakStart)) {
        if (startTime.isBefore(breakStart) && endTime.isAfter(breakEnd)) {
          adjustedEndTime = endTime.subtract(1, "hour");
        } else if (startTime.isAfter(breakStart)) {
          adjustedEndTime = endTime.subtract(
            endTime.diff(breakEnd, "hour", true),
            "hour"
          );
        }
      }
    }

    const totalHours =
      startTime && adjustedEndTime
        ? adjustedEndTime.diff(startTime, "hour", true).toFixed(1)
        : 0;

    if (new Date(leaveEndDate) < new Date(leaveStartDate)) {
      messages.error("วันที่สิ้นสุดการลาต้องหลังวันที่เริ่มการลา");
      return;
    }
    if (dayjs(leaveEndTime, "HH:mm").isBefore(dayjs(leaveStartTime, "HH:mm"))) {
      return messages.error("เวลาที่สิ้นสุดการลาต้องหลังเวลาที่เริ่มการลา");
    }

    try {
      if (type_id) {
        const hasTypeId =
          type_id === 1 || type_id === 4 || type_id === 8 || type_id === 13;
        if (hasTypeId) {
          const base: ITypeDataLeave = {
            id: id,
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
            groupId: session?.user.ownerGroup,
            attrachFile: attendFiles[0]?.name,
          };

          if (await checkDataLeaveCancel(type_id)) {
            return;
          }

          if (await checkDataLeaveHour(type_id, values)) {
            return;
          }

          try {
            if (
              await checkLeaveConflict(userId, leaveStartDate, leaveEndDate)
            ) {
              return;
            }

            const condition: ITypeDataLeave = {
              ...base,
              ...(values.time_start_check
                ? { leaveHour: 8 }
                : {
                    leaveHour:
                      values.startTime && values.endTime
                        ? Number(totalHours)
                        : Number(totalDays) * 8,
                  }),
            };
            Modals.confirm({
              title: "Add ",
              icon: <ExclamationCircleFilled />,
              content: "Are you sure you want to add this ?",
              okText: "Confirm",
              cancelText: "Cancel",
              okButtonProps: {
                style: {
                  backgroundColor: "#00a1df",
                  borderColor: "#00a1df",
                },
              },
              onOk: async () => {
                const result = await dataleaveservice.createDataLeave(
                  condition
                );

                if (result) {
                  if (attendFiles.length > 0) {
                    attendFiles.forEach(async (file) => {
                      const formData: any = new FormData();
                      formData.append("type", "attend");
                      formData.append("files", file.originFileObj);
                      await dataleaveservice.uploadFiles(result.id, formData);
                    });
                  }
                  messages.success(`Add success`);
                  createdataleaveForm.resetFields();
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setCheckSwitch(false);
                  setLoading(true);
                  router.push("/page/data-leave/detail-online-leave");
                }
              },
              onCancel() {
                setLoading(false);
              },
            });
          } catch (err) {
            messages.error("ลาไม่สำเร็จ");
          }
          return;
        }
        if (new Date(leaveStartDate) < today) {
          messages.error("ไม่สามารถลาในวันที่ผ่านมาได้");
          return;
        }
      }
    } catch (error) {
      messages.error("ลาย้อนหลังไม่สำเร็จ");
    }

    try {
      if (type_id) {
        const hasTypeId = type_id === 2;
        if (hasTypeId) {
          if (new Date(leaveStartDate) < twoDayAdvance) {
            messages.warning("ต้องลาล่วงหน้า 2 วัน");
            return;
          }
          const base: ITypeDataLeave = {
            id: id,
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
            groupId: session?.user.ownerGroup,
            attrachFile: attendFiles[0]?.name,
          };
          if (await checkDataLeaveCancel(type_id)) {
            return;
          }

          if (await checkDataLeaveHour(type_id, values)) {
            return;
          }

          try {
            if (await checkLeaveConflict(userId, leaveStartDate, leaveEndDate))
              return;

            const condition: ITypeDataLeave = {
              ...base,
              ...(values.time_start_check
                ? { leaveHour: 8 }
                : {
                    leaveHour:
                      values.startTime && values.endTime
                        ? Number(totalHours)
                        : Number(totalDays) * 8,
                  }),
            };
            Modals.confirm({
              title: "Add ",
              icon: <ExclamationCircleFilled />,
              content: "Are you sure you want to add this ?",
              okText: "Confirm",
              cancelText: "Cancel",
              okButtonProps: {
                style: {
                  backgroundColor: "#00a1df",
                  borderColor: "#00a1df",
                },
              },
              onOk: async () => {
                const result = await dataleaveservice.createDataLeave(
                  condition
                );
                if (result) {
                  if (attendFiles.length > 0) {
                    attendFiles.forEach(async (file) => {
                      const formData: any = new FormData();
                      formData.append("type", "attend");
                      formData.append("files", file.originFileObj);
                      await dataleaveservice.uploadFiles(result.id, formData);
                    });
                  }
                  messages.success(`Add success`);
                  createdataleaveForm.resetFields();
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setCheckSwitch(false);
                  setLoading(true);
                  router.push("/page/data-leave/detail-online-leave");
                }
              },
              onCancel() {
                setLoading(false);
              },
            });
          } catch (err) {
            messages.error("ลาไม่สำเร็จ");
          }

          return;
        }
      }
    } catch (error) {
      messages.error("ลาส่วงหน้า 2วัน ไม่สำเร็จ");
    }

    try {
      if (type_id) {
        const hasTypeId = type_id === 3 || type_id === 6 || type_id === 10;
        if (hasTypeId) {
          if (new Date(leaveStartDate) < fiveDayAdvance) {
            messages.warning("ต้องลาล่วงหน้า 5 วัน");
            return;
          }
          const base: ITypeDataLeave = {
            id: id,
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
            groupId: session?.user.ownerGroup,
            attrachFile: attendFiles[0]?.name,
          };
          if (await checkDataLeaveCancel(type_id)) {
            return;
          }
          if (await checkDataLeaveHour(type_id, values)) {
            return;
          }
          try {
            if (await checkLeaveConflict(userId, leaveStartDate, leaveEndDate))
              return;
            const condition: ITypeDataLeave = {
              ...base,
              ...(values.time_start_check
                ? { leaveHour: 8 }
                : {
                    leaveHour:
                      values.startTime && values.endTime
                        ? Number(totalHours)
                        : Number(totalDays) * 8,
                  }),
            };
            Modals.confirm({
              title: "Add ",
              icon: <ExclamationCircleFilled />,
              content: "Are you sure you want to add this ?",
              okText: "Confirm",
              cancelText: "Cancel",
              okButtonProps: {
                style: {
                  backgroundColor: "#00a1df",
                  borderColor: "#00a1df",
                },
              },
              onOk: async () => {
                const result = await dataleaveservice.createDataLeave(
                  condition
                );
                if (result) {
                  if (attendFiles.length > 0) {
                    attendFiles.forEach(async (file) => {
                      const formData: any = new FormData();
                      formData.append("type", "attend");
                      formData.append("files", file.originFileObj);
                      await dataleaveservice.uploadFiles(result.id, formData);
                    });
                  }
                  messages.success(`Add success`);
                  createdataleaveForm.resetFields();
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setCheckSwitch(false);
                  setLoading(true);
                  router.push("/page/data-leave/detail-online-leave");
                }
              },
              onCancel() {
                setLoading(false);
              },
            });
          } catch (err) {
            messages.error("ลาไม่สำเร็จ");
          }
          return;
        }
      }
    } catch (error) {
      messages.error("ลาล่วงหน้า 5วัน ไม่สำเร็จ");
    }

    try {
      if (type_id) {
        const hasTypeId = type_id === 7;
        if (hasTypeId) {
          if (new Date(leaveStartDate) < fifteenDayAdvance) {
            messages.warning("ต้องลาล่วงหน้า 15 วัน");
            return;
          }
          const base: ITypeDataLeave = {
            id: id,
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
            groupId: session?.user.ownerGroup,
            attrachFile: attendFiles[0]?.name,
          };

          if (await checkDataLeaveCancel(type_id)) {
            return;
          }

          if (await checkDataLeaveHour(type_id, values)) {
            return;
          }

          try {
            if (await checkLeaveConflict(userId, leaveStartDate, leaveEndDate))
              return;
            const condition: ITypeDataLeave = {
              ...base,
              ...(values.time_start_check
                ? { leaveHour: 8 }
                : {
                    leaveHour:
                      values.startTime && values.endTime
                        ? Number(totalHours)
                        : Number(totalDays) * 8,
                  }),
            };
            Modals.confirm({
              title: "Add ",
              icon: <ExclamationCircleFilled />,
              content: "Are you sure you want to add this ?",
              okText: "Confirm",
              cancelText: "Cancel",
              okButtonProps: {
                style: {
                  backgroundColor: "#00a1df",
                  borderColor: "#00a1df",
                },
              },
              onOk: async () => {
                const result = await dataleaveservice.createDataLeave(
                  condition
                );
                if (result) {
                  if (attendFiles.length > 0) {
                    attendFiles.forEach(async (file) => {
                      const formData: any = new FormData();
                      formData.append("type", "attend");
                      formData.append("files", file.originFileObj);
                      await dataleaveservice.uploadFiles(result.id, formData);
                    });
                  }
                  messages.success(`Add success`);
                  createdataleaveForm.resetFields();
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setCheckSwitch(false);
                  setLoading(true);
                  router.push("/page/data-leave/detail-online-leave");
                }
              },
              onCancel() {
                setLoading(false);
              },
            });
          } catch (err) {
            messages.error("ลาไม่สำเร็จ");
          }
          return;
        }
      }
    } catch (error) {
      messages.error("ลาล่วงหน้า 15วัน ไม่สำเร็จ");
    }

    try {
      if (type_id) {
        const hasTypeId =
          type_id === 5 || type_id === 9 || type_id === 11 || type_id === 12;
        if (hasTypeId) {
          if (new Date(leaveStartDate) < thirtyDayAdvance) {
            messages.warning("ต้องลาล่วงหน้า 30 วัน");
            return;
          }
          const base: ITypeDataLeave = {
            id: id,
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
            groupId: session?.user.ownerGroup,
            attrachFile: attendFiles[0]?.name,
          };

          if (await checkDataLeaveCancel(type_id)) {
            return;
          }

          if (await checkDataLeaveHour(type_id, values)) {
            return;
          }

          try {
            if (await checkLeaveConflict(userId, leaveStartDate, leaveEndDate))
              return;

            const condition: ITypeDataLeave = {
              ...base,
              ...(values.time_start_check
                ? { leaveHour: 8 }
                : {
                    leaveHour:
                      values.startTime && values.endTime
                        ? Number(totalHours)
                        : Number(totalDays) * 8,
                  }),
            };
            Modals.confirm({
              title: "Add ",
              icon: <ExclamationCircleFilled />,
              content: "Are you sure you want to add this ?",
              okText: "Confirm",
              cancelText: "Cancel",
              okButtonProps: {
                style: {
                  backgroundColor: "#00a1df",
                  borderColor: "#00a1df",
                },
              },
              onOk: async () => {
                const result = await dataleaveservice.createDataLeave(
                  condition
                );
                if (result) {
                  if (attendFiles.length > 0) {
                    attendFiles.forEach(async (file) => {
                      const formData: any = new FormData();
                      formData.append("type", "attend");
                      formData.append("files", file.originFileObj);
                      await dataleaveservice.uploadFiles(result.id, formData);
                    });
                  }
                  messages.success(`Add success`);
                  createdataleaveForm.resetFields();
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setCheckSwitch(false);
                  setLoading(true);
                  router.push("/page/data-leave/detail-online-leave");
                }
              },
              onCancel() {
                setLoading(false);
              },
            });
          } catch (err) {
            messages.error("ลาไม่สำเร็จ");
          }
          return;
        }
      }
    } catch (error) {
      messages.error("ลาล่วงหน้า 30วัน ไม่สำเร็จ");
    }
  };

  return getUserOwner ? (
    <div>
      {modelsHeader}
      {messageHeader}
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>Home</span>,
              },
              {
                title: <span>Create Data Leave </span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Create Data Leave`}</div>
        </Divider>
      </Row>
      <Row gutter={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
        <Col span={12}>
          <App>
            <CreateOnlineLeave
              getUser={getUser}
              getTypeLeaveOption={getTypeLeaveOption}
              onfinishCreate={(e: ITypeDataLeaveCreate) => onfinishCreate(e)}
              createdataleaveForm={createdataleaveForm}
              setStartDate={(e: Date) => setStartDate(e)}
              setEndDate={(e: Date) => setEndDate(e)}
              setCheckSwitch={(e: boolean) => setCheckSwitch(e)}
              getStartDate={getStartDate}
              getEndDate={getEndDate}
              checkSwitch={checkSwitch}
              beforeUploadAttendFiles={(e: RcFile) =>
                beforeUploadAttendFiles(e)
              }
              handleChangeAttendFiles={(e: any) => handleChangeAttendFiles(e)}
              attendFiles={attendFiles}
              getUserOwner={getUserOwner}
              onChangeParams={onChangeParams}
              groupDetail={groupDetail}
              groupUserId={groupUserId}
            />
          </App>
        </Col>
        <Col span={12}>
          <TableOnlineDetailLeave
            typeLeaveTable={typeLeaveTable}
            params={params}
            typeLeaveTableAll={typeLeaveTableAll}
            rowClassName={rowClassName}
          />
        </Col>
      </Row>
    </div>
  ) : null;
}
