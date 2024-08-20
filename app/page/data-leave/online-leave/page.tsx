"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Divider,
  Modal,
  Row,
  UploadFile,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
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
  IDepartMent,
  ISelectDepartment,
} from "../common";
import { CreateOnlineLeave } from "./components/create-online-leave";
import { TableOnlineDetailLeave } from "./components/table-online-detail-leave";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { RcFile, UploadProps } from "antd/es/upload";
import { error } from "console";

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
  const [typeLeaveTableAll, setTypeLeaveTableAll] = useState<ITypetypeleave[]>(
    []
  );
  const [dataLeaveUserById, setDataLeaveByUserId] = useState<ITypetypeleave[]>(
    []
  );
  const [getDepartmentById, setResDepartMent] = useState<ISelectDepartment[]>(
    []
  );
  const [getStartDate, setStartDate] = useState<Date>();
  const [getEndDate, setEndDate] = useState<Date>();
  const [checkSwitch, setCheckSwitch] = useState<boolean>(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [params, setParams] = useState<any>({
    typeId: null,
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    lengthDate: 0,
    lengthTime: 0,
  });
  const [createdataleaveForm] = useForm();
  const [time, setTime] = useState(dayjs("08:30", "HH:mm"));

  useEffect(() => {
    if (loading) loadDataTypeLeave();
  }, [loading, params]);

  const loadDataTypeLeave = async () => {
    const res = await dataleaveservice.getdataAll();
    const resOwner = await dataleaveserviceUser.getOwnerGroupsByPositionId(
      getUser?.userMapOrganizeChart[0]?.positionId
    );
    const resTableDeatilTypeLeave =
      await dataleaveservice.findDetailTypeLeaveByUserId(getUser?.userId);
    const resTableUserTypeLeave = await dataleaveservice.findUserByUserId(
      getUser?.userId
    );
    const options = res.map((event: ITypetypeleave) => {
      return { value: event.typeId, label: event.typeName };
    });
    const dataLeaveUserId = await dataleaveservice.getdataLeaveByuserId(
      session?.user.userId as string
    );
    const resTableDepartMent = await dataleaveservice.findDetailDepartment();
    const departmentOptions = resTableDepartMent.map((event: IDepartMent) => {
      return { value: event.departId, label: event.departName };
    });
    setResDepartMent(departmentOptions);
    setDataLeaveByUserId(dataLeaveUserId);
    setLoading(false);
    setUserOwner(resOwner);
    setTypeLeaveTable(resTableDeatilTypeLeave);
    setTypeLeaveTableAll(resTableUserTypeLeave.typeLeaveDisabledMap);
    setTypeLeaveOption(options);
    setTypeLeave(res);
    setLoading(false);
  };

  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };

  const onChangeParams = (value: Dayjs, type: string) => {
    setTime(value);
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
    }
    if (type === "startTime") {
      setParams((e: any) => ({ ...e, startTime: value }));
    } else if (type === "endTime" && params.startTime) {
      checklenghtTime(params.startTime, value);
    }
    if (type === "endTime") {
      setParams((e: any) => ({ ...e, endTime: value }));
    }

    setLoading(true);
  };

  const checklenghtDay = async (value1: any, value2: any) => {
    const startDate = value1 ? dayjs(value1).startOf("day") : null;
    const endDate = value2 ? dayjs(value2).endOf("day") : null;
    const totalDays =
      startDate && endDate ? endDate.diff(startDate, "days").toFixed(0) : 0;
    setParams((e: any) => ({
      ...e,
      lengthDate: totalDays != "0" ? Number(totalDays) : checkSwitch ? 1 : 0,
    }));
  };

  const checklenghtTime = async (value1: any, value2: any) => {
    const startTime = value1 ? dayjs(value1, "HH:mm") : null;
    const endTime = value2 ? dayjs(value2, "HH:mm") : null;
    const totalHours =
      startTime && endTime
        ? endTime.diff(startTime, "hour", true).toFixed(1)
        : 0;
    setParams((e: any) => ({
      ...e,
      lengthTime: totalHours != 0 ? Number(totalHours) : 1,
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
      message.warning("คุณลาในช่วงเวลานี้แล้ว กรุณาเลือกช่วงเวลาใหม่.");
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
      message.error("คุณไม่มีสิทธิลาประเภทการลานี้!");
      return true;
    }
    return false;
  };

  const checkLeaveHour = async (
    type_id: number,
    value: any
  ): Promise<boolean> => {
    try {
      let resultId: number;
      switch (type_id) {
        case 1:
          resultId = 240;
          break;
        case 2:
        case 3:
        case 4:
        case 7:
        case 10:
          resultId = 24;
          break;
        case 5:
          resultId = 48;
          break;
        case 6:
          resultId = 784;
          break;
        case 8:
          resultId = 40;
          break;
        case 9:
        case 11:
          resultId = 120;
          break;
        case 12:
          resultId = 480;
          break;
        case 13:
          resultId = 1440;
          break;
        default:
          resultId = 0;
      }

      const dataLeaveUserById = await dataleaveservice.getdataLeaveUserById(
        type_id
      );
      const hasLeaveHour = dataLeaveUserById.map(
        (leaveTime: any) => leaveTime.leaveHour
      );
      const totalLeaveHours = hasLeaveHour.reduce(
        (total: any, hour: any) => total + (Number(hour) || 0),
        0
      );

      if (totalLeaveHours < resultId) {
        if (typeof value === "object" && value !== null) {
          let totalHourvalue = 0;
          for (const data in value) {
            if (value.hasOwnProperty(data)) {
              const hour = value;
              if (hour.startDate && hour.endDate) {
                const startDate = new Date(hour.startDate);
                const endDate = new Date(hour.endDate);
                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                  const differenceInMilliseconds =
                    endDate.getTime() - startDate.getTime();
                  const differenceInHours =
                    differenceInMilliseconds / (1000 * 60 * 60);
                  totalHourvalue = differenceInHours;
                } else {
                  message.error("ตรวจสอบจำนวนเวลาลาไม่สำเร็จ");
                }
              }
            }
          }
          let result: number;
          switch (type_id) {
            case 1:
              result = 721;
              break;
            case 2:
            case 3:
            case 4:
            case 7:
            case 10:
              result = 73;
              break;
            case 5:
              result = 49;
              break;
            case 6:
              result = 145;
              break;
            case 8:
              result = 121;
              break;
            case 9:
            case 11:
              result = 361;
              break;
            case 12:
              result = 1441;
              break;
            case 13:
              result = 4321;
              break;
            default:
              result = 0;
          }
          if (totalHourvalue > result) {
            return true;
          }
          const dataHoru = dataLeaveUserById.map((ho: any) => {
            const startDate = new Date(ho.startDate);
            const endDate = new Date(ho.endDate);
            const differenceInMilliseconds =
              endDate.getTime() - startDate.getTime();
            const differenceInHours = Math.ceil(
              differenceInMilliseconds / (1000 * 60 * 60)
            );
            return {
              startDate: startDate.toISOString().split("T")[0],
              endDate: endDate.toISOString().split("T")[0],
              differenceInHours,
            };
          });

          const totalHour = dataHoru.reduce(
            (accumulator: any, item: any) =>
              accumulator + item.differenceInHours,
            0
          );
          const totalAll = totalHour + totalHourvalue;
          if (totalAll > result) {
            return true;
          }
          return false;
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
      message.warning({
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
    const startTime = values.startTime
      ? dayjs(values.startTime, "HH:mm")
      : null;
    const endTime = values.endTime ? dayjs(values.endTime, "HH:mm") : null;
    const selectedOption = getTypeLeaveOption.find(
      (option) => option.value === values.type_id
    );
    const selecteddepart = getDepartmentById.find(
      (option) => option.value === values.depart_id
    );
    const totalDays =
      startDate && endDate ? endDate.diff(startDate, "days").toFixed(0) : 0;

    const totalHours =
      startTime && endTime
        ? endTime.diff(startTime, "hour", true).toFixed(1)
        : 0;

    if (new Date(leaveEndDate) < new Date(leaveStartDate)) {
      message.error("วันที่สิ้นสุดการลาต้องหลังวันที่เริ่มการลา");
      return;
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
            departId: values.depart_id,
            departName: selecteddepart ? selecteddepart.label : undefined,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
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
            Modal.confirm({
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
                  message.success(`Add success`);
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
            message.error("ลาไม่สำเร็จ");
          }
          return;
        }
        if (new Date(leaveStartDate) < today) {
          message.error("ไม่สามารถลาในวันที่ผ่านมาได้");
          return;
        }
      }
    } catch (error) {
      message.error("ลาย้อนหลังไม่สำเร็จ");
    }

    try {
      if (type_id) {
        const hasTypeId = type_id === 2;

        if (hasTypeId) {
          if (new Date(leaveStartDate) < twoDayAdvance) {
            message.warning("ต้องลาล่วงหน้า 2 วัน");
            return;
          }
          const base: ITypeDataLeave = {
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            departId: values.depart_id,
            departName: selecteddepart ? selecteddepart.label : undefined,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
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
            Modal.confirm({
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
                  message.success(`Add success`);
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
            message.error("ลาไม่สำเร็จ");
          }

          return;
        }
      }
    } catch (error) {
      message.error("ลาส่วงหน้า 2วัน ไม่สำเร็จ");
    }

    try {
      if (type_id) {
        const hasTypeId = type_id === 3 || type_id === 6 || type_id === 10;
        if (hasTypeId) {
          if (new Date(leaveStartDate) < fiveDayAdvance) {
            message.warning("ต้องลาล่วงหน้า 5 วัน");
            return;
          }
          const base: ITypeDataLeave = {
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            departId: values.depart_id,
            departName: selecteddepart ? selecteddepart.label : undefined,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
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
            Modal.confirm({
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
                  message.success(`Add success`);
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
            message.error("ลาไม่สำเร็จ");
          }
          return;
        }
      }
    } catch (error) {
      message.error("ลาล่วงหน้า 5วัน ไม่สำเร็จ");
    }

    try {
      if (type_id) {
        const hasTypeId = type_id === 7;
        if (hasTypeId) {
          if (new Date(leaveStartDate) < fifteenDayAdvance) {
            message.warning("ต้องลาล่วงหน้า 15 วัน");
            return;
          }
          const base: ITypeDataLeave = {
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            departId: values.depart_id,
            departName: selecteddepart ? selecteddepart.label : undefined,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
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
            Modal.confirm({
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
                  message.success(`Add success`);
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
            message.error("ลาไม่สำเร็จ");
          }
          return;
        }
      }
    } catch (error) {
      message.error("ลาล่วงหน้า 15วัน ไม่สำเร็จ");
    }

    try {
      if (type_id) {
        const hasTypeId =
          type_id === 5 || type_id === 9 || type_id === 11 || type_id === 12;
        if (hasTypeId) {
          if (new Date(leaveStartDate) < thirtyDayAdvance) {
            message.warning("ต้องลาล่วงหน้า 30 วัน");
            return;
          }
          const base: ITypeDataLeave = {
            userId: values.userId,
            firstName: values.firstNameTh,
            lastName: values.lastNameTh,
            positionId: values.posId,
            position: values.position,
            departId: values.depart_id,
            departName: selecteddepart ? selecteddepart.label : undefined,
            typeId: values.type_id,
            typeName: selectedOption ? selectedOption.label : undefined,
            startDate: values.startDate,
            endDate: values.endDate,
            detail: values.detail,
            phoneNumber: values.phoneNumber,
            status: "waitting",
            ownerId: values.ownerId,
            ownerName: values.ownerName,
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
            Modal.confirm({
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
                  message.success(`Add success`);
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
            message.error("ลาไม่สำเร็จ");
          }
          return;
        }
      }
    } catch (error) {
      message.error("ลาล่วงหน้า 30วัน ไม่สำเร็จ");
    }

    // const base: ITypeDataLeave = {
    //   userId: values.userId,
    //   firstName: values.firstNameTh,
    //   lastName: values.lastNameTh,
    //   positionId: values.posId,
    //   position: values.position,
    //   departId: values.depart_id,
    //   departName: selecteddepart ? selecteddepart.label : undefined,
    //   typeId: values.type_id,
    //   typeName: selectedOption ? selectedOption.label : undefined,
    //   startDate: values.startDate,
    //   endDate: values.endDate,
    //   detail: values.detail,
    //   phoneNumber: values.phoneNumber,
    //   status: "waitting",
    //   ownerId: values.ownerId,
    //   ownerName: values.ownerName,
    // };
    // try {
    //   // if (type_id) {
    //   //   const hasTypeId =
    //   //     type_id === 1 || type_id === 4 || type_id === 8 || type_id === 13;
    //   //   if (hasTypeId) {
    //   //     message.error("ลาย้อนหลัง");
    //   //     return;
    //   //   }
    //   if (await checkLeaveConflict(userId, leaveStartDate, leaveEndDate))
    //     return;
    //   // }

    // const condition: ITypeDataLeave = {
    //   ...base,
    //   ...(values.time_start_check
    //     ? { leaveHour: 8 }
    //     : {
    //         leaveHour:
    //           values.startTime && values.endTime
    //             ? Number(totalHours)
    //             : Number(totalDays) * 8,
    //       }),
    // };

    //   Modal.confirm({
    //     title: "Add ",
    //     icon: <ExclamationCircleFilled />,
    //     content: "Are you sure you want to add this ?",
    //     okText: "Confirm",
    //     cancelText: "Cancel",
    //     okButtonProps: {
    //       style: {
    //         backgroundColor: "#00a1df",
    //         borderColor: "#00a1df",
    //       },
    //     },

    //     onOk: async () => {
    //       const result = await dataleaveservice.createDataLeave(condition);
    //       if (result) {
    //         if (attendFiles.length > 0) {
    //           attendFiles.forEach(async (file) => {
    //             const formData: any = new FormData();
    //             formData.append("type", "attend");
    //             formData.append("files", file.originFileObj);
    //             await dataleaveservice.uploadFiles(result.id, formData);
    //           });
    //         }
    //         message.success(`Add success`);
    //         createdataleaveForm.resetFields();
    //         setStartDate(undefined);
    //         setEndDate(undefined);
    //         setCheckSwitch(false);
    //         setLoading(true);
    //         router.push("/page/data-leave/detail-online-leave");
    //       }
    //     },
    //     onCancel() {
    //       setLoading(false);
    //     },
    //   });
    // } catch (err) {
    //   message.error("ลาไม่สำเร็จ");
    // }
  };

  return getUserOwner ? (
    <div>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Set Data Leave </span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Set Date Leave`}</div>
        </Divider>
      </Row>
      <Row gutter={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
        <Col span={12}>
          <CreateOnlineLeave
            getUser={getUser}
            getTypeLeaveOption={getTypeLeaveOption}
            getDepartmentById={getDepartmentById}
            onfinishCreate={(e: ITypeDataLeaveCreate) => onfinishCreate(e)}
            createdataleaveForm={createdataleaveForm}
            setStartDate={(e: Date) => setStartDate(e)}
            setEndDate={(e: Date) => setEndDate(e)}
            setCheckSwitch={(e: boolean) => setCheckSwitch(e)}
            getStartDate={getStartDate}
            getEndDate={getEndDate}
            checkSwitch={checkSwitch}
            beforeUploadAttendFiles={(e: RcFile) => beforeUploadAttendFiles(e)}
            handleChangeAttendFiles={(e: any) => handleChangeAttendFiles(e)}
            attendFiles={attendFiles}
            getUserOwner={getUserOwner}
            onChangeParams={onChangeParams}
            params={params}
            setParams={setParams}
            time={time}
          />
        </Col>
        <Col span={12}>
          <TableOnlineDetailLeave
            typeLeaveTable={typeLeaveTable}
            params={params}
            typeLeaveTableAll={typeLeaveTableAll}
          />
        </Col>
      </Row>
    </div>
  ) : null;
}
