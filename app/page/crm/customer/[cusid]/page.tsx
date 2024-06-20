"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, message, Row, UploadFile, Tabs } from "antd";
import DescriptionCustomerComponent from "./components/description-form";
import BranchCustomerComponent from "./components/customer-branch";
import ProjectCustomerComponent from "./components/customer-project";
import {
  ITCustomerForm,
  ITCustomer,
  ITPagination,
  ITBranchForm,
  ITBranch,
  ITBranchAddressForm,
  ITBranchDetail,
  ITBranchContactForm,
} from "../common";
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

export default function CustomerDetailPage() {
  const { data: session } = useSession();
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const params = useParams<{ cusid: string }>();
  const [descriptionForm] = useForm();
  const [branchs, setBranchs] = useState<ITBranch[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState(false);
  const [showModalBranchAdd, setShowModalBranchAdd] = useState(false);
  const [branchDetail, setBranchDetail] = useState<ITBranchDetail | undefined>(
    undefined
  );
  // const [data, setData] = useState<ITCustomer>();
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);

  const fetchData = async () => {
    await fetchDescription();
    await fetchBranch();
    setloading(false);
  };
  const fetchDescription = async () => {
    const customerDetail = await crmServices.findCustomerByCustomerId(
      +params.cusid
    );
    const regisDate = customerDetail?.regisDate
      ? dayjs(customerDetail.regisDate)
      : null;
    descriptionForm.setFieldsValue({
      ...customerDetail,
      regisDate: regisDate,
    });

    setIsEdit(false);
  };
  const fetchBranch = async () => {
    const branchs = await crmServices.findBranchByCustomerId(+params.cusid, {});
    setBranchs(branchs);
    setShowModalBranchAdd(false);
  };

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

  async function onSaveBranch(form: ITBranchForm): Promise<void> {
    await crmServices
      .createBranch(+params.cusid, form)
      .then((res) => {
        message.success("เพิ่มสาขาสำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
  }
  async function onShowModalBranchDetail(
    id: number | undefined
  ): Promise<void> {
    if (id) {
      const branchDetail = await crmServices.findBranchDetailByBranchId(id);
      setBranchDetail(branchDetail);
    } else {
      setBranchDetail(undefined);
    }
  }
  async function onDeleteCustomerBranch(id: number): Promise<void> {
    await crmServices
      .deleteBranch(id)
      .then((res) => {
        message.success("ลบสาขาสำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
  }
  async function onSaveBranchAddress(
    id: number,
    form: ITBranchAddressForm
  ): Promise<void> {
    await crmServices
      .createBranchAddress(id, form)
      .then((res) => {
        message.success("เพิ่มที่อยู่สำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    onShowModalBranchDetail(id);
  }
  async function onDeleteCustomerBranchAddress(
    branchId: number,
    addressId: number
  ): Promise<void> {
    await crmServices
      .deleteBranchAddress(addressId)
      .then((res) => {
        message.success("ลบที่อยู่สำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    onShowModalBranchDetail(branchId);
  }
  async function onSaveBranchContact(
    branchId: number,
    form: ITBranchContactForm
  ): Promise<void> {
    await crmServices
      .createBranchContact(branchId, form)
      .then((res) => {
        message.success("เพิ่มที่อยู่สำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    onShowModalBranchDetail(branchId);
  }
  async function onDeleteCustomerBranchContact(
    branchId: number,
    contactId: number
  ): Promise<void> {
    await crmServices
      .deleteBranchContact(contactId)
      .then((res) => {
        message.success("ลบผู้ติดต่อสำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    onShowModalBranchDetail(branchId);
  }
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
                href: "/page/crm/customer",
                title: <span>Customer</span>,
              },
              {
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
                          branchs={branchs}
                          branchDetail={branchDetail}
                          showModalBranchAdd={showModalBranchAdd}
                          onShowModalBranchAdd={(status) =>
                            setShowModalBranchAdd(status)
                          }
                          onShowModalBranchDetail={onShowModalBranchDetail}
                          onSaveBranch={onSaveBranch}
                          onDeleteCustomerBranch={onDeleteCustomerBranch}
                          onSaveBranchAddress={onSaveBranchAddress}
                          onDeleteCustomerBranchAddress={
                            onDeleteCustomerBranchAddress
                          }
                          onSaveBranchContact={onSaveBranchContact}
                          onDeleteCustomerBranchContact={
                            onDeleteCustomerBranchContact
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
