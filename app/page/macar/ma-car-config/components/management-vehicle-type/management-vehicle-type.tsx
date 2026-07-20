"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, message, Row } from "antd";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { MaVehicleType, MaVehicleTypeGroup } from "../../../common";
import { MaVehicleTypeServices } from "../../services/ma-vehicle-type.service";
import { MaVehicleTypeGroupServices } from "../../services/ma-vehicle-type-group.service";
import ManagementVehicleTypeManage from "./components/management-vehicle-type-manage";
import ManagementVehicleTypeTable from "./components/management-vehicle-type-table";

/** จัดการ master "ประเภทรถ" (รถ 4 ล้อ / 2 ล้อ ฯลฯ) — clone จาก ประเภทการตรวจสภาพ */
const ManagementVehicleType: React.FC = (): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const [form] = Form.useForm();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const services = MaVehicleTypeServices(baseUrIntranet);
  const groupServices = MaVehicleTypeGroupServices(baseUrIntranet);

  const [checkType, setCheckType] = useState<string>("create");
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<MaVehicleType[]>([]);
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    if (loading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    groupServices.getMaVehicleTypeGroupQuery().then((res: MaVehicleTypeGroup[]) => {
      setGroupOptions(
        (res ?? [])
          .filter((g) => g?.status !== false)
          .map((g) => ({ label: g.groupName, value: g.id }))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const response = await services.getMaVehicleTypeQuery();
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
        await services.createMaVehicleType(base);
      } else if (status === "edit") {
        await services.updateMaVehicleType(form.getFieldValue("id"), base);
      } else {
        await services.deleteMaVehicleType(form.getFieldValue("id"));
      }
      message.success(
        status === "create"
          ? "เพิ่มประเภทรถสำเร็จ"
          : status === "edit"
          ? "แก้ไขประเภทรถสำเร็จ"
          : "ลบประเภทรถสำเร็จ"
      );
      form.resetFields();
      setLoading(true);
      setOpenModal(false);
    } catch (error) {
      message.error("ดำเนินการประเภทรถไม่สำเร็จ");
    }
  };

  return (
    <div>
      <Row gutter={[8, 8]} className="mb-3 flex justify-end">
        <Col>
          <Button type="primary" onClick={() => handleOpen("create", undefined)}>
            {`สร้างประเภทรถ`}
          </Button>
        </Col>
      </Row>
      {openModal ? (
        <ManagementVehicleTypeManage
          form={form}
          checkType={checkType}
          handleCancel={handleCancel}
          openModal={openModal}
          onFinish={onFinish}
          groupOptions={groupOptions}
        />
      ) : null}
      <ManagementVehicleTypeTable
        dataSource={dataSource}
        handleOpen={handleOpen}
        loading={loading}
      />
    </div>
  );
};

export default ManagementVehicleType;
