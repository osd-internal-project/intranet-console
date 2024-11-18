"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumb, Col, Divider, Row, UploadFile, message, Form, Modal } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import LeaveManagementServices from "../../../services/leave-management.service";
import { RcFile, UploadProps } from "antd/es/upload";
import { IDataUser, ISelect, ITypetypeleave, ITypeDataLeaveCreate, UserGroupType, ITypeDataLeave } from "../common";
import { CreateOnlineLeave } from "./components/create-online-leave";
import { TableOnlineDetailLeave } from "./components/table-online-detail-leave";
import { checkStatusTypeLeave, validateCheckLeaveDay, validateSumTotalLeave } from "@/app/utils/validatefield";
import MasterHolidaysService from "../../setting/master-holidays/services/index.service";
import dayjs from "dayjs";
import { IFindAllDayDto } from "../../setting/master-holidays/common";
import MasterTypeLeaveService from "../../setting/typeleave/services/index.service";
import { ExclamationCircleFilled } from "@ant-design/icons";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const Intra = useAxiosIntranet();
  const AuthUser = useAxiosUser();
  const leavemanagementservices = LeaveManagementServices(Intra);
  const dataleaveserviceUser = LeaveManagementServices(AuthUser);
  const masterholidaysService = MasterHolidaysService(Intra);
  const mastertypeleaveservices = MasterTypeLeaveService(Intra);

  const [getUser] = useState<IDataUser | null>(session ? session?.user : null);
  const [getUserOwner, setUserOwner] = useState<IDataUser | null>({});
  const [getTypeLeaveOption, setTypeLeaveOption] = useState<ISelect[]>([]);
  const [typeLeaveTable, setTypeLeaveTable] = useState<ITypetypeleave[]>([]);
  const [groupDetail, setGroupDetail] = useState<UserGroupType[]>([]);
  const [groupUserId, setDataGroupUserId] = useState<any>();
  const [getStartDate, setStartDate] = useState<Date>();
  const [getEndDate, setEndDate] = useState<Date>();
  const [checkSwitch, setCheckSwitch] = useState<boolean>(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createdataleaveForm] = Form.useForm();
  const [typeLeaveTableAll, setTypeLeaveTableAll] = useState<ITypetypeleave[]>([]);
  const [params, setParams] = useState<any>({
    typeId: null,
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    lengthDate: 0,
    lengthTime: 0,
  });
  const [dataHolidayDay, setDataHolidayDay] = useState<IFindAllDayDto[]>([]);
  const [masterdataTypeLeave, setMasterDataTypeLeave] = useState<ITypetypeleave[]>([]);

  useEffect(() => {
    fecthDataHoliday();
    if (loading) loadDataTypeLeave();
  }, [loading, params]);

  const loadDataTypeLeave = async () => {
    const res = await leavemanagementservices.getdataAll();
    const resTableDeatilTypeLeave = await leavemanagementservices.findDetailTypeLeaveByUserId(getUser?.userId);
    const resTableUserTypeLeave = await leavemanagementservices.findUserByUserId(getUser?.userId);
    const options = res.map((event: ITypetypeleave) => {
      return { value: event.typeId, label: event.typeName };
    });
    const groupId = session?.user.ownerGroup;
    if (groupId) {
      const dataGroupDetail = await dataleaveserviceUser.getUserGroupByGroupId(groupId);
      const dataUserById = await dataleaveserviceUser.getUsersByUserId(dataGroupDetail.headId);
      setUserOwner(dataUserById);
      setGroupDetail(dataGroupDetail);
    }
    const dataGroupUserId = await leavemanagementservices.getdataLeaveByUserId(session?.user.userId);
    setDataGroupUserId(dataGroupUserId);
    setTypeLeaveTable(resTableDeatilTypeLeave);
    setTypeLeaveTableAll(resTableUserTypeLeave.typeLeaveDisabledMap);
    setTypeLeaveOption(options);
    setLoading(false);
  };

  const fecthDataHoliday = async () => {
    const yearNow = dayjs(new Date()).format("YYYY");
    const dataResult = await masterholidaysService.getHolidayByYear(yearNow);
    const masterTypeLeave = await mastertypeleaveservices.getdataAll({});
    setDataHolidayDay(dataResult);
    setMasterDataTypeLeave(masterTypeLeave);
  };

  const beforeUploadAttendFiles = (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };

  const rowClassName = (record: any) => {
    return typeLeaveTableAll.some((e: any) => record.id === e.masterTypeleaveId) ? "disabled-row" : "";
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return setAttendFiles(newFileList);
  };

  const onfinishCreate = async (values: ITypeDataLeaveCreate) => {
    let base: ITypeDataLeave;
    let total: number = 0;
    let sumDataLeave = await validateSumTotalLeave(values, dataHolidayDay);
    await checkStatusTypeLeave(values, masterdataTypeLeave);
    let RemainingLeave: number = 0;
    if (session?.user.userId) {
      const dataLeaveUserById = await leavemanagementservices.getdataLeaveUserById(session?.user.userId, values.type_id);
      const dataMasterType = await leavemanagementservices.getdataMasterTypeLeaveByTypeId(values.type_id);
      RemainingLeave = await validateCheckLeaveDay(dataLeaveUserById, dataMasterType, session?.user.startWork);

      total = RemainingLeave - sumDataLeave;
      if (total <= 0) {
        message.error(`ไม่สามารถทำการลาได้เนื่องจากวันลาที่เหลืออยู่ หมด หรือไม่เพียงพอ`);
        return false;
      }

      base = {
        id: values.id,
        userId: values.userId,
        firstName: values.firstNameTh,
        lastName: values.lastNameTh,
        positionId: values.posId,
        position: values.position,
        typeId: values.type_id,
        typeName: dataMasterType ? dataMasterType.typeName : undefined,
        startDate: values.startDate,
        endDate: values.endDate,
        detail: values.detail,
        phoneNumber: values.phoneNumber,
        status: "waitting",
        ownerId: values.ownerId,
        ownerName: values.ownerName,
        groupId: session?.user.ownerGroup,
        attrachFile: attendFiles[0]?.name,
        leaveHour: sumDataLeave,
      };
    }
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
        const result = await leavemanagementservices.createDataLeave(base);
        if (result) {
          if (attendFiles.length > 0) {
            attendFiles.forEach(async (file) => {
              const formData: any = new FormData();
              formData.append("type", "attend");
              formData.append("files", file.originFileObj);
              await leavemanagementservices.uploadFiles(result.id, formData);
            });
          }
          message.success(`Add success`);
          setStartDate(undefined);
          setEndDate(undefined);
          setCheckSwitch(false);
          createdataleaveForm.resetFields();
          setLoading(true);
          router.push("/page/leave-control-management/leave-history");
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
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>ใบลาออนไลน์</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`ใบลาออนไลน์`}</div>
        </Divider>
      </Row>
      <Row gutter={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
        <Col span={12}>
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
            beforeUploadAttendFiles={(e: RcFile) => beforeUploadAttendFiles(e)}
            handleChangeAttendFiles={(e: any) => handleChangeAttendFiles(e)}
            attendFiles={attendFiles}
            getUserOwner={getUserOwner}
            // onChangeParams={onChangeParams}
            groupDetail={groupDetail}
            groupUserId={groupUserId}
          />
        </Col>
        <Col span={12}>
          <TableOnlineDetailLeave typeLeaveTable={typeLeaveTable} params={params} typeLeaveTableAll={typeLeaveTableAll} rowClassName={rowClassName} />
        </Col>
      </Row>
    </div>
  ) : null;
}
