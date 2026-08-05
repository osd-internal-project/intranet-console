"use client";
import React, { useContext } from "react";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, Modal, notification, Row, Select, TablePaginationConfig, Tabs } from "antd";
import TableEvents from "./components/table-events";
import { organizeManagementTaskCreateInput } from "@/app/common/organize-management-task";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import OrganizeManagementServices from "@/app/services/organize-management-task.service";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import MasterTypeEventsServices from "@/app/services/master-type-events.service";
import type { ITMasterTypeEvents } from "@/app/common/master-type-events";

import { successText } from "@/app/utils/message";
export default function Page() {
  const { id24Axios } = useId24();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const [api, contextHolder] = notification.useNotification();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const mastertypeeventsServices = MasterTypeEventsServices(baseUrIntranet);
  const organizemanagementServices = OrganizeManagementServices(baseUrIntranet);
  const [FormManage] = Form.useForm();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [masterTypes, setMasterTypes] = React.useState<ITMasterTypeEvents[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("");
  const [dataTable, setDataTable] = React.useState<{
    data: organizeManagementTaskCreateInput[];
    count: number;
  }>({ data: [], count: 0 });
  const [pagination, setPagination] = React.useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [handleModal, setHandleModal] = React.useState<{
    open: boolean;
    type: "create" | "edit" | "delete" | "close";
    data: any;
  }>({ open: false, type: "create", data: null });

  React.useEffect(() => {
    masterdata();
  }, []);

  React.useEffect(() => {
    if (loading && activeTab !== "") fetchdata();
  }, [loading, activeTab]);

  const masterdata = async () => {
    const response: ITMasterTypeEvents[] = await mastertypeeventsServices.dataOption();
    setMasterTypes(response);
    if (response.length > 0) {
      setActiveTab(String(response[0].typeId));
      setLoading(true);
    }
  };

  const fetchdata = async () => {
    const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take = Number(pagination.pageSize);
    const condition = {
      where: {
        typeId: activeTab,
      },
      take,
      skip,
    };
    const res = await organizemanagementServices.dataTable(condition);
    setDataTable({ data: res.data, count: res.count });
    setLoading(false);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPagination((prev) => ({ ...prev, current: 1 }));
    setLoading(true);
  };

  const handleModalOpen = (status: boolean, type: "create" | "edit" | "delete" | "close", data: any) => {
    setHandleModal({ open: status, type, data });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    setLoading(true);
  };

  const handleDelete = async (id: number) => {
    const response = await organizemanagementServices.delete(id);
    if (response) {
      api.success({ message: successText("events.delete") });
      setHandleModal({ open: false, type: "create", data: null });
      FormManage.resetFields();
      setLoading(true);
    }
  };

  const onFinish = async (values: organizeManagementTaskCreateInput) => {
    const base = {
      ...values,
      createdBy: `${user?.firstNameTh} ${user?.lastNameTh}`,
      updatedBy: `${user?.firstNameTh} ${user?.lastNameTh}`,
    } as organizeManagementTaskCreateInput;
    await organizemanagementServices.create(base);
    api.success({ message: successText("events.create") });
    setHandleModal({ open: false, type: "create", data: null });
    FormManage.resetFields();
    setLoading(true);
  };

  const tabItems = masterTypes.map((type) => ({
    key: type.typeId,
    label: type.name,
  }));

  return (
    <div>
      {contextHolder}
      <Row>
        <Col span={24}>
          <Breadcrumb items={[{ href: "/page/home", title: <span>{`หน้าหลัก`}</span> }, { title: <span>{`การจัดการกิจกรรม`}</span> }]} />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>{`การจัดการกิจกรรม`}</span>
          </div>
        </Divider>
        <Col span={24}>
          <Tabs activeKey={activeTab} items={tabItems} onChange={handleTabChange} />
          <TableEvents
            data={dataTable}
            pagination={pagination}
            onChangePagination={handleTableChange}
            handleModalOpen={handleModalOpen}
            handleDelete={handleDelete}
          />
        </Col>
      </Row>

      {handleModal.open && (
        <Modal
          title="สร้างกิจกรรมใหม่"
          closable={{ "aria-label": "Custom Close Button" }}
          open={handleModal.open}
          footer={false}
          onCancel={() => handleModalOpen(false, "close", null)}
        >
          <Form form={FormManage} layout="vertical" autoComplete="off" onFinish={onFinish}>
            <Form.Item name="name" label="ชื่อกิจกรรม">
              <Input placeholder="Please Input" />
            </Form.Item>
            <Form.Item name="typeId" label="ประเภทของงานกิจกรรม">
              <Select
                placeholder="Please Select"
                options={masterTypes.map((type) => ({
                  value: type.typeId,
                  label: type.name,
                }))}
              />
            </Form.Item>
            <Form.Item name="location" label="สถานที่จัดงาน">
              <Input placeholder="Please Input" />
            </Form.Item>
            <Form.Item name="date" label="วันที่จัดกิจกรรม">
              <DatePicker />
            </Form.Item>
            <div>
              <Button htmlType="submit">{`ยืนยัน`}</Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}
