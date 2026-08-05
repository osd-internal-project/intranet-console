"use client";
import React, { useState, useEffect } from "react";
import { Breadcrumb, Card, Col, Row, TabsProps, Tabs, Button, Modal, Form, Input, FormProps, Divider, Select, TablePaginationConfig } from "antd";
import { RefreshmenType } from "./common";
import { useForm } from "antd/es/form/Form";
import ManageRefreshmentComponent from "./components/manageRoomRefreshment";
import { ManageRefreshmentServices } from "./services/manage-refreshmen.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

import { notifyError, notifySuccess } from "@/app/utils/message";
const ManageBookingRoom = () => {
  const { id24Axios } = useId24();
  const baseUrlIntra = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [form] = useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalAddRefreshment, setModalAddRefreshment] = useState(false);
  const [pagination, setPagination] = useState<any>({
    take: 10,
    skip: 0,
    current: 1,
    pageSize: 10,
  });
  const [refreshmentData, setRefreshmentData] = useState<RefreshmenType[]>([]);
  const [refreshmentTotal, setRefreshmentTotal] = useState<RefreshmenType[]>([]);

  const changePagination = (page: TablePaginationConfig) => {
    const skip = (page.current! - 1) * page.pageSize!;
    setPagination({
      take: page.pageSize || 10,
      skip: skip,
      current: page.current,
      pageSize: page.pageSize,
    });
  };

  const fetchData = async () => {
    try {
      const Refereshmentresponse = await ManageRefreshmentServices(baseUrlIntra).findMasterRefreshment(pagination.take, pagination.skip);

      setRefreshmentTotal(Refereshmentresponse.count);
      const Refereshment: RefreshmenType[] = Refereshmentresponse.data.map((item: any, index: number) => ({
        ...item,
        key: index.toString(),
      }));
      setRefreshmentData(Refereshment);
    } catch (error) {
      notifyError(error, "booking.room.load");
    }
  };

  // const items: TabsProps["items"] = [
  //   {
  //     key: "1",
  //     label: "อาหารว่าง",
  //     children: (
  //       <ManageRefreshmentComponent
  //         refreshmentData={refreshmentData}
  //         setRefreshmentData={setRefreshmentData}
  //         pagination={pagination}
  //         refreshmentTotal={refreshmentTotal}
  //         changePagination={changePagination}
  //         fetchData={fetchData}
  //       />
  //     ),
  //   },
  // ];

  const showModalAddRefreahment = () => {
    setModalAddRefreshment(true);
  };

  const handleAddRefreshmentCancel = () => {
    setModalAddRefreshment(false);
    form.resetFields();
  };

  const addRefreshment: FormProps<RefreshmenType>["onFinish"] = async (values) => {
    const response = await ManageRefreshmentServices(baseUrlIntra).createMasterRefreshment(values);
    if (response) {
      notifySuccess("refreshment.create");
      form.resetFields();
      setModalAddRefreshment(false);
    } else {
      notifyError(undefined, "refreshment.create");
    }

    setSubmitLoading(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  return (
    <>
      <Modal title="เพิ่มอาหารว่าง" open={modalAddRefreshment} onCancel={handleAddRefreshmentCancel} footer={null} width={500}>
        <Form
          form={form}
          name="add_refreshment"
          initialValues={{ remember: true }}
          onFinish={addRefreshment}
          autoComplete="off"
          labelCol={{ md: 10, sm: 12 }}>
          <Divider orientation="left">เพิ่มอาหารว่าง</Divider>
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
            <Button type="default" onClick={handleAddRefreshmentCancel} style={{ marginRight: 8 }}>
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              ตกลง
            </Button>
          </Row>
        </Form>
      </Modal>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },

              {
                title: <span>Booking Room Refreshment</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0" style={{ padding: "0px 0px 0px 0px", marginBottom: "0px", marginTop: "0px" }}>
          <div className="title-page-font">{`Booking Room Refreshment`}</div>
        </Divider>
        <Col span={24}>
          <div>
            <Card styles={{ body: { padding: "10px" } }}>
              <div className="flex justify-end">
                <Button type="primary" onClick={showModalAddRefreahment} size="small" style={{ marginBottom: "10px" }}>
                  เพิ่มอาหารว่าง
                </Button>
              </div>
              {/* <Tabs defaultActiveKey="1" items={items} /> */}
              <ManageRefreshmentComponent
                refreshmentData={refreshmentData}
                setRefreshmentData={setRefreshmentData}
                pagination={pagination}
                refreshmentTotal={refreshmentTotal}
                changePagination={changePagination}
                fetchData={fetchData}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ManageBookingRoom;
