"use client";
import { Breadcrumb, Col, Divider, Form, Row } from "antd";
import UserTable from "./components/users-table";
import { useEffect, useState } from "react";
import { ITypeOption, TManageUserPageDto, TGroupId24, TOrganizeAllDto } from "./common";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UsersServices } from "@/app/services/users.service";
import { MasterPositionServices } from "@/app/services/master-position.service";
import { UserAction } from "./components/user-action";
import dayjs from "dayjs";
import { DataNode } from "antd/es/tree";
import { groupWithSubGroupsToGroupTree } from "./components/group-tree-mapper";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import UserGroupServices from "../../../services/usergroup.service";
import OrganizeServices from "@/app/services/organize-chart.service";
import { CarryOutOutlined } from "@ant-design/icons";
import { TfindAllOrganizeDto } from "../../setting/organize-chart/common";

export type Group = {
  name: string;
  description: string;
  notes: string;
  createdAt?: dayjs.Dayjs;
  updatedAt?: dayjs.Dayjs;
};

export type GroupWithId = Group & { id: string };
export type GroupWithSubgroups = GroupWithId & {
  subGroups: GroupWithSubgroups[];
};

export type GroupDetailData = {
  loading: boolean;
  group: GroupWithSubgroups;
};

type TabType = {
  label: string;
  key: string;
};

export default function UsermanagementPage() {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const baseUrlIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [positionOption, setPositionOption] = useState<ITypeOption[]>([]);
  const [filterForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [selectUserType, setSelectUserType] = useState<"ldap" | "local">("local");
  const [managePage, setManagePage] = useState<TManageUserPageDto>({
    loading: true,
    pagination: { current: 1, pageSize: 10 },
    search: {},
    dataUsers: { data: [], total: 0 },
    modalStatus: false,
    modalTitle: "create",
  });
  const [optionsOrganize, setOptionsOrganize] = useState<TabType[]>([]);
  const [groupDetailData, setGroupDetailData] = useState<GroupDetailData>({
    loading: true,
    group: {
      name: "Loading...",
      description: "",
      notes: "",
      subGroups: [{ name: "subGroup", id: "234", description: "", notes: "", subGroups: [] }],
      id: "123",
    },
  });
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [treeListDepartment, setTreeListDepartment] = useState<any[] | null>(null);

  useEffect(() => {
    if (managePage.loading) {
      featchData();
      loaddata();
    }
  }, [managePage.loading]);

  const loaddata = async () => {
    const resOrganize = await OrganizeServices(baseUrlIntranet).getOrganizeByType("department");
    const tree = createTreeDepartMent(resOrganize, null);
    setTreeListDepartment(tree);
  };

  const featchData = async () => {
    const skip = (Number(managePage.pagination.current) - 1) * Number(managePage.pagination.pageSize);
    const take = Number(managePage.pagination.pageSize);
    const resultUsers = await UsersServices(baseUrlUser).findAllUser({ ...managePage.search, skip: skip, take: take });
    const resultMasterPosition = await MasterPositionServices(baseUrlUser).findAllPosition();
    const groupResponse = await UsersServices(baseUrlUser).findGroupsId24();
    const resOrganize = await UserGroupServices(baseUrlUser).findAllOrganize();
    const orgList = resOrganize.map((item: TOrganizeAllDto) => ({ value: item.organizedId, label: item.organizedName }));

    const positionOption: ITypeOption[] = resultMasterPosition.map((d: any) => ({
      label: d.nameTh,
      value: d.id,
    }));
    setPositionOption(positionOption);
    setGroupDetailData({
      loading: false,
      group: groupResponse,
    });
    setOptionsOrganize([...orgList]);
    setTreeData([groupWithSubGroupsToGroupTree(groupResponse)]);
    setManagePage({ ...managePage, loading: false, dataUsers: resultUsers });
  };

  const createTreeDepartMent = (obj: TfindAllOrganizeDto[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item: TfindAllOrganizeDto) => {
      if (item.parentPositionId === parentId) {
        const children = createTreeDepartMent(obj, item.positionId);
        if (children.length > 0) {
          (item.icon = <CarryOutOutlined />), (item.children = children);
        }
        tree.push({
          value: item.positionId,
          title: item.positionName,
          children: item.children,
        });
      }
    });
    return tree;
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              title: <span>User Management</span>,
            },
            {
              title: <span>Users</span>,
            },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Users`}</div>
      </Divider>
      <Col span={24}>
        <UserAction
          setManagePage={setManagePage}
          managePage={managePage}
          positionOption={positionOption}
          treeData={treeData}
          optionsOrganize={optionsOrganize}
          treeListDepartment={treeListDepartment}
          filterForm={filterForm}
          createForm={createForm}
          setSelectUserType={setSelectUserType}
          selectUserType={selectUserType}
        />
        <UserTable
          setManagePage={setManagePage}
          managePage={managePage}
          filterForm={filterForm}
          createForm={createForm}
          setSelectUserType={setSelectUserType}
          selectUserType={selectUserType}
        />
      </Col>
    </Row>
  );
}
