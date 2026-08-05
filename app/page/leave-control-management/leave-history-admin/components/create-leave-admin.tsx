"use client";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import { timeOptions } from "@/app/utils/time-convertor";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { ExclamationCircleFilled, UploadOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input, message, Modal, Select, Switch, Typography, Upload, type UploadFile } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import type { ISelect, ITypeDataLeaveCreate, ITypetypeleave } from "../../common";
import LeaveManagementServices from "@/app/services/leave-management.service";
import { UsersServices } from "@/app/services/users.service";
import type { TUserAllDto } from "@/app/page/users-management/users/common";
import { checkStatusTypeLeave, getQuotaLeavePerYear, validateCheckLeaveDay, validateSumTotalLeave } from "@/app/utils/validatefield";
import type { IFindAllDayDto } from "@/app/page/setting/master-holidays/common";
import { fetchData } from "next-auth/client/_utils";
import MasterHolidaysService from "@/app/page/setting/master-holidays/services/index.service";

import { notifySuccess } from "@/app/utils/message";
const CreateLeaveAdminPage: React.FC = (): React.ReactElement => {
  const [createForm] = Form.useForm();
  const router = useRouter();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrlUsers = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const usersservices = UsersServices(baseUrlUsers);
  const [typeleaveOptions, setTypeleaveOptions] = useState<ISelect[]>([]);
  const [usersOptions, setUsersOptions] = useState<TUserAllDto[]>([]);
  const [dataHolidayDay, setDataHolidayDay] = useState<IFindAllDayDto[]>([]);
  const [typeLeaveTable, setTypeLeaveTable] = useState<ITypetypeleave[]>([]);
  const [typeLeaveTableAll, setTypeLeaveTableAll] = useState<ITypetypeleave[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [checkSwitch, setCheckSwitch] = useState<boolean>(false);
  const [getStartDate, setStartDate] = useState<Date>();
  const [getEndDate, setEndDate] = useState<Date>();

  useEffect(() => {
    if (user?.userId) {
      fetchData(user.userId);
    }
  }, [user, loading]);

  useEffect(() => {
    masterData();
  }, []);

  const masterData = async () => {
    const yearNow = dayjs(new Date()).format("YYYY");
    const dataResult = await MasterHolidaysService(baseUrlIntranet).getHolidayByYear(yearNow);
    setDataHolidayDay(dataResult);
    const responseLeave = await LeaveManagementServices(baseUrlIntranet).getdataAll();
    const responseUser = await usersservices.findAllUser({});
    const options = responseLeave.map((event: ITypetypeleave) => {
      return { value: event.typeId, label: event.typeName };
    });
    setTypeleaveOptions(options);
    setUsersOptions(responseUser.data);
  };

  const fetchData = async (userId: string) => {
    try {
      const resTableDeatilTypeLeave = await LeaveManagementServices(baseUrlIntranet).findDetailTypeLeaveByUserId(user?.userId);
      const resTableUserTypeLeave = await LeaveManagementServices(baseUrlIntranet).findUserByUserId(user?.userId);

      setTypeLeaveTable(resTableDeatilTypeLeave);
      setTypeLeaveTableAll(resTableUserTypeLeave.typeLeaveDisabledMap);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUser = async (value: string) => {
    const onfilterUsers = usersOptions.find((item) => item.userId === value);
    if (!onfilterUsers) return false;
    const HeaderGroup = await LeaveManagementServices(baseUrlIntranet).getHeaderByUserId(onfilterUsers?.token);
    createForm.setFieldsValue({
      firstNameTh: onfilterUsers?.firstNameTh,
      lastNameTh: onfilterUsers?.lastNameTh,
      posId: onfilterUsers?.masterPosition?.posId,
      position: onfilterUsers?.masterPosition?.nameTh,
      userId: value,
      ownerName: HeaderGroup && HeaderGroup.map((item: TUserAllDto) => `${item.firstNameTh} ${item.lastNameTh}`).join(", "),
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
    const sumDataLeave = await validateSumTotalLeave({ ...values, startDate, endDate }, dataHolidayDay, values.type_id);

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

  const createLeaveBase = (
    values: ITypeDataLeaveCreate,
    user: any,
    dataMasterType: any,
    totalHours: number,
    quotaLeaveHour: number,
    usedLeaveHour: number,
    beforeLeaveHour: number,
    afterLeaveHour: number,
  ) => ({
    startDate: dayjs(values.startDate).startOf("date").toISOString(),
    endDate: dayjs(values.endDate).endOf("date").toISOString(),
    startTime: values.startTime || undefined,
    endTime: values.endTime || undefined,
    detail: values.detail,
    phoneNumber: values.phoneNumber,
    ownerName: values.ownerName,
    userId: createForm.getFieldValue("userId"),
    firstName: createForm.getFieldValue("firstNameTh"),
    lastName: createForm.getFieldValue("lastNameTh"),
    positionId: createForm.getFieldValue("posId"),
    position: createForm.getFieldValue("position"),
    typeId: values.type_id,
    typeName: dataMasterType?.typeName,
    status: "waiting",
    attrachFile: attendFiles[0]?.name,
    leaveHour: totalHours,
    groupId: user?.ownerGroupId,
    yearLeaveHour: quotaLeaveHour, // จำนวนวันลาที่ได้ขอในปีนั้น
    usedLeaveHour: usedLeaveHour, // จำนวนวันลาที่ใช้ไปในปีนั้น
    beforeLeaveHour: beforeLeaveHour, // จำนวนวันลาคงเหลือก่อนขอลา(อนุมัติ)
    afterLeaveHour: afterLeaveHour, // จำนวนวันลาคงเหลือหลังขอลา(อนุมัติ)
  });

  // Main function
  const onfinishCreate = async (values: ITypeDataLeaveCreate) => {
    const startDateYear = dayjs(values.startDate).format("YYYY");
    const endDateYear = dayjs(values.endDate).format("YYYY");
    const isSameYear = startDateYear === endDateYear;

    if (!user?.userId || !user?.startWork) return false;
    const { valid: hasPermission, dataMasterType } = await validateLeavePermission(user, values?.type_id);
    if (!hasPermission) return false;

    let totalLeaveHours = 0;
    if (isSameYear) {
      const validation = await validateYearlyLeave(values, user, dataMasterType, values.startDate, values.endDate);
      if (!validation.valid) return false;
      totalLeaveHours = validation.hours;
    } else {
      createForm.setFields([{ name: "endDate", errors: ["ไม่สามารถเลือกวันที่ข้ามปีได้ กรุณาเลือกวันที่ภายในปีเดียวกัน"] }]);

      return false;
    }
    const currentTypeLeaveData = typeLeaveTable.find((item: any) => item.typeId === values.type_id);

    // โควตาวันลา(yearLeaveHour)
    const { quotaLeaveHour } = getQuotaLeavePerYear(dataMasterType, user.startWork);
    // console.log("โควตาวันลา(yearLeaveHour):", quotaLeaveHour);

    // ลามาแล้ว(usedLeaveHour)
    const usedDays = Number(currentTypeLeaveData?.haveLeaveDays || 0);
    const usedHoursPart = Number(currentTypeLeaveData?.haveLeaveHours || 0);
    const usedLeaveHour = usedDays * 8 + usedHoursPart;
    // console.log("ลามาแล้ว(usedLeaveHour):", usedLeaveHour);

    // คงเหลือก่อนอนุมัติ(beforeLeaveHour)
    const beforeLeaveHour = Number(currentTypeLeaveData?.limitLeaveLastResult || 0);
    // console.log("คงเหลือ(beforeLeaveHour):", beforeLeaveHour);

    // console.log("ลาครั้งนี้(leaveHour):", totalLeaveHours);

    // คงเหลือหลังอนุมัติ(afterLeaveHour)
    const afterLeaveHour = beforeLeaveHour - totalLeaveHours;
    // console.log("คงเหลือหลังอนุมัติ(afterLeaveHour):", afterLeaveHour);

    const base = createLeaveBase(values, user, dataMasterType, totalLeaveHours, quotaLeaveHour, usedLeaveHour, beforeLeaveHour, afterLeaveHour);
    // console.log("base:", base);
    showConfirmModal(base, !isSameYear);
  };

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
          notifySuccess("leave.create");
          setStartDate(undefined);
          setEndDate(undefined);
          setCheckSwitch(false);
          createForm.resetFields();
          setLoading(true);
          router.push("/page/leave-control-management/leave-history-admin");
        }
      },
      onCancel: () => setLoading(false),
    });
  };

  return (
    <div>
      <Card className="w-full grid grid-cols-1">
        <div>
          <Form
            size="small"
            className=" grid grid-cols-1 p-0 no-label-padding"
            layout="vertical"
            autoComplete="off"
            form={createForm}
            onFinish={onfinishCreate}
          >
            <div className="col-span-1 md:col-span-1  justify-end flex p-0">
              <Form.Item label={`วันที่ `} name={`createdAt`} layout="horizontal">
                <Typography.Text>{dayjs(new Date()).format("DD-MM-YYYY")}</Typography.Text>
              </Form.Item>
            </div>
            <div className="md:col-span-1 w-full">
              <Form.Item label={`ชื่อ - สกุล`} name={`fullName`} layout="horizontal" wrapperCol={{ span: 24 }}>
                <Select
                  onChange={handleChangeUser}
                  className="w-full"
                  placeholder="ชื่อ - สกุล"
                  options={usersOptions.map((user) => ({
                    value: user.userId,
                    label: `${user.firstNameTh} ${user.lastNameTh}`,
                  }))}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </div>
            <div className=" col-span-1 md:col-span-1 ">
              <Form.Item label={`ตำแหน่ง `} name={`position`} layout="horizontal" wrapperCol={{ span: 20 }}>
                <Input
                  readOnly
                  className="!bg-transparent !shadow-none !border-none hover:!bg-transparent focus:!bg-transparent cursor-default text-gray-900"
                />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 " style={{ marginTop: "-10px" }}>
              <Form.Item label={`เรียนถึง `} name={`ownerName`} layout="horizontal" wrapperCol={{ span: 20 }}>
                <Input
                  readOnly
                  className="!bg-transparent !shadow-none !border-none hover:!bg-transparent focus:!bg-transparent cursor-default text-gray-900"
                />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ">
              <Form.Item label={`ประเภทการลา :`} name={`type_id`} rules={[{ required: true, message: "กรุณาเลือกประเภทการลา" }]}>
                <Select placeholder={`ประเภทการลา`} options={typeleaveOptions} allowClear showSearch optionFilterProp="label" />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <div className=" col-span-3 md:col-span-1 ">
                <Form.Item label={`ตั้งแต่วันที่ :`} name={`startDate`} rules={[{ required: true }]}>
                  <DatePicker allowClear className="w-full" onChange={(e: any) => setStartDate(e)} format={"DD-MM-YYYY"} />
                </Form.Item>
              </div>
              <div className=" col-span-3 md:col-span-1 ">
                <Form.Item label={`ถึงวันที่ :`} name={`endDate`} rules={[{ required: true }]}>
                  <DatePicker allowClear className="w-full" onChange={(e: any) => setEndDate(e)} format={"DD-MM-YYYY"} />
                </Form.Item>
              </div>
            </div>
            <>
              {dayjs(getStartDate).isSame(getEndDate, "day") && getEndDate && (
                <div className="w-full grid grid-cols-4 gap-2">
                  <div className="col-span-3 md:col-span-1">
                    <Form.Item label="ลา 1 วัน" name="time_start_check" valuePropName="checked">
                      <Switch unCheckedChildren="ไม่" checkedChildren="ใช่" onChange={setCheckSwitch} />
                    </Form.Item>
                  </div>
                  {!checkSwitch && (
                    <>
                      <div className="col-span-3 md:col-span-1">
                        <Form.Item label="เวลาเริ่มต้น :" name="startTime" rules={[{ required: true, message: "กรุณาเลือกเวลาที่เริ่มลา" }]}>
                          <Select
                            showSearch={false}
                            virtual
                            allowClear
                            className="w-full"
                            placeholder="เลือกช่วงเวลา"
                            options={timeOptions.map((time) => ({
                              value: time,
                              label: time,
                            }))}
                          />
                        </Form.Item>
                      </div>

                      <div className="col-span-3 md:col-span-1">
                        <Form.Item label="เวลาสิ้นสุด :" name="endTime" rules={[{ required: true, message: "กรุณาเลือกเวลาที่สิ้นสุดการลา" }]}>
                          <Select
                            showSearch={false}
                            virtual
                            allowClear
                            className="w-full"
                            placeholder="เลือกช่วงเวลา"
                            options={timeOptions.map((time) => ({
                              value: time,
                              label: time,
                            }))}
                          />
                        </Form.Item>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
            {/* <div className="col-span-3 md:col-span-1">
              <Form.Item label="เวลาเริ่มต้น :" name="startTime" rules={[{ required: true, message: "กรุณาเลือกเวลาที่เริ่มลา" }]}>
                <Select
                  showSearch={false}
                  virtual
                  allowClear
                  className="w-full"
                  placeholder="เลือกช่วงเวลา"
                  options={timeOptions.map((time) => ({
                    value: time,
                    label: time,
                  }))}
                />
              </Form.Item>
            </div>

            <div className="col-span-3 md:col-span-1">
              <Form.Item label="เวลาสิ้นสุด :" name="endTime" rules={[{ required: true, message: "กรุณาเลือกเวลาที่สิ้นสุดการลา" }]}>
                <Select
                  showSearch={false}
                  virtual
                  allowClear
                  className="w-full"
                  placeholder="เลือกช่วงเวลา"
                  options={timeOptions.map((time) => ({
                    value: time,
                    label: time,
                  }))}
                />
              </Form.Item>
            </div> */}
            <div className=" col-span-3 md:col-span-1 ">
              <Form.Item label={`วัตถุประสงค์การลา :`} name={`detail`} rules={[{ required: true, message: "กรุณากรอกวัตถุประสงค์การลา" }]}>
                <Input.TextArea placeholder="วัตถุประสงค์การลา" />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <div className=" col-span-3 md:col-span-1 ">
                <Form.Item
                  label={`เบอร์โทรศัพท์ :`}
                  name={"phoneNumber"}
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกเบอร์โทรศัพท์",
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
                    },
                  ]}
                >
                  <Input
                    maxLength={10}
                    placeholder="เบอร์โทรศัพท์"
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <div className=" col-span-3 md:col-span-1 ">
                <Form.Item label={`แนบไฟล์ :`} name={"attrachFile"}>
                  <Upload
                    showUploadList={true}
                    // fileList={attendFiles}
                    // onChange={handleChangeAttendFiles}
                    // beforeUpload={beforeUploadAttendFiles}
                    multiple={false}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>{`อัปโหลดไฟล์`}</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
            <div className=" col-span-12 md:col-span-1  justify-center flex w-full">
              <Button htmlType="submit" type="primary">{`ยื่นใบลา`}</Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default CreateLeaveAdminPage;
