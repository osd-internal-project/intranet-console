import React, { useContext, useState } from "react";
import { Button, message, Upload, type UploadFile, type UploadProps } from "antd";
import { TablePaginationConfig } from "antd";
import { useForm } from "antd/es/form/Form";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import ManagementCarAvailableTable from "./components/management-car-available-table";
import ManagementCarAvailableManage from "./components/management-car-available-manage";
import dayjs from "dayjs";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import type { RcFile } from "antd/es/upload";
import { handleCompress } from "@/app/utils";
import ManagementCarAvailableFilesPage from "./components/management-car-available-files";


const baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL_INTRANET;

export interface props {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  maCarData: any[];
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
}

const ManagementCarAvailable: React.FC<props> = ({ setLoading, loading, maCarData, pagination, changePagination }): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const [form] = useForm();
  const [formfiles] = useForm();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const intraAuthService = ManageCarServices(baseUrIntranet);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalFiles, setOpenModalFiles] = useState<boolean>(false);
  const [checkType, setCheckType] = useState<string>("create");
  const [attendFiles, setAttendFiles] = useState<UploadFile[]>([]);

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

  const handleCloseModalFiles = (status: string, data: any) => {
    if (status === "open") {
      formfiles.setFieldsValue(data);
      setOpenModalFiles(true);
    } else {
      setOpenModalFiles(false);
    }
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
        createdById: user?.userId,
        createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      };
    } else if (status === "edit") {
      maCarCreateData = {
        ...values,
        updatedAt: dayjs().toISOString(),
        updatedById: user?.userId,
        updatedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      };
    }
    try {
      if (status === "create") {
        intraAuthService.createMaCar(maCarCreateData);
      } else if (status === "edit") {
        let formData: any = new FormData();
        attendFiles.forEach((file: any) => {
          formData.append("files", file.originFileObj);
        });
        const data = await intraAuthService.updateMaCar(form.getFieldValue("carId"), maCarCreateData);
        if (data) {
          const upload = await intraAuthService.uploadFilesDoc(form.getFieldValue("carId"), formData);
        }
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

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    if (newFileList.length > 10) {
      message.warning("คุณไม่สามารถอัปโหลดภาพเกิน 10 ไฟล์");
      return Upload.LIST_IGNORE;
    }

    return setAttendFiles(newFileList);
  };

  const beforeUploadAttendFiles = async (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return Upload.LIST_IGNORE;
    }
    const isPdf = file.type === "application/pdf";
    if (!isPdf) {
      message.error("คุณสามารถอัปโหลดได้เฉพาะไฟล์ .pdf เท่านั้น");
    }
    const compressed = await handleCompress(file);
    return compressed;
  };

  async function downloadFile(id: number, name: string): Promise<void> {
      if (id && name) {
        const fileUrl = `${baseImageUrl}/public/car-file/${id}?fileName=${encodeURIComponent(name)}`;
        try {
          const response = await fetch(fileUrl);
  
          if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement("a");
  
            link.href = window.URL.createObjectURL(blob);
            link.download = `${name}`;
            link.click();
  
            window.URL.revokeObjectURL(link.href);
          } else {
            message.error("ไม่มีไฟล์ให้ดาวน์โหลด");
          }
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์");
        }
      } else {
        message.error("ไม่มีไฟล์ให้ดาวน์โหลด");
      }
    }

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
            handleCloseModalFiles={handleCloseModalFiles}
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
          handleChangeAttendFiles={handleChangeAttendFiles}
          beforeUploadAttendFiles={beforeUploadAttendFiles}
          attendFiles={attendFiles}
        />
      ) : null}
      {openModalFiles ? (
        <ManagementCarAvailableFilesPage
          formfiles={formfiles}
          handleCloseModalFiles={handleCloseModalFiles}
          openModalFiles={openModalFiles}
          downloadFile={downloadFile}
        />
      ) : null}
    </>
  );
};

export default ManagementCarAvailable;
