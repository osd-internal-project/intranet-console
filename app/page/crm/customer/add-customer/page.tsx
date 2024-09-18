"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, message, Row, Spin } from "antd";
import {
  ITCustomerForm,
  ITPagination,
  ITConfigData,
  ITSelectUsers,
} from "../common";
import CrmServices from "../services/index.service";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";

import { checkRule } from "@/app/utils/rules";
import CreateCustomerForm from "./components/create-form";
import { useRouter } from "next/navigation";
import UserServices from "../services/user.service";
import { useSession } from "next-auth/react";

export default function AddCustomerPage() {
  const { data: session } = useSession();
  const intranetAuth = useAxiosCrm();
  const crmServices = CrmServices(intranetAuth);
  const userAuth = useAxiosUser();
  const userServices = UserServices(userAuth);
  const router = useRouter();
  const [customerTypeGroup, setCustomerTypeGroup] = useState<ITConfigData[]>(
    []
  );
  const [customerResponsibles, setCustomerResponsibles] = useState<
    ITSelectUsers[]
  >([]);
  const [customerTypes, setCustomerTypes] = useState<ITConfigData[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const group = await crmServices.findConfigCustomerTypeGroup();
    setCustomerTypeGroup(group);
    if (session?.user.userId) {
      const responsibles = await userServices.findSaleUserBySalePermission(
        session?.user.userId
      );
      if (responsibles && responsibles.length > 0) {
        setCustomerResponsibles(responsibles);
      }
    }

    const types = await crmServices.findConfigCustomerType();
    setCustomerTypes(types);
  };

  function onFinishAdd(form: ITCustomerForm): void {
    let createForm = form;
    if (form.customerTypeId) {
      const customerTypeSelected = customerTypes.findLast(
        (group) => group.id === form.customerTypeGroupId
      );
      if (customerTypeSelected?.name) {
        createForm = {
          ...createForm,
          customerTypeName: customerTypeSelected.name,
        };
      }
    }
    if (form.customerTypeGroupId) {
      const customerTypeGroupSelected = customerTypeGroup.findLast(
        (group) => group.id === form.customerTypeGroupId
      );
      if (customerTypeGroupSelected?.name) {
        createForm = {
          ...createForm,
          customerTypeGroupName: customerTypeGroupSelected.name,
        };
      }
    }

    if (form.responsibleId && form.responsibleId.length > 0) {
      const responsibleIded = customerResponsibles
        .filter((user) => form.responsibleId?.includes(user.userId))
        .map((user) => ({
          uid: user.userId,
          name: `${user.firstNameTh} ${user.lastNameTh}`,
        }));
      if (responsibleIded) {
        createForm = {
          ...createForm,
          responsibleId: form.responsibleId,
          responsible: responsibleIded,
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
                title: <span>Add Customer Group</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`ADD CUSTOMER GROUP`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <CreateCustomerForm
                onFinishAdd={onFinishAdd}
                customerTypeGroup={customerTypeGroup}
                customerTypes={customerTypes}
                customerResponsibles={customerResponsibles}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
