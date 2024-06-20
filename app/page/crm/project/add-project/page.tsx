"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, message, Row, Spin } from "antd";
import {
  ITBranchForSelect,
  ITCustomerForSelect,
  ITPagination,
} from "../common";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
import CrmServices from "../services/index.service";

import { checkRule } from "@/app/utils/rules";
import CreateCustomerForm from "./components/create-form";
import { useRouter } from "next/navigation";
import { count } from "console";

export default function AddProjectPage() {
  const intranetAuth = useAxiosCrm();
  const crmServices = CrmServices(intranetAuth);
  const rounter = useRouter();
  const [loading, setloading] = useState<boolean>(true);
  const [customerList, setCustomerList] = useState<ITCustomerForSelect[]>([]);
  const [branchList, setBranchList] = useState<ITBranchForSelect[]>([]);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);
  const fetchData = async () => {
    const data = await crmServices.findCustomerActive();
    setCustomerList(data);
    setloading(false);
  };
  async function onFinishAdd(form: ITCustomerForSelect): Promise<void> {
    const data = await crmServices
      .createProject(form)
      .then(() => {
        message.error("สร้าง Project สำเร็จ");
        rounter.push("/page/crm/project");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
  }
  async function changeCustomerSelect(id: number): Promise<void> {
    const data = await crmServices.findBranchByCustomerId(id);
    setBranchList(data);
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
                href: "/page/crm/project",
                title: <span>Project</span>,
              },
              {
                title: <span>Add Project</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`ADD PROJECT`}</div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <Card>
              <CreateCustomerForm
                customerList={customerList}
                branchList={branchList}
                onFinishAdd={onFinishAdd}
                changeCustomerSelect={changeCustomerSelect}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
