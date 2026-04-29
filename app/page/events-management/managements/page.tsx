"use client";
import React, { useContext } from "react";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, Modal, notification, Row, TablePaginationConfig } from "antd";
import TableEvents from "./components/table-events";
import { organizeManagementTaskCreateInput } from "@/app/common/organize-management-task";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import OrganizeManagementServices from "@/app/services/organize-management-task.service";
import { UserContext, type UserContectType } from "@/app/config/userContext";

export default function Page() {
  const { id24Axios } = useId24();
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const [api, contextHolder] = notification.useNotification();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const organizemanagementServices = OrganizeManagementServices(baseUrIntranet);
  const [FormManage] = Form.useForm();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dataTable, setDataTable] = React.useState<{ data: organizeManagementTaskCreateInput[]; count: number }>({ data: [], count: 0 });
  const [pagination, setPagination] = React.useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [handleModal, setHandleModal] = React.useState<{
    open: boolean;
    type: "create" | "edit" | "delete" | "close";
    data: any;
  }>({
    open: false,
    type: "create",
    data: null,
  });

  React.useEffect(() => {
    if (loading) fetchdata();
  }, [loading]);

  const fetchdata = async () => {
    const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take = Number(pagination.pageSize);
    const condition = {
      where: {},
      take,
      skip,
    };
    const res = await organizemanagementServices.dataTable(condition);
    setDataTable({ data: res.data, count: res.count });
    setLoading(false);
  };

  const handleModalOpen = (status: boolean, type: "create" | "edit" | "delete" | "close", data: any) => {
    setHandleModal({ open: status, type, data });
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    setLoading(true);
  };

  const onFinish = async (values: organizeManagementTaskCreateInput) => {
    const base = {
      ...values,
      createdBy: `${user?.firstNameTh} ${user?.lastNameTh}`,
      updatedBy: `${user?.firstNameTh} ${user?.lastNameTh}`,
    } as organizeManagementTaskCreateInput;
    await organizemanagementServices.create(base);
    api.success({
      message: "สร้าง Events สำเร็จ",
    });
    setHandleModal({ open: false, type: "create", data: null });
    FormManage.resetFields();
    setLoading(true);
  };

  return (
    <div>
      {contextHolder}
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>การจัดการกิจกรรม</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>การจัดการกิจกรรม</span>
          </div>
        </Divider>
        <Col span={24}>
          <TableEvents data={dataTable} pagination={pagination} onChangePagination={handleTableChange} handleModalOpen={handleModalOpen} />
        </Col>
      </Row>
      {handleModal.open ? (
        <>
          <Modal
            title="สร้างกิจกรรมใหม่"
            closable={{ "aria-label": "Custom Close Button" }}
            open={handleModal.open}
            footer={false}
            onCancel={() => handleModalOpen(false, "close", null)}
          >
            <Form form={FormManage} layout="vertical" autoComplete="off" onFinish={onFinish}>
              <Form.Item name={"name"} label={`ชื่อกิจกรรม`}>
                <Input />
              </Form.Item>
              <Form.Item name={"date"} label={`วันที่จัดกิจกรรม`}>
                <DatePicker />
              </Form.Item>
              <div>
                <Button htmlType="submit">{`ยืนยัน`}</Button>
              </div>
            </Form>
          </Modal>
        </>
      ) : null}
    </div>
  );
}
