"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, message, Row, Spin } from "antd";
import { ITCustomerForm, ITPagination } from "../common";
import CrmServices from "../services/index.service";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
import { checkRule } from "@/app/utils/rules";
import CreateCustomerForm from "./components/create-form";
import { useRouter } from "next/navigation";

export default function AddCustomerPage() {
  const intranetAuth = useAxiosCrm();
  const crmServices = CrmServices(intranetAuth);
  const router = useRouter();
  const customerGroup = [
    { id: 1, name: "osd1" },
    { id: 2, name: "osd2" },
  ];
  const users = [
    { userId: "11", name: "user1" },
    { userId: "22", name: "user2" },
  ];
  function onFinishAdd(form: ITCustomerForm): void {
    let createForm = form;
    if (form.customerGroupId) {
      const customerGroupSelected = customerGroup.findLast(
        (group) => group.id === form.customerGroupId
      );
      if (customerGroupSelected?.name) {
        createForm = {
          ...createForm,
          customerGroupName: customerGroupSelected.name,
        };
      }
    }
    if (form.responsibleId) {
      const userSelected = users.findLast(
        (user) => user.userId === form.responsibleId
      );
      if (userSelected?.name) {
        createForm = {
          ...createForm,
          responsibleName: userSelected.name,
        };
      }
    }
    if (form.thirdPartyId) {
      const userSelected = users.findLast(
        (user) => user.userId === form.thirdPartyId
      );
      if (userSelected?.name) {
        createForm = {
          ...createForm,
          customerGroupName: userSelected.name,
        };
      }
    }
    crmServices
      .create(createForm)
      .then((res) => {
        message.success("สร้าง customer สำเร็จ");
        router.push("/page/crm/customer");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
  }

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>CRM</span>,
              },
              {
                href: "/page/crm/customer",
                title: <span>Customer</span>,
              },
              {
                title: <span>Add Customer</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`ADD CUSTOMER`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <CreateCustomerForm onFinishAdd={onFinishAdd} />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
