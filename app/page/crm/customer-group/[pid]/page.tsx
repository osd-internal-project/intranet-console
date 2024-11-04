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
import { useAxiosCrm } from "@/app/lib/axios/hooks/userAxiosAuth";
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
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import modal from "antd/es/modal";
import {
  ITCustomerGroup,
  ITBranch,
  ITCustomer,
  ITCustomerForm,
} from "@/app/common/customer";
import CustomerGroupDetails from "./components/customer-group-details";
import CustomerGroupCustomerList from "./components/customer-group-customer-list";
import CustomerGroupProductList from "./components/customer-group-product-list";
import CustomerCreateForm from "./components/customer-create-form";
import { ITCustomerProduct } from "@/app/common/product";
import { ITProject } from "@/app/common/project";
const { useForm } = Form;
export default function ProductsAddPage() {
  const { data: session } = useSession();
  const { pid } = useParams();
  const crmAuth = useAxiosCrm();
  const customerGroupServices = CustomerGroupServices(crmAuth);
  const customerServices = CustomerServices(crmAuth);
  const customerBranchServices = CustomerBranchServices(crmAuth);
  const customerProductServices = CustomerProductServices(crmAuth);
  const customerProjectServices = CustomerProjectServices(crmAuth);
  const customerGroupId = String(pid);
  const router = useRouter();

  const [details, setDetails] = useState<ITCustomerGroup>();

  const [loading, setloading] = useState<boolean>(true);
  const [activeTabsKey, setActiveTabKey] = useState<string>("products");
  const [openCustomerCreate, setOpenCustomerCreate] = useState<boolean>(false);
  const [customerList, setCustomerList] = useState<ITCustomer[]>([]);
  const [branchList, setBranchList] = useState<ITBranch[]>([]);
  const [customerProductsByCustomerGroup, setCustomerProductsByCustomerGroup] =
    useState<ITCustomerProduct[]>([]);
  const [customerProductsByCustomer, setCustomerProductsByCustomer] = useState<
    ITCustomerProduct[]
  >([]);
  const [customerProductsByBranch, setCustomerProductsByBranch] = useState<
    ITCustomerProduct[]
  >([]);
  const [projectDatas, setProjectDatas] = useState<ITProject[]>([]);
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
  const fetchDataCustomers = async () => {
    const res = await customerServices.findCustomerListByCustomerGroup(
      Number(customerGroupId),
      { userid: session?.user.userId ? session.user.userId : null }
    );
    if (res) {
      setCustomerList(res.data);
    }
  };
  const fetchDataProductsByCustomerGroup = async () => {
    const data = await customerProductServices.findManyByCustomerGroup(
      Number(customerGroupId)
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
  const getCustomerProductsByCustomer = async (customerId: number) => {
    const products = await customerProductServices.findManyByCustomer(
      customerId
    );
    if (products) {
      setCustomerProductsByCustomer(products);
    } else {
      setCustomerProductsByCustomer([]);
    }
  };
  const getCustomerProductsByBranch = async (bracnchId: number) => {
    const products = await customerProductServices.findManyByBranch(bracnchId);
    console.log(products);
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

  async function getProductDataTable(
    productId: string,
    parentId: string,
    type: string
  ) {
    const projects =
      await customerProjectServices.findProjectsByProductIdAndParentId(
        productId,
        parentId,
        type
      );
    setProjectDatas(projects);
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
                  label: `Products`,
                  children: details ? (
                    <CustomerGroupProductList
                      customerGroupId={String(customerGroupId)}
                      customerProductsByCustomerGroup={
                        customerProductsByCustomerGroup
                      }
                      projectDatas={projectDatas}
                      getProductDataTable={getProductDataTable}
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
                      customerList={customerList}
                      customerProductsByCustomer={customerProductsByCustomer}
                      branchList={branchList}
                      customerProductsByBranch={customerProductsByBranch}
                      onOpenCustomerCreateForm={onOpenCustomerCreateForm}
                      getCustomerProductsByCustomer={
                        getCustomerProductsByCustomer
                      }
                      getCustomerBrachList={getCustomerBrachList}
                      getCustomerProductsByBranch={getCustomerProductsByBranch}
                      projectDatas={projectDatas}
                      getProductDataTable={getProductDataTable}
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
          customerTypeGroup={[]}
          customerTypes={[]}
          customerResponsibles={[]}
          onFinishAdd={function (form: ITCustomerForm): void {
            throw new Error("Function not implemented.");
          }}
          openCustomerCreate={openCustomerCreate}
          onOpenCustomerCreateForm={onOpenCustomerCreateForm}
        />
      )}
    </Spin>
  );
}
