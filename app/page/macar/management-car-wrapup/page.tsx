"use client";
import React, { useContext, useEffect, useState } from "react";
import ManagementCarWrapupManage from "./components/management-car-wrapup-manage";
import ManagementCarWrapupTable from "./components/management-car-wrapup-table";
import { Breadcrumb, Button, Card, Col, Divider, Form, message, Row, UploadFile } from "antd";
import { RcFile } from "antd/lib/upload";
import dayjs from "dayjs";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { ManageCarServices } from "../ma-car-management/services/manage-car.service";
import type { MaCarType } from "../common";
import ExportExcel from "../ma-car-management/export/export-excel";

export default function ManagementCarWrapup() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const [form] = Form.useForm();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [dataSourceWrapup, setDataSourceWrapup] = useState<any[]>([]);
  const [carDetail, setDataCarDetail] = useState<any[]>([]);
  const [optionsType, setOptionsType] = useState<{ value: string; label: string; key: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkType, setCheckType] = useState<string>("create");
  const [checkApprovedStatus, setCheckApprovedStatus] = useState<string>("approved");
  const [carMileage, setCarMileage] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [Files, setFiles] = useState<any>();

  useEffect(() => {
    fectdataOptions();
    if (loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    try {
      const responseWrapup = await ManageCarServices(baseUrIntranet).getMaCarQueryWarpup();
      const responseCar = await ManageCarServices(baseUrIntranet).getMaCarQuery();
      setDataSourceWrapup(responseWrapup);
      setDataCarDetail(responseCar);
      setLoading(false);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  const fectdataOptions = async () => {
    const responseTypeOptions = await ManageCarServices(baseUrIntranet).getMaCarQueryType();
    const optionsType = responseTypeOptions.map((event: MaCarType, index: number) => {
      return {
        value: event.typeName,
        label: event.typeName,
        key: index,
      };
    });
    setOptionsType(optionsType);
  };

  const handleOpen = async (status: string, values: any) => {
    if (status !== "create") {
      form.setFieldsValue({ ...values, dateStart: dayjs(values.dateStart), dateEnd: dayjs(values.dateEnd) });
      if (values.maCarWrapupImage.length > 0) {
        await getFileImages(values.maCarWrapupImage);
      }
    }

    setCheckType(status);
    setOpenModal(true);
  };

  const getFileImages = async (e: any) => {
    const getImages = await ManageCarServices(baseUrIntranet).getImages(e[0]?.idwarpupImage);
    console.log(getImages);
  };

  const handleClose = () => {
    setFiles(undefined);
    form.resetFields();
    setCheckType("create");
    setCarMileage(0);
    setOpenModal(false);
  };

  const handleChangeSelect = async (value: string) => {
    setCarMileage(0);
    if (value) {
      const response = await ManageCarServices(baseUrIntranet).getMaCarQueryByCarId(value);
      form.setFieldsValue({ wrapupMiles: response.carMile, carName: response.carName });
      setCarMileage(response.carMile);
    }
  };

  const onFinish = async (status: string, values: any) => {
    let base = {};
    let response;
    if (status === "create" || status === "edit") {
      base = {
        ...(status === "create" ? { carId: values.carId } : {}),
        vender: values?.vender,
        typeName: values?.typeName,
        carName: form.getFieldValue("carName"),
        wrapupMiles: new String(values?.wrapupMiles),
        detail: values?.detail,
        cost: values?.cost ?? 0,
        dateStart: values.dateStart,
        dateEnd: values.dateEnd,
        createbyName: `${user?.firstNameTh} ${user?.lastNameTh}`,
        remark: values?.remark,
        status: null,
      };
    } else if (status === "approved") {
      base = {
        status: checkApprovedStatus === "approved" ? true : false,
      };
    }
    status === "create"
      ? (response = await ManageCarServices(baseUrIntranet).createMaCarWarpup(base))
      : status === "delete"
      ? (response = await ManageCarServices(baseUrIntranet).deleteMaCarWarpup(form.getFieldValue("carWrapupId")))
      : (response = await ManageCarServices(baseUrIntranet).updateMaCarWarpup(form.getFieldValue("carWrapupId"), base));
    if (status === "create" || (status === "edit" && response && attendFiles.length > 0)) {
      await Promise.all(
        attendFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file.originFileObj as RcFile);
          await ManageCarServices(baseUrIntranet).uploadFiles(response.carWrapupId, formData);
        }),
      );
    }
    if (response) {
      status === "create"
        ? message.success("เพิ่มการตรวจสภาพรถสำเร็จ")
        : status === "approved"
        ? message.success("การตรวจสภาพรถสำเร็จ")
        : message.success("แก้ไขข้อมูลการตรวจสภาพรถสำเร็จ");
    } else {
      message.error("เพิ่มการตรวจสภาพรถไม่สำเร็จ");
    }
    setCarMileage(0);
    setCheckType("create");
    setAttendFiles([]);
    setFiles(undefined);
    form.resetFields();
    setLoading(true);
    setOpenModal(false);
  };
  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>Over Time</span>,
              },
              {
                title: <span>เช็คสภาพรถยนต์</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`เช็คสภาพรถยนต์`}</div>
        </Divider>
      </Row>
      <Card>
        <Row gutter={[8, 8]} className="mb-2 flex justify-end">
          <Col>
            <Button type="primary" onClick={() => handleOpen("create", undefined)}>
              {`เพิ่มข้อมูลตรวจสภาพรถ`}
            </Button>
          </Col>
          {dataSourceWrapup ? (
            <>
              <Col>
                <ExportExcel datamacar={dataSourceWrapup} />
              </Col>
            </>
          ) : null}
        </Row>
        <ManagementCarWrapupTable handleOpen={handleOpen} dataSource={dataSourceWrapup} loading={loading} />
      </Card>

      {openModal ? (
        <ManagementCarWrapupManage
          form={form}
          carDetail={carDetail}
          checkType={checkType}
          openModal={openModal}
          handleClose={handleClose}
          handleChangeSelect={handleChangeSelect}
          carMileage={carMileage}
          optionsType={optionsType}
          setAttendFiles={setAttendFiles}
          attendFiles={attendFiles}
          onFinish={onFinish}
          setCheckApprovedStatus={setCheckApprovedStatus}
          Files={Files}
        />
      ) : null}
    </div>
  );
}
