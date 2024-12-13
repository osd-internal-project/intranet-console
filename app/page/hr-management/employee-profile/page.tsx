"use client";

import { useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Divider, Form, PaginationProps, Radio, Row, TablePaginationConfig, UploadFile } from "antd";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import EmployeeProfileGrid from "./components/employee-profile-grid";
import EmployeeProfileList from "./components/employee-profile-list";
import EmployeeProfileManageUser from "./components/employee-profile-manage-user";
import EmployeeProfileDetail from "@/app/services/employee-profile.services";
import { gridIconHr, listIcon } from "@/components/icon";
import EmployeeProfileDashboard from "./components/employee-profile-dashboard";

export default function EmployeeProfilePage() {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlHrManagement = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_HR_MANAGEMENT);
  const [form] = Form.useForm();
  const [typeGroup, setTypeGroup] = useState<string>("list");
  const [typeManageUser, setTypeManageUser] = useState<string>("Create");
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataSourceDashboard, setDataSourceDashboard] = useState<{ active: number; inactive: number; new: number; status: string; total: number }>({
    active: 0,
    inactive: 0,
    new: 0,
    status: "",
    total: 0,
  });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (loading) fecthDataDashboard();
  }, [loading]);

  const fecthDataDashboard = async () => {
    const baseParams = {
      valueOne: "non-params",
      valueTwo: true,
      valueThree: false,
      valueFour: "approved",
    };
    const dataCountDashboards = await EmployeeProfileDetail(baseUrlHrManagement).getCount(baseParams);
    const dataEmployeeProfileAll = await EmployeeProfileDetail(baseUrlHrManagement).getEmployeeProfileAll(pagination);
    if (dataCountDashboards.status === "success") setDataSourceDashboard(dataCountDashboards);
    setDataSource(dataEmployeeProfileAll);
    setLoading(false);
  };
  const options = [
    { label: <span>{listIcon}</span>, value: "list" },
    { label: <span>{gridIconHr}</span>, value: "grid" },
  ];
  const onChangeType = (typeGroup: string) => {
    setTypeGroup(typeGroup);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  const handleOpen = (type: string) => {
    setTypeManageUser(type);
    setOpenModal(true);
  };

  const handleClose = () => {
    setTypeManageUser("Create");
    form.resetFields();
    setOpenModal(false);
  };

  const onFinish = async (values: any, type: string) => {
    console.log(type);
    console.log(values);
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
                title: <span>ข้อมูลพนักงาน</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`ข้อมูลพนักงาน`}</div>
        </Divider>
      </Row>
      <div className="space-y-2">
        <div className="flex justify-end space-x-2">
          <Radio.Group
            options={options}
            defaultValue="list"
            optionType="button"
            buttonStyle="solid"
            className="gap-2"
            onChange={(type) => onChangeType(type.target.value)}
          />
          <Button type="primary" onClick={() => handleOpen("Create")}>{`Add User`}</Button>
        </div>
        <div>
          <EmployeeProfileDashboard dataSourceDashboard={dataSourceDashboard} />
        </div>
        <div>
          {typeGroup === "list" ? (
            <>
              <EmployeeProfileList dataSource={dataSource} pagination={pagination} changePagination={changePagination} />
            </>
          ) : (
            <>
              <EmployeeProfileGrid dataSource={dataSource} pagination={pagination} changePagination={changePagination} />
            </>
          )}
        </div>
      </div>
      <div>
        {openModal ? (
          <EmployeeProfileManageUser
            openModal={openModal}
            form={form}
            typeManageUser={typeManageUser}
            handleClose={handleClose}
            setPreviewOpen={setPreviewOpen}
            setPreviewImage={setPreviewImage}
            setFileList={setFileList}
            previewOpen={previewOpen}
            previewImage={previewImage}
            fileList={fileList}
            onFinish={onFinish}
          />
        ) : null}
      </div>
    </>
  );
}
