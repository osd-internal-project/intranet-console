"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Col, Divider, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import TableMasterOvertimeConfig from "./components/table-master-overtime-config";
import { MasterOvertimeConfigService } from "@/app/services/master-overtime-config.service";
import ManageMasterOvertimeConfig from "./components/manage-master-overtime-config";
import { manageDays } from "./manage-config";

import { notifySuccess } from "@/app/utils/message";
export default function MasterOvertimeConfig() {
  const [ManageForm] = useForm();
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (loading) fectData();
  }, [loading]);

  const fectData = async () => {
    const resData = await MasterOvertimeConfigService(baseUrlIntranet).findMasterOvertimeConfig();
    setDataSource(resData);
    setLoading(false);
  };

  const OpenModal = (events: any) => {
    ManageForm.setFieldsValue({ ...events, name: manageDays(events.name), nameEn: events.name });
    setOpenModal(true);
  };

  const CloseModal = () => {
    ManageForm.resetFields();
    setOpenModal(false);
  };

  const onFinish = async (events: {
    breakTime: number;
    endTime: string;
    intime: number;
    name: string;
    overtime: number;
    startOt: string;
    startTime: string;
    typeDate: string;
  }) => {
    const index = ManageForm.getFieldValue("index");
    const nameEn = ManageForm.getFieldValue("nameEn");

    const condition = {
      name: nameEn,
      index: index,
      intime: events.intime,
      endTime: events.endTime,
      startOt: events.startOt,
      overtime: events.overtime,
      typeDate: events.typeDate,
      breakTime: events.breakTime,
      startTime: events.startTime,
    };

    const updatedPartTimeCondition: any = { ...condition };

    if (updatedPartTimeCondition[index]) {
      updatedPartTimeCondition[index] = {
        ...updatedPartTimeCondition[index],
        name: nameEn,
        index: index,
        intime: events.intime,
        endTime: events.endTime,
        startOt: events.startOt,
        overtime: events.overtime,
        typeDate: events.typeDate,
        breakTime: events.breakTime,
        startTime: events.startTime,
      };
    }

    const base = {
      partTimeCondition: updatedPartTimeCondition,
    };

    const result = await MasterOvertimeConfigService(baseUrlIntranet).update(base);
    if (result) {
      notifySuccess("data.save");
    }
  };

  return (
    <div>
      <Row>
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
                title: <span>Setting Master Overtime Config</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Setting Master Overtime Config`}</div>
        </Divider>
      </Row>
      {dataSource.length > 0 && <TableMasterOvertimeConfig dataSource={dataSource} OpenModal={OpenModal} />}
      {openModal && <ManageMasterOvertimeConfig ManageForm={ManageForm} openModal={openModal} CloseModal={CloseModal} onFinish={onFinish} />}
    </div>
  );
}
