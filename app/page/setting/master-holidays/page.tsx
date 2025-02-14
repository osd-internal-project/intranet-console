"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, Form, Modal, Row, message } from "antd";
import { CreateMasterHolidays } from "./components/master-holidays-create";
import { TableMasterHolidays } from "./components/master-holidays-table";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterHolidaysService from "./services/index.service";
import { ICreateMasterHolidayYearDto, IFindAllYearDto, IManagePageYear } from "./common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export default function MasterdataHolidays() {
  // const Auth = useAxiosIntranet();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const masterholidaysService = MasterHolidaysService(baseUrIntranet);
  const [loading, setLoading] = useState<boolean>(true);
  const [manageStatusYear, setManageStatusYear] = useState<IManagePageYear>({
    statusModal: false,
    statusAction: "create",
  });
  const [dataHolidayYear, setDataHolidayYear] = useState<IFindAllYearDto[]>([]);
  const [formCreate] = Form.useForm();

  useEffect(() => {
    if (loading) featchData();
  }, [loading]);

  const featchData = async () => {
    const resDataYear = await masterholidaysService.getAllYear();
    setDataHolidayYear(resDataYear);
    setLoading(false);
  };

  const onFinishCreate = (event: ICreateMasterHolidayYearDto) => {
    const dataCreate = {
      holidaysDate: dayjs(event.holidaysDate).format("YYYY-MM-DD"),
      holidaysYear: dayjs(event.holidaysYear).format("YYYY"),
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
        const result = await masterholidaysService.createMasterHolidaysYear(dataCreate);
        if (result) {
          message.success(`Add success`);
          formCreate.resetFields();
          setLoading(true);
          setManageStatusYear({ statusModal: false });
        }
      },
      onCancel() {
        setManageStatusYear({ statusModal: false });
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
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Setting</span>,
              },
              {
                title: <span>Setting Holidays</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Setting Holidays`}</div>
        </Divider>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Card className="grid grid-cols-1 ">
            <CreateMasterHolidays
              onFinishCreate={onFinishCreate}
              setManageStatusYear={setManageStatusYear}
              manageStatusYear={manageStatusYear}
              formCreate={formCreate}
            />
            <TableMasterHolidays loading={loading} dataHolidayYear={dataHolidayYear} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
