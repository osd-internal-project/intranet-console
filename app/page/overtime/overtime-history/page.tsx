"use client";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Card, Divider, Form, message, Modal, TablePaginationConfig } from "antd";
import { FilterOverTimeHistory } from "./components/filter";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import OverTimeServices from "@/app/services/overtime.service";
import { IOverTimeForm } from "@/app/common/overtime";
import TableOvertimeHistory from "./components/table";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { intersection } from "lodash";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { ModalOvertimeHistory } from "./components/modal";

const OvertimeHistory = () => {
  const { id24Axios, tokenAccess } = useId24();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const sideMenuGroups =
    tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];
  const baseUrlIntra = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const baseUrlReport = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_REPORT);
  const [filterForm] = Form.useForm();
  const [formDetail] = Form.useForm();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [params, setParams] = useState<any>({});
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataResource, setDataResource] = useState<{ data: IOverTimeForm[]; total: number }>({ data: [], total: 0 });
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      fecthData();
    }
  }, [loading]);

  const fecthData = async () => {
    try {
      const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take = Number(pagination.pageSize);
      const isHr = intersection(sideMenuGroups, ["hr"]).length > 0;
      const overtime = isHr
        ? await OverTimeServices(baseUrlIntra).findManyHr(skip, take, params)
        : await OverTimeServices(baseUrlIntra).findMany(skip, take, params);
      setDataResource({ data: overtime.data, total: overtime.total });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching overtime data:", error);
      message.error("Failed to fetch overtime data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const response = await OverTimeServices(baseUrlReport).exportReport({
      search: params,
    });
    const blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `รายงานการดำเนินการMA-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.xlsx`);
    message.success("สำเร็จ");
  };

  const onSearch = async (value: object) => {
    setParams({ ...value });
    setLoading(true);
    setPagination({ pageSize: 10, current: 1 });
    setOpenFilter(false);
  };

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  const onFinishUpdate = (values: IOverTimeForm, type: string) => {
    if (!values.overTimeID) return;
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
        const detailUser = { userId: user?.userId, fullName: `${user?.firstNameTh} ${user?.lastNameTh}` };
        const res = await OverTimeServices(baseUrlIntra).update(values?.overTimeID ? values?.overTimeID : "", type, detailUser);
        if (res) {
          type === "cancel" ? message.error("cancel success") : message.success("approved success");
          setLoading(true);
        }
      },
      onCancel() {},
    });
  };

  const onFinishDelete = (id: string) => {
    if (!id) return;
    Modal.confirm({
      title: <>{"delete"}</>,
      icon: <ExclamationCircleFilled />,
      content: <>{"Are you sure you want to delete this ?"}</>,

      onOk: async () => {
        const res = await OverTimeServices(baseUrlIntra).delete(id);
        if (res) {
          message.success("delete success");
          setLoading(true);
        }
      },
      onCancel() {},
    });
  };

  const handleOpenModal = (status: boolean, data: IOverTimeForm | null) => {
    if (status === false) {
      formDetail.resetFields();
    }
    formDetail.setFieldsValue({
      ...data,
      dateStart: data?.dateStart ? dayjs(data?.dateStart) : null,
      startTime: data?.startTime,
      endTime: data?.endTime,
      approvedDate: data?.approvedDate ? dayjs(data?.approvedDate) : null,
      createdAt: data?.createdAt ? dayjs(data?.createdAt) : null,
      updatedAt: data?.updatedAt ? dayjs(data?.updatedAt) : null,
    });
    setOpenModal(status);
  };

  return (
    <div>
      <div className="mb-4">
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              title: <span>Over Time</span>,
            },
            {
              title: <span>รายละเอียดการทำงานล่วงเวลา</span>,
            },
          ]}
        />
      </div>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`ตารางรายละเอียดการทำงานล่วงเวลา`}</div>
      </Divider>
      <div>
        <Card>
          <FilterOverTimeHistory
            handleOpenFilter={handleOpenFilter}
            openFilter={openFilter}
            filterForm={filterForm}
            onSearch={onSearch}
            handleExport={handleExport}
            dataResource={dataResource}
          />
          <TableOvertimeHistory
            dataResource={dataResource}
            pagination={pagination}
            changePagination={changePagination}
            onFinishUpdate={onFinishUpdate}
            onFinishDelete={onFinishDelete}
            sideMenuGroups={sideMenuGroups}
            handleOpenModal={handleOpenModal}
          />
        </Card>
      </div>
      {openModal ? <ModalOvertimeHistory formDetail={formDetail} openModal={openModal} handleOpenModal={handleOpenModal} /> : null}
    </div>
  );
};

export default OvertimeHistory;
