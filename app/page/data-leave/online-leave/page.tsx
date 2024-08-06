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
  IDepartMent,
  ISelectDepartMent,
} from "../common";
import { CreateOnlineLeave } from "./components/create-online-leave";
import { TableOnlineDetailLeave } from "./components/table-online-detail-leave";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { RcFile, UploadProps } from "antd/es/upload";

export default function Page() {
  const router = useRouter();
  const Auth = useAxiosIntranet();
  const AuthUser = useAxiosUser();
  const dataleaveservice = DataLeaveService(Auth);
  const dataleaveserviceUser = DataLeaveService(AuthUser);
  const { data: session } = useSession();
  const [getUser, setUser] = useState<IDataUser | null>(
    session ? session.user : null
  );
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
  const [getDepartmentById, setResDepartMent] = useState<ISelectDepartMent[]>(
    []
  );
  const [getStartDate, setStartDate] = useState<Date>();
  const [getEndDate, setEndDate] = useState<Date>();
  const [checkSwitch, setCheckSwitch] = useState<boolean>(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [params, setParams] = useState<any>({
    typeId: null,
    departId: null,
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    lengthDate: 0,
    lengthTime: 0,
  });

  const [createdataleaveForm] = useForm();

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
    // const resTableDeatilTypeLeaveAll = await dataleaveservice.getdataTypeLeaveAll({});
    const options = res.map((event: ITypetypeleave) => {
      return { value: event.typeId, label: event.typeName };
    });
    const dataLeaveUserId = await dataleaveservice.getdataLeaveByuserID(
      session?.user.userId as string
    );
    const resTableDepartMent = await dataleaveservice.findDetailDepartment();
    const departmentOptions = resTableDepartMent.map((event: IDepartMent) => {
      return { value: event.departId, label: event.departName };
    });
    const resDataDepartmentId = await dataleaveservice.getdataDepartmentId();
    // console.log(resDataDepartmentId);

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

  const onChangeParams = (value: string, type: string) => {
    if (type === "type") {
      setParams((e: any) => ({ ...e, typeId: value }));
    }
    if (type === "depart") {
      setParams((e: any) => ({ ...e, departId: value }));
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

  const onfinishCreate = (values: ITypeDataLeaveCreate) => {
    const dataLeaveByUserId = dataLeaveUserById;
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

    const condition: ITypeDataLeave = {
      ...base,
      ...(values.time_start_check
        ? { leaveHour: 8 }
        : {
            leaveHour:
              values.startTime && values.endTime
                ? Number(totalHours)
                : Number(totalDays) * 8,
            startTime: values.startTime,
            endTime: values.endTime,
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
        const result = await dataleaveservice.createDataLeave(condition);
        console.log(condition);
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
