"use client";
import React, { useEffect, useState } from "react";
import ManagementCarMasterdataTable from "./components/management-car-masterdata-table";
import ManagementCarMasterdataManage from "./components/management-car-masterdata-manage";
import { Button, Col, Form, message, Row } from "antd";
import { useSession } from "next-auth/react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";
import { MaCarType } from "../../../common";
import ExportExcel from "../../export/export-excel-ma-type";

const ManagementCarMasterdataType: React.FC = (): React.ReactElement => {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const IntranetAuth = useAxiosIntranet();
  const maCarServices = ManageCarServices(IntranetAuth);
  const manageCarServices = ManageCarServices(IntranetAuth);
  const [checkType, setCheckType] = useState<string>("create");
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataSource, setDataSourtce] = useState<MaCarType[]>([]);

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const response = await maCarServices.getMaCarQueryType();
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
        createdById: session?.user.userId,
        createdByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
    } else if (status === "edit") {
      base = {
        ...values,
        createdByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      };
    }

    try {
      if (status === "create") {
        await manageCarServices.createMaCarType(base);
      } else if (status === "edit") {
        await manageCarServices.updateMaCarType(form.getFieldValue("id"), base);
      } else {
        await maCarServices.deleteMaCarType(form.getFieldValue("id"));
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
