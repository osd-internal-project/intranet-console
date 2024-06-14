"use client";
import React, { useEffect, useState } from "react";
import UserGroupServices from "../services/usergroup.service";
import { Card, Tabs, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import Title from "antd/es/skeleton/Title";

import "../style.css";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { icons } from "antd/es/image/PreviewGroup";
import { CarryOutOutlined, PlusOutlined } from "@ant-design/icons";

type TabType = {
  label: string;
  key: string;
};

type TOrganizeDto = {
  id: number;
  organizedId: string;
  organizedName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
export interface props {
  propDataTree: (res: { selectOrganize: string | null; groupSelect: string | null; loading: boolean }) => void;
  loading: boolean;
  selectOrganize: string | null;
}
const GroupTree: React.FC<props> = ({ propDataTree, loading, selectOrganize }): React.ReactElement => {
  const userAuth = useAxiosUser();
  const userGroupServices = UserGroupServices(userAuth);
  const [treeList, setTreeList] = useState<any[] | null>(null);
  const [tabList, setTabList] = useState<TabType[]>([]);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [tabsKey, setTabsKey] = useState<string>("0");

  useEffect(() => {
    featchData();
  }, []);

  useEffect(() => {
    if (featchGroup && selectOrganize) {
      setTreeList(null);
      featchGroup(selectOrganize);
    }
  }, [loading]);

  const featchGroup = async (organize: string) => {
    const group = await userGroupServices.getUserGroupByOrganizedGroupId(organize);
    const tree = createTree(group.organizeMapGroup, null);
    setTreeList(tree);
    propDataTree({ selectOrganize: organize, groupSelect: null, loading: false });
  };

  const featchData = async () => {
    const resOrganize = await userGroupServices.findAllOrganize();
    const orgList = resOrganize.map((item: TOrganizeDto) => ({ key: item.organizedId, label: item.organizedName }));
    setTabList([...orgList]);
    propDataTree({ selectOrganize: selectOrganize, groupSelect: null, loading: false });
  };

  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.group.parentGroupId === parentId) {
        const children = createTree(obj, item.group.groupId);
        if (children.length > 0) {
          (item.group.icon = <CarryOutOutlined />), (item.group.children = children);
        }
        tree.push({
          key: item.group.groupId,
          title: item.group.groupName,
          children: item.group.children,
        });
      }
    });
    return tree;
  };

  const onChangTapOrganize = (value: any) => {
    setTabsKey(value);
    propDataTree({ selectOrganize: value, groupSelect: null, loading: true });
  };

  const onSelectTree = (value: any) => {
    propDataTree({ selectOrganize: selectOrganize, groupSelect: value[0], loading: false });
  };

  const changeParent = (value: any) => {
    setTabsKey(value);
    setSelectedTab(value);
    propDataTree({ selectOrganize: selectOrganize, groupSelect: null, loading: true });
  };

  return (
    <Card className="mx-2 my-2 md:my-0" style={{ minHeight: " 500px" }}>
      <div className=" grid-cols-1 gap-0 ">
        <div className="flex flex-row">
          <Tabs tabPosition="left" activeKey={tabsKey} items={tabList} onChange={onChangTapOrganize} />
          <div className="basis-5/5">
            {treeList ? (
              <Tree
                showIcon={true}
                treeData={treeList}
                defaultExpandAll={true}
                onSelect={onSelectTree}
                rootStyle={{ fontSize: 14 }}
                blockNode
                showLine
              />
            ) : (
              ``
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupTree;
