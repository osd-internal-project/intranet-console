"use client";
import React from "react";
import { Breadcrumb, Col, Divider, Form, Row, TablePaginationConfig } from "antd";
import ManageEvents from "./components/manage-events";
import TableEvents from "./components/table-events";
import { organizeManagementCreateInput } from "@/app/common/organize-management";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import OrganizeManagementServices from "@/app/services/organize-management.service";

export default function Page() {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const organizemanagementServices = OrganizeManagementServices(baseUrIntranet);
  const [ManageForm] = Form.useForm();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dataTable, setDataTable] = React.useState<{ data: organizeManagementCreateInput[]; count: number }>({ data: [], count: 0 });
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
    console.log(res);

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

  const onfinish = (type: "create" | "edit" | "delete" | "close", values: any) => {
    // Handle form submission logic here
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
        <ManageEvents handleModalOpen={handleModalOpen} handleModal={handleModal} ManageForm={ManageForm} onfinish={onfinish} />
      ) : null}
    </div>
  );
}
