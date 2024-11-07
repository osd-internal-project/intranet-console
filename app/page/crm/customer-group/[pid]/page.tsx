"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  MenuProps,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  TablePaginationConfig,
  Tabs,
} from "antd";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { checkRule } from "@/app/utils/rules";
import Link from "next/link";
import { useSession } from "next-auth/react";
const { TextArea } = Input;
import {
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CustomerGroupServices from "@/app/services/customer-group.service";

import CustomerServices from "@/app/services/customer.service";
import CustomerBranchServices from "@/app/services/customer-branch.service";
import CustomerProductServices from "@/app/services/customer-product.service";
import CustomerProjectServices from "@/app/services/customer-project.service";
import UserServices from "@/app/services/user.service";

import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import modal from "antd/es/modal";
import {
  ITCustomerGroup,
  ITBranch,
  ITCustomer,
  ITCustomerForm,
  ITSelectUsers,
  ITConfigData,
  ITBranchForm,
  ITBranchDetail,
  ITBranchAddressForm,
  ITBranchContactForm,
} from "@/app/common/customer";
import CustomerGroupDetails from "./components/customer-group-details";
import CustomerGroupCustomerList from "./components/customer-group-customer-list";
import CustomerGroupProductList from "./components/customer-group-product-list";
import CustomerCreateForm from "./components/customer-create-form";
import { ITCustomerProduct } from "@/app/common/product";
import { ITProject } from "@/app/common/project";
import CusomterEditForm from "./components/customer-edit-form";
import BranchEdit from "./components/branch-edit";
const { useForm } = Form;
export default function ProductsAddPage() {
  const { data: session } = useSession();
  const { pid } = useParams();

  const crmAuth = useAxiosCrm();
  const userAuth = useAxiosUser();
  const rules = {
    ruleCustomerShow: checkRule("crm-c-s"),
    ruleCustomerAdd: checkRule("crm-c-a"),
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

  const customerGroupServices = CustomerGroupServices(crmAuth);
  const userServices = UserServices(userAuth);
  const customerServices = CustomerServices(crmAuth);
  const customerBranchServices = CustomerBranchServices(crmAuth);
  const customerProductServices = CustomerProductServices(crmAuth);
  const customerProjectServices = CustomerProjectServices(crmAuth);
  const customerGroupId = String(pid);
  const router = useRouter();
  const [descriptionCustomerForm] = useForm();
  const [customerBrahEditForm] = useForm();
  const [details, setDetails] = useState<ITCustomerGroup>();

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
  const [branchList, setBranchList] = useState<ITBranchDetail[]>([]);
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
    fetchData();
    fetchConfigs();
  }, []);
  useEffect(() => {
    fetchData();
  }, [activeTabsKey, customerGroupId]);

  const fetchData = async () => {
    setloading(true);
    console.log(1);
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
  const fetchConfigs = async () => {
    const group = await customerServices.findConfigCustomerTypeGroup();
    setCustomerTypeGroup(group);
    if (session?.user.userId) {
      const responsibles = await userServices.findSaleUserBySalePermission(
        session?.user.userId
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
      { userid: session?.user.userId ? session.user.userId : null }
    );
    if (res) {
      setCustomerList(res.data);
    }
    setloading(false);
  };
  const fetchDataProductsByCustomerGroup = async () => {
    const data = await customerProductServices.findManyByCustomerGroup(
      Number(customerGroupId),
      {}
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
      search
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
      search
    );

    if (products) {
      console.log(products);
      setCustomerProductsByBranch(products);
    } else {
      setCustomerProductsByBranch([]);
    }
  };
  const getCustomerBrachList = async (customerId: number) => {
    setloading(true);
    const branchs = await customerBranchServices.findManyByCustomerId(
      customerId,
      {}
    );
    setBranchList(branchs);
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
    const branchSelected = branchList.find((branch) => branch.id === branchId);
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
  async function onSaveBranchEdit(form: ITBranchForm): Promise<void> {
    const base = {
      ...form,
      updatedBy: `${session?.user.firstNameTh} ${session?.user.lastNameTh}`,
      updatedByID: session?.user.userId,
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
    form: ITBranchAddressForm,
    customerId: number
  ): Promise<void> {
    await customerBranchServices
      .createBranchAddress(branchId, form)
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
      .deleteBranchAddress(addressId)
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
    form: ITBranchContactForm,
    customerId: number
  ): Promise<void> {
    await customerBranchServices
      .createBranchContact(branchId, form)
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
      .deleteBranchContact(contactId)
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
                      rules={rules}
                      customerList={customerList}
                      customerProductsByCustomer={customerProductsByCustomer}
                      getCustomerProductsByCustomer={
                        getCustomerProductsByCustomer
                      }
                      branchList={branchList}
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
                    <Card>ไม่พบข้อมูล</Card>
                  ),
                  // icon: <Icon />,
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
          rules={rules}
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
