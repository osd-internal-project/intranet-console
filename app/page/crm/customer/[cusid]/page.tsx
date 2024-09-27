"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  message,
  Row,
  UploadFile,
  Tabs,
  Form,
} from "antd";
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
  ITSelectUsers,
  ITConfigData,
  ITCustomerSubForm,
  ITCustomerSub,
  ITCustomerSubDetail,
} from "../common";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import CrmServices from "../services/index.service";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import UserServices from "../services/user.service";
import { ITProject } from "../../project/common";
import { checkRule } from "@/app/utils/rules";
import CustomerSubDetailComponent from "./components/customer-sub-detail";

export default function CustomerDetailPage() {
  const rules = {
    ruleCustomerShow: checkRule("crm-c-s"),
    ruleCustomerEdit: checkRule("crm-c-e"),
    ruleCustomerSubAdd: checkRule("crm-cs-a"),
    ruleCustomerSubEdit: checkRule("crm-cs-e"),
    ruleCustomerSubDelete: checkRule("crm-cs-d"),
    ruleCustomerBranchAdd: checkRule("crm-cb-a"),
    ruleCustomerBranchEdit: checkRule("crm-cb-e"),
    ruleCustomerBranchDelete: checkRule("crm-cb-d"),
    ruleCustomerAddressAdd: checkRule("crm-ca-a"),
    ruleCustomerAddressDelete: checkRule("crm-ca-d"),
    ruleCustomerContactAdd: checkRule("crm-cc-a"),
    ruleCustomerContactDelete: checkRule("crm-cc-d"),
    ruleProjectShow: checkRule("crm-p-s"),
  };
  const { data: session } = useSession();
  const crmAuth = useAxiosCrm();
  const crmServices = CrmServices(crmAuth);
  const userAuth = useAxiosUser();
  const userServices = UserServices(userAuth);
  const params = useParams<{ cusid: string }>();
  const [descriptionForm] = useForm();
  const [formBranchEdit] = useForm();
  const [formCustomerSubEdit] = useForm();

  const [customerSubs, setCustomerSubs] = useState<ITCustomerSubDetail[]>([]);
  const [customerSubIdSelected, setCustomerSubIdSelected] = useState<
    number | undefined
  >(undefined);
  const [branchs, setBranchs] = useState<ITBranch[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState(false);
  const [showModalCustomeSubAdd, setShowModalCustomerSubAdd] = useState(false);
  const [showModalCustomeSubEdit, setShowModalCustomerSubEdit] =
    useState(false);
  const [showModalBranchAdd, setShowModalBranchAdd] = useState(false);

  const [showModalBranchEdit, setShowModalBranchEdit] = useState(false);
  const [branchDetail, setBranchDetail] = useState<ITBranchDetail | undefined>(
    undefined
  );
  const [projectDetail, setProjectDetail] = useState<ITProject[]>([]);
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
  const [formEdit] = Form.useForm();
  useEffect(() => {
    if (loading === true) fetchData();
    fetchProject();
  }, [loading]);

  const fetchData = async () => {
    await fetchConfig();
    await fetchDescription();
    await fetchCustomerSubs();
    if (customerSubIdSelected) {
      await fetchBranchByCustomerSubId(customerSubIdSelected);
    }

    setloading(false);
  };
  const fetchConfig = async () => {
    const group = await crmServices.findConfigCustomerTypeGroup();
    setCustomerTypeGroup(group);
    if (session?.user.userId) {
      const responsibles = await userServices.findOrganizeUserByUserId(
        session?.user.userId
      );

      if (session?.user.userId) {
        const responsibles = await userServices.findSaleUserBySalePermission(
          session?.user.userId
        );
        if (responsibles && responsibles.length > 0) {
          setCustomerResponsibles(responsibles);
        }
      }
    }

    const types = await crmServices.findConfigCustomerType();
    setCustomerTypes(types);
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
      responsibleId: customerDetail.responsible?.map((data) => data.uid),
    });
    setIsEdit(false);
  };
  const fetchCustomerSubs = async () => {
    const customerSubs = await crmServices.findCustomerSubByCustomerId(
      +params.cusid,
      {}
    );
    setCustomerSubs(customerSubs);
    setShowModalBranchAdd(false);
  };
  async function fetchBranchByCustomerSubId(
    customerSubId: number
  ): Promise<void> {
    const branchs = await crmServices.findBranchByCustomerSubId(
      customerSubId,
      {}
    );
    setCustomerSubIdSelected(customerSubId);
    setBranchs(branchs);
  }
  const fetchProject = async () => {
    const projects = await crmServices.findProjectDataTableByCustomerId(
      +params.cusid
    );
    setProjectDetail(projects);
    setloading(false);
  };

  async function onFinishEdit(data: ITCustomerForm): Promise<void> {
    let form = {
      ...data,
      ...(data.registration && { registration: Number(data.registration) }),
      updatedById: session?.user.userId,
      updatedByName: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
    };
    let updateForm = form;
    if (form.customerTypeId) {
      const customerTypeSelected = customerTypes.findLast(
        (d) => d.id === form.customerTypeGroupId
      );
      if (customerTypeSelected?.name) {
        updateForm = {
          ...updateForm,
          customerTypeName: customerTypeSelected.name,
        };
      }
    }
    if (form.customerTypeGroupId) {
      const customerTypeGroupSelected = customerTypeGroup.findLast(
        (d) => d.id === form.customerTypeGroupId
      );
      if (customerTypeGroupSelected?.name) {
        updateForm = {
          ...updateForm,
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
        updateForm = {
          ...updateForm,
          responsibleId: form.responsibleId,
          responsible: responsibleIded,
        };
      }
    }
    // if (form.responsible) {
    //   const userSelected = users.findLast(
    //     (user) => user.userId === form.responsible
    //   );
    //   if (userSelected?.name) {
    //     updateForm = {
    //       ...updateForm,
    //       responsibleName: userSelected.name,
    //     };
    //   }
    // }

    await crmServices
      .update(+params.cusid, updateForm)
      .then((res) => {
        message.success("อัพเดท customer สำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
  }

  async function onSaveBranch(form: ITBranchForm): Promise<void> {
    if (customerSubIdSelected) {
      await crmServices
        .createBranch(+params.cusid, customerSubIdSelected, form)
        .then((res) => {
          message.success("เพิ่มสาขาสำเร็จ");
        })
        .catch(() => {
          message.error("ผิดพลาด กรุณาลองใหม่");
        });
      setloading(true);
    } else {
      message.error("ผิดพลาด กรุณาลองใหม่");
    }
  }
  async function onSaveBranchEdit(form: ITBranchForm): Promise<void> {
    const base = {
      ...form,
      updatedBy: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      updatedByID: session?.user.userId,
      updatedAt: dayjs(),
    };
    await crmServices
      .editBranch(+form.id, base)
      .then((res) => {
        message.success("แก้ไขสาขาสำเร็จ");
        setShowModalBranchEdit(false);
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
  async function onSaveCustomerSub(form: ITCustomerSubForm): Promise<void> {
    await crmServices
      .createCustomerSub(+params.cusid, form)
      .then((res) => {
        message.success("เพิ่มลูกค้าสำเร็จ");
        setShowModalCustomerSubAdd(false);
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
  }
  async function onEditCustomerSub(form: ITCustomerSubForm): Promise<void> {
    await crmServices
      .editCustomerSub(form.id, form)
      .then((res) => {
        setShowModalCustomerSubEdit(false);
        message.success("แก้ไขลูกค้าสำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
  }
  async function onDeleteCustomerSub(id: number): Promise<void> {
    await crmServices
      .deleteBranch(id)
      .then((res) => {
        message.success("ลบลูกค้าสำเร็จ");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    setloading(true);
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
          <div className="title-page-font">{`CUSTOMER GROUP DESCRIPTION`}</div>
        </Col>
        <Col span={24}>
          {rules.ruleCustomerShow ? (
            <div className="grid grid-cols-1 ">
              <DescriptionCustomerComponent
                rules={rules}
                descriptionForm={descriptionForm}
                isEdit={isEdit}
                setIsEdit={(e: boolean) => setIsEdit(e)}
                onFinishEdit={onFinishEdit}
                customerTypeGroup={customerTypeGroup}
                customerTypes={customerTypes}
                customerResponsibles={customerResponsibles}
              />
              <div>
                <Card>
                  <Tabs
                    size="small"
                    items={[
                      {
                        key: "customers",
                        label: "Customers",
                        children: (
                          <div>
                            <CustomerSubDetailComponent
                              rules={rules}
                              branchDetail={branchDetail}
                              customerSubs={customerSubs}
                              showModalCustomerSubAdd={showModalCustomeSubAdd}
                              showModalCustomerSubEdit={showModalCustomeSubEdit}
                              onShowModalCustomerSubAdd={function (
                                status: boolean
                              ): void {
                                setShowModalCustomerSubAdd(status);
                              }}
                              onShowModalCustomerSubEdit={function (
                                status: boolean
                              ): void {
                                setShowModalCustomerSubEdit(status);
                              }}
                              onSaveCustomerSub={onSaveCustomerSub}
                              onSaveCustomerSubEdit={onEditCustomerSub}
                              onDeleteCustomerSub={onDeleteCustomerSub}
                              // formEdit={undefined}
                              formBranchEdit={formBranchEdit}
                              branchs={branchs}
                              fetchBranchByCustomerSubId={
                                fetchBranchByCustomerSubId
                              }
                              showModalBranchAdd={showModalBranchAdd}
                              showModalBranchEdit={showModalBranchEdit}
                              onShowModalBranchAdd={function (
                                status: boolean
                              ): void {
                                setShowModalBranchAdd(status);
                              }}
                              onShowModalBranchEdit={function (
                                status: boolean
                              ): void {
                                setShowModalBranchEdit(status);
                              }}
                              onShowModalBranchDetail={onShowModalBranchDetail}
                              onSaveBranch={onSaveBranch}
                              onSaveBranchEdit={onSaveBranchEdit}
                              onDeleteCustomerBranch={onDeleteCustomerBranch}
                              onSaveBranchAddress={onSaveBranchAddress}
                              onDeleteCustomerBranchAddress={
                                onDeleteCustomerBranchAddress
                              }
                              onSaveBranchContact={onSaveBranchContact}
                              onDeleteCustomerBranchContact={
                                onDeleteCustomerBranchContact
                              }
                              formCustomerSubEdit={formCustomerSubEdit}
                            />
                            {/* <BranchCustomerComponent
                              rules={rules}
                              branchs={branchs}
                              branchDetail={branchDetail}
                              showModalBranchAdd={showModalBranchAdd}
                              showModalBranchEdit={showModalBranchEdit}
                              onShowModalBranchAdd={(status) =>
                                setShowModalBranchAdd(status)
                              }
                              onShowModalBranchEdit={(status) =>
                                setShowModalBranchEdit(status)
                              }
                              onShowModalBranchDetail={onShowModalBranchDetail}
                              onSaveBranch={onSaveBranch}
                              onSaveBranchEdit={onSaveBranchEdit}
                              onDeleteCustomerBranch={onDeleteCustomerBranch}
                              onSaveBranchAddress={onSaveBranchAddress}
                              onDeleteCustomerBranchAddress={
                                onDeleteCustomerBranchAddress
                              }
                              onSaveBranchContact={onSaveBranchContact}
                              onDeleteCustomerBranchContact={
                                onDeleteCustomerBranchContact
                              }
                              formEdit={formEdit}
                            /> */}
                          </div>
                        ),
                      },
                      {
                        key: "project",
                        label: "Project",
                        children: (
                          <ProjectCustomerComponent
                            rules={rules}
                            projectDetail={projectDetail}
                            loading={loading}
                            setLoading={setloading}
                          />
                        ),
                      },
                    ]}
                  />
                </Card>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </div>
  ) : (
    ""
  );
}
