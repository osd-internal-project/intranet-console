"use client";
import React, { useState, useEffect, useContext } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { message, Form, FormProps } from "antd";
import { MaCarBookServices } from "../../../../services/ma-car-book.service";
import { useRouter } from "next/navigation";
import { MaCarType, MaCarBookType, ProvincesType } from "../../common/index";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { CarBookForm } from "./car-book-form";
import { checkMaCarBookConfig } from "@/app/utils/validatefield";
import { UserContectType, UserContext } from "@/app/config/userContext";
export interface props {
  maCarData: MaCarType[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dataoptionsProvinces: ProvincesType[];
}

const MaCarBook: React.FC<props> = ({ maCarData, setLoading, dataoptionsProvinces }): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const router = useRouter();
  const intraAuth = useAxiosIntranet();
  const macarbookservices = MaCarBookServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [carName, setCarName] = useState<MaCarType[]>([]);
  const [formUser] = Form.useForm();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endtDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (maCarData) {
      setCarName(maCarData);
    }
    formUser.setFieldsValue({
      userName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      phoneNumber: user?.phoneNumber,
    });
  }, [maCarData]);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const createMaCarBook: FormProps<MaCarBookType>["onFinish"] = async (values) => {
    const checkCarAvilable = await macarbookservices.getMaCarBookCheck(values.carId);
    setSubmitLoading(true);
    const carSelected = [...maCarData].reverse().find((car): car is any => car.carId === values.carId);
    if (carSelected.status === false) {
      message.warning("รถคันนี้ไม่พร้อมใช้งาน เนื่องจากมีการจองไปแล้ว");
      setSubmitLoading(false);
      return;
    }
    const carBookStartDate = values.carBookStartDate as Date;
    const carBookEndDate = values.carBookEndDate as Date;

    const data = {
      carId: values.carId,
      carName: carSelected?.carName,
      createdById: user?.userId,
      createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      carBookProvince: values.idProvinces,
      carBookPlace: values.carBookPlace,
      carBookUsers: Number(values.carBookUsers),
      carBookStartDate: startDate,
      carBookEndDate: endtDate,
      detail: values.detail,
      carBookTitle: values.carBookTitle,
      carBookApprovedStatus: "Process",
      remark: values.remark,
    };

    try {
      if (carSelected) {
        const hasProcessStatus = carSelected.maCarBook.some(
          (item: MaCarBookType) => item.carBookApprovedStatus === "Process" || item.carBookApprovedStatus === "Approve",
        );
        if (hasProcessStatus) {
          const conflict = await checkMaCarBookConfig(checkCarAvilable, carBookStartDate, carBookEndDate);
          if (conflict) {
            message.error("รถคันนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่ !");
            setSubmitLoading(false);
            return;
          }
        }
      }
      const updataStatusCar = {
        status: false,
      };
      const maCarBook = await macarbookservices.createMaCarBook(data);
      maCarBook
        ? (message.success("จองรถสำเร็จ"), router.push("/page/macar/ma-car"), await macarbookservices.updateMaCar(values.carId, updataStatusCar))
        : message.error("จองรถไม่สำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("จองรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  return (
    <>
      <CarBookForm
        formUser={formUser}
        createMaCarBook={createMaCarBook}
        carName={carName}
        dataoptionsProvinces={dataoptionsProvinces}
        disabledDate={disabledDate}
        submitLoading={submitLoading}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </>
  );
};

export default MaCarBook;
