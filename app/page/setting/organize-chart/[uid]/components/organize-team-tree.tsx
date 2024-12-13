"use client";
import React, { useEffect, useState } from "react";
import { Card, Tree } from "antd";

import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { CarryOutOutlined, PlusOutlined } from "@ant-design/icons";
import OrganizeServices from "../../../../../services/organize-chart.service";
import { TfindAllOrganizeDto, TfindChildrenOrganizeById } from "../../common";

export interface props {
  propDataTree: (res: { organizeSelect: string | null; loading: boolean }) => void;
  loading: boolean;
  positionId: string;
}

const OrganizeTeamTree: React.FC<props> = ({ propDataTree, loading, positionId }): React.ReactElement => {
  const intranetAuth = useAxiosIntranet();
  const organizeServices = OrganizeServices(intranetAuth);
  const [treeList, setTreeList] = useState<any[] | null>(null);

  useEffect(() => {
    if (loading === true) {
      setTreeList(null);
      loaddata();
    }
  }, [loading]);

  const loaddata = async () => {
    const resOrganize = await organizeServices.getChildrenOrganizeById(positionId);
    const filterOrganize = resOrganize.map((item: TfindChildrenOrganizeById) => ({
      id: item.id,
      positionId: item.position_id,
      description: item.description,
      positionName: item.position_name,
      parentPositionId: item.position_id === positionId ? null : item.parent_position_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
    const tree = createTree(filterOrganize, null);
    setTreeList(tree);
    propDataTree({ organizeSelect: null, loading: false });
  };

  const createTree = (obj: TfindAllOrganizeDto[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item: TfindAllOrganizeDto) => {
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

  const onSelectTree = (value: any) => {
    propDataTree({ organizeSelect: value[0], loading: false });
  };

  return (
    <Card className="mx-2 my-2 md:my-0" style={{ minHeight: " 500px" }}>
      <div className=" grid-cols-1 gap-0 ">
        <div className="flex flex-row">
          <div className="basis-5/5">
            <div className=" mb-10">
              <div className=" text-2xl  font-semibold h-full">{` `}</div>
            </div>
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

export default OrganizeTeamTree;
