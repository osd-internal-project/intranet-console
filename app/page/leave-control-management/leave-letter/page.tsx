"use client";
import React, { useEffect, useState, useContext } from "react";
import { Breadcrumb, Col, Divider, Row, UploadFile, message, Form, Modal } from "antd";
import { useRouter } from "next/navigation";
import LeaveManagementServices from "../../../services/leave-management.service";
import { RcFile, UploadProps } from "antd/es/upload";
import { ISelect, ITypetypeleave, ITypeDataLeaveCreate } from "../common";
import { CreateOnlineLeave } from "./components/create-online-leave";
import { TableOnlineDetailLeave } from "./components/table-online-detail-leave";
import { checkStatusTypeLeave, validateCheckLeaveDay, validateSumTotalLeave, getQuotaLeavePerYear } from "@/app/utils/validatefield";
import MasterHolidaysService from "../../setting/master-holidays/services/index.service";
import { IFindAllDayDto } from "../../setting/master-holidays/common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import imageCompression from "browser-image-compression";
import dayjs from "dayjs";
import { handleCompress } from "@/app/utils";

export default function Page() {
  const [createdataleaveForm] = Form.useForm();
  const router = useRouter();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [getTypeLeaveOption, setTypeLeaveOption] = useState<ISelect[]>([]);
  const [typeLeaveTable, setTypeLeaveTable] = useState<ITypetypeleave[]>([]);
  const [getHeader, setHeader] = useState<any>();
  const [getStartDate, setStartDate] = useState<Date>();
  const [getEndDate, setEndDate] = useState<Date>();
  const [checkSwitch, setCheckSwitch] = useState<boolean>(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [typeLeaveTableAll, setTypeLeaveTableAll] = useState<ITypetypeleave[]>([]);
  const [dataHolidayDay, setDataHolidayDay] = useState<IFindAllDayDto[]>([]);
  const [createdataleaveFormValues, setCreatedataleaveFormValues] = useState<any>({});
  useEffect(() => {
    fecthDataHoliday();
    if (loading) loadDataTypeLeave();
  }, [loading, user]);

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
    setDataHolidayDay(dataResult);
  };

  const beforeUploadAttendFiles = async (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    const compressed = await handleCompress(file);
    return compressed;
  };

  const rowClassName = (record: any) => {
    return typeLeaveTableAll.some((e: any) => record.id === e.masterTypeleaveId) ? "disabled-row" : "";
  };

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return setAttendFiles(newFileList);
  };

  // Helper functions
  const createLeaveBase = (values: ITypeDataLeaveCreate, user: any, dataMasterType: any, totalHours: number, quotaLeaveHour: number, usedLeaveHour: number, beforeLeaveHour: number, afterLeaveHour: number) => ({
    startDate: dayjs(values.startDate).startOf("date").toISOString(),
    endDate: dayjs(values.endDate).endOf("date").toISOString(),
    startTime: values.startTime || undefined,
    endTime: values.endTime || undefined,
    detail: values.detail,
    phoneNumber: values.phoneNumber,
    ownerName: values.ownerName,
    userId: values.userId,
    firstName: values.firstNameTh,
    lastName: values.lastNameTh,
    positionId: values.posId,
    position: user?.masterPosition.nameEn,
    typeId: values.type_id,
    typeName: dataMasterType?.typeName,
    status: "waiting",
    attrachFile: attendFiles[0]?.name,
    leaveHour: totalHours,
    groupId: user?.ownerGroupId,
    yearLeaveHour: quotaLeaveHour,   // จำนวนวันลาที่ได้ขอในปีนั้น
    usedLeaveHour: usedLeaveHour,   // จำนวนวันลาที่ใช้ไปในปีนั้น
    beforeLeaveHour: beforeLeaveHour, // จำนวนวันลาคงเหลือก่อนขอลา(อนุมัติ)
    afterLeaveHour: afterLeaveHour,  // จำนวนวันลาคงเหลือหลังขอลา(อนุมัติ)
  });

  const showConfirmModal = (base: any, isCrossYear = false) => {
    Modal.confirm({
      title: "Add",
      icon: <ExclamationCircleFilled />,
      content: `Are you sure you want to add this leave request?${isCrossYear ? " (Cross-year leave)" : ""}`,
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: {
        style: { backgroundColor: "#00a1df", borderColor: "#00a1df" },
      },
      onOk: async () => {
        const result = await LeaveManagementServices(baseUrlIntranet).createDataLeave(base);
        if (result) {
          if (attendFiles.length > 0) {
            attendFiles.forEach(async (file) => {
              const formData: any = new FormData();
              formData.append("type", "attend");
              formData.append("files", file.originFileObj);
              await LeaveManagementServices(baseUrlIntranet).uploadFiles(result.id, formData);
            });
          }
          message.success("Add success");
          setStartDate(undefined);
          setEndDate(undefined);
          setCheckSwitch(false);
          createdataleaveForm.resetFields();
          setLoading(true);
          router.push("/page/leave-control-management/leave-history");
        }
      },
      onCancel: () => setLoading(false),
    });
  };

  const validateLeavePermission = async (user: any, typeId: number) => {
    const dataMasterType = await LeaveManagementServices(baseUrlIntranet).getdataMasterTypeLeaveByTypeId(typeId);
    const datadisabledLeave = await LeaveManagementServices(baseUrlIntranet).getdataTypeLeaveMap(user.id, dataMasterType.typeId);
    if (datadisabledLeave.length > 0) {
      message.error(`ท่านไม่มีสิทธ์${dataMasterType.typeName}`);
      return { valid: false, dataMasterType: null };
    }

    return { valid: true, dataMasterType };
  };

  const validateYearlyLeave = async (values: ITypeDataLeaveCreate, user: any, dataMasterType: any, startDate: any, endDate: any) => {
    const sumDataLeave = await validateSumTotalLeave({ ...values, startDate, endDate }, dataHolidayDay);

    const dataLeaveUserById = await LeaveManagementServices(baseUrlIntranet).getdataLeaveUserById({
      userId: user.userId,
      typeId: values.type_id,
      startDate,
    });

    const remainingLeave = await validateCheckLeaveDay(dataLeaveUserById, dataMasterType, user.startWork);

    const count = await LeaveManagementServices(baseUrlIntranet).countDataLeaveRange(
      user.userId,
      values.type_id,
      startDate,
      endDate,
      values.startTime,
      values.endTime,
    );

    const total = remainingLeave - sumDataLeave;
    const currentYear = dayjs(startDate).year();

    if (count.status === 200) {
      message.error(`ช่วงเวลาที่คุณเลือก${currentYear ? `ในปี ${currentYear} ` : ""}มีการลาแล้ว กรุณาเลือกช่วงเวลาใหม่`);
      return { valid: false, hours: 0 };
    }

    if (total < 0) {
      message.error(`ไม่สามารถทำการลาได้เนื่องจากวันลาที่เหลืออยู่${currentYear ? `ในปี ${currentYear} ` : ""}หมด หรือไม่เพียงพอ`);
      return { valid: false, hours: 0 };
    }

    return { valid: true, hours: sumDataLeave };
  };

  // ตรวจสอบเลือกวันที่เริ่มต้น และถึงวันที่ โดยให้อยู่ในปีเดียวกัน
  const checkDate = (startDate: any, endDate: any) => {
    // If either date is missing, let form validators handle required behavior
    if (!startDate || !endDate) return Promise.resolve(true);
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // End date must not be before start date
    // if (end.isBefore(start, "day")) {
    //   return Promise.reject(new Error("วันที่สิ้นสุดต้องไม่อยู่ก่อนวันที่เริ่มต้น"));
    // }

    // Enforce both dates to be within the same calendar year
    if (start.year() !== end.year()) {
      return Promise.reject(new Error("ไม่สามารถเลือกวันที่ข้ามปีได้ กรุณาเลือกวันที่ภายในปีเดียวกัน"));
    }

    return Promise.resolve(true);
  };


  // Main function
  const onfinishCreate = async (values: ITypeDataLeaveCreate) => {
    const startDateYear = dayjs(values.startDate).format("YYYY");
    const endDateYear = dayjs(values.endDate).format("YYYY");
    const isSameYear = startDateYear === endDateYear;

    // Check leave status permission
    const checkStatusLeave = await checkStatusTypeLeave(values);
    if (checkStatusLeave.status === 500) return false;

    if (!user?.userId || !user?.startWork) return false;
    const { valid: hasPermission, dataMasterType } = await validateLeavePermission(user, values?.type_id);
    if (!hasPermission) return false;

    let totalLeaveHours = 0;
    if (isSameYear) {
      const validation = await validateYearlyLeave(values, user, dataMasterType, values.startDate, values.endDate);
      if (!validation.valid) return false;
      totalLeaveHours = validation.hours;
    } else {
      const dateRanges = [
        { startDate: values.startDate, endDate: dayjs(values.startDate).endOf("year") },
        { startDate: dayjs(values.endDate).startOf("year"), endDate: values.endDate },
      ];
      for (const dateRange of dateRanges) {
        const validation = await validateYearlyLeave(values, user, dataMasterType, dateRange.startDate, dateRange.endDate);
        if (!validation.valid) return false;
        totalLeaveHours += validation.hours;
      }
    }
    console.log("totalLeaveHours:", totalLeaveHours);
    console.log("values:", values);
    console.log("user:", user);
    console.log("dataMasterType:", dataMasterType);
    console.log("typeLeaveTable:", typeLeaveTable);

    const currentTypeLeaveData = typeLeaveTable.find((item) => item.typeId === values.type_id);

    // โควตาวันลา(yearLeaveHour)
    const { quotaLeaveHour, quotaLeaveDay } = getQuotaLeavePerYear(dataMasterType, user.startWork);
    console.log("โควตาวันลา(yearLeaveHour):", quotaLeaveHour);

    // ลามาแล้ว(usedLeaveHour)
    const usedDays = Number(currentTypeLeaveData?.haveLeaveDays || 0);
    const usedHoursPart = Number(currentTypeLeaveData?.haveLeaveHours || 0);
    const usedLeaveHour = usedDays * 8 + usedHoursPart;
    console.log("ลามาแล้ว(usedLeaveHour):", usedLeaveHour);

    // คงเหลือ(beforeLeaveHour)
    const beforeLeaveHour = Number(currentTypeLeaveData?.limitLeaveLastResult || 0);
    console.log("คงเหลือ(beforeLeaveHour):", beforeLeaveHour);

    console.log("ลาครั้งนี้(leaveHour):", totalLeaveHours);

    // รวม(afterLeaveHour)
    const afterLeaveHour = usedLeaveHour + totalLeaveHours;
    console.log("รวม(afterLeaveHour):", afterLeaveHour);

    const base = createLeaveBase(values, user, dataMasterType, totalLeaveHours, quotaLeaveHour, usedLeaveHour, beforeLeaveHour, afterLeaveHour);
    console.log("base:", base);
    showConfirmModal(base, !isSameYear);
  };

  function onChangeFormCreate(values: any): void {
    setCreatedataleaveFormValues({ ...createdataleaveFormValues, ...values });
  }

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
        <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
          <div className="title-page-font">{`ใบลาออนไลน์`}</div>
        </Divider>
      </Row>
      {user ? (
        <Row gutter={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
          <Col span={11}>
            <CreateOnlineLeave
              getUser={user}
              getTypeLeaveOption={getTypeLeaveOption}
              onfinishCreate={(e: ITypeDataLeaveCreate) => {
                // checkDate(e.startDate, e.endDate)
                onfinishCreate(e)
              }}
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
              getHeader={getHeader}
              onChangeFormCreate={onChangeFormCreate}
              dataHolidayDay={dataHolidayDay}
            />
          </Col>
          <Col span={13}>
            <TableOnlineDetailLeave
              rowClassName={rowClassName}
              typeLeaveTable={typeLeaveTable}
              createdataleaveForm={createdataleaveForm}
              typeLeaveTableAll={typeLeaveTableAll}
              createdataleaveFormValues={createdataleaveFormValues}
              dataHolidayDay={dataHolidayDay}
            />
          </Col>
        </Row>
      ) : null}
    </div>
  );
}
