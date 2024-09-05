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
import DataLeaveService from "../services/index.service";
import { TabeLeavManagement } from "./components/tab-leave-management";
import { CreateLeaveManagement } from "./components/create-leave-management";
import { ExclamationCircleFilled } from "@ant-design/icons";

const page = () => {
  const AuthIntra = useAxiosIntranet();
  const AuthUser = useAxiosUser();
  const dataleaveserviceIntra = DataLeaveService(AuthIntra);
  const dataleaveserviceUser = DataLeaveService(AuthUser);
  const [getdataTypeLeave, setdataTypeLeave] = useState<ITypetypeleave[]>([]);
  const [getdataUser, setdataUser] = useState<ISelect[]>([]);
  const [getdataUserByTypeId, setdataUserByTypeId] = useState<ITpyeUser[]>([]);
  const [getLoading, setLoading] = useState<boolean>(true);
  const [getSearch, setSearch] = useState<{ typeid: string } | undefined>(
    undefined
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formcreate] = Form.useForm();

  useEffect(() => {
    if (getLoading) {
      loadDataTypeLeave();
    }
  }, [getLoading]);

  const loadDataTypeLeave = async () => {
    try {
      const resTypeLeave = await dataleaveserviceIntra.getdataTypeLeaveAll({});
      const resUser = await dataleaveserviceUser.getdataUserAll();
      const options = resUser.map((event: ITpyeUser) => ({
        value: event.id,
        label: `${event.firstNameTh} ${event.lastNameTh}`,
      }));
      setdataTypeLeave(resTypeLeave);
      setSearch({ typeid: "1" });
      setdataUser(options);
      setLoading(true);
    } catch (error) {}
  };

  useEffect(() => {
    if (getSearch) {
      loadDataUser(getSearch);
    }
  }, [getSearch]);

  const loadDataUser = async (search: { typeid: string }) => {
    try {
      const res = await dataleaveserviceIntra.getdataUserByTypeLeaveId(search);
      const lasresult = res.typeLeaveDisabledMap.map(
        (event: { id: ITypeDataleaveMap; user: ITpyeUser }) => ({
          user: event.user,
          id: event.id,
        })
      );
      setdataUserByTypeId(lasresult);
    } catch (error) {}
  };

  function handleChangeTab(typeId: string): void {
    setSearch(typeId === "0" ? undefined : { typeid: typeId });
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
          setLoading(true);
          if (result) {
            message.success("Add success");
            formcreate.resetFields();
            setOpenModal(false);
            if (getSearch) {
              setSearch(
                getSearch.typeid === "0"
                  ? undefined
                  : { typeid: getSearch.typeid }
              );
            } else {
              setSearch(undefined);
            }
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
            if (getSearch) {
              setSearch(
                getSearch.typeid === "0"
                  ? undefined
                  : { typeid: getSearch.typeid }
              );
            } else {
              setSearch(undefined);
            }
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
    <Row>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>Home</span>,
            },
            {
              title: <span>Leave Management</span>,
            },
          ]}
        />
      </Col>
      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Leave Management`}</div>
      </Divider>
      <div className="w-full">
        <Card>
          <Tabs
            defaultActiveKey={getSearch?.typeid ? getSearch.typeid : ""}
            tabPosition={"left"}
            onChange={handleChangeTab}
            destroyInactiveTabPane={false}
            items={getdataTypeLeave.map((type, i) => {
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
                      getLoading={getLoading}
                    />
                  </div>
                ),
              };
            })}
          />
        </Card>
      </div>
    </Row>
  );
};

export default page;
