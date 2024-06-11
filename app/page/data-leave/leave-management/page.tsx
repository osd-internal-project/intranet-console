"use client";
import React, { useEffect, useState } from "react";
import { Card, Form, Modal, Tabs, message } from "antd";
import { ISelect, ITpyeUser, ITypetypeleave } from "../common";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
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
  const [getSearch, setSearch] = useState<any>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [formcreate] = Form.useForm();

  useEffect(() => {
    if (getLoading) loadDataTypeLeave();
  }, [getLoading]);

  const loadDataTypeLeave = async () => {
    const resTypeLeave = await dataleaveserviceIntra.getdataTypeLeaveAll({});
    const resUser = await dataleaveserviceUser.getdataUserAll();
    const options = resUser.map((event: ITpyeUser) => {
      return {
        value: event.id,
        label: `${event.firstNameTh} ${event.lastNameTh}`,
      };
    });
    setdataTypeLeave(resTypeLeave);
    setdataUser(options);
    setLoading(false);
  };

  useEffect(() => {
    if (getSearch) loadDataUser();
  }, [getSearch]);

  const loadDataUser = async () => {
    const res = await dataleaveserviceIntra.getdataUserByTypeLeaveId(getSearch);
    console.log(res);

    const lasresult = res.typeLeaveDisabledMap.map((event: { user: ITpyeUser }) => {
      return event.user;
    });
    setdataUserByTypeId(lasresult);
    setLoading(false);
  };

  function handdleChangeTab(typeId: string): void {
    if (typeId === "0") {
      setSearch({ typeid: {} });
    } else {
      setSearch({ typeid: typeId });
    }
    setLoading(true);
  }
  const onFinishCreate = (event: any) => {
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
        const result = await dataleaveserviceIntra.createTypeLeaveDisabled(event);
        if (result) {
          message.success(`Add success`);
          formcreate.resetFields();
          setOpenModal(false);
          setLoading(true);
        }
      },
      onCancel() {
        setLoading(false);
      },
    });
  };
  return (
    <div>
      <Card>
        <Tabs
          tabPosition={"left"}
          onChange={handdleChangeTab}
          destroyInactiveTabPane={true}
          items={getdataTypeLeave.map((type, i) => {
            return {
              label: `${type.typeName}`,
              key: String(type.id),
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
                  <TabeLeavManagement getdataUserByTypeId={getdataUserByTypeId} />
                </div>
              ),
            };
          })}
        />
      </Card>
    </div>
  );
};

export default page;
