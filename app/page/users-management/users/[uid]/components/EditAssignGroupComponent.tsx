"use client";
import React, { useEffect, useState } from "react";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import UserServices from "../../services/user.service";
import { Button, Card, Col, Form, Row, Select, SelectProps, Spin, Tabs, Tree, TreeSelect, message } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import Title from "antd/es/skeleton/Title";
import { useForm } from "antd/es/form/Form";
import UserGroupServices from "../../../user-group/services/usergroup.service";
import { CarryOutOutlined } from "@ant-design/icons";
import Loading from "@/components/Loading";

export interface props {
  userid: string;
}

type TOrganizeDto = {
  id: number;
  organizedId: string;
  organizedName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type TabType = {
  label: string;
  key: string;
};

const EditAssignGroupComponent: React.FC<props> = ({ userid }): React.ReactElement => {
  const userAuth = useAxiosUser();
  const userGroupServices = UserGroupServices(userAuth);
  const userServices = UserServices(userAuth);
  const [assignGroupForm] = useForm();
  const [optionsOrganize, setOptionsOrganize] = useState<TabType[]>([]);
  const [loadTree, setLoadTree] = useState<boolean>(false);
  const [valueTreeSelect, setValueTreeSelect] = useState<string>();
  const [groupOption, setGroupOption] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    featchData();
  }, []);

  const featchData = async () => {
    const resOrganize = await userGroupServices.findAllOrganize();
    const orgList = resOrganize.map((item: TOrganizeDto) => ({ value: item.organizedId, label: item.organizedName }));
    setOptionsOrganize([...orgList]);
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
          value: item.group.groupId,
          title: item.group.groupName,
          children: item.group.children,
        });
      }
    });
    return tree;
  };

  const selectOrganize = async (organizeId: string) => {
    setLoadTree(true);
    const groups = await userGroupServices.getUserGroupByOrganizedGroupId(organizeId);
    const tree = createTree(groups.organizeMapGroup, null);
    assignGroupForm.setFieldsValue({ groupList: undefined });
    const assignGroup = await userServices.findAssignGroup(userid, organizeId);
    const assignOwnerGroup = await userServices.findOwnerGroupByOrganizeId(userid, organizeId);
    if (assignGroup.length > 0) {
      const groupActiveIds = assignGroup.map((item: { id: number; usersId: string; organizedId: string; groupId: string }) => item.groupId);
      assignGroupForm.setFieldsValue({ groupList: groupActiveIds });
    }
    assignGroupForm.setFieldsValue({ groupOwnerId: assignOwnerGroup.ownerGroupId });
    const treeData = createTree(groups.organizeMapGroup, null);
    setGroupOption(tree);
    setGroupOption(treeData);
    setLoadTree(false);
  };

  const onChange = (value: string) => {
    setValueTreeSelect(value);
  };

  const onChangeGroupOwner = async (value: string) => {
    console.log(value);
  };

  const saveAssignGroup = async (value: { organizeId: string; groupList: string[]; groupOwnerId: string }) => {
    const resAssign = await userServices.assignGroups(userid, value.organizeId, value.groupList);
    const resAssignOwnerGroup = await userServices.assignOwnerGroups(userid, value.organizeId, value.groupOwnerId);
    if (resAssign || resAssignOwnerGroup) {
      setLoadTree(true);
      message.success("สำเร็จ").then(() => setLoadTree(false));
    }
  };

  return (
    <Card>
      <Form form={assignGroupForm} onFinish={saveAssignGroup}>
        <Row>
          <Col span={12}>
            <Row style={{ paddingBottom: "10px" }}>Group Organization</Row>
            <Row>
              <Form.Item name="organizeId">
                <Select placeholder="กรุณาเลือก Organization" options={optionsOrganize} onSelect={selectOrganize} style={{ width: "100%" }} />
              </Form.Item>
            </Row>
          </Col>

          <Col span={12}>
            {loadTree ? (
              <Loading />
            ) : (
              <>
                <Row style={{ paddingBottom: "10px" }}>Group</Row>
                <Form.Item name="groupList">
                  <TreeSelect
                    multiple
                    allowClear
                    showSearch={false}
                    value={valueTreeSelect}
                    style={{ width: "100%" }}
                    treeDefaultExpandAll
                    placeholder="Please select"
                    onChange={onChange}
                    treeData={groupOption}
                  />
                </Form.Item>
                <Row style={{ paddingBottom: "10px" }}>Group Owner</Row>
                <Form.Item name="groupOwnerId">
                  <TreeSelect
                    allowClear
                    showSearch={false}
                    value={valueTreeSelect}
                    style={{ width: "100%" }}
                    treeDefaultExpandAll
                    placeholder="Please select"
                    onChange={onChangeGroupOwner}
                    treeData={groupOption}
                  />
                </Form.Item>
                <div className="flex justify-end">
                  <Button type="primary" htmlType="submit" ghost>
                    Save
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default EditAssignGroupComponent;
