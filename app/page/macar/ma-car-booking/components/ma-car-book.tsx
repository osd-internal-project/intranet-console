"use client";
import React, { useState, useEffect, useContext } from "react";
import { message, Form, FormProps } from "antd";
import { MaCarBookServices } from "../../../../services/ma-car-book.service";
import { MaCarType, MaCarBookType, ProvincesType } from "../../common/index";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { CarBookForm } from "./car-book-form";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { useRouter } from "next/navigation";
export interface props {
  maCarData: MaCarType[];
  masterDataProvinces: ProvincesType[];
}

const MaCarBook: React.FC<props> = ({ maCarData, masterDataProvinces }): React.ReactElement => {
  const router = useRouter();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const macarbookservices = MaCarBookServices(baseUrIntranet);
  const [formUser] = Form.useForm();
  useEffect(() => {
    if (user) {
      formUser.setFieldsValue({
        userName: `${user?.firstNameTh} ${user?.lastNameTh}`,
        phoneNumber: user?.phoneNumber,
      });
    }
  }, [maCarData, user]);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const createMaCarBook: FormProps<MaCarBookType>["onFinish"] = async (values) => {
    const { carBookStartDate, carBookEndDate } = values;
    const checkCarAvilable = await macarbookservices.getMaCarBookCheck(values.carId, carBookStartDate, carBookEndDate);
    if (checkCarAvilable && Object.keys(checkCarAvilable).length > 0) {
      message.error("รถคันนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่ !");
      return false;
    }
    const carSelected = maCarData.find((car): car is any => car.carId === values.carId);
    const data = {
      carId: values.carId,
      carName: carSelected?.carName,
      createdById: user?.userId,
      createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      carBookProvince: values.idProvinces,
      carBookPlace: values.carBookPlace,
      carBookUsers: Number(values.carBookUsers),
      carBookStartDate: values.carBookStartDate,
      carBookEndDate: values.carBookEndDate,
      detail: values.detail,
      carBookTitle: values.carBookTitle,
      carBookApprovedStatus: "Process",
      remark: values.remark,
    };
    try {
      const maCarBook = await macarbookservices.createMaCarBook(data);
      maCarBook ? (message.success("จองรถสำเร็จ"), router.push("/page/macar/ma-car")) : message.error("จองรถไม่สำเร็จ");
    } catch (error) {
      message.error("จองรถไม่สำเร็จ");
    }
  };
  return (
    <>
      <CarBookForm
        formUser={formUser}
        createMaCarBook={createMaCarBook}
        maCarData={maCarData}
        masterDataProvinces={masterDataProvinces}
        disabledDate={disabledDate}
      />
    </>
  );
};

export default MaCarBook;
