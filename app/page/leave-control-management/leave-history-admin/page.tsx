"use client";
import React, { useContext, useEffect, useState } from "react";
import { TableDetail } from "./components/table-detail";
import { Breadcrumb, Card, Col, Divider, Form, Modal, Row, TablePaginationConfig, Tabs, message } from "antd";
import DataLeaveService from "../../../services/leave-management.service";
import { ITypeDataLeave, type ITypetypeleave } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { intersection } from "lodash";
import dayjs from "dayjs";
import saveAs from "file-saver";
import { TableTotalLeaveDetailPage } from "./components/table-leave-detail";
import LeaveManagementServices from "../../../services/leave-management.service";

export default function Page() {
  const { id24Axios, tokenAccess } = useId24();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const sideMenuGroups =
    tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrlReport = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_REPORT);
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
  const [formdetail] = Form.useForm();

  useEffect(() => {
    if (loading) loadData();
  }, [loading, user]);

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

  const dataDetailLeaveHour = async (userId: string, typeId: number) => {
    console.log(typeId);
    const resTableDeatilTypeLeave = await LeaveManagementServices(baseUrlIntranet).findDetailByTypeLeaveUserId(userId, typeId);
    setTypeLeaveTableAll(resTableDeatilTypeLeave);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
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

  // const onChange = (key: string) => {
  //   console.log(key);
  // };

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
            // onChange={onChange}
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
                        <TableTotalLeaveDetailPage
                        // dataLeaveUser={dataLeaveUser}
                        // setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
                        // openModalDetail={openModalDetail}
                        // formdetail={formdetail}
                        // onFinishUpdate={onFinishUpdate}
                        // onFinishDelete={onFinishDelete}
                        // downloadFile={downloadFile}
                        // sideMenuGroups={sideMenuGroups}
                        // setSubmitAction={setSubmitAction}
                        // submitAction={submitAction}
                        // setParams={setParams}
                        // setLoading={setLoading}
                        // handleExport={handleExport}
                        // pagination={pagination}
                        // changePagination={changePagination}
                        />
                      </Card>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Row>
    </>
  );
}
