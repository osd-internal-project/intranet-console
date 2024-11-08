"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Tabs,
  message,
} from "antd";
import {
  ISelect,
  ITpyeUser,
  ITypetypeleave,
  ITypeDataleaveMap,
} from "../common";
import {
  useAxiosIntranet,
  useAxiosUser,
} from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../../../services/leave-management.service";
import { TabeLeavManagement } from "./components/tab-leave-management";
import { CreateLeaveManagement } from "./components/create-leave-management";
import { ExclamationCircleFilled } from "@ant-design/icons";

const page = () => {
  const [formcreate] = Form.useForm();
  const AuthIntra = useAxiosIntranet();
  const AuthUser = useAxiosUser();
  const dataleaveserviceIntra = DataLeaveService(AuthIntra);
  const dataleaveserviceUser = DataLeaveService(AuthUser);
  const [getdataTypeLeave, setdataTypeLeave] = useState<ITypetypeleave[]>([]);
  const [getdataUser, setdataUser] = useState<ISelect[]>([]);
  const [getdataUserByTypeId, setdataUserByTypeId] = useState<ITpyeUser[]>([]);
  const [getLoading, setLoading] = useState<boolean>(true);
  const [loadingTableUsers, setLoadingTableUsers] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [getdataType, setDataType] = useState<string>("1");

  useEffect(() => {
    if (getLoading) {
      fecthData();
    }
    if (getdataType) {
      fecthDataDisabledUser();
    }
  }, [getLoading, getdataType]);

  const fecthData = async () => {
    try {
      const resTypeLeave = await dataleaveserviceIntra.getdataTypeLeaveAll({});
      const resUser = await dataleaveserviceUser.getdataUserAll();
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
    setLoadingTableUsers(true);
    try {
      const result = await dataleaveserviceIntra.getdataUserByTypeLeaveId({
        typeid: getdataType,
      });
      const typeLeaveDisabledUser = result.typeLeaveDisabledMap.map(
        (event: { id: ITypeDataleaveMap; user: ITpyeUser }) => ({
          user: event.user,
          id: event.id,
        })
      );
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

  const onFinishCreate = async (event: ITpyeUser) => {
    const resTypeLeaveMap = await dataleaveserviceIntra.getdataTypeLeaveMap(
      event.userId
    );
    if (event.userId && resTypeLeaveMap.length > 0) {
      if (resTypeLeaveMap[0].userId === event.userId) {
        message.warning(`ประเภทการลานี้มีการเพิ่มชื่อผู้ใช้นี้แล้ว!`);
        return {};
      }
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
          const result = await dataleaveserviceIntra.createTypeLeaveDisabled(
            event
          );
          if (result) {
            message.success("Add success");
            formcreate.resetFields();
            setOpenModal(false);
            setLoading(true);
          }
        } catch (error) {
          message.error("Failed to add data.");
        } finally {
        }
      },
      onCancel() {
        formcreate.resetFields();
      },
    });
  };

  const onFinishDel = (id: number) => {
    Modal.confirm({
      title: "Delete this unit",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const dataResult =
            await dataleaveserviceIntra.deleteTypeLeaveDisabled(id);
          if (dataResult) {
            message.success("Delete success");
            setLoading(true);
          }
        } catch (error) {
          message.error("Failed to delete data.");
        } finally {
          setLoading(false);
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
                title: <span>Leave Disabled Management</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Leave Disabled Management`}</div>
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
                      <TabeLeavManagement
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
