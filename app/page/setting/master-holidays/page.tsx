"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Form, Modal, Row, message } from "antd";
import { CreateMasterHolidays } from "./components/create-master-holidays";
import { TableMasterHolidays } from "./components/table-master-holidays";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterHolidaysService from "./services/index.service";
import { FilterMasterdataHolidys, ITypeMasterdataHolidys } from "./common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";

export default function MasterdataHolidays() {
  const Auth = useAxiosIntranet();
  const masterholidaysService = MasterHolidaysService(Auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [getswitch, setSwitch] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [getdata, setData] = useState<ITypeMasterdataHolidys[]>([]);
  const [params, setParams] = useState<object>({});
  const [getdate, setdate] = useState<any>();

  const [formfilters] = Form.useForm();
  const [formcreate] = Form.useForm();
  const [formedit] = Form.useForm();

  useEffect(() => {
    if (loading) loadData();
  }, [loading, getdate]);

  const loadData = async () => {
    const res = await masterholidaysService.getdataAll(params);
    setData(res);
    setLoading(false);
  };
  const onFinishCreate = (event: ITypeMasterdataHolidys) => {
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
        const result = await masterholidaysService.createMasterHolidays(event);
        if (result) {
          message.success(`Add success`);
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

  const onFinishEdit = (event: ITypeMasterdataHolidys) => {
    console.log(event);
    const condition = {
      where: {
        id: event.id,
      },
      data: {
        holidaysName: event.holidaysName,
        holidaysDate: getdate,
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
        const result = await masterholidaysService.updateMasterHolidays(condition);
        if (result) {
          message.success(`Edit success`);
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
      title: "Delete this unit",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await masterholidaysService.deleteMasterHolidays(event);
        if (dataResult) {
          message.success(`Delete success`);
          setLoading(true);
        }
      },
      onCancel() {
        setLoading(false);
      },
    });
  };

  const onSearch = (event: FilterMasterdataHolidys) => {
    let search = {};
    if (event.holidaysName) {
      search = { ...search, typeName: { contains: event.holidaysName } };
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
        <Col span={24} style={{ marginBottom: "20px" }}>
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
                title: <span>Set Master Holidays </span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`SET MASTER HOLIDAYS`}</div>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Card className="grid grid-cols-1 ">
            <CreateMasterHolidays
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
            <TableMasterHolidays
              getdata={getdata}
              setOpenModalEdit={(e: boolean) => setOpenModalEdit(e)}
              openModalEdit={openModalEdit}
              formedit={formedit}
              onFinishEdit={(e: ITypeMasterdataHolidys) => onFinishEdit(e)}
              onFinishDel={(e: number) => onFinishDel(e)}
              loading={loading}
              setdate={setdate}
              getdate={getdate}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
