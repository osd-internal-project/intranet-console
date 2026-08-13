"use client";
import { useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Row,
  Segmented,
  Spin,
  TreeSelectProps,
} from "antd";
import { Col, SegmentedProps } from "antd/lib";
import UserModuleServices from "@/app/services/user-module.service";
import { useForm } from "antd/es/form/Form";
import { CarryOutOutlined } from "@ant-design/icons";
import { PermissionConfig } from "./components/permission-config";
import UserGroupServices from "@/app/services/usergroup.service";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { ITUserGroup } from "@/app/common/user-group";

import { notifySuccess } from "@/app/utils/message";
export default function UserModulePage() {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [moduleSelected, setModuleSelected] = useState<string | undefined>(
    undefined,
  );
  const [userModuleOptions, setUserModuleOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [groupOptions, setGroupOptions] = useState<TreeSelectProps["treeData"]>(
    [],
  );
  useEffect(() => {
    fetchData();
  }, [loading]);

  async function fetchData() {
    const userModules = await UserModuleServices(baseUrlUser).findMany({
      where: { status: true },
    });
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
    const groups = await UserGroupServices(baseUrlUser).getUserGroupAll();
    const tree = createTree(groups, null);
    setGroupOptions(tree);
  };
  /**
   * แปลงรายการกลุ่มแบบ flat ให้เป็นโครงสร้าง tree ตาม parentGroupId
   * node แต่ละตัวมีทั้ง `value` (สำหรับ TreeSelect) และ `key` (สำหรับ Tree)
   * รวมถึง `groupName` ไว้ให้ฝั่งที่ต้องการชื่อแบบ plain text ใช้งาน
   * @param obj รายการกลุ่มทั้งหมดแบบ flat
   * @param parentId groupId ของกลุ่มแม่ (null = ระดับบนสุด)
   * @returns tree ของกลุ่มผู้ใช้งาน
   */
  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];

    obj.forEach((item) => {
      if (item.parentGroupId === parentId) {
        const children = createTree(obj, item.groupId);
        if (children.length > 0) {
          ((item.icon = <CarryOutOutlined />), (item.children = children));
        }
        tree.push({
          value: item.groupId,
          key: item.groupId,
          title: item.groupName,
          groupName: item.groupName,
          children: item.children,
        });
      }
    });
    return tree;
  };
  async function onSelectGroups(value: string): Promise<void> {
    if (moduleSelected && value) {
      const permissionGroup = await UserGroupServices(
        baseUrlUser,
      ).getPermissionGroupByGroupIdAndModuleId({
        groupid: value,
        modulecode: moduleSelected,
      });
      form.setFieldValue(
        "permissionGroupId",
        permissionGroup.map((group: ITUserGroup) => group.groupId),
      );
    } else {
      form.setFieldValue("permissionGroupId", undefined);
    }
  }

  async function onSubmitPermission(value: {
    groupId: string;
    permissionGroupId: string[];
  }): Promise<void> {
    await UserGroupServices(baseUrlUser)
      .setUserPermissionGroup({
        userGroupId: value.groupId,
        userModuleId: moduleSelected,
        permissionGroupIds: value.permissionGroupId,
      })
      .then((res) => {
        notifySuccess("userpermission.assign");
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
                title: <span>หน้าหลัก</span>,
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
            <div className="  w-full gap-2">
              <div className="mb-2">
                <div className="font-semibold">สิทธิ์การดำเนินการ</div>
                <div className="text-gray-500 text-xs">
                  เลือกระบบที่ต้องการกำหนดสิทธิ์ (การเปลี่ยนระบบจะล้างข้อมูลในฟอร์ม)
                </div>
              </div>
              <div className="inline-flex flex-wrap gap-1 p-1 mb-4 rounded-lg bg-gray-100">
                {userModuleOptions.map((option) => {
                  const isSelected = moduleSelected === option.value;

                  return (
                    <Button
                      key={option.value}
                      type="text"
                      // ปุ่มที่เลือกอยู่กดซ้ำไม่ได้ แต่ยังต้องแสดงสีแบบ active
                      // จึง override สีของ state disabled ของ antd ด้วย !important
                      className={
                        isSelected
                          ? "font-semibold !bg-[#cde2fb] !border-[#86b6ef] !text-[#184f95] !opacity-100 !cursor-default"
                          : "font-semibold !text-gray-600"
                      }
                      disabled={isSelected}
                      onClick={() => {
                        form.resetFields();
                        setModuleSelected(String(option.value));
                      }}
                    >
                      {option.label}
                    </Button>
                  );
                })}

                {/* <Segmented
                  size="large"
                  // vertical

                  options={userModuleOptions}
                  onChange={(value) => {
                    form.resetFields();
                    setModuleSelected(String(value));
                  }}
                /> */}
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
