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
export interface props {
  propDataTree: (res: { groupSelect: string | null; loading: boolean }) => void;
  loading: boolean;
}
const GroupTree: React.FC<props> = ({ propDataTree, loading }): React.ReactElement => {
  const userAuth = useAxiosUser();
  const userGroupServices = UserGroupServices(userAuth);

  const [treeList, setTreeList] = useState<any[] | null>(null);
  const [tabList, setTabList] = useState<TabType[]>([]);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [tabsKey, setTabsKey] = useState<string>("0");

  useEffect(() => {
    if (loading === true) {
      setTreeList(null);
      loaddata();
    }
  }, [loading]);

  const loaddata = async () => {
    const group = await userGroupServices.getUserGroupAll();
    const tree = createTree(group, null);
    setTreeList(tree);
    propDataTree({ groupSelect: null, loading: false });
  };

  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.parentGroupId === parentId) {
        const children = createTree(obj, item.groupId);
        if (children.length > 0) {
          (item.icon = <CarryOutOutlined />), (item.children = children);
        }
        tree.push({
          key: item.groupId,
          title: item.groupName,
          children: item.children,
        });
      }
    });
    return tree;
  };

  const onSelectTree = (value: any) => {
    propDataTree({ groupSelect: value[0], loading: false });
  };
  const changeParent = (value: any) => {
    setTabsKey(value);
    setSelectedTab(value);
    propDataTree({ groupSelect: null, loading: true });
  };
  return (
    <Card className="mx-2 my-2 md:my-0" style={{ minHeight: " 500px" }}>
      <div className=" grid-cols-1 gap-0 ">
        <div className="flex flex-row">
          {/* <div className="basis-1/5   " style={{ minHeight: " 400px", borderRight: "1px solid #E5E7EB" }}>
            <div className=" mb-5">
              <div className=" text-2xl  font-semibold ">Organize Name</div>
            </div>
            <Tabs tabPosition="left" activeKey={tabsKey} items={tabList} onChange={changeParent} className="user-group-tabs" />
          </div> */}
          <div className="basis-5/5">
            <div className=" mb-10">
              <div className=" text-2xl  font-semibold h-full">{` `}</div>
            </div>
            {treeList ? <Tree showIcon={true} treeData={treeList} defaultExpandAll={true} onSelect={onSelectTree} rootStyle={{ fontSize: 14 }} blockNode showLine /> : ``}
          </div>

          {/* <Tree showLine treeData={treeData} defaultExpandAll={true} /> */}
        </div>
      </div>
    </Card>
  );
};

export default GroupTree;
