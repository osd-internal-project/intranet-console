"use client";
// import "../style.css";
import React, { useEffect, useState } from "react";
import UserGroupServices from "../../../../services/usergroup.service";
import { Card, Tabs, Tree } from "antd";

import { CarryOutOutlined } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

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
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const [treeList, setTreeList] = useState<any[] | null>(null);
  const [tabList, setTabList] = useState<TabType[]>([]);
  const [tabsKey, setTabsKey] = useState<string>("0");

  useEffect(() => {
    if (loading) {
      featchDataTree(tabsKey);
      featchData();
    }
  }, [loading]);

  const featchData = async () => {
    const resOrganize = await UserGroupServices(baseUrlUser).findAllOrganize();
    const orgList = resOrganize.map((item: TOrganizeDto) => ({
      key: item.organizedId,
      label: item.organizedName,
    }));
    setTabList([...orgList]);
    propDataTree({
      selectOrganize: selectOrganize,
      groupSelect: null,
      loading: false,
    });
  };

  const featchDataTree = async (organize: string) => {
    const groups = await UserGroupServices(baseUrlUser).getUserGroupAll();
    const tree = createTree(groups, null);
    setTreeList(tree);
    propDataTree({
      selectOrganize: organize,
      groupSelect: null,
      loading: false,
    });
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

  const onChangTapOrganize = async (organize: any) => {
    console.log(organize);
    setTabsKey(organize);
    featchDataTree(organize);
  };

  const onSelectTree = (value: any) => {
    propDataTree({
      selectOrganize: selectOrganize,
      groupSelect: value[0],
      loading: false,
    });
  };

  return (
    <Card className="mx-2 my-2 md:my-0" style={{ minHeight: " 500px" }}>
      <div className=" grid-cols-1 gap-0 ">
        <div className="flex flex-row">
          <Tabs tabPosition="left" activeKey={tabsKey} items={tabList} onChange={onChangTapOrganize} />
          {selectOrganize ? (
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
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default GroupTree;
