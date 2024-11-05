"use client";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MasterHolidaysService from "../services/index.service";
import { ICreateMasterHolidayDto, IFindAllDayDto, IManagePageDay } from "../common";
import { HolidayTable } from "./components/holidays-table";
import { Breadcrumb, Card, Col, Divider, message, Modal, Row } from "antd";
import { HolidayActions } from "./components/holidays-action";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { ExclamationCircleFilled } from "@ant-design/icons";

interface THoliday {
  id: number;
  holidaysYear: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function MasterdataHolidaysByYear() {
  const Auth = useAxiosIntranet();
  const masterholidaysService = MasterHolidaysService(Auth);
  const params = useParams();
  const year = params.id as string;
  const [formAction] = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [manageStatusDay, setManageStatusDay] = useState<IManagePageDay>({ statusModal: false, statusAction: "create" });
  const [dataHolidayDay, setDataHolidayDay] = useState<IFindAllDayDto[]>([]);
  const [holidayDay, setHolidayDay] = useState<THoliday>({
    id: 0,
    holidaysYear: "1999",
  });

  useEffect(() => {
    if (loading) featchData();
  }, [loading]);

  const featchData = async () => {
    const resDataYear = await masterholidaysService.getHolidayByYear(year);
    const resDataOne = await masterholidaysService.getOneHolidayByYear(year);
    setHolidayDay(resDataOne);
    setDataHolidayDay(resDataYear);
    formAction.setFieldValue("holidaysYear", year);
    setLoading(false);
  };

  const onFinishAction = (event: ICreateMasterHolidayDto) => {
    const dataCreate = {
      holidaysName: event.holidaysName,
      holidaysDate: dayjs(event.holidaysDate).format("YYYY-MM-DD"),
      holidaysYear: holidayDay.id,
    };
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
        const result = await masterholidaysService.createMasterHolidays(dataCreate);
        if (result) {
          message.success(`Add success`);
          formAction.resetFields();
          setLoading(true);
          setManageStatusDay({ statusModal: false });
        }
      },
      onCancel() {
        setManageStatusDay({ statusModal: false });
      },
    });
  };

  const onDelete = (value: number) => {
    Modal.confirm({
      title: "Delete this unit",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await masterholidaysService.deleteMasterHoliday(value);
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

  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Setting</span>,
              },
              {
                title: <span>Setting Holidays</span>,
              },
              {
                title: <span>{year}</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">ปี {year}</div>
        </Divider>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Card className="grid grid-cols-1 ">
            <HolidayActions
              onFinishAction={onFinishAction}
              setManageStatusDay={setManageStatusDay}
              manageStatusDay={manageStatusDay}
              formAction={formAction}
            />
            <HolidayTable loading={loading} dataHolidayDay={dataHolidayDay} onDelete={onDelete} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
