"use client";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Breadcrumb, Card, Col, Row, Tabs, TreeDataNode } from "antd";
import React, { useEffect, useState } from "react";
import UserGroupServices from "../../../users-management/user-group/services/usergroup.service";
import { CarryOutOutlined } from "@ant-design/icons";
import { Tree, TreeNode } from "react-organizational-chart";
import HumanTiles from "./organizationTiles";
import OrganizeServices from "../../../setting/organize-chart/services/organize-chart.service";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

type TOrganizeDto = {
  id: number;
  positionId: string;
  description: string;
  positionName: string;
  parentPositionId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  icon?: any;
  children?: any;
};

type TTreeData = {
  key: string;
  title: string;
  children: any;
};

export default function Organizational() {
  const userAuth = useAxiosUser();
  const intranetAuth = useAxiosIntranet();
  const userGroupServices = UserGroupServices(userAuth);
  const organizeServices = OrganizeServices(intranetAuth);
  const [treeList, setTreeList] = useState<TTreeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loaddata();
  }, []);

  const loaddata = async () => {
    const resOrganize = await organizeServices.getOrganizeByType("department");
    const tree = createTree(resOrganize, null);
    setTreeList(tree);
    setLoading(false);
  };

  const createTree = (obj: TOrganizeDto[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.parentPositionId === parentId) {
        const children = createTree(obj, item.positionId);
        if (children.length > 0) {
          (item.icon = <CarryOutOutlined />), (item.children = children);
        }
        tree.push({
          key: item.positionId,
          title: item.positionName,
          children: item.children,
        });
      }
    });
    return tree;
  };

  function traverse(obj: any, firstRecursion = false) {
    if (obj?.children?.length === 0) {
      return firstRecursion ? (
        <></>
      ) : (
        <TreeNode
          label={
            <HumanTiles
              data={{
                key: obj.key,
                title: obj.title,
                children: obj.children,
              }}
            />
          }
        />
      );
    }
    let childNodes = obj?.children?.map((child: TTreeData) => traverse(child));
    return firstRecursion ? (
      [childNodes]
    ) : (
      <TreeNode
        key={obj.key}
        label={
          <HumanTiles
            data={{
              key: obj.key,
              title: obj.title,
              children: obj.children,
            }}
          />
        }
      >
        {childNodes}
      </TreeNode>
    );
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Col span={24}>
          <div className=" grid-span-1 space-y-2">
            <Card>
              <div className="w-full overflow-x-auto">
                <Tree lineWidth={"3px"} lineColor={"#00a1df"} lineBorderRadius={"10px"} label={<HumanTiles data={{ title: treeList[0]?.title }} />}>
                  {traverse(treeList[0], true)}
                </Tree>
              </div>
            </Card>
          </div>
        </Col>
      )}
    </>
  );
}
