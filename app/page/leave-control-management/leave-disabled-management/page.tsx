"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, Form, Modal, Row, Tabs, message } from "antd";
import { ISelect, ITpyeUser, ITypetypeleave, ITypeDataleaveMap } from "../common";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../../../services/leave-management.service";
import { TableLeavManagement } from "./components/table-leave-management";
import { CreateLeaveManagement } from "./components/create-leave-management";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

const page = () => {
  const [formcreate] = Form.useForm();
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  // const AuthIntra = useAxiosIntranet();
  // const AuthUser = useAxiosUser();
  // const dataleaveserviceIntra = DataLeaveService(AuthIntra);
  // const dataleaveserviceUser = DataLeaveService(AuthUser);
  const [getdataTypeLeave, setdataTypeLeave] = useState<ITypetypeleave[]>([]);
  const [getdataUser, setdataUser] = useState<ISelect[]>([]);
  const [getdataUserByTypeId, setdataUserByTypeId] = useState<ITpyeUser[]>([]);
  const [getLoading, setLoading] = useState<boolean>(true);
  const [loadingTableUsers, setLoadingTableUsers] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [getdataType, setDataType] = useState<string>("1");

  useEffect(() => {
    if (getLoading) {
      fecthData();
    }
    if (getdataType || loadingTableUsers) {
      fecthDataDisabledUser();
    }
  }, [getLoading, getdataType, loadingTableUsers]);

  const fecthData = async () => {
    try {
      const resTypeLeave = await DataLeaveService(baseUrlIntranet).getdataAll();
      const resUser = await DataLeaveService(baseUrlUser).getdataUserAll();
      // console.log(resUser);

      const options = resUser.map((event: ITpyeUser) => ({
        value: event.id,
        label: `${event.firstNameTh} ${event.lastNameTh}`,
      }));
      setdataTypeLeave(resTypeLeave);
      setdataUser(options);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fecthDataDisabledUser = async () => {
    try {
      const result = await DataLeaveService(baseUrlIntranet).getdataUserByTypeLeaveId({
        typeid: getdataType,
      });
      const typeLeaveDisabledUser = result.typeLeaveDisabledMap.map((event: { id: ITypeDataleaveMap; user: ITpyeUser }) => ({
        user: event.user,
        id: event.id,
      }));
      setdataUserByTypeId(typeLeaveDisabledUser);
      setLoadingTableUsers(false);
    } catch (error) {
      message.error(`${error}`);
    }
  };

  async function handleChangeTab(typeId: string) {
    try {
      setDataType(typeId);
      setLoading(true);
    } catch (error) {
      message.error(`${error}`);
    }
  }

  const onFinishCreate = async (event: any) => {
    const resTypeLeaveMap = await DataLeaveService(baseUrlIntranet).getdataTypeLeaveMap(event.userId, event.masterTypeleaveId);
    if (event.userId && event.masterTypeleaveId && resTypeLeaveMap.length > 0) {
      message.warning(`ประเภทการลานี้มีการเพิ่มชื่อผู้ใช้นี้แล้ว!`);
      return false;
    }
    Modal.confirm({
      title: "Add ",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to add this ?",
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df",
          borderColor: "#00a1df",
        },
      },
      onOk: async () => {
        try {
          const result = await DataLeaveService(baseUrlIntranet).createTypeLeaveDisabled(event);
          if (result) {
            message.success("Add success");
            formcreate.resetFields();
            setLoading(true);
            setLoadingTableUsers(true);
            setOpenModal(false);
          }
        } catch (error) {
          message.error("Failed to add data.");
        } finally {
          setLoading(true);
          setLoadingTableUsers(true);
        }
      },
      onCancel() {
        setOpenModal(false);
        formcreate.resetFields();
      },
    });
  };

  const onFinishDel = (id: number) => {
    Modal.confirm({
      title: "Delete",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const dataResult = await DataLeaveService(baseUrlIntranet).deleteTypeLeaveDisabled(id);
          if (dataResult) {
            message.success("Delete success");
            setLoading(true);
            setLoadingTableUsers(true);
          }
        } catch (error) {
          message.error("Failed to delete data.");
        } finally {
          setLoadingTableUsers(true);
          setLoading(true);
        }
      },
      onCancel() {
        formcreate.resetFields();
      },
    });
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
                title: <span>จัดการสิทธ์การลา</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
          <div className="title-page-font">{`จัดการสิทธ์การลา`}</div>
        </Divider>
        <div className="w-full">
          <Card>
            <Tabs
              defaultActiveKey={"1"}
              tabPosition={"left"}
              onChange={handleChangeTab}
              destroyInactiveTabPane={false}
              items={getdataTypeLeave.map((type) => {
                return {
                  label: `${type.typeName}`,
                  key: String(type.typeId),
                  children: (
                    <div className=" space-y-3">
                      <CreateLeaveManagement
                        onFinishCreate={(event: any) => onFinishCreate(event)}
                        TypeId={type.id}
                        getdataUser={getdataUser}
                        setOpenModal={(event: boolean) => setOpenModal(event)}
                        openModal={openModal}
                        formcreate={formcreate}
                      />
                      <TableLeavManagement
                        getdataUserByTypeId={getdataUserByTypeId}
                        onFinishDel={(e: number) => onFinishDel(e)}
                        getLoading={loadingTableUsers}
                      />
                    </div>
                  ),
                };
              })}
            />
          </Card>
        </div>
      </Row>
    </>
  );
};

export default page;
