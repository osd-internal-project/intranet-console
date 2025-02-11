"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  message,
  Modal,
  Row,
  Spin,
  Tabs,
} from "antd";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth"; 
import Link from "next/link";
import { ExclamationCircleFilled } from "@ant-design/icons";
import CustomerGroupServices from "@/app/services/customer-group.service";

import CustomerServices from "@/app/services/customer.service";
import CustomerBranchServices from "@/app/services/customer-detail-sub.service";
import CustomerProductServices from "@/app/services/customer-product.service";
import CustomerProjectServices from "@/app/services/customer-project.service";
import UserServices from "@/app/services/user.service";

import { useParams } from "next/navigation";
import dayjs from "dayjs";
import {
  ITCustomerGroup,
  ITCustomer,
  ITCustomerForm,
  ITSelectUsers,
  ITConfigData,
  ITCustomerDetailSubForm,
  ITCustomerDetailSubDetail,
  ITCustomerDetailSubAddressForm,
  ITCustomerDetailSubContactForm,
} from "@/app/common/customer";
import CustomerGroupDetails from "./components/customer-group-details";
import CustomerGroupCustomerList from "./components/customer-group-customer-list";
import CustomerGroupProductList from "./components/customer-group-product-list";
import CustomerCreateForm from "./components/customer-create-form";
import { ITCustomerProduct } from "@/app/common/product";
import { ITProject } from "@/app/common/project";
import CusomterEditForm from "./components/customer-edit-form";
import BranchEdit from "./components/branch-edit";
import CustomerGroupSearch from "./components/customer-group-search";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
const { useForm } = Form;
export default function CustomerGroupDetailPage() {
  const { user, roles } = (useContext(UserContext) as UserContectType) || {
    user: null,
    roles: null,
  };    
  const { id24Axios } = useId24();  
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlCrm = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_CRM);
  const { pid } = useParams(); 
  
  const userServices = UserServices(baseUrlUser);
  const customerGroupServices = CustomerGroupServices(baseUrlCrm);
  const customerServices = CustomerServices(baseUrlCrm);
  const customerBranchServices = CustomerBranchServices(baseUrlCrm);
  const customerProductServices = CustomerProductServices(baseUrlCrm);
  const customerProjectServices = CustomerProjectServices(baseUrlCrm);
  const customerGroupId = String(pid);
  const [descriptionCustomerForm] = useForm();
  const [customerBrahEditForm] = useForm();
  const [details, setDetails] = useState<ITCustomerGroup>();
  const [allSearch, setAllSearch] = useState<object>({});
  const [loading, setloading] = useState<boolean>(true);
  const [activeTabsKey, setActiveTabKey] = useState<string>("products");
  const [openCustomerCreate, setOpenCustomerCreate] = useState<boolean>(false);
  const [openCustomerUpdateId, setOpenCustomerUpdateId] = useState<
    number | undefined
  >(undefined);
  const [openBranchUpdateId, setOpenBranchUpdateId] = useState<{
    branchId: number | undefined;
    customerId: number | undefined;
  }>({ branchId: undefined, customerId: undefined });

  const [customerList, setCustomerList] = useState<ITCustomer[]>([]);
  const [customerDetailSubList, setCustomerDetailSubList] = useState<ITCustomerDetailSubDetail[]>([]);
  const [customerProductsByCustomerGroup, setCustomerProductsByCustomerGroup] =
    useState<ITCustomerProduct[]>([]);
  const [customerProductsByCustomer, setCustomerProductsByCustomer] = useState<
    ITCustomerProduct[]
  >([]);
  const [customerProductsByBranch, setCustomerProductsByBranch] = useState<
    ITCustomerProduct[]
  >([]);
  const [projectDatas, setProjectDatas] = useState<ITProject[]>([]);
  const [customerTypeGroup, setCustomerTypeGroup] = useState<ITConfigData[]>(
    []
  );
  const [customerResponsibles, setCustomerResponsibles] = useState<
    ITSelectUsers[]
  >([]);
  const [customerTypes, setCustomerTypes] = useState<ITConfigData[]>([]);
  useEffect(() => {
    // fetchData();
    fetchConfigs();
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [activeTabsKey, customerGroupId]);
  useEffect(() => {
    fetchDataOnSearch();
  }, [allSearch]);
  const fetchData = async () => {
    setloading(true);
    const data = await customerGroupServices.findDetailsById(
      Number(customerGroupId)
    );
    if (data) {
      setDetails(data);
    }
    if (activeTabsKey === "customers") {
      await fetchDataCustomers();
    } else if (activeTabsKey === "products") {
      await fetchDataProductsByCustomerGroup();
    }
    setloading(false);
  };
  const fetchDataOnSearch = async () => {
    setloading(true);
    if (activeTabsKey === "customers") {
      await fetchDataCustomers();
    } else if (activeTabsKey === "products") {
      await fetchDataProductsByCustomerGroup();
    }
    setloading(false);
  };
  const fetchConfigs = async () => {
    const group = await customerServices.findConfigCustomerTypeGroup();
    setCustomerTypeGroup(group); 
    if (user?.userId) {
    
      const responsibles = await userServices.findUsersFormSaleProjectModuleByUserId(
        user?.userId
      );
      if (responsibles && responsibles.length > 0) {
        setCustomerResponsibles(responsibles);
      }
    }

    const types = await customerServices.findConfigCustomerType();
    setCustomerTypes(types);
  };
  const fetchDataCustomers = async () => {
    setloading(true);
    const res = await customerServices.findCustomerListByCustomerGroup(
      Number(customerGroupId),
      {
        ...allSearch,
        userid: user?.userId ? user?.userId : null,
      }
    );
    if (res.data) {
      setCustomerList(res.data);
    }
    setloading(false);
  };
  const fetchDataProductsByCustomerGroup = async () => {
    const data = await customerProductServices.findManyByCustomerGroup(
      Number(customerGroupId),
      allSearch
    );
    if (data) {
      setCustomerProductsByCustomerGroup(data);
    } else {
      setCustomerProductsByCustomerGroup([]);
    }
  };
  const onOpenCustomerCreateForm = async (state: boolean) => {
    setOpenCustomerCreate(state);
  };
  const onChangeTabs = async (key: string) => {
    setActiveTabKey(key);
  };
  const getCustomerProductsByCustomer = async (
    customerId: number,
    search: any
  ) => {
    const products = await customerProductServices.findManyByCustomer(
      customerId,
      allSearch
    );
    if (products) {
      setCustomerProductsByCustomer(products);
    } else {
      setCustomerProductsByCustomer([]);
    }
  };
  const getCustomerProductsByBranch = async (
    bracnchId: number,
    search: any
  ) => {
    const products = await customerProductServices.findManyByBranch(
      bracnchId,
      allSearch
    );

    if (products) {
      setCustomerProductsByBranch(products);
    } else {
      setCustomerProductsByBranch([]);
    }
  };
  const getCustomerBrachList = async (customerId: number) => {
    setloading(true);
    const customerDetailSubs = await customerBranchServices.findManyByCustomerId(
      customerId,
      allSearch
    );
    setCustomerDetailSubList(customerDetailSubs);
    setloading(false);
  };

  async function getProjectDataTable(
    productId: string,
    parentId: string,
    type: string,
    search: any
  ) {
    const projects =
      await customerProjectServices.findProjectsByProductIdAndParentId(
        productId,
        parentId,
        type,
        search
      );
    setProjectDatas(projects);
  }
  function onFinishAddCustomer(form: ITCustomerForm): void {
    let createForm = form;
    const customerNameTh =
      form.customerTypeId === "natural"
        ? `${form.details?.firstNameTh} ${form.details?.lastNameTh}`
        : form.details?.customerNameTh;
    const customerNameEn =
      form.customerTypeId === "natural"
        ? `${form.details?.firstNameTh} ${form.details?.lastNameTh}`
        : form.details?.customerNameEn;
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
          customerNameTh: customerNameTh,
          customerNameEn: customerNameEn,
          responsibleId: form.responsibleId,
          responsible: responsibleIded,
        };
      }
    }
    customerServices
      .create(createForm)
      .then((res) => {
        message.success("สร้าง customer สำเร็จ");
        fetchDataCustomers();
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
  }

  function onDeleteCustomer(customerId: number): void {
    Modal.confirm({
      title: "Delete this Customer",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        await customerServices.delete(customerId).then((data) => {
          message.success("ลบสำเร็จ");
        });
        fetchDataCustomers();
      },
    });
  }

  function onOpenCustomerDescription(customerId: number): void {
    const customerSelected = customerList.find((cus) => cus.id === customerId);
    descriptionCustomerForm.setFieldsValue(customerSelected);
    setOpenCustomerUpdateId(customerId);
  }
  async function onCloseUpdateCustomer(): Promise<void> {
    setOpenCustomerUpdateId(undefined);
    descriptionCustomerForm.resetFields();
  }

  async function updateCustomer(data: ITCustomerForm): Promise<void> {
    setloading(true);
    if (!openCustomerUpdateId) {
      return;
    }

    let form = {
      ...data,
      ...(data.registration && { registration: Number(data.registration) }),
      updatedById: user?.userId,
      updatedByName: `${user?.firstNameTh} ${user?.lastNameTh}`,
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
    const customerNameTh =
      form.customerTypeId === "natural"
        ? `${form.details?.firstNameTh} ${form.details?.lastNameTh}`
        : form.details?.customerNameTh;
    const customerNameEn =
      form.customerTypeId === "natural"
        ? `${form.details?.firstNameTh} ${form.details?.lastNameTh}`
        : form.details?.customerNameEn;
    updateForm = {
      ...updateForm,
      responsibleId: form.responsibleId,
      customerNameEn: customerNameEn,
      customerNameTh: customerNameTh,
    };
    await customerServices
      .update(openCustomerUpdateId, updateForm)
      .then(async (res) => {
        message.success("อัพเดท customer สำเร็จ");
        await onCloseUpdateCustomer();
        fetchDataCustomers();
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
        setloading(false);
      });
  }

  function onDeleteBranch(branchId: number, customerId: number): void {
    Modal.confirm({
      title: "Delete this Branch",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        await customerBranchServices.delete(branchId).then((data) => {
          message.success("ลบสำเร็จ");
        });

        getCustomerBrachList(customerId);
      },
    });
  }

  function onOpenEditBranch(branchId: number, customerId: number): void {
    const branchSelected = customerDetailSubList.find((branch) => branch.id === branchId);
    customerBrahEditForm.setFieldsValue({
      ...branchSelected,
      customerId: customerId,
    });
    setOpenBranchUpdateId({ branchId: branchId, customerId: customerId });
  }
  function onCloseUpdateBranch(): void {
    setOpenBranchUpdateId({ branchId: undefined, customerId: undefined });
    customerBrahEditForm.resetFields();
  }
  async function onSaveBranchEdit(form: ITCustomerDetailSubForm): Promise<void> {
    const base = {
      ...form,
      updatedBy: `${user?.firstNameTh} ${user?.lastNameTh}`,
      updatedByID: user?.userId,
      updatedAt: dayjs(),
    };

    await customerBranchServices
      .update(+form.id, base)
      .then(async (res) => {
        await onCloseUpdateBranch();
        if (openBranchUpdateId?.customerId) {
          getCustomerBrachList(openBranchUpdateId.customerId);
        }
        setOpenBranchUpdateId({ branchId: undefined, customerId: undefined });
        customerBrahEditForm.resetFields();
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
        setloading(false);
      });
    setloading(true);
  }

  async function onSaveBranchAddress(
    branchId: number,
    form: ITCustomerDetailSubAddressForm,
    customerId: number
  ): Promise<void> {
    await customerBranchServices
      .createCustomerDetailSubAddress(branchId, form)
      .then((res) => {
        message.success("สร้างผู้ติดต่อสำเร็จ");
        getCustomerBrachList(customerId);
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
  }

  async function onDeleteCustomerBranchAddress(
    branchId: number,
    addressId: number,
    customerId: number
  ): Promise<void> {
    await customerBranchServices
      .deleteCustomerDetailSubAddress(addressId)
      .then((res) => {
        message.success("สร้างผู้ติดต่อสำเร็จ");
        getCustomerBrachList(customerId);
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
  }

  async function onSaveBranchContact(
    branchId: number,
    form: ITCustomerDetailSubContactForm,
    customerId: number
  ): Promise<void> {
    await customerBranchServices
      .createCustomerDetailSubContact(branchId, form)
      .then((res) => {
        message.success("สร้างผู้ติดต่อสำเร็จ");
        getCustomerBrachList(customerId);
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
  }

  async function onDeleteCustomerBranchContact(
    branchId: number,
    contactId: number,
    customerId: number
  ): Promise<void> {
    await customerBranchServices
      .deleteCustomerDetailSubContact(contactId)
      .then((res) => {
        message.success("สร้างผู้ติดต่อสำเร็จ");
        getCustomerBrachList(customerId);
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
  }

  return (
    <Spin spinning={loading}> 
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link href={"/page"}>Home</Link>,
              },
              {
                title: <span>CRM</span>,
              },
              {
                title: (
                  <Link href={"/page/crm/customer-group"}>Customer Group</Link>
                ),
              },
              {
                title: <span>{String(customerGroupId)}</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">
            {details ? details.customerGroupName : ""}
          </div>
        </Col>

        <Col span={24}>
          <div className="grid grid-cols-1 ">
            {details && <CustomerGroupDetails details={details} />}
          </div>
        </Col>
        <Col span={24}>
          <div className="grid grid-cols-1 ">
            <CustomerGroupSearch
              onSearch={(search: object) => {
                setAllSearch(search);
              }}
            />
          </div>
        </Col>
        <Col span={24}>
          <Card styles={{ body: { padding: "5px" } }}>
            <Tabs
              onChange={onChangeTabs}
              accessKey={activeTabsKey}
              items={[
                {
                  key: "products",
                  label: `Customer Group Products`,
                  children: details ? (
                    <CustomerGroupProductList
                      customerGroupId={String(customerGroupId)}
                      customerProductsByCustomerGroup={
                        customerProductsByCustomerGroup
                      }
                      fetchDataProductsByCustomerGroup={
                        fetchDataProductsByCustomerGroup
                      }
                      projectDatas={projectDatas}
                      getProjectDataTable={getProjectDataTable}
                    />
                  ) : (
                    <Card>ไม่พบข้อมูล</Card>
                  ),
                },
                {
                  key: "customers",
                  label: `Customers`,
                  children: details ? (
                    <CustomerGroupCustomerList
                      roles={roles}
                      customerList={customerList}
                      customerProductsByCustomer={customerProductsByCustomer}
                      getCustomerProductsByCustomer={
                        getCustomerProductsByCustomer
                      }
                      customerDetailSubList={customerDetailSubList}
                      customerProductsByBranch={customerProductsByBranch}
                      onOpenCustomerCreateForm={onOpenCustomerCreateForm}
                      getCustomerBrachList={getCustomerBrachList}
                      getCustomerProductsByBranch={getCustomerProductsByBranch}
                      projectDatas={projectDatas}
                      getProjectDataTable={getProjectDataTable}
                      onDeleteCustomer={onDeleteCustomer}
                      onOpenCustomerDescription={onOpenCustomerDescription}
                      onOpenEditBranch={onOpenEditBranch}
                      onDeleteBranch={onDeleteBranch}
                      onSaveBranchAddress={onSaveBranchAddress}
                      onDeleteCustomerBranchAddress={
                        onDeleteCustomerBranchAddress
                      }
                      onSaveBranchContact={onSaveBranchContact}
                      onDeleteCustomerBranchContact={
                        onDeleteCustomerBranchContact
                      }
                    />
                  ) : (
                    <Card>{`ไม่พบข้อมูล`}</Card>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
      {openCustomerCreate && (
        <CustomerCreateForm
          customerTypeGroup={customerTypeGroup}
          customerTypes={customerTypes}
          customerResponsibles={customerResponsibles}
          onFinishAdd={onFinishAddCustomer}
          openCustomerCreate={openCustomerCreate}
          onOpenCustomerCreateForm={onOpenCustomerCreateForm}
        />
      )}
      {openCustomerUpdateId && (
        <CusomterEditForm
          roles={roles}
          customerTypeGroup={customerTypeGroup}
          customerTypes={customerTypes}
          customerResponsibles={customerResponsibles}
          descriptionForm={descriptionCustomerForm}
          openCustomerUpdateId={openCustomerUpdateId}
          onCloseUpdate={onCloseUpdateCustomer}
          onFinishEdit={updateCustomer}
        />
      )}
      {openBranchUpdateId.branchId && (
        <BranchEdit
          openBranchUpdateId={openBranchUpdateId.branchId}
          customerBrahEditForm={customerBrahEditForm}
          onCloseUpdate={onCloseUpdateBranch}
          onSaveBranchEdit={onSaveBranchEdit}
        />
      )}
    </Spin>
  );
}
 
