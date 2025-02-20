"use client";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Card, Col, message, Row, SelectProps } from "antd";
import {
  ITCustomerDetailSubForSelect,
  ITCustomerForSelect,
  ITProjectCreateForm,
  ITSelectUsers,
  ITContractCompany,
} from "@/app/common/project";
import { useAxiosCrm, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import ProjectServices from "@/app/services/customer-project.service";
import ProductsServices from "@/app/services/customer-product.service";
import CustomerGroupServices from "@/app/services/customer-group.service";
import UserServices from "@/app/services/user.service";
import UserGroupServices from "@/app/services/usergroup.service";
import CreateCustomerForm from "./components/create-form";
import { CarryOutOutlined } from "@ant-design/icons";
import { ITCustomerSub } from "@/app/common/ticket";
import { ITCustomerProduct } from "@/app/common/product";
import {
  ITCustomerDetailSubDetail,
  ITCustomerGroup,
} from "@/app/common/customer";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
  const router = useRouter();
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlCrm = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_CRM);
  const projectServices = ProjectServices(baseUrlCrm);
  const productsServices = ProductsServices(baseUrlCrm);
  const customerGroupServices = CustomerGroupServices(baseUrlCrm);
  const userServices = UserServices(baseUrlUser);
  const userGroupServices = UserGroupServices(baseUrlUser);
  const [loading, setloading] = useState<boolean>(true);
  const [customerGroupList, setCustomerGroupList] = useState<ITCustomerGroup[]>(
    []
  );
  const [customerList, setCustomerList] = useState<ITCustomerForSelect[]>([]);
  const [customerSubList, setCustomerSubList] = useState<
    ITCustomerDetailSubDetail[]
  >([]);
  const [engineerList, setEngineerList] = useState<ITSelectUsers[]>([]);
  const [saleList, setSaleList] = useState<{ uid: string; name: string }[]>([]);
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

    const users = await userServices.findUsersFormEngineerProjectModule();
    // selectOrganize(user?.userId);
    setEngineerList(users);
    const productOptions = await productsServices.findProductOptions();
    setProductOptions(productOptions);
    const data = await customerGroupServices.findMany();
    setCustomerGroupList(data);
    setloading(false);
  };
  // const selectOrganize = async (userId: string) => {
  //   const groups = await userGroupServices.getUserGroupFormOrganizedByUserId(userId);
  //   const tree = createTree(groups.organizeMapGroup, null);
  //   setGroupOption(tree);
  // };
  // const createTree = (obj: any[], parentId: string | null) => {
  //   const tree: any[] = [];
  //   obj.forEach((item) => {
  //     if (item.group.parentGroupId === parentId) {
  //       const children = createTree(obj, item.group.groupId);
  //       if (children.length > 0) {
  //         (item.group.icon = <CarryOutOutlined />),
  //           (item.group.children = children);
  //       }
  //       tree.push({
  //         value: item.group.groupId,
  //         title: item.group.groupName,
  //         children: item.group.children,
  //       });
  //     }
  //   });
  //   return tree;
  // };

  async function onFinishAdd(form: ITProjectCreateForm): Promise<void> {
    console.log(form.productDetails);

    const productDetails = form?.productDetails
      ? form?.productDetails.map((data) => ({
          customerProductId: data.id,
          details: data.value,
        }))
      : [];
    delete form["productDetails"];
    let data = {
      ...form,
    };
    if (form.projectManagerId) {
      const user = engineerList.findLast(
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
      const user = engineerList.findLast(
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
      const user = saleList.findLast((user) => user.uid === form.saleId);
      if (user) {
        data = {
          ...data,
          saleName: `${user.name}`,
        };
      }
    }
    // delete data["productDetails"];
    // delete data["customerGroupId"];
    delete data["customerId"];

    await projectServices
      .createProject(data, productDetails)
      .then(() => {
        message.success("สร้าง Project สำเร็จ");
        router.push('/page/crm/project')
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
      // const customer = customerList.findLast((customer) => customer.id === id);
      // if (customer?.responsible) {
      //   setSaleList(customer.responsible);
      // }
    } else {
      setCustomerSubList([]);
    }
  }
  async function changeCustomerSelect(id: number): Promise<void> {
    if (id) {
      const data = await projectServices.findCustomerSubSelectByCustomerId(id);
      setCustomerSubList(data);
      const customer = customerList.findLast((customer) => customer.id === id);
      if (customer?.responsible) {
        setSaleList(customer.responsible);
      }
    } else {
      setCustomerSubList([]);
    }
  }
  async function changeCustomerSubSelect(id: number): Promise<void> {
    // if (id) {
    //   const data = await projectServices.findCustomerSubSelectByCustomerSubId(id);
    //   setCustomerSubList(data);
    // } else {
    //   setCustomerSubList([]);
    // }
  }
  async function onChangeGroupSelect(value: string[]): Promise<void> {
    const data = await userGroupServices.findUsersLowerByOwnerGroup(value);
    setUsersFormGroup(data);
  }

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
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
                onFinishAdd={onFinishAdd}
                changeCustomerGroupSelect={changeCustomerGroupSelect}
                changeCustomerSelect={changeCustomerSelect}
                changeCustomerSubSelect={changeCustomerSubSelect}
                engineerList={engineerList}
                saleList={saleList}
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
