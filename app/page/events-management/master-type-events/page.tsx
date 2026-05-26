"use client";
import type { ITMasterTypeEvents } from "@/app/common/master-type-events";
import { loadAppConfig } from "@/app/config/app-config";
import MasterTypeEventsServices from "@/app/services/master-type-events.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Breadcrumb, Button, Card, Col, Divider, Form, notification, Row, type TablePaginationConfig } from "antd";
import React from "react";
import TableMasterTypeEvents from "./components/table-master-type-events";
import ManageMasterTypeEvents from "./components/manage-master-type-events";

const Page = () => {
  const [api, contextHolder] = notification.useNotification();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const mastertypeeventsServices = MasterTypeEventsServices(baseUrIntranet);
  const [formmanage] = Form.useForm();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dataTable, setDataTable] = React.useState<{ data: ITMasterTypeEvents[]; count: number }>({ data: [], count: 0 });
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
    if (loading) {
      fecthData();
    }
  }, [loading]);
  const fecthData = async () => {
    const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take = Number(pagination.pageSize);
    const condition = {};
    const res = await mastertypeeventsServices.dataTable(condition, take, skip);
    setDataTable(res);
    setLoading(false);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    setLoading(true);
  };

  const handleModalOpen = (status: boolean, type: "create" | "edit" | "delete" | "close", data: ITMasterTypeEvents | null) => {
    if (type === "edit") {
      formmanage.setFieldsValue(data);
    }
    setHandleModal({ open: status, type, data });
  };

  const onFinish = async (type: "create" | "edit" | "delete" | "close", values: any) => {
    if (type === "create") {
      await mastertypeeventsServices.create(values);
      api.success({
        message: "บันทึกสำเร็จ",
        description: "เพิ่มข้อมูลทรัพย์สินเรียบร้อยแล้ว",
        placement: "topRight",
      });
      formmanage.resetFields();
      setHandleModal({
        open: false,
        type: "create",
        data: null,
      });
    } else {
      await mastertypeeventsServices.update(formmanage.getFieldValue("id"), values);
      api.success({
        message: "บันทึกสำเร็จ",
        description: "แก้ไขข้อมูลทรัพย์สินเรียบร้อยแล้ว",
        placement: "topRight",
      });
      formmanage.resetFields();
      setHandleModal({
        open: false,
        type: "create",
        data: null,
      });
    }
    setLoading(true);
  };

  const handleDelete = async (id: number) => {
    await mastertypeeventsServices.delete(id);
    api.success({
      message: "ลบข้อมูลสพเร็จ",
      description: "ลบข้อมูลเรียบร้อยแล้ว",
      placement: "topRight",
    });
    formmanage.resetFields();
    setHandleModal({
      open: false,
      type: "create",
      data: null,
    });
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
                title: <span>ผู้ให้บริการ(Vendors)</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>ประเภทของการจัดงาน</span>
          </div>
        </Divider>
        <Col span={24}>
          <Card>
            <div className="flex justify-end mb-2">
              <Button type="primary" htmlType="button" onClick={() => handleModalOpen(true, "create", null)}>{`เพิ่ม`}</Button>
            </div>
            <TableMasterTypeEvents
              dataTable={dataTable}
              pagination={pagination}
              handleTableChange={handleTableChange}
              handleModalOpen={handleModalOpen}
              handleDelete={handleDelete}
            />
          </Card>
        </Col>
      </Row>
      {handleModal.open ? (
        <ManageMasterTypeEvents handleModal={handleModal} handleModalOpen={handleModalOpen} formmanage={formmanage} onFinish={onFinish} />
      ) : null}
    </div>
  );
};

export default Page;
