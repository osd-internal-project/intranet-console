"use client";

import { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Divider, Radio, Row } from "antd";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import EmployeeProfileGrid from "./components/employee-profile-grid";
import EmployeeProfileList from "./components/employee-profile-list";
import EmployeeProfileCreateUser from "./components/employee-profile-create-user";
import EmployeeProfileDetail from "@/app/services/employee-profile.services";
import { cardTableHrDashboard } from "./common/index";
import { gridIconHr, listIcon } from "@/components/icon";

export default function EmployeeProfilePage() {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlHrManagement = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_HR_MANAGEMENT);

  const [typeGroup, setTypeGroup] = useState<string>("list");
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [dataSourceDashboard, setDataSourceDashboard] = useState<{ active: number; inactive: number; new: number; status: string; total: number }>({
    active: 0,
    inactive: 0,
    new: 0,
    status: "",
    total: 0,
  });
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    fecthDataDashboard();
  }, [loading]);

  const fecthDataDashboard = async () => {
    const baseParams = {
      valueOne: "non-params",
      valueTwo: true,
      valueThree: false,
      valueFour: "approved",
    };
    const data = await EmployeeProfileDetail(baseUrlHrManagement).getCount(baseParams);
    if (data.status === "success") setDataSourceDashboard(data);

    // const positions = await MasterPositionServices(baseUrlUser).getMasterPositionAll();
    // const interNationalApi = await globalservices.findAll();
    // const data = await userServices.getUsersAll({});
    // const dataSource = data.map((d: any) => ({
    //   ...d,
    //   position: d.masterPosition?.nameTh,
    //   status: d.activeStatus ? "Active" : "Inactive",
    //   fullname: `${d.firstNameTh} ${d.lastNameTh}`,
    // }));
    // setLoading(false);
  };
  const options = [
    { label: <span>{listIcon}</span>, value: "list" },
    { label: <span>{gridIconHr}</span>, value: "grid" },
  ];
  const onChangeType = (typeGroup: string) => {
    setTypeGroup(typeGroup);
  };

  const handleOpen = () => {
    setOpenModal(true);
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
          <Button type="primary" onClick={() => handleOpen()}>{`Add User`}</Button>
        </div>
        <div>
          <div className="grid col-span-3 grid-cols-4 space-x-8">
            <div>
              <Card>{cardTableHrDashboard("total", dataSourceDashboard.total)}</Card>
            </div>
            <div>
              <Card>{cardTableHrDashboard("active", dataSourceDashboard.active)}</Card>
            </div>
            <div>
              <Card>{cardTableHrDashboard("inactive", dataSourceDashboard.inactive)}</Card>
            </div>
            <div>
              <Card>{cardTableHrDashboard("new", dataSourceDashboard.new)}</Card>
            </div>
          </div>
        </div>
        <div>
          {typeGroup === "list" ? (
            <>
              <EmployeeProfileList dataSource={dataSource} />
            </>
          ) : (
            <>
              <EmployeeProfileGrid />
            </>
          )}
        </div>
      </div>
      <div>{openModal ? <EmployeeProfileCreateUser /> : null}</div>
    </>
  );
}
