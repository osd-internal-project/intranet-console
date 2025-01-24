"use client";
import { use, useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Segmented,
  Select,
  SelectProps,
  Spin,
  Switch,
  Tabs,
  TreeSelect,
  TreeSelectProps,
} from "antd";
import { Col, SegmentedProps } from "antd/lib";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import UserModuleServices from "@/app/services/user-module.service";
import { ITUserModule, ITUserModuleForm } from "@/app/common/user-module";
import { useForm } from "antd/es/form/Form";
import modal from "antd/es/modal";
import { CarryOutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { PermissionConfig } from "./components/permission-config";
import UserGroupServices from "@/app/services/usergroup.service";
import { UserContectType, UserContext } from "@/app/config/userContext";

const { TextArea } = Input;

export default function UserModulePage() {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const userAuth = useAxiosUser();
  const userModuleServices = UserModuleServices(userAuth);
  const userGroupServices = UserGroupServices(userAuth);
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [moduleSelected, setModuleSelected] = useState<string | undefined>(
    undefined
  );
  const [userModuleOptions, setUserModuleOptions] = useState<
    SegmentedProps["options"]
  >([]);
  const [groupOptions, setGroupOptions] = useState<TreeSelectProps["treeData"]>(
    []
  );
  useEffect(() => {
    fetchData();
  }, [loading]);

  async function fetchData() {
    const userModules = await userModuleServices.findMany({});
    if (userModules) {
      const options = userModules.map((module) => ({
        value: module.code,
        label: `${module.name}`,
      }));
      setUserModuleOptions(options);
    } else {
      setUserModuleOptions([]);
    }
    await getgroups();
    setLoading(false);
  }
  const getgroups = async () => {
    const groups = await userGroupServices.getUserGroupAll();
    const tree = createTree(groups, null);
    setGroupOptions(tree);
  };
  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];

    obj.forEach((item) => {
      console.log(item);
      if (item.parentGroupId === parentId) {
        const children = createTree(obj, item.groupId);
        if (children.length > 0) {
          (item.icon = <CarryOutOutlined />), (item.children = children);
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
  async function onSelectGroups(value: string): Promise<void> {
    if (moduleSelected && value) {
      const permissionGroup =
        await userGroupServices.getPermissionGroupByGroupIdAndModuleId({
          groupid: value,
          modulecode: moduleSelected,
        });
      form.setFieldValue(
        "permissionGroupId",
        permissionGroup.map((group: ITUserGroup) => group.groupId)
      );
    } else {
      form.setFieldValue("permissionGroupId", undefined);
    }
  }

  async function onSubmitPermission(value: {
    groupId: string;
    permissionGroupId: string[];
  }): Promise<void> {
    await userGroupServices
      .setUserPermissionGroup({
        userGroupId: value.groupId,
        userModuleId: moduleSelected,
        permissionGroupIds: value.permissionGroupId,
      })
      .then((res) => {
        message.success("Success");
      })
      .catch((res) => console.log(res));
  }

  return (
    <Spin spinning={loading}>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก {user?.userId}</span>,
              },
              {
                title: <span>Group Permission</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Group Permission`}</div>
        </Divider>
        <div className="w-full">
          <Card>
            <div className=" flex w-full gap-2">
              <div className="flex-none">
                <Segmented
                  size="large"
                  vertical
                  options={userModuleOptions}
                  onChange={(value) => {
                    form.resetFields();
                    setModuleSelected(String(value));
                  }}
                />
              </div>
              {moduleSelected && (
                <div className="flex-1 w-full">
                  <PermissionConfig
                    userModuleSelected={moduleSelected}
                    groupOption={groupOptions}
                    onSelectGroups={onSelectGroups}
                    form={form}
                    onSubmitPermission={onSubmitPermission}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </Row>
    </Spin>
  );
}
