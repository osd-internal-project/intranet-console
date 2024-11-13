import React, { useEffect, useState } from "react";
import ManagementCarWrapupManage from "./components/management-car-wrapup-manage";
import ManagementCarWrapupTable from "./components/management-car-wrapup-table";
import { Button, Col, Form, message, Row } from "antd";
import ExportExcel from "../../export/export-excel";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageCarServices } from "../../services/manage-car.service";

const ManagementCarWrapup: React.FC = (): React.ReactElement => {
  const [form] = Form.useForm();
  const intraAuth = useAxiosIntranet();
  const manageCarServices = ManageCarServices(intraAuth);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkType, setCheckType] = useState<string>("create");
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    try {
      const maresponse = await manageCarServices.getMaCarQuery();
      setDataSource(maresponse);
      setLoading(false);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  const handleOpen = (status: string, values: any) => {
    setCheckType(status);
    form.setFieldsValue(values);
    setOpenModal(true);
  };
  return (
    <div>
      <Row gutter={[8, 8]} className="mb-2 flex justify-end">
        <Col>
          <Button type="primary" onClick={() => handleOpen("create", undefined)}>
            {`เพิ่มข้อมูลตรวจสภาพรถ`}
          </Button>
        </Col>
        <Col>
          <ExportExcel datamacar={dataSource} />
        </Col>
      </Row>
      <ManagementCarWrapupTable handleOpen={handleOpen} dataSource={dataSource} loading={loading} />
      {openModal ? <ManagementCarWrapupManage /> : null}
    </div>
  );
};

export default ManagementCarWrapup;
