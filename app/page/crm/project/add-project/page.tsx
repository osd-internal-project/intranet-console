"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  message,
  Row,
  SelectProps,
  Spin,
} from "antd";
import {
  ITBranchForSelect,
  ITCustomerForSelect,
  ITProject,
  ITProjectCreateForm,
  ITSelectUsers,
  ITContractCompany,
} from "../common";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import ProjectServices from "../services/index.service";
import ProductsServices from "@/app/services/customer-product.service";
import CustomerGroupServices from "@/app/services/customer-group.service";
import CrmCustomerServices from "../../customer/services/index.service";
import UserServices from "../services/user.service";
import { checkRule } from "@/app/utils/rules";
import CreateCustomerForm from "./components/create-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CarryOutOutlined } from "@ant-design/icons";
import { ITBranch, ITBranchDetail } from "../../customer/common";
import { ITCustomerSub } from "../../ticket/common";
import { ITCustomerProduct } from "@/app/common/product";
import { ITCustomerGroup } from "@/app/common/customer";

export default function AddProjectPage() {
  const { data: session } = useSession();
  const crmAuth = useAxiosCrm();
  const userAuth = useAxiosUser();
  const projectServices = ProjectServices(crmAuth);
  const productsServices = ProductsServices(crmAuth);
  const customerGroupServices = CustomerGroupServices(crmAuth);
  const userServices = UserServices(userAuth);
  const rounter = useRouter();
  const [loading, setloading] = useState<boolean>(true);
  const [customerGroupList, setCustomerGroupList] = useState<ITCustomerGroup[]>(
    []
  );
  const [customerList, setCustomerList] = useState<ITCustomerForSelect[]>([]);
  const [branchList, setBranchList] = useState<ITBranchForSelect[]>([]);
  const [customerSubList, setCustomerSubList] = useState<ITCustomerSub[]>([]);
  const [userList, setUserList] = useState<ITSelectUsers[]>([]);
  const [saleList, setSaleList] = useState<{ uid: string; name: string }[]>([]);
  const [groupOption, setGroupOption] = useState<SelectProps["options"]>([]);
  const [usersFormGroup, setUsersFormGroup] = useState<ITSelectUsers[]>([]);
  const [cntractCompany, setContractCompany] = useState<ITContractCompany[]>(
    []
  );
  const [productOptions, setProductOptions] = useState<ITCustomerProduct[]>([]);
  useEffect(() => {
    if (loading === true) fetchData();
  }, [loading]);
  const fetchData = async () => {
    const resContractCompany = await projectServices.findContractCompany();
    setContractCompany(resContractCompany);
    if (session?.user.userId) {
      const users = await userServices.findOrganizeUserByUserId(
        session?.user.userId
      );
      selectOrganize(session?.user.userId);
      setUserList(users);
    }
    const productOptions = await productsServices.findProductOptions();
    setProductOptions(productOptions);
    const data = await customerGroupServices.findMany();
    setCustomerGroupList(data);
    setloading(false);
  };
  const selectOrganize = async (userId: string) => {
    const groups = await userServices.getUserGroupFormOrganizedByUserId(userId);
    const tree = createTree(groups.organizeMapGroup, null);
    setGroupOption(tree);
  };
  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.group.parentGroupId === parentId) {
        const children = createTree(obj, item.group.groupId);
        if (children.length > 0) {
          (item.group.icon = <CarryOutOutlined />),
            (item.group.children = children);
        }
        tree.push({
          value: item.group.groupId,
          title: item.group.groupName,
          children: item.group.children,
        });
      }
    });
    return tree;
  };

  async function onFinishAdd(form: ITProjectCreateForm): Promise<void> {
    console.log(form.productDetails);
    let data = {
      ...form,
      ...(form?.productDetails && {
        customerProjectProductMap: {
          createMany: {
            data: form.productDetails.map((data) => ({
              customerProductId: data.id,
              details: data.value,
            })),
          },
        },
      }),
    };
    if (form.projectManagerId) {
      const user = userList.findLast(
        (user) => user.userId === form.projectManagerId
      );

      if (user) {
        data = {
          ...data,
          projectManagerName: `${user.firstNameTh} ${user.lastNameTh}`,
        };
      }
    }
    if (form.saleManagerId) {
      const user = userList.findLast(
        (user) => user.userId === form.saleManagerId
      );
      if (user) {
        data = {
          ...data,
          saleManagerName: `${user.firstNameTh} ${user.lastNameTh}`,
        };
      }
    }
    if (form.saleId) {
      const user = userList.findLast((user) => user.userId === form.saleId);
      if (user) {
        data = {
          ...data,
          saleName: `${user.firstNameTh} ${user.lastNameTh}`,
        };
      }
    }
    delete data["productDetails"];
    delete data["customerGroupId"];
    delete data["customerId"];
    delete data["customerDetailSubId"];

    await projectServices
      .createProject(data)
      .then((data) => {
        message.success("สร้าง Project สำเร็จ");
        // rounter.push("/page/crm/project");
      })
      .catch(() => {
        message.error("ผิดพลาด กรุณาลองใหม่");
      });
    console.log(data);
  }
  async function changeCustomerGroupSelect(id: number): Promise<void> {
    if (id) {
      const data = await projectServices.findCustomerSelectByCustomerGroupId(
        id
      );
      setCustomerList(data);
      const customer = customerList.findLast((customer) => customer.id === id);
      if (customer?.responsible) {
        setSaleList(customer.responsible);
      }
    } else {
      setCustomerSubList([]);
    }
  }
  async function changeCustomerSelect(id: number): Promise<void> {
    if (id) {
      const data = await projectServices.findBranchSelectByCustomerId(id);
      setBranchList(data);
      const customer = customerList.findLast((customer) => customer.id === id);
      if (customer?.responsible) {
        setSaleList(customer.responsible);
      }
    } else {
      setCustomerSubList([]);
    }
  }
  async function changeCustomerSubSelect(id: number): Promise<void> {
    if (id) {
      const data = await projectServices.findBranchSelectByCustomerSubId(id);
      setBranchList(data);
      const customer = customerList.findLast((customer) => customer.id === id);
      // if (customer?.responsible) {
      //   setSaleList(customer.responsible);
      // }
    } else {
      setBranchList([]);
    }
  }
  async function onChangeGroupSelect(value: string[]): Promise<void> {
    const data = await userServices.findUsersByOwnerGroup(value);
    setUsersFormGroup(data);
  }

  function selectRelateUsers(value: string[]): void {
    throw new Error("Function not implemented.");
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
                customerGroupList={customerGroupList}
                customerList={customerList}
                customerSubList={customerSubList}
                branchList={branchList}
                onFinishAdd={onFinishAdd}
                changeCustomerGroupSelect={changeCustomerGroupSelect}
                changeCustomerSelect={changeCustomerSelect}
                changeCustomerSubSelect={changeCustomerSubSelect}
                userList={userList}
                saleList={saleList}
                groupOption={groupOption}
                onChangeGroupSelect={onChangeGroupSelect}
                usersFormGroup={usersFormGroup}
                cntractCompany={cntractCompany}
                productOptions={productOptions}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
