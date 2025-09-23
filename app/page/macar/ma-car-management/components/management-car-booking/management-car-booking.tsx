import React, { useContext, useState } from "react";
import { Form, message } from "antd";
import type { FormInstance, TablePaginationConfig } from "antd";
import { dataMaCarbook } from "../../../common";
import { showStatus } from "@/app/utils/validatefield";
import { ManageCarServices } from "../../services/manage-car.service";
import { MaCarServices } from "@/app/services/ma-car.service";
import ManagementCarBookingModal from "./components/management-car-booking-modal";
import ManagementCarBookingTable from "./components/management-car-booking-table";
import dayjs from "dayjs";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import ManagementCarFilterPage from "./components/management-car-filter";

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarBookData: dataMaCarbook;
  pagination: any;
  changePagination: (pagination: TablePaginationConfig) => void;
  handleOpenFilter: (value: boolean) => void;
  openFilter: boolean;
  filterForm: FormInstance;
  onSearch: (values: { carBookApprovedStatus?: string; carBookStartDate?: Date | string; createdByName?: string }) => void;
}

const managementCarBooking: React.FC<props> = ({
  setLoading,
  loading,
  maCarBookData,
  pagination,
  changePagination,
  handleOpenFilter,
  openFilter,
  filterForm,
  onSearch,
}): React.ReactElement => {
  const { id24Axios } = useId24();
  const [form] = Form.useForm();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const showStatusBox = showStatus();
  const [checkType, setCheckType] = useState<string>("");
  const [checkStatusApproved, setCheckStatusApproved] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const openModalFecthStatus = async (status: string, record: any) => {
    if (status === "approved") {
      setCheckType(status);
    } else if (status === "cancel") {
      setCheckType(status);
    } else if (status === "return") {
      setCheckType(status);
    } else {
      setCheckType(status);
    }
    form.setFieldsValue({
      ...record,
      carBookStartDate: dayjs(record.carBookStartDate),
      carBookEndDate: dayjs(record.carBookEndDate),
      carMile: record.maCar.carMile,
      carPetrol: record.maCar.carPetrol,
    });
    setOpenModal(true);
  };

  const closeModalFecthStatus = async () => {
    setCheckType("");
    setOpenModal(false);
  };

  const onFinish = async (status: string, values: any) => {
    const { createdById, carName, detail, carBookPlace, carBookStartDate, carBookEndDate } = form.getFieldsValue(true) || {};
    let updatedApproveMa: any = {};
    try {
      if (status === "approved") {
        updatedApproveMa = {
          carName,
          createdById,
          detail,
          carBookPlace,
          carBookStartDate: dayjs(carBookStartDate).toISOString(),
          carBookEndDate: dayjs(carBookEndDate).toISOString(),
          id: form.getFieldValue("id"),
          carBookApprovedById: user?.userId,
          carBookApprovedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
          carBookApprovedStatus: checkStatusApproved === "approved" ? "Approve" : "DisapProved",
          carBookApprovedDate: dayjs(),
          ...(checkStatusApproved !== "disable" && { remarkApproved: values.remarkApproved }),
        };
      }
      if (status === "return") {
        updatedApproveMa = {
          carName,
          createdById,
          detail,
          carBookPlace,
          carBookStartDate,
          carBookEndDate,
          id: form.getFieldValue("id"),
          recipientId: user?.userId,
          recipientName: `${user?.firstNameTh} ${user?.lastNameTh}`,
          carBookApprovedStatus: "Completed",
          returnAt: dayjs(),
        };
      }
      if (status === "cancel") {
        updatedApproveMa = { id: form.getFieldValue("id"), carBookApprovedStatus: "Cancel", remarkCancel: values.remarkCancel };
      }
      if (status === "delete") {
        await ManageCarServices(baseUrIntranet).deleteMaCarBook(form.getFieldValue("id"));
      }
      let result;
      if (status !== "delete") {
        result = await ManageCarServices(baseUrIntranet).updateMaCarBook(updatedApproveMa);
      }
      if (result && status !== "approved" && checkStatusApproved !== "approved") {
        const updataStatusCar = { status: true };
        await MaCarServices(baseUrIntranet).updateMaCar(form.getFieldValue("carId"), updataStatusCar);
      }
      setCheckType("");
      setCheckStatusApproved("");
      setLoading(true);
      setOpenModal(false);
    } catch (e) {
      message.error(`${e}`);
    }
  };

  return (
    <div>
      <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between" }}>
        <> {showStatusBox}</>
        <>
          <ManagementCarFilterPage handleOpenFilter={handleOpenFilter} openFilter={openFilter} filterForm={filterForm} onSearch={onSearch} />
        </>
      </div>
      {maCarBookData.docs ? (
        <ManagementCarBookingTable
          dataSource={maCarBookData.docs}
          loading={loading}
          total={maCarBookData.total}
          changePagination={changePagination}
          openModalFecthStatus={openModalFecthStatus}
          pagination={pagination}
        />
      ) : null}

      {openModal ? (
        <ManagementCarBookingModal
          form={form}
          status={checkType}
          onFinish={onFinish}
          openModal={openModal}
          closeModalFecthStatus={closeModalFecthStatus}
          setCheckStatusApproved={setCheckStatusApproved}
        />
      ) : null}
    </div>
  );
};

export default managementCarBooking;
