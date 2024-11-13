import React, { useState } from "react";
import { Form, message } from "antd";
import type { TablePaginationConfig } from "antd";
import { dataMaCarbook } from "../../../common";
import { useSession } from "next-auth/react";
import { showStatus } from "@/app/utils/validatefield";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import { MaCarServices } from "@/app/services/ma-car.service";
import ManagementCarBookingModal from "./components/management-car-booking-modal";
import ManagementCarBookingTable from "./components/management-car-booking-table";
import dayjs from "dayjs";

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarBookData: dataMaCarbook;
  pagination: any;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const managementCarBooking: React.FC<props> = ({ setLoading, loading, maCarBookData, pagination, changePagination }): React.ReactElement => {
  const { data: session } = useSession();
  const showStatusBox = showStatus();
  const [form] = Form.useForm();
  const intraAuth = useAxiosIntranet();
  const macarservice = MaCarServices(intraAuth);
  const managecarservices = ManageCarServices(intraAuth);
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
    form.setFieldsValue({ ...record, carBookStartDate: dayjs(record.carBookStartDate), carBookEndDate: dayjs(record.carBookEndDate) });
    setOpenModal(true);
  };

  const closeModalFecthStatus = async () => {
    setCheckType("");
    setOpenModal(false);
  };

  const onFinish = async (status: string, values: any) => {
    let updatedApproveMa: any = {};
    try {
      if (status === "approved") {
        updatedApproveMa = {
          id: form.getFieldValue("id"),
          carBookApprovedById: session?.user.userId,
          carBookApprovedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
          carBookApprovedStatus: checkStatusApproved === "approved" ? "Approve" : "DisapProved",
          carBookApprovedDate: dayjs(),
          ...(checkStatusApproved !== "disable" && { remarkApproved: values.remarkApproved }),
        };
      }
      if (status === "return") {
        updatedApproveMa = {
          id: form.getFieldValue("id"),
          recipientId: session?.user.userId,
          recipientName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
          carBookApprovedStatus: "Completed",
          returnAt: dayjs(),
        };
      }
      if (status === "cancel") {
        updatedApproveMa = { id: form.getFieldValue("id"), carBookApprovedStatus: "Cancel", remarkCancel: values.remarkCancel };
      }
      if (status === "delete") {
        await managecarservices.deleteMaCarBook(form.getFieldValue("id"));
      }
      let result;
      if (status !== "delete") {
        result = await managecarservices.updateMaCarBook(updatedApproveMa);
      }
      if (result && status !== "approved" && checkStatusApproved !== "approved") {
        const updataStatusCar = { status: true };
        await macarservice.updateMaCar(form.getFieldValue("carId"), updataStatusCar);
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
      <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between" }}>{showStatusBox}</div>
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
