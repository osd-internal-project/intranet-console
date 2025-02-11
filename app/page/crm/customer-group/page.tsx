"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, message, Row, Spin, TablePaginationConfig } from "antd";
 
import Link from "next/link";

import { ExclamationCircleOutlined } from "@ant-design/icons";
import CustomerGroupServices from "@/app/services/customer-group.service";
import { ITCustomerGroup, ITCustomerGroupForm } from "@/app/common/customer";
import CustomerGroupTableComponent from "./components/customer-group-table";
import CustomerGroupFilterComponent from "./components/customer-group-filter";
import CustomerGroupAddComponent from "./components/customer-group-add";
import { useForm } from "antd/es/form/Form";
import CustomerGroupEditComponent from "./components/customer-group-edit";
import modal from "antd/es/modal";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";

export default function CustomerGroupPage() {
  const { id24Axios } = useId24();  
  const baseUrlCrm = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_CRM);
  const customerGroupServices = CustomerGroupServices(baseUrlCrm);
  const [addForm] = useForm();
  const [editForm] = useForm();
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataTable, setDataTable] = useState<ITCustomerGroup[]>([]);
  const [search, setSearch] = useState<object>({});
  const [addState, setAddState] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    const res = await customerGroupServices.findDatatable(search, take, skip);
    setDataTable(res.data);
    setPagination({ ...pagination, total: res.count });
    setloading(false);
  };
  const handdleSearch = (value: object) => {
    setSearch(value);
    setloading(true);
  };
  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setloading(true);
  };
  function handdleChangeExpenseStatus(id: number, status: string): void {}

  async function handdleCreate(form: ITCustomerGroupForm): Promise<void> {
    await customerGroupServices
      .create(form)
      .then((data) => {
        message.success("สำเร็จ");
        setloading(true);
        setAddState(false);
      })
      .catch((err) => message.error("ผิดพลาด"));
  }
  async function handdleUpdate(form: ITCustomerGroupForm): Promise<void> {
    if (editId) {
      await customerGroupServices
        .update(editId, form)
        .then((data) => {
          message.success("สำเร็จ");
          setloading(true);
          setEditId(undefined);
        })
        .catch((err) => message.error("ผิดพลาด"));
    }
  }

  function onOpenEdit(data: ITCustomerGroup): void {
    if (data?.id) {
      setEditId(data.id);
      editForm.setFieldsValue(data);
    }
  }

  function handdleDelete(id: string): void {
    modal.confirm({
      title: "ยืนยันการลบ",
      icon: <ExclamationCircleOutlined />,
      content: "ยืนยันการลบ Customer Group",
      okText: "ลบ",
      cancelText: "ยกเลิก",
      okButtonProps: { danger: true },
      async onOk() {
        setloading(true);
        await customerGroupServices
          .delete(Number(id))
          .then((data) => {
            message.success("สำเร็จ");
            setloading(true);
          })
          .catch((err) => message.error("ผิดพลาด"));
        setloading(false);
      },
    });
  }

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link href={"/page"}>Home</Link>,
              },
              {
                title: <span>CRM</span>,
              },
              {
                title: <span>Customer Group</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`Customer Group`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <div className=" flex justify-end mb-2">
                <Button type="primary" size="small" onClick={() => setAddState(true)}>
                  Add Customer Group
                </Button>
              </div>
              <div>
                <CustomerGroupFilterComponent onSearch={handdleSearch} />
              </div>
              <div>
                <CustomerGroupTableComponent
                  dataTable={dataTable}
                  pagination={pagination}
                  changePagination={changePagination}
                  onOpenEdit={onOpenEdit}
                  handdleDelete={handdleDelete}
                />
              </div>
            </Card>
          </div>
        </Col>
      </Row>
      ...
      {addState && (
        <CustomerGroupAddComponent
          handdleCreate={handdleCreate}
          addState={addState}
          addForm={addForm}
          setAddState={(status: boolean) => setAddState(status)}
        />
      )}
      {editId && (
        <CustomerGroupEditComponent editId={editId} setEditId={(state) => setEditId(state)} handdleUpdate={handdleUpdate} editForm={editForm} />
      )}
    </Spin>
  );
}
