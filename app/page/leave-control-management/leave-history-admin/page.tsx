"use client";
import React, { useContext, useEffect, useState } from "react";
import { TableDetail } from "./components/table-detail";
import { Breadcrumb, Card, Col, Divider, Form, Modal, Row, TablePaginationConfig, Tabs, message } from "antd";
import DataLeaveService from "../../../services/leave-management.service";
import { ITypeDataLeave, type ISelect, type ITypeDataLeaveCreate, type ITypetypeleave } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { intersection } from "lodash";
import dayjs from "dayjs";
import saveAs from "file-saver";
import { TableTotalLeaveDetailPage } from "./components/table-leave-detail";
import LeaveManagementServices from "../../../services/leave-management.service";
import CreateLeaveAdminPage from "./components/create-leave-admin";
import { TableDetailEdit } from "./components/table-detail-edit";
import { getQuotaLeavePerYear, validateCheckLeaveDay, validateSumTotalLeave } from "@/app/utils/validatefield";
import { UsersServices } from "@/app/services/users.service";
import MasterHolidaysService from "../../setting/master-holidays/services/index.service";

export default function Page() {
  const { id24Axios, tokenAccess } = useId24();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const sideMenuGroups =
    tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];
  const isHr = intersection(sideMenuGroups, ["hr"]).length > 0;
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrlReport = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_REPORT);
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLeaveUser, setDataLeaveUser] = useState<{ data: ITypeDataLeave[]; count: number }>({ data: [], count: 0 });
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [submitAction, setSubmitAction] = useState<"approved" | "cancel">("approved");
  const [params, setParams] = useState<{ type: string; value: string }>({ type: "", value: "" });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [typeLeaveTableAll, setTypeLeaveTableAll] = useState<ITypetypeleave>();
  const [optionsTypeleave, setOptionsTypeleave] = useState<ISelect[]>([]);
  const [formdetail] = Form.useForm();
  const [formdetailEdit] = Form.useForm();

  useEffect(() => {
    if (loading) loadData();
  }, [loading, user]);

  useEffect(() => {
    masterdata();
  }, []);

  const loadData = async () => {
    if (user?.userId) {
      const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take = Number(pagination.pageSize);
      const isHr = intersection(sideMenuGroups, ["hr"]).length > 0;
      const { data, count } = isHr
        ? await DataLeaveService(baseUrlIntranet).getdataLeaveHrfindBygroup(user.userId, params, skip, take)
        : await DataLeaveService(baseUrlIntranet).getdataLeavefindBygroup(user.userId, params, skip, take);
      setDataLeaveUser({ data, count });
      setLoading(false);
    }
  };

  const masterdata = async () => {
    const res = await LeaveManagementServices(baseUrlIntranet).getdataAll();
    const options = res.map((event: ITypetypeleave) => {
      return { value: event.typeId, label: event.typeName };
    });
    setOptionsTypeleave(options);
  };

  const dataDetailLeaveHour = async (userId: string, typeId: number) => {
    // console.log(typeId);
    const resTableDeatilTypeLeave = await LeaveManagementServices(baseUrlIntranet).findDetailByTypeLeaveUserId(userId, typeId);
    //console.log("resTableDeatilTypeLeave: ",resTableDeatilTypeLeave);
    setTypeLeaveTableAll(resTableDeatilTypeLeave);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  const handleReloadData = (e: string) => {
    if (e === "1" || e === "4") {
      formdetail.resetFields();
      formdetailEdit.resetFields();
      setLoading(true);
    }
  };

  const onFinishUpdate = (values: any, type: string, id: number) => {
    Modal.confirm({
      title: <>{type === "cancel" ? "Cancel " : "Approved"}</>,
      icon: <ExclamationCircleFilled />,
      content: <>{type === "cancel" ? "Are you sure you want to cancel this ?" : "Are you sure you want to Approved this ?"}</>,
      okText: "Confirm",
      okButtonProps: {
        type: "primary",
        style: {
          backgroundColor: type === "cancel" ? "#ff4d4f" : "#1890ff",
          borderColor: type === "cancel" ? "#ff4d4f" : "#1890ff",
          color: "white",
        },
      },
      cancelText: "Cancel",
      cancelButtonProps: {
        style: {
          backgroundColor: "#f0f0f0",
          borderColor: "#d9d9d9",
          color: "#000",
        },
      },
      onOk: async () => {
        const res = await DataLeaveService(baseUrlIntranet).approvedDataLeave(values.detailApproved, type, id, user, values.typeLeave);
        if (res) {
          type === "cancel" ? message.error("cancel success") : message.success("approved success");
          setSubmitAction("approved");
          setLoading(true);
          setOpenModalDetail(false);
        }
      },
      onCancel() {},
    });
  };

  const onFinishDelete = (type: string, id: number) => {
    Modal.confirm({
      title: <>{"Delete"}</>,
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: {
        type: "primary",
        style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" },
      },
      cancelText: "Cancel",
      cancelButtonProps: {
        style: {
          backgroundColor: "#f0f0f0",
          borderColor: "#d9d9d9",
          color: "#000",
        },
      },
      onOk: async () => {
        try {
          const res = await DataLeaveService(baseUrlIntranet).deleteDataLeave(id);
          if (res) {
            message.success("Delete success");
          } else {
            message.error("Delete failed");
          }
          setLoading(true);
          setOpenModalDetail(false);
        } catch (error) {
          message.error("Delete failed");
        }
      },
      onCancel() {},
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

  const validateYearlyLeave = async (values: any, user: any, dataMasterType: any, startDate: any, endDate: any) => {
    const yearNow = dayjs(new Date()).format("YYYY");
    const dataResult = await MasterHolidaysService(baseUrlIntranet).getHolidayByYear(yearNow);
    const sumDataLeave = await validateSumTotalLeave({ ...values, startDate, endDate }, dataResult);
    const dataLeaveUserById = await LeaveManagementServices(baseUrlIntranet).getdataLeaveUserById({
      userId: user.userId,
      typeId: values.typeId,
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

  const onFinishEdit = async (type: string, data: any) => {
    const startDateYear = dayjs(data.startDate).format("YYYY");
    const endDateYear = dayjs(data.endDate).format("YYYY");
    const isSameYear = startDateYear === endDateYear;
    const resTableDeatilTypeLeave = await LeaveManagementServices(baseUrlIntranet).findDetailTypeLeaveByUserId(data?.userId);

    const currentTypeLeaveData = resTableDeatilTypeLeave.find((item: any) => item.typeId === data.typeId);

    const userInfo = await UsersServices(baseUrlUser).findByUserId(data?.userId);
    if (!userInfo?.userId || !userInfo?.startWork) return false;
    const { valid: hasPermission, dataMasterType } = await validateLeavePermission(userInfo, data?.typeId);
    if (!hasPermission) return false;

    let totalLeaveHours = 0;
    if (isSameYear) {
      const validation = await validateYearlyLeave(data, userInfo, dataMasterType, data.startDate, data.endDate);
      if (!validation.valid) return false;
      totalLeaveHours = validation.hours;
    }

    // โควตาวันลา(yearLeaveHour)
    const { quotaLeaveHour, quotaLeaveDay } = getQuotaLeavePerYear(dataMasterType, userInfo.startWork);
    console.log("โควตาวันลา(yearLeaveHour):", quotaLeaveHour);

    // ลามาแล้ว(usedLeaveHour)
    const usedDays = Number(currentTypeLeaveData?.haveLeaveDays || 0);
    const usedHoursPart = Number(currentTypeLeaveData?.haveLeaveHours || 0);
    const usedLeaveHour = usedDays * 8 + usedHoursPart;
    console.log("ลามาแล้ว(usedLeaveHour):", usedLeaveHour);

    // คงเหลือก่อนอนุมัติ(beforeLeaveHour)
    const beforeLeaveHour = Number(currentTypeLeaveData?.limitLeaveLastResult || 0);
    console.log("คงเหลือ(beforeLeaveHour):", beforeLeaveHour);
    console.log("ลาครั้งนี้(leaveHour):", totalLeaveHours);
    // คงเหลือหลังอนุมัติ(afterLeaveHour)
    const afterLeaveHour = beforeLeaveHour - totalLeaveHours;
    console.log("คงเหลือหลังอนุมัติ(afterLeaveHour):", afterLeaveHour);
    Modal.confirm({
      title: <>{"Edit"}</>,
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to edit this ?",
      okText: "Confirm",
      cancelText: "Cancel",
      cancelButtonProps: {
        style: {
          backgroundColor: "#f0f0f0",
          borderColor: "#d9d9d9",
          color: "#000",
        },
      },
      onOk: async () => {
        try {
          const res = await DataLeaveService(baseUrlIntranet).updateDetailLeave(data.id, { ...data, typeName: dataMasterType?.typeName }, user);
          if (res) {
            message.success("Update success");
          } else {
            message.error("Update failed");
          }
          setLoading(true);
          setOpenModalDetail(false);
        } catch (error) {
          message.error("Update failed");
        }
      },
      onCancel() {},
    });
  };

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await DataLeaveService(baseUrlIntranet).downloadFile(id);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  const handleExport = async () => {
    const response = await DataLeaveService(baseUrlReport).exportReport({
      search: params,
    });
    const blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `รายงานการลา-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.xlsx`);
    message.success("สำเร็จ");
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>จัดการการลา</span>,
              },
            ]}
          />
        </Col>
        <div className="site-card-border-less-wrapper" style={{ width: "100%", marginTop: "10px" }}>
          <Tabs
            onChange={handleReloadData}
            type="card"
            items={[
              {
                label: `จัดการการลา`,
                key: "1",
                children: (
                  <div>
                    <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
                      <div className="title-page-font">{`จัดการการลา`}</div>
                    </Divider>
                    <div className="w-full">
                      <Card>
                        <TableDetail
                          dataLeaveUser={dataLeaveUser}
                          setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
                          openModalDetail={openModalDetail}
                          formdetail={formdetail}
                          onFinishUpdate={onFinishUpdate}
                          onFinishDelete={onFinishDelete}
                          downloadFile={downloadFile}
                          sideMenuGroups={sideMenuGroups}
                          setSubmitAction={setSubmitAction}
                          submitAction={submitAction}
                          setParams={setParams}
                          setLoading={setLoading}
                          handleExport={handleExport}
                          pagination={pagination}
                          changePagination={changePagination}
                          dataDetailLeaveHour={dataDetailLeaveHour}
                          typeLeavebyTypeId={typeLeaveTableAll}
                        />
                      </Card>
                    </div>
                  </div>
                ),
              },
              {
                label: `ประวัติการลารวมของพนักงาน`,
                key: "2",
                children: (
                  <div>
                    <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
                      <div className="title-page-font">{`ประวัติการลารวมของพนักงาน`}</div>
                    </Divider>
                    <div className="w-full">
                      <Card>
                        <TableTotalLeaveDetailPage />
                      </Card>
                    </div>
                  </div>
                ),
              },
              ...(isHr
                ? [
                    {
                      label: `สร้างข้อมูลการลาพนักงาน`,
                      key: "3",
                      children: (
                        <div>
                          <Divider orientation="left" orientationMargin="0" style={{ padding: 0, marginBottom: 0, marginTop: 0 }}>
                            <div className="title-page-font">{`จัดการการลาพนักงาน`}</div>
                          </Divider>
                          <div className="w-full">
                            <Card>
                              <CreateLeaveAdminPage />
                            </Card>
                          </div>
                        </div>
                      ),
                    },
                  ]
                : []),
              ...(isHr
                ? [
                    {
                      label: `แก้ไขข้อมูลการลาพนักงาน`,
                      key: "4",
                      children: (
                        <div>
                          <Divider orientation="left" orientationMargin="0" style={{ padding: 0, marginBottom: 0, marginTop: 0 }}>
                            <div className="title-page-font">{`แก้ไขข้อมูลการลาพนักงาน`}</div>
                          </Divider>
                          <div className="w-full">
                            <Card>
                              <TableDetailEdit
                                dataLeaveUser={dataLeaveUser}
                                setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
                                openModalDetail={openModalDetail}
                                formdetail={formdetailEdit}
                                onFinishUpdate={onFinishUpdate}
                                onFinishDelete={onFinishDelete}
                                downloadFile={downloadFile}
                                sideMenuGroups={sideMenuGroups}
                                setSubmitAction={setSubmitAction}
                                submitAction={submitAction}
                                setParams={setParams}
                                setLoading={setLoading}
                                handleExport={handleExport}
                                pagination={pagination}
                                changePagination={changePagination}
                                dataDetailLeaveHour={dataDetailLeaveHour}
                                typeLeavebyTypeId={typeLeaveTableAll}
                                onFinishEdit={onFinishEdit}
                                optionsTypeleave={optionsTypeleave}
                              />
                            </Card>
                          </div>
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </Row>
    </>
  );
}
