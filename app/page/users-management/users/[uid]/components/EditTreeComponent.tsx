"use client";
import React, { useEffect, useState } from "react";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import UserGroupServices from "../../services/usergroup.service";
import UserServices from "../../services/user.service";
import { Button, Card, Form, Select, Spin, Tree, TreeSelect, message } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import Title from "antd/es/skeleton/Title";

import "../../style.css";
import { useForm } from "antd/es/form/Form";
export interface props {
  userid: string;
}

type optionType = {
  label: string;
  value: string;
};
const EditTreeComponent: React.FC<props> = ({ userid }): React.ReactElement => {
  const userAuth = useAxiosUser();
  const userGroupServices = UserGroupServices(userAuth);
  const userServices = UserServices(userAuth);
  const [treeform] = useForm();
  const [treeList, setTreeList] = useState<any[]>([]);
  const [loadTree, setLoadTree] = useState<boolean>(false);
  const [organizedList, setOrganizedList] = useState<optionType[]>([]);
  const [viewValue, setViewValue] = useState<string>();
  const [ownerValue, setOwnerValue] = useState<string>();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  useEffect(() => {
    loaddata();
  }, [userid]);

  const loaddata = async () => {
    if (userid) {
      const data = await userServices.getUsersByUserId(userid);

      treeform.setFieldValue("ownerGroup", data.ownerGroupId);
    }
    // const orgs = await organizedServices.getOrganizedAll();
    // const optins = orgs.map((org: any) => ({
    //   value: org.organizedId,
    //   label: org.organizedName,
    // }));
    // setOrganizedList(optins);

    setLoadTree(true);
    treeform.setFieldsValue({ grouplist: undefined });
    const groups = await userGroupServices.getUserGroupAll();
    const userGroup = await userGroupServices.getUserGroupIdByUserId(userid);
    const ownerCondition = {
      where: { userId: userid },
      select: {
        ownerGroupId: true,
      },
    };
    const ownnerDetail = await userServices.getUsersByCondition(ownerCondition);
    if (ownnerDetail.ownerGroup) {
      treeform.setFieldsValue({ ownerGroup: ownnerDetail.ownerGroup.groupid });
    }
    if (userGroup.data.length > 0) {
      const groupActiveIds = userGroup.data.map((item: any) => item.userGroupId);
      treeform.setFieldsValue({ grouplist: groupActiveIds });
    }
    const tree = createTree(groups, null);
    setTreeList(tree);
    setLoadTree(false);
  };

  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.parentGroupId === parentId) {
        const children = createTree(obj, item.groupId);
        if (children.length > 0) {
          item.children = children;
        }
        tree.push({
          value: item.groupId,
          title: item.groupName,
          children: item.children,
        });
      }
    });

    return tree;
  };

  const onFinish = async (value: any) => {
    setbuttonLoading(true);
    const group = value.grouplist;
    await userServices
      .setUserGroupMap(userid, value.organizedId, value.ownerGroup, group)
      .then(() => {
        message.success(`Success`);
        setbuttonLoading(false);
      })
      .catch((err) => {
        message.error(`ผิดพลาด`);
        console.log(err);
      });
  };
  const onChangeOwnerGroup = (newValue: string) => {
    setOwnerValue(newValue);
  };

  const onChangeViewGroup = (newValue: string) => {
    setViewValue(newValue);
  };

  return (
    <Card className="mx-2 my-2 md:my-0" style={{ minHeight: "500px" }}>
      <Form form={treeform} onFinish={onFinish} layout="vertical">
        <div className="grid grid-cols-1 gap-0 ">
          <div className=" mb-5">
            <div className=" text-2xl  font-semibold ">User Group</div>
          </div>

          {/* <div className="grid grid-cols-1 ">{`Organization`}</div> */}
          {/* <div className="grid grid-cols-1 mb-5">
            <Form.Item name="organizedId">
              <Select placeholder="กรุณาเลือก Organization" options={organizedList} onSelect={setTree} />
            </Form.Item>
          </div> */}

          <div className="mb-5">
            <Spin spinning={loadTree}>
              <Form.Item name="ownerGroup" label="Owner Group" rules={[{ required: true, message: "Please select owner group" }]}>
                <TreeSelect
                  // showSearch
                  style={{ width: "100%" }}
                  value={ownerValue}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Please Select"
                  allowClear
                  treeDefaultExpandAll
                  onChange={onChangeOwnerGroup}
                  treeData={treeList}
                />
              </Form.Item>
            </Spin>
          </div>

          <div className="mb-5" style={{ marginTop: "-20px" }}>
            <Spin spinning={loadTree}>
              <Form.Item name="grouplist" label="View Group" rules={[{ required: true, message: "Please select view group" }]}>
                <TreeSelect
                  // showSearch
                  style={{ width: "100%" }}
                  value={viewValue}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Please Select"
                  allowClear
                  multiple
                  treeDefaultExpandAll
                  onChange={onChangeViewGroup}
                  treeData={treeList}
                />
              </Form.Item>
            </Spin>
          </div>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" className="button-blue" loading={buttonLoading}>
              Save User Group
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default EditTreeComponent;
