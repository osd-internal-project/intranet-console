"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import ManagementCarWrapupManage from "./components/management-car-wrapup-manage";
import ManagementCarWrapupTable from "./components/management-car-wrapup-table";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  message,
  Row,
  Select,
  UploadFile,
} from "antd";
import { RcFile } from "antd/lib/upload";
import dayjs, { Dayjs } from "dayjs";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { ManageCarServices } from "../ma-car-management/services/manage-car.service";
import type { MaCarType, MaCarWrapupImage } from "../common";
import ExportExcel from "../ma-car-management/export/export-excel";

export default function ManagementCarWrapup() {
  const { user, accessRole } = (useContext(UserContext) as UserContectType) || {
    user: null,
    accessRole: () => false,
  };
  // สิทธิ์ลบไฟล์ของโมดูล macar — เฉพาะ admin หรือ ma-user
  const canDelete = accessRole(["admin", "maUser"]);
  const [form] = Form.useForm();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );
  const [dataSourceWrapup, setDataSourceWrapup] = useState<any[]>([]);
  const [carDetail, setDataCarDetail] = useState<any[]>([]);
  const [optionsType, setOptionsType] = useState<
    { value: string; label: string; key: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkType, setCheckType] = useState<string>("create");
  const [checkApprovedStatus, setCheckApprovedStatus] =
    useState<string>("approved");
  const [carMileage, setCarMileage] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);
  const [Files, setFiles] = useState<any>();
  // ไฟล์แนบที่อัปโหลดไว้แล้วของรายการที่กำลังเปิด — ถือใน state ตรง ๆ (ไม่ผูกกับ form store)
  const [selectedImages, setSelectedImages] = useState<MaCarWrapupImage[]>([]);

  // ตัวกรอง (client-side) — ช่วงเวลา / รถ / ประเภทการตรวจสภาพ
  const [filterCarId, setFilterCarId] = useState<string | undefined>();
  const [filterTypeId, setFilterTypeId] = useState<number | undefined>();
  const [filterRange, setFilterRange] = useState<[Dayjs, Dayjs] | null>(null);

  const filteredWrapup = useMemo(() => {
    return (dataSourceWrapup ?? []).filter((row: any) => {
      if (filterCarId && row.carId !== filterCarId) return false;
      if (filterTypeId && row.typeId !== filterTypeId) return false;
      if (filterRange?.[0] && filterRange?.[1] && row.dateStart) {
        const d = dayjs(row.dateStart);
        // เลือกช่วงเวลาย้อนหลังได้ — คลุมทั้งวันเริ่มถึงวันสิ้นสุด
        if (
          d.isBefore(filterRange[0].startOf("day")) ||
          d.isAfter(filterRange[1].endOf("day"))
        )
          return false;
      }
      return true;
    });
  }, [dataSourceWrapup, filterCarId, filterTypeId, filterRange]);

  const clearFilters = () => {
    setFilterCarId(undefined);
    setFilterTypeId(undefined);
    setFilterRange(null);
  };

  useEffect(() => {
    fectdataOptions();
    if (loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    try {
      const responseWrapup =
        await ManageCarServices(baseUrIntranet).getMaCarQueryWarpup();
      const responseCar =
        await ManageCarServices(baseUrIntranet).getMaCarQuery();
      setDataSourceWrapup(responseWrapup);
      setDataCarDetail(responseCar);
      setLoading(false);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  const fectdataOptions = async () => {
    const responseTypeOptions =
      await ManageCarServices(baseUrIntranet).getMaCarQueryType();
    const optionsType = responseTypeOptions.map(
      (event: MaCarType, index: number) => {
        return {
          value: event.id,
          label: event.typeName,
          key: index,
        };
      },
    );
    setOptionsType(optionsType);
  };

  const handleOpen = async (status: string, values: any) => {
    if (status !== "create") {
      // ข้อมูลเก่าบางรายการบันทึกไว้เฉพาะ typeName (ไม่มี typeId) — หา typeId จากชื่อประเภท
      // เพื่อให้ Select ประเภทการตรวจสภาพแสดงค่าที่เลือกตอนแก้ไข และบันทึกกลับได้ถูกต้อง
      const resolvedTypeId =
        values.typeId ??
        optionsType.find((option) => option.label === values.typeName)?.value;
      form.setFieldsValue({
        ...values,
        typeId: resolvedTypeId,
        dateStart: dayjs(values.dateStart),
        dateEnd: dayjs(values.dateEnd),
      });
      setSelectedImages(values.maCarWrapupImage ?? []);
    }

    setCheckType(status);
    setOpenModal(true);
  };

  const handleClose = () => {
    setFiles(undefined);
    form.resetFields();
    setCheckType("create");
    setCarMileage(0);
    setSelectedImages([]);
    setOpenModal(false);
  };

  /** ลบไฟล์แนบ 1 รายการออกจาก MinIO + DB แล้วอัปเดตรายการในฟอร์มทันที และรีเฟรชตาราง */
  const handleDeleteImage = async (idwarpupImage: number) => {
    try {
      await ManageCarServices(baseUrIntranet).deleteMaCarWarpupimage(
        idwarpupImage,
      );
      setSelectedImages((prev) =>
        prev.filter((img) => img.idwarpupImage !== idwarpupImage),
      );
      message.success("ลบไฟล์สำเร็จ");
      setLoading(true);
    } catch {
      message.error("ลบไฟล์ไม่สำเร็จ");
    }
  };

  const handleChangeSelect = async (value: string) => {
    setCarMileage(0);
    if (value) {
      const response =
        await ManageCarServices(baseUrIntranet).getMaCarQueryByCarId(value);
      form.setFieldsValue({
        wrapupMiles: response.carMile,
        carName: response.carName,
      });
      setCarMileage(response.carMile);
    }
  };

  const onFinish = async (status: string, values: any) => {
    const findCar = optionsType.find(
      (option) => option.value === values.typeId,
    );
    let base = {};
    let response;
    if (status === "create" || status === "edit") {
      base = {
        ...(status === "create" ? { carId: values.carId } : {}),
        vender: values?.vender,
        typeName: findCar?.label,
        typeId: findCar?.value,
        carName: form.getFieldValue("carName"),
        wrapupMiles: new String(values?.wrapupMiles),
        detail: values?.detail,
        objective: values?.objective,
        cost: values?.cost ?? 0,
        dateStart: values.dateStart,
        nextCheckDate: values.nextCheckDate,
        dateEnd: values.dateEnd,
        createbyName: `${user?.firstNameTh} ${user?.lastNameTh}`,
        remark: values?.remark,
        status: false,
      };
    } else if (status === "approved") {
      base = {
        status: checkApprovedStatus === "approved" ? true : false,
      };
    }
    status === "create"
      ? (response =
          await ManageCarServices(baseUrIntranet).createMaCarWarpup(base))
      : status === "delete"
        ? (response = await ManageCarServices(baseUrIntranet).deleteMaCarWarpup(
            form.getFieldValue("carWrapupId"),
          ))
        : (response = await ManageCarServices(baseUrIntranet).updateMaCarWarpup(
            form.getFieldValue("carWrapupId"),
            base,
          ));
    if (
      status === "create" ||
      (status === "edit" && response && attendFiles.length > 0)
    ) {
      await Promise.all(
        attendFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file.originFileObj as RcFile);
          await ManageCarServices(baseUrIntranet).uploadFiles(
            response.carWrapupId,
            formData,
          );
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
            <Button
              type="primary"
              onClick={() => handleOpen("create", undefined)}
            >
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
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <DatePicker.RangePicker
            placeholder={["วันเริ่ม", "วันสิ้นสุด"]}
            value={filterRange}
            onChange={(value) => setFilterRange(value as [Dayjs, Dayjs] | null)}
            format="DD/MM/YYYY"
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="ทุกคัน"
            style={{ width: 200 }}
            value={filterCarId}
            onChange={setFilterCarId}
            options={carDetail.map((car: any) => ({
              value: car.carId,
              label: car.carName,
            }))}
          />
          <Select
            allowClear
            placeholder="ทุกประเภท"
            style={{ width: 200 }}
            value={filterTypeId}
            onChange={setFilterTypeId}
            options={optionsType.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
          <Button onClick={clearFilters}>ล้างตัวกรอง</Button>
        </div>
        <ManagementCarWrapupTable
          handleOpen={handleOpen}
          dataSource={filteredWrapup}
          loading={loading}
        />
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
          images={selectedImages}
          canDelete={canDelete}
          onDeleteImage={handleDeleteImage}
        />
      ) : null}
    </div>
  );
}
