"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, message, Row, UploadFile, Tabs } from "antd";
import DescriptionCustomerComponent from "./components/description-form";
import BranchCustomerComponent from "./components/customer-branch";
import ProjectCustomerComponent from "./components/customer-project";
import { ITCustomerForm, ITCustomer, ITPagination } from "../common";
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
import CrmServices from "../services/index.service";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";

const customerGroup = [
  { id: 1, name: "osd1" },
  { id: 2, name: "osd2" },
];
const users = [
  { userId: "11", name: "user1" },
  { userId: "22", name: "user2" },
];

export default function MaTaskPage() {
  const { data: session } = useSession();
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const params = useParams<{ cusid: string }>();
  const [descriptionForm] = useForm();
  const [loading, setloading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState(false);
  const [showModalBranchAdd, setShowModalBranchAdd] = useState(false);
  // const [data, setData] = useState<ITCustomer>();
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    const res = await crmServices.findCustomerByCustomerId(+params.cusid);
    const regisDate = res?.regisDate ? dayjs(res.regisDate) : null;
    console.log(regisDate);
    descriptionForm.setFieldsValue({
      ...res,
      regisDate: regisDate,
    });
    setIsEdit(false);
    setloading(false);
  };
  // const data: ITMaDetail = {
  //   id: 2,
  //   maName: "task 2",
  //   maStatus: "success",
  //   maTypeId: 2,
  //   maTypeName: "ตรวจสภาพ",
  //   maDate: new Date(),
  //   detail: "ทดสอบ",
  //   contact: "บริษัท",
  //   remake: "สำเร็จ",
  //   updatedDate: new Date(),
  //   createdDate: new Date(),
  // };

  async function onFinishEdit(data: ITCustomerForm): Promise<void> {
    let form = {
      ...data,
      updatedById: session?.user.userId,
      updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
    };
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
    await crmServices
      .update(+params.cusid, form)
      .then((res) => {
        message.success("อัพเดท customer สำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
  }

  // async function downloadFile(id: number, name: string): Promise<void> {
  //   if (id) {
  //     const response = await maServices.downloadFile(id);
  //     const url = URL.createObjectURL(response);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = name;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   }
  // }

  // async function getImageBlob(id: number, name: string) {
  //   if (id) {
  //     const response = await maServices.downloadFile(id);
  //     if (response) return response;
  //     else return undefined;
  //   }
  // }

  return descriptionForm.getFieldsValue() ? (
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
                href: "/page/maintenance-management",
                title: <span>Customer Description</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`CUSTOMER DESCRIPTION`}</div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <DescriptionCustomerComponent
              descriptionForm={descriptionForm}
              isEdit={isEdit}
              setIsEdit={(e: boolean) => setIsEdit(e)}
              // maTypes={maTypes}
              onFinishEdit={onFinishEdit}
              // downloadFile={downloadFile}
              // getImageBlob={getImageBlob}
            />
            <div>
              <Card>
                <Tabs
                  items={[
                    {
                      key: "branch",
                      label: "สาขา",
                      children: (
                        <BranchCustomerComponent
                          showModalBranchAdd={showModalBranchAdd}
                          onShowModalBranchAdd={(status) =>
                            setShowModalBranchAdd(status)
                          }
                        />
                      ),
                    },
                    {
                      key: "project",
                      label: "Project",
                      children: <ProjectCustomerComponent />,
                    },
                  ]}
                />
              </Card>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}
