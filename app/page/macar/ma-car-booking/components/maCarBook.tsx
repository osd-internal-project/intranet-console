"use client";
import React, { useState, useEffect } from "react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { message, Form, FormProps } from "antd";
import { MaCarBookServices } from "../services/ma-car-book.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MaCarType, MaCarBookType, ProvincesType } from "../../common/index";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { CarBookForm } from "./carBookForm";
export interface props {
  maCarData: MaCarType[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dataoptionsProvinces: ProvincesType[];
}

const MaCarBook: React.FC<props> = ({
  maCarData,
  setLoading,
  dataoptionsProvinces,
}: any): React.ReactElement => {
  const router = useRouter();
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const intraAuthService = MaCarBookServices(intraAuth);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [carName, setCarName] = useState<MaCarType[]>([]);
  const [formUser] = Form.useForm();
  const [messages, messageHeader] = message.useMessage();

  useEffect(() => {
    if (maCarData) {
      setCarName(maCarData);
    }
    formUser.setFieldsValue({
      userName: `${session?.user.firstNameTh || ""} ${
        session?.user.lastNameTh || ""
      }`,
      phoneNumber: session?.user.phoneNumber,
    });
  }, [maCarData]);

  const checkMaCarBookConflict = async (
    carName: string,
    carBookStartDate: Date,
    carBookEndDate: Date
  ) => {
    const existingMa = await intraAuthService.getMaCarBookCheck();
    return existingMa.some((record: any) => {
      return (
        record.carName === carName &&
        ((new Date(carBookStartDate) >= new Date(record.carBookStartDate) &&
          new Date(carBookStartDate) < new Date(record.carBookEndDate)) ||
          (new Date(carBookEndDate) > new Date(record.carBookStartDate) &&
            new Date(carBookEndDate) <= new Date(record.carBookEndDate)) ||
          (new Date(carBookStartDate) <= new Date(record.carBookStartDate) &&
            new Date(carBookEndDate) >= new Date(record.carBookEndDate)))
      );
    });
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const createMaCarBook: FormProps<MaCarBookType>["onFinish"] = async (
    values
  ) => {
    setSubmitLoading(true);
    const carSelected = [...maCarData]
      .reverse()
      .find((car): car is any => car.carId === values.carId);
    if (carSelected.status === false) {
      messages.warning("รถคันนี้ไม่พร้อมใช้งาน");
      setSubmitLoading(false);
      return;
    }
    const carBookStartDate = values.carBookStartDate as Date;
    const carBookEndDate = values.carBookEndDate as Date;
    const today = new Date();
    if (new Date(carBookStartDate) < today) {
      messages.error("ไม่สามารถจองในวันที่ผ่านมาได้");
      setSubmitLoading(false);
      return;
    }
    const selectedOptionProvinces = dataoptionsProvinces.find(
      (option: ProvincesType) => option.value === values.idProvinces
    );
    if (new Date(carBookEndDate) < new Date(carBookStartDate)) {
      messages.error("วันที่สิ้นสุดการจองต้องหลังวันที่เริ่มการจอง");
      setSubmitLoading(false);
      return;
    }
    const data = {
      carId: values.carId,
      carName: carSelected?.carName,
      createdById: session?.user.userId,
      createdByName: `${session?.user.firstNameTh || ""} ${
        session?.user.lastNameTh || ""
      }`,
      carBookProvince: selectedOptionProvinces
        ? selectedOptionProvinces.label
        : undefined,
      carBookPlace: values.carBookPlace,
      carBookUsers: Number(values.carBookUsers),
      carBookStartDate: values.carBookStartDate,
      carBookEndDate: values.carBookEndDate,
      detail: values.detail,
      carBookTitle: values.carBookTitle,
      carBookApprovedStatus: "Process",
      remark: values.remark || null,
    };

    try {
      if (carSelected) {
        const hasProcessStatus = carSelected.maCarBook.some(
          (item: MaCarBookType) =>
            item.carBookApprovedStatus === "Process" ||
            item.carBookApprovedStatus === "Approve"
        );
        if (hasProcessStatus) {
          const conflict = await checkMaCarBookConflict(
            carSelected.carName || "",
            carBookStartDate,
            carBookEndDate
          );
          if (conflict) {
            messages.error(
              "รถคันนี้ถูกจองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกช่วงเวลาใหม่ !"
            );
            setSubmitLoading(false);
            return;
          }
        }
      }
      const maCarBook = await intraAuthService.createMaCarBook(data);

      maCarBook
        ? (messages.success("จองรถสำเร็จ"), router.push("/page/macar/ma-car"))
        : messages.error("จองรถไม่สำเร็จ");

      setSubmitLoading(false);
    } catch (error) {
      messages.error("จองรถไม่สำเร็จ");
      setSubmitLoading(false);
    }
    setLoading(true);
  };

  return (
    <>
      {messageHeader}
      <CarBookForm
        formUser={formUser}
        createMaCarBook={createMaCarBook}
        carName={carName}
        dataoptionsProvinces={dataoptionsProvinces}
        disabledDate={disabledDate}
        submitLoading={submitLoading}
      />
    </>
  );
};

export default MaCarBook;
