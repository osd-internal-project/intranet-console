import { Avatar, Card, Tag } from "antd";
import { useEffect, useState } from "react";
import OrganizeServices from "@/app/services/organize-chart.service";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { CarryOutOutlined } from "@ant-design/icons";
import { TreeNode, Tree } from "react-organizational-chart";
import HumanTiles from "./organizationTiles";
import UserServices from "@/app/page/users-management/users/services/user.service";
import Loading from "@/components/Loading";

type Props = {
  data: TOrganizeDto;
};

export type TOrganizeDto = {
  id: number;
  positionId: string;
  description: string;
  positionName: string;
  parentPositionId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type TUserDetailDefaultDto = {
  id: number;
  position_id: string;
  position_name: string;
  parent_position_id: string;
  userId: string;
  username: string;
  first_name_en: string;
  last_name_en: string;
  email: string;
  type: string;
  image_id: string;
};

export type TUserDetailDto = {
  id: number;
  positionId: string;
  positionName: string;
  parentPositionId: string;
  userId: string;
  username: string;
  firstNameEn: string;
  lastNameEn: string;
  type: string;
  email: string;
  icon: any;
  children: any;
  imageId: string;
};

type TTreeData = {
  key: string;
  title: string;
  children: any;
};

const OrganizationalTeam: React.FC<Props> = ({ data }) => {
  const intranetAuth = useAxiosIntranet();
  const organizeServices = OrganizeServices(intranetAuth);
  const userAuth = useAxiosUser();
  const userServices = UserServices(userAuth);
  const [treeList, setTreeList] = useState<TTreeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loaddata();
  }, []);

  const getImage = async (userId: string) => {
    return await userServices.getImage(userId);
  };

  const loaddata = async () => {
    const resUserInposition = await organizeServices.findChildrenUserById(data.positionId);
    const filterOrganize = await Promise.all(
      resUserInposition.map(async (item: TUserDetailDefaultDto) => ({
        id: item.id,
        positionId: item.position_id,
        positionName: item.position_name,
        parentPositionId: item.position_id === data.positionId ? null : item.parent_position_id,
        userId: item.userId,
        username: item.username,
        firstNameEn: item.first_name_en,
        lastNameEn: item.last_name_en,
        email: item.userId,
        type: item.type,
        imageId: item.image_id ? await getImage(item.userId) : null,
      }))
    );
    const tree = createTree(filterOrganize, null);
    setTreeList(tree);
    setLoading(false);
  };

  const createTree = (obj: TUserDetailDto[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item: TUserDetailDto, index: number) => {
      if (item.parentPositionId === parentId) {
        const children = createTree(obj, item.positionId);
        if (children.length > 0) {
          (item.icon = <CarryOutOutlined />), (item.children = children);
        }
        tree.push({
          key: index,
          title: item.positionName,
          children: item.children,
          userId: item.userId,
          username: item.username,
          firstNameEn: item.firstNameEn,
          lastNameEn: item.lastNameEn,
          email: item.userId,
          type: item.type,
          imageId: item.imageId,
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
                userId: obj.userId,
                username: obj.username,
                firstNameEn: obj.firstNameEn,
                lastNameEn: obj.lastNameEn,
                email: obj.userId,
                type: obj.type,
                imageId: obj.imageId,
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
              userId: obj.userId,
              username: obj.username,
              firstNameEn: obj.firstNameEn,
              lastNameEn: obj.lastNameEn,
              email: obj.userId,
              type: obj.type,
              imageId: obj.imageId,
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
        <Card>
          <div className="w-full overflow-x-auto">
            <Tree lineWidth={"3px"} lineColor={"#00a1df"} lineBorderRadius={"10px"} label={<HumanTiles data={{ title: treeList[0]?.title }} />}>
              {traverse(treeList[0], true)}
            </Tree>
          </div>
        </Card>
      )}
    </>
  );
};

export default OrganizationalTeam;
