import React, { useState, useEffect } from "react";
import { Select, Table, Space, Button, Row, Modal, Form, Input, Divider, Tag, message, Popconfirm } from "antd";
import type { TableProps, FormProps } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ManageRefreshmentServices } from "../services/manage-refreshmen.service";
import { useForm } from "antd/es/form/Form";
import { RefreshmenType } from "../common";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

const Refreshment: React.FC<any> = ({
  refreshmentData,
  refreshmentTotal,
  setRefreshmentData,
  pagination,
  changePagination,
  fetchData,
}: any): React.ReactElement => {
  const { id24Axios, tokenAccess } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [form] = useForm();
  const manageRefreshmentServices = ManageRefreshmentServices(baseUrlIntranet);
  const [currentRefreshmentId, setCurrentRefreshmentId] = useState<string | null>(null);
  const [modalEditMasterRoom, setModalEditRefreshment] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const columns: TableProps<RefreshmenType>["columns"] = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
      render: (id: number, record: any, index: number) =>
        pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : "",
    },
    {
      title: "ชื่ออาหารว่าง",
      dataIndex: "refreshmentName",
      key: "refreshmentName",
    },
    {
      title: "สถานะ",
      dataIndex: "refreshmentStatus",
      key: "refreshmentStatus",
      render: (status: boolean) => (status ? <Tag color="green">มีพร้อมเสิร์ฟ</Tag> : <Tag color="red">สินค้าหมด</Tag>),
    },
    {
      title: "รายละเอียด",
      dataIndex: "refreshmentDescription",
      key: "refreshmentDescription",
    },
    {
      title: "จัดการ",
      dataIndex: "manage",
      key: "manage",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModalEditRefreshment(record)}>แก้ไข</a>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteRefreshment(record.id)}
            okText="ใช่"
            cancelText="ไม่">
            <a>ลบ</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditRefreshmentCancel = () => {
    setModalEditRefreshment(false);
    form.resetFields();
  };

  const showModalEditRefreshment = (record: RefreshmenType) => {
    setCurrentRefreshmentId(record.id);
    form.setFieldsValue(record);
    setModalEditRefreshment(true);
  };

  const handleDeleteRefreshment = async (id: string) => {
    try {
      await manageRefreshmentServices.deleteMasterRefreshment(id);
      const isLastItemOnPage = refreshmentData.length === 1;
      const isNotFirstPage = pagination.current > 1;

      if (isLastItemOnPage && isNotFirstPage) {
        changePagination({
          ...pagination,
          current: pagination.current - 1,
        });
      } else {
        await fetchData();
      }

      message.success("ลบรายการอาหรว่างสำเร็จ");
    } catch (error) {
      message.error("ลบรายการอาหรว่างไม่สำเร็จ");
    }
  };

  const updatedRefreshment: FormProps<RefreshmenType>["onFinish"] = async (values) => {
    setSubmitLoading(true);
    try {
      const { ...restValues } = values;
      const updatedMasterRefreshment = {
        ...restValues,
        id: currentRefreshmentId,
      };
      await manageRefreshmentServices.updateMasterRefreshment(updatedMasterRefreshment);
      message.success("แก้ไขรายการอาหรว่างสำเร็จ");
      handleEditRefreshmentCancel();
      await fetchData();
      setSubmitLoading(false);
    } catch (error) {
      message.error("แก้ไขรายการอาหรว่างสำเร็จ");
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal title="แก้ไขอาหารว่าง" open={modalEditMasterRoom} onCancel={handleEditRefreshmentCancel} footer={null} width={500}>
        <Form
          form={form}
          name="edit_refreshment"
          initialValues={{ remember: true }}
          onFinish={updatedRefreshment}
          autoComplete="off"
          labelCol={{ md: 10, sm: 12 }}>
          <Divider orientation="left">แก้ไขอาหารว่าง</Divider>
          <Form.Item label="ชื่ออาหารว่าง" name="refreshmentName" rules={[{ required: true, message: "กรุณากรอกชื่ออาหารว่าง!" }]}>
            <Input placeholder="กรอกชื่ออาหารว่าง" />
          </Form.Item>
          <Form.Item label="รายละเอียดอาหารว่าง" name="refreshmentDescription" rules={[{ required: true, message: "กรุณากรอกรายละเอียดอาหารว่าง!" }]}>
            <Input placeholder="กรอกรายละเอียดอาหารว่าง" />
          </Form.Item>
          <Form.Item label="สถานะอาหารว่าง" name="refreshmentStatus" rules={[{ required: true, message: "กรุณาเลือกสถานะอาหารว่าง!" }]}>
            <Select placeholder="เลือกสถานะอาหารว่าง">
              <Select.Option value={true}>มีพร้อมเสิร์ฟ</Select.Option>
              <Select.Option value={false}>สินค้าหมด</Select.Option>
            </Select>
          </Form.Item>
          <Row justify="end">
            <Button type="default" onClick={handleEditRefreshmentCancel} style={{ marginRight: 8 }}>
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              ตกลง
            </Button>
          </Row>
        </Form>
      </Modal>
      <Table
        size="small"
        columns={columns}
        dataSource={refreshmentData}
        rowKey="id"
        onChange={changePagination}
        pagination={{
          total: refreshmentTotal,
          current: pagination.current,
          pageSize: pagination.pageSize,
        }}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default Refreshment;
