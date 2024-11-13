import React, { useState } from "react";
import { Button, message } from "antd";
import { TablePaginationConfig } from "antd";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import ManagementCarAvailableTable from "./components/management-car-available-table";
import ManagementCarAvailableManage from "./components/management-car-available-manage";
import dayjs from "dayjs";

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarData: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const ManagementCarAvailable: React.FC<props> = ({ setLoading, loading, maCarData, pagination, changePagination }): React.ReactElement => {
  const [form] = useForm();
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const intraAuthService = ManageCarServices(intraAuth);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [checkType, setCheckType] = useState<string>("create");

  const handleOpenModal = (status: string, value: any) => {
    if (status !== "create") {
      form.setFieldsValue(value);
    }
    setCheckType(status);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setOpenModal(false);
  };

  const onFinish = async (status: string, values: any) => {
    let maCarCreateData: any = {};
    if (status === "create") {
      maCarCreateData = {
        carId: values.carId,
        carName: values.carName,
        carPetrol: values.carPetrol,
        carMile: values.carMile,
        detail: values.detail,
        status: values.status,
        createdById: session?.user.userId,
        createdByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
    } else if (status === "edit") {
      maCarCreateData = {
        ...values,
        updatedAt: dayjs().toISOString(),
        updatedById: session?.user.userId,
        updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
    } else {
    }

    try {
      if (status === "create") {
        intraAuthService.createMaCar(maCarCreateData);
      } else if (status === "edit") {
        intraAuthService.updateMaCar(form.getFieldValue("carId"), maCarCreateData);
      } else {
        intraAuthService.deleteMaCar(form.getFieldValue("carId"));
      }
      status === "create" ? message.success("เพิ่มรถสำเร็จ") : status === "edit" ? message.success("แก้ไขสำเร็จ") : message.success("ลบสำเร็จ");
    } catch (error) {
      message.error("ไม่สำเร็จ");
    }
    form.resetFields();
    setOpenModal(false);
    setLoading(true);
  };

  return (
    <>
      <div className="mb-3 flex justify-end">
        <Button type="primary" onClick={() => handleOpenModal("create", undefined)}>
          {`เพิ่มรถ`}
        </Button>
      </div>
      {maCarData ? (
        <>
          <ManagementCarAvailableTable
            dataSource={maCarData}
            loading={loading}
            pagination={pagination}
            changePagination={changePagination}
            handleOpenModal={handleOpenModal}
          />
        </>
      ) : null}
      {openModal ? (
        <ManagementCarAvailableManage
          form={form}
          handleCloseModal={handleCloseModal}
          openModal={openModal}
          checkType={checkType}
          onFinish={onFinish}
        />
      ) : null}
    </>
  );
};

export default ManagementCarAvailable;
