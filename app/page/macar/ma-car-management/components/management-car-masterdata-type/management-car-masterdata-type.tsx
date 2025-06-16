"use client";
import React, { useContext, useEffect, useState } from "react";
import ManagementCarMasterdataTable from "./components/management-car-masterdata-table";
import ManagementCarMasterdataManage from "./components/management-car-masterdata-manage";
import { Button, Col, Form, message, Row } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import { MaCarType } from "../../../common";
import ExportExcel from "../../export/export-excel-ma-type";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

const ManagementCarMasterdataType: React.FC = (): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const [form] = Form.useForm();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [checkType, setCheckType] = useState<string>("create");
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataSource, setDataSourtce] = useState<MaCarType[]>([]);

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const response = await ManageCarServices(baseUrIntranet).getMaCarQueryType();
    setDataSourtce(response);
    setLoading(false);
  };

  const handleOpen = (status: string, values: any) => {
    if (status !== "create") {
      form.setFieldsValue(values);
    }
    setCheckType(status);
    setOpenModal(true);
  };

  const handleCancel = () => {
    setCheckType("");
    form.resetFields();
    setOpenModal(false);
  };

  const onFinish = async (status: string, values: any) => {
    let base = {};
    if (status === "create") {
      base = {
        ...values,
        createdById: user?.userId,
        createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      };
    } else if (status === "edit") {
      base = {
        ...values,
        createdByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
      };
    }

    try {
      if (status === "create") {
        await ManageCarServices(baseUrIntranet).createMaCarType(base);
      } else if (status === "edit") {
        await ManageCarServices(baseUrIntranet).updateMaCarType(form.getFieldValue("id"), base);
      } else {
        await ManageCarServices(baseUrIntranet).deleteMaCarType(form.getFieldValue("id"));
      }
      message.success(
        status === "create" ? "เพิ่มประเภทการตรวจสภาพสำเร็จ" : status === "edit" ? "แก้ไขประเภทการตรวจสภาพสำเร็จ" : "ลบประเภทการตรวจสภาพสำเร็จ",
      );
      form.resetFields();
      setLoading(true);
      setOpenModal(false);
    } catch (error) {
      message.error("เพิ่มประเภทการตรวจสภาพไม่สำเร็จ");
    }
  };

  return (
    <div>
      <Row gutter={[8, 8]} className="mb-3 flex justify-end">
        <Col>
          <Button type="primary" onClick={() => handleOpen("create", undefined)}>
            {`สร้างประเภทตรวจสภาพ`}
          </Button>
        </Col>
        <Col>
          <ExportExcel datamacartype={dataSource} />
        </Col>
      </Row>
      {openModal ? (
        <ManagementCarMasterdataManage form={form} checkType={checkType} handleCancel={handleCancel} openModal={openModal} onFinish={onFinish} />
      ) : null}
      <ManagementCarMasterdataTable dataSource={dataSource} handleOpen={handleOpen} loading={loading} />
    </div>
  );
};

export default ManagementCarMasterdataType;
