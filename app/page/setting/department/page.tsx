"use client";
import { Breadcrumb, Card, Col, Row } from "antd";
import DepartmentCreateComponent from "./components/departmentCreate";
import DepartmentComponent from "./components/departmentTable";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DepartmentServices from "./services/department.service";
import { useEffect, useState } from "react";
import { TdepartmentCreateDto, TdepartmentFindMany } from "./common";
import { TPagination } from "@/app/types/user-type";
import { useForm } from "antd/es/form/Form";

export default function Page() {
  const intranetAuth = useAxiosIntranet();
  const departmentServices = DepartmentServices(intranetAuth);
  const [loading, setloading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TPagination>({ current: 1, pageSize: 10 });
  const [dataTable, setDataTable] = useState<TdepartmentFindMany[]>([]);
  const [formCreate] = useForm();

  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const resDepartment = await departmentServices.findMany();
    setDataTable(resDepartment);
    setloading(false);
  };

  const changePagination = (page: TPagination) => {
    // console.log(page);
  };

  async function createDepartMent(value: TdepartmentCreateDto): Promise<void> {
    await departmentServices.create(value);
    formCreate.resetFields();
    setloading(true);
  }

  async function editDepartMent(id: number, data: TdepartmentCreateDto): Promise<void> {
    await departmentServices.update(id, data);
    setloading(true);
  }

  async function deleteDepartMent(id: number): Promise<void> {
    await departmentServices.delete(id);
    setloading(true);
  }

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                href: "/page/setting",
                title: <span>Setting</span>,
              },
              {
                href: "/page/Department",
                title: <span>Department</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`Department`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <DepartmentCreateComponent createDepartMent={createDepartMent} form={formCreate} />
            </Card>
            <Card>
              <DepartmentComponent
                dataTable={dataTable}
                loading={loading}
                setLoading={(e: boolean) => setloading(e)}
                pagination={pagination}
                changePagination={changePagination}
                editDepartMent={editDepartMent}
                deleteDepartMent={deleteDepartMent}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
