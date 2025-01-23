"use client";
import React, { useEffect, useState, useContext } from "react";
import { Breadcrumb, Col, Divider, Row, UploadFile, message, Form, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import LeaveManagementServices from "../../../services/leave-management.service";
import { RcFile, UploadProps } from "antd/es/upload";
import { IDataUser, ISelect, ITypetypeleave, ITypeDataLeaveCreate, UserGroupType, ITypeDataLeave } from "../common";
import { CreateOnlineLeave } from "./components/create-online-leave";
import { TableOnlineDetailLeave } from "./components/table-online-detail-leave";
import { checkStatusTypeLeave, validateSumTotalLeave } from "@/app/utils/validatefield";
import MasterHolidaysService from "../../setting/master-holidays/services/index.service";
import { IFindAllDayDto } from "../../setting/master-holidays/common";
import MasterTypeLeaveService from "../../setting/typeleave/services/index.service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export default function Page() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };

  // console.log(user);

  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  // const leavemanagementservices = LeaveManagementServices(Intra);
  // const dataleaveserviceUser = LeaveManagementServices(AuthUser);
  // const masterholidaysService = MasterHolidaysService(baseUrlIntranet);
  // const mastertypeleaveservices = MasterTypeLeaveService(baseUrlIntranet);

  // const [getUser] = useState<IDataUser | null>(session ? session?.user : null);
  const [getTypeLeaveOption, setTypeLeaveOption] = useState<ISelect[]>([]);
  const [typeLeaveTable, setTypeLeaveTable] = useState<ITypetypeleave[]>([]);
  const [groupDetail, setGroupDetail] = useState<UserGroupType[]>([]);
  const [getHeader, setHeader] = useState<any>();
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
  }, [loading, params, user]);

  const loadDataTypeLeave = async () => {
    if (user) {
      const res = await LeaveManagementServices(baseUrlIntranet).getdataAll();
      const resTableDeatilTypeLeave = await LeaveManagementServices(baseUrlIntranet).findDetailTypeLeaveByUserId(user?.userId);
      const resTableUserTypeLeave = await LeaveManagementServices(baseUrlIntranet).findUserByUserId(user?.userId);
      const options = res.map((event: ITypetypeleave) => {
        return { value: event.typeId, label: event.typeName };
      });
      const HeaderGroup = await LeaveManagementServices(baseUrlIntranet).getHeaderByUserId();
      
      setHeader(HeaderGroup);
      setTypeLeaveTable(resTableDeatilTypeLeave);
      setTypeLeaveTableAll(resTableUserTypeLeave.typeLeaveDisabledMap);
      setTypeLeaveOption(options);
      setLoading(false);
    }
  };

  const fecthDataHoliday = async () => {
    const yearNow = dayjs(new Date()).format("YYYY");
    const dataResult = await MasterHolidaysService(baseUrlIntranet).getHolidayByYear(yearNow);
    const masterTypeLeave = await MasterTypeLeaveService(baseUrlIntranet).getdataAll({});
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

    // if (session?.user.userId) {
    //   const dataMasterType = await leavemanagementservices.getdataMasterTypeLeaveByTypeId(values.type_id);
    //   const datadisabledLeave = await leavemanagementservices.getdataTypeLeaveMap(session?.user.id, dataMasterType.typeId);
    //   if (datadisabledLeave.length > 0) {
    //     message.error(`ท่านไม่มีสิทธ์${dataMasterType.typeName}`);
    //     return false;
    //   }
    await checkStatusTypeLeave(values, masterdataTypeLeave);
    let remainingLeave: number = 0;

    let bases = {};
    // if (session?.user.userId) bases = { ...bases, userId: session?.user.userId };
    if (values.type_id) bases = { ...bases, typeId: values.type_id };
    const dataLeaveUserById = await LeaveManagementServices(baseUrlIntranet).getdataLeaveUserById(bases);

    // remainingLeave = await validateCheckLeaveDay(dataLeaveUserById, dataMasterType, session?.user.startWork);

    total = remainingLeave - sumDataLeave;

    if (total <= 0) {
      message.error(`ไม่สามารถทำการลาได้เนื่องจากวันลาที่เหลืออยู่ หมด หรือไม่เพียงพอ`);
      return false;
    }
    base = {
      userId: values.userId,
      firstName: values.firstNameTh,
      lastName: values.lastNameTh,
      positionId: values.posId,
      position: values.position,
      typeId: values.type_id,
      // typeName: dataMasterType ? dataMasterType.typeName : undefined,
      startDate: values.startDate,
      endDate: values.endDate,
      detail: values.detail,
      phoneNumber: values.phoneNumber,
      status: "waitting",
      ownerId: values.ownerId,
      ownerName: values.ownerName,
      attrachFile: attendFiles[0]?.name,
      leaveHour: sumDataLeave,
    };
    // }

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
        // const result = await LeaveManagementServices(baseUrlIntranet).createDataLeave(base);
        // if (result) {
        //   if (attendFiles.length > 0) {
        //     attendFiles.forEach(async (file) => {
        //       const formData: any = new FormData();
        //       formData.append("type", "attend");
        //       formData.append("files", file.originFileObj);
        //       await LeaveManagementServices(baseUrlIntranet).uploadFiles(result.id, formData);
        //     });
        //   }
        //   message.success(`Add success`);
        //   setStartDate(undefined);
        //   setEndDate(undefined);
        //   setCheckSwitch(false);
        //   createdataleaveForm.resetFields();
        //   setLoading(true);
        //   router.push("/page/leave-control-management/leave-history");
        // }
      },
      onCancel() {
        setLoading(false);
      },
    });
  };

  return (
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
      {user ? (
        <Row gutter={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
          <Col span={12}>
            <CreateOnlineLeave
              getUser={user}
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
              groupDetail={groupDetail}
              getHeader={getHeader}
            />
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
      ) : null}
    </div>
  );
}
