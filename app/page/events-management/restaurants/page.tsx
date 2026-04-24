"use client";
import React, { useState } from "react";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Breadcrumb, Col, Divider, Form, notification, Row, TablePaginationConfig, type UploadFile } from "antd";
import type { ITypeMasterRestaurant } from "@/app/common/master-restaurant";
import MasterRestaurantServices from "@/app/services/master-restaurant.service";
import TableRestaurant from "./components/table-restaurant";
import ManageRestaurant from "./components/manage-restaurant";
import type { RcFile, UploadProps } from "antd/es/upload";
import { handleCompress } from "@/app/utils";

export default function Page() {
  const [api, contextHolder] = notification.useNotification();
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const masterrestaurantServices = MasterRestaurantServices(baseUrIntranet);
  const [ManageForm] = Form.useForm();
  const [attendFiles, setAttendFiles] = useState<UploadFile[][]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dataTable, setDataTable] = React.useState<{ data: ITypeMasterRestaurant[]; count: number }>({ data: [], count: 0 });
  const [pagination, setPagination] = React.useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [handleModal, setHandleModal] = React.useState<{
    open: boolean;
    type: "create" | "edit" | "delete" | "close";
    data: any;
  }>({
    open: false,
    type: "create",
    data: null,
  });

  React.useEffect(() => {
    if (loading) fetchdata();
  }, [loading]);

  const fetchdata = async () => {
    const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take = Number(pagination.pageSize);
    const condition = {
      where: {},
      take,
      skip,
    };
    const res = await masterrestaurantServices.dataTable(condition);
    setDataTable({ data: res.data, count: res.count });
    setLoading(false);
  };

  const handleModalOpen = (status: boolean, type: "create" | "edit" | "delete" | "close", data: any) => {
    setHandleModal({ open: status, type, data });
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    setLoading(true);
  };

  const getUploadProps = (): UploadProps => ({
    beforeUpload: async (file) => {
      const compressed = await handleCompress(file);
      return compressed;
    },
    onChange: (info) => {
      ManageForm.setFieldValue("files", info.fileList);
      setAttendFiles([info.fileList]);
    },
  });
  const onfinish = async (type: "create" | "edit" | "delete" | "close", values: any) => {
    if (type === "create") {
      const formData = new FormData();
      formData.append("items", JSON.stringify(values));
      attendFiles.forEach((fileList) => {
        const file = fileList?.[0];
        if (file) {
          formData.append("files", file.originFileObj as RcFile);
        }
      });
      await masterrestaurantServices.create(formData);
      api.success({
        message: "บันทึกสำเร็จ",
        description: "เพิ่มข้อมูลทรัพย์สินเรียบร้อยแล้ว",
        placement: "topRight",
      });
      ManageForm.resetFields();
      setAttendFiles([]);
      setHandleModal({
        open: false,
        type: "create",
        data: null,
      });
    }
    setLoading(true);
  };

  const handleDelete = async (id: number) => {
    await masterrestaurantServices.delete(id);
    api.success({
      message: "ลบข้อมู,สำเร็จ",
      description: "ลบข้อมูลเรียบร้อยแล้ว",
      placement: "topRight",
    });
    ManageForm.resetFields();
    setAttendFiles([]);
    setHandleModal({
      open: false,
      type: "create",
      data: null,
    });
    setLoading(true);
  };

  const downloadFile = async (fileName: string) => {
    try {
      const blob = await masterrestaurantServices.download(fileName);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div>
      {contextHolder}
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>ร้านอาหาร</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>การจัดการร้านอาหาร</span>
          </div>
        </Divider>
        <Col span={24}>
          <TableRestaurant
            data={dataTable}
            pagination={pagination}
            onChangePagination={handleTableChange}
            handleModalOpen={handleModalOpen}
            downloadFile={downloadFile}
            handleDelete={handleDelete}
            setLoading={setLoading}
          />
        </Col>
      </Row>
      {handleModal.open ? (
        <ManageRestaurant
          handleModalOpen={handleModalOpen}
          handleModal={handleModal}
          ManageForm={ManageForm}
          onfinish={onfinish}
          getUploadProps={getUploadProps}
        />
      ) : null}
    </div>
  );
}
