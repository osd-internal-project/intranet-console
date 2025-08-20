"use client";
import { Breadcrumb, Col, Divider, Form, Modal, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ManageStockRequestPage } from "./components/manage-stock-request";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { ISelect, ITpyeUser } from "@/app/page/leave-control-management/common";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import DataLeaveService from "../../../../services/leave-management.service";
import MasterProductServices from "../../services/stock.service";
import { ITRequestOrder } from "../../common/request-order";
import RequestOrderServices from "../../services/request-order.service";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const page = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm<ITRequestOrder>();
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const dataleaveService = DataLeaveService(baseUrlUser);
  const masterproductServices = MasterProductServices(baseUrlInventory);
  const requestorderServices = RequestOrderServices(baseUrlInventory);
  const [getdataUser, setdataUser] = useState<ISelect[]>([]);
  const [optionsMasterData, setOptionsMasterData] = useState<ISelect[]>([]);
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };

  useEffect(() => {
    masterData();
    if (user) {
      form.setFieldsValue({
        createdBy: `${user.firstNameTh} ${user.lastNameTh}`,
        status: "new",
      });
    }
  }, [user]);

  const masterData = async () => {
    const resMasterproduct = await masterproductServices.findOptions();
    setOptionsMasterData(resMasterproduct);
    const resUser = await dataleaveService.getdataUserAll();
    const options = resUser.map((event: ITpyeUser) => ({
      value: `${event.firstNameTh} ${event.lastNameTh}`,
      label: `${event.firstNameTh} ${event.lastNameTh}`,
    }));
    setdataUser(options);
  };

  const onFinish = (values: ITRequestOrder) => {
    modal.confirm({
      title: "ยืนยันการขอเบิก",
      icon: <ExclamationCircleOutlined />,
      content: "ตรวจสอบข้อมูลก่อนยืนยันการขอเบิกสินค้า",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          const response = await requestorderServices.create(values);
          if (response) {
            form.resetFields();
            modal.success({
              title: "Success",
              content: "บันทึกข้อมูลสำเร็จ",
            });
          }
        } catch (error) {
          console.error("Error creating request order:", error);
          modal.error({
            title: "Error",
            content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          });
        }
      },
    });
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
                title: <span>{`หน้าหลัก`}</span>,
              },
              {
                href: "/page/stock",
                title: <span>{`การจัดการสินค้า`}</span>,
              },
              {
                href: "/page/stock/stock-request/",
                title: <span>{`การเบิกสินค้า`}</span>,
              },
              { title: <span>{`จัดการการเบิกสินค้า`}</span> },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>{`จัดการการเบิกสินค้า`}</span>
          </div>
        </Divider>
      </Row>
      <div>
        <ManageStockRequestPage getdataUser={getdataUser} options={optionsMasterData} form={form} onFinish={onFinish} />
      </div>
    </div>
  );
};
export default page;
