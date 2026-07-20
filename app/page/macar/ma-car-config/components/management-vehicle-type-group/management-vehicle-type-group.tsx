"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, message, Row } from "antd";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { MaVehicleTypeGroup } from "../../../common";
import { MaVehicleTypeGroupServices } from "../../services/ma-vehicle-type-group.service";
import ManagementVehicleTypeGroupManage from "./components/management-vehicle-type-group-manage";
import ManagementVehicleTypeGroupTable from "./components/management-vehicle-type-group-table";

/** จัดการ "กลุ่มประเภทรถ" (เช่น รถยนต์นั่ง / รถบรรทุก) — ชั้นแม่เหนือประเภทรถ */
const ManagementVehicleTypeGroup: React.FC = (): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const [form] = Form.useForm();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const services = MaVehicleTypeGroupServices(baseUrIntranet);

  const [checkType, setCheckType] = useState<string>("create");
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<MaVehicleTypeGroup[]>([]);

  useEffect(() => {
    if (loading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const fetchData = async () => {
    const response = await services.getMaVehicleTypeGroupQuery();
    setDataSource(response ?? []);
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
    const userName = `${user?.firstNameTh} ${user?.lastNameTh}`;
    const base =
      status === "create"
        ? { ...values, createdById: user?.userId, createdByName: userName }
        : { ...values, createdByName: userName };

    try {
      if (status === "create") {
        await services.createMaVehicleTypeGroup(base);
      } else if (status === "edit") {
        await services.updateMaVehicleTypeGroup(form.getFieldValue("id"), base);
      } else {
        await services.deleteMaVehicleTypeGroup(form.getFieldValue("id"));
      }
      message.success(
        status === "create"
          ? "เพิ่มกลุ่มประเภทรถสำเร็จ"
          : status === "edit"
          ? "แก้ไขกลุ่มประเภทรถสำเร็จ"
          : "ลบกลุ่มประเภทรถสำเร็จ"
      );
      form.resetFields();
      setLoading(true);
      setOpenModal(false);
    } catch (error) {
      message.error("ดำเนินการกลุ่มประเภทรถไม่สำเร็จ");
    }
  };

  return (
    <div>
      <Row gutter={[8, 8]} className="mb-3 flex justify-end">
        <Col>
          <Button type="primary" onClick={() => handleOpen("create", undefined)}>
            {`สร้างกลุ่มประเภทรถ`}
          </Button>
        </Col>
      </Row>
      {openModal ? (
        <ManagementVehicleTypeGroupManage
          form={form}
          checkType={checkType}
          handleCancel={handleCancel}
          openModal={openModal}
          onFinish={onFinish}
        />
      ) : null}
      <ManagementVehicleTypeGroupTable
        dataSource={dataSource}
        handleOpen={handleOpen}
        loading={loading}
      />
    </div>
  );
};

export default ManagementVehicleTypeGroup;
