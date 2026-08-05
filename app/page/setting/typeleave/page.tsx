"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, Form, Modal, Row } from "antd";
import { CreateTypeLeave } from "./components/create-type-leave";
import { TableTypeLeave } from "./components/table-type-leave";
import MasterTypeLeaveService from "./services/index.service";
import { Filtertypeleave, ITypetypeleave } from "./common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

import { notifySuccess } from "@/app/utils/message";
export default function TypeLeave() {
  const { id24Axios, tokenAccess } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const mastertypeleaveService = MasterTypeLeaveService(baseUrlIntranet);
  const [loading, setLoading] = useState<boolean>(true);
  const [getswitch, setSwitch] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [getdata, setData] = useState<ITypetypeleave[]>([]);
  const [params, setParams] = useState<object>({});

  const [formfilters] = Form.useForm();
  const [formcreate] = Form.useForm();
  const [formedit] = Form.useForm();

  useEffect(() => {
    if (loading) loadData();
  }, [loading]);

  const loadData = async () => {
    const res = await mastertypeleaveService.getdataAll(params);
    setData(res);
    setLoading(false);
  };
  const onFinishCreate = (event: ITypetypeleave) => {
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
        const result = await mastertypeleaveService.createTypeleave(event);
        if (result) {
          notifySuccess("setting.typeleave.create");
          formcreate.resetFields();
          setOpenModal(false);
          setSwitch(false);
          setLoading(true);
        }
      },
      onCancel() {
        setLoading(false);
      },
    });
  };

  const onFinishEdit = (event: ITypetypeleave) => {
    const condition = {
      where: {
        id: event.id,
      },
      data: {
        descriptionLeave: event.descriptionLeave,
        forwardLeave: event.forwardLeave,
        limitLeaveFour: event.limitLeaveFour,
        limitLeaveOne: event.limitLeaveOne,
        limitLeaveThree: event.limitLeaveThree,
        limitLeaveTwo: event.limitLeaveTwo,
        typeEveryDay: event.typeEveryDay,
        typeId: event.typeId,
        typeName: event.typeName,
        typeNameEn: event.typeNameEn,
        typeNameTh: event.typeNameTh,
        updatedAt: event.updatedAt,
      },
    };
    Modal.confirm({
      title: "Edit ",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to Edit this ?",
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df",
          borderColor: "#00a1df",
        },
      },
      onOk: async () => {
        const result = await mastertypeleaveService.updateTypeleave(condition);
        if (result) {
          notifySuccess("setting.typeleave.update");
          formedit.resetFields();
          setOpenModalEdit(false);
          setLoading(true);
        }
      },
      onCancel() {
        setLoading(false);
      },
    });
  };

  const onFinishDel = (event: number) => {
    Modal.confirm({
      title: "Delete ",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await mastertypeleaveService.deleteTypeleave(event);
        if (dataResult) {
          notifySuccess("setting.typeleave.delete");
          setLoading(true);
        }
      },
      onCancel() {
        setLoading(false);
      },
    });
  };

  const onSearch = (event: Filtertypeleave) => {
    let search = {};
    if (event.typeName) {
      search = { ...search, typeName: { contains: event.typeName } };
    }
    if (event.createdAt) {
      search = {
        ...search,
        createdAt: {
          gte: dateToStartofDay(event.createdAt[0]),
          lte: dateToEndofDay(event.createdAt[1]),
        },
      };
    }
    setParams(search);
    setLoading(true);
    setOpenFilter(false);
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Setting</span>,
              },
              {
                title: <span>Set Type Leave</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Set Type Leave`}</div>
        </Divider>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Card className="grid grid-cols-1 ">
            <CreateTypeLeave
              onFinishCreate={onFinishCreate}
              setSwitch={(e: boolean) => setSwitch(e)}
              getswitch={getswitch}
              setOpenFilter={(e: boolean) => setOpenFilter(e)}
              setOpenModal={(e: boolean) => setOpenModal(e)}
              openFilter={openFilter}
              openModal={openModal}
              formfilters={formfilters}
              formcreate={formcreate}
              onSearch={(e: any) => onSearch(e)}
            />
            <TableTypeLeave
              getdata={getdata}
              setOpenModalEdit={(e: boolean) => setOpenModalEdit(e)}
              openModalEdit={openModalEdit}
              formedit={formedit}
              onFinishEdit={(e: ITypetypeleave) => onFinishEdit(e)}
              onFinishDel={(e: number) => onFinishDel(e)}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
