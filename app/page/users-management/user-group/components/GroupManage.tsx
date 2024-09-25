import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  message,
} from "antd";
import UserGroupServices from "../services/usergroup.service";
import { GroupManageSkeleton } from "./Skeleton";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import Link from "next/link";
import {
  CarryOutOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { checkRule } from "@/app/utils/rules";
import RolesServices from "../../user-role/services/role.service";
import GroupPermissionComponent from "./GroupPermission";
import GroupUserPermission from "./GroupUserPermission";

import { useSession } from "next-auth/react";
import { Label } from "recharts";
export interface props {
  propDataManage: (res: {
    selectOrganize: string | null;
    groupSelect: string | null;
    loading: boolean;
  }) => void;
  groupSelect: string | null;
  selectOrganize: string | null;
}

type TSelectRoleDto = {
  roleId: string;
  roleName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type groupDetail = {
  groupId: string;
  groupName: string;
  description: string;
  headId?: string;
  parentGroupId: string;
  // organizedGroupId: string;
};
export type ITSelectUsers = {
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
};
const GroupManage: React.FC<props> = ({
  propDataManage,
  groupSelect,
  selectOrganize,
}): React.ReactElement => {
  const { data: session } = useSession();
  const userAuth = useAxiosUser();
  const addRule = checkRule("um-ug-a");
  const editRule = checkRule("um-ug-e");
  const deleteRule = checkRule("um-ug-d");
  const [addform] = Form.useForm();
  const [editform] = Form.useForm();
  const [permissionform] = Form.useForm();
  const [userpermissionform] = Form.useForm();
  const userGroupServices = UserGroupServices(userAuth);
  const userRolesServices = RolesServices(userAuth);
  const [groupDetail, setGroupDetail] = useState<groupDetail | null>(null);
  const [openAddModel, setOpenAddModel] = useState<boolean>(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [selectRole, setSeleceRole] = useState<TSelectRoleDto[]>([]);
  const [showModalPermission, setShowModalPermission] =
    useState<boolean>(false);
  const [groupOption, setGroupOption] = useState<SelectProps["options"]>([]);
  const [userSelect, setUserSelect] = useState<SelectProps["options"]>([]);
  const [saleUsersFormGroup, setSaleUsersFormGroup] = useState<ITSelectUsers[]>(
    []
  );
  const [engineerUsersFormGroup, setEngineerUsersFormGroup] = useState<
    ITSelectUsers[]
  >([]);
  const [showModalUserPermission, setShowModalUserPermission] =
    useState<boolean>(false);
  const [userGroupIds, setUserGroupIds] = useState<string[]>([]);

  useEffect(() => {
    featchData();
  }, [groupSelect]);

  const featchData = async () => {
    setEditState(false);
    setGroupDetail(null);
    if (session?.user.userId) {
      const groups = await userGroupServices.getUserGroupFormOrganizedByUserId(
        session?.user.userId
      );
      const tree = createTree(groups.organizeMapGroup, null);
      setGroupOption(tree);
    }

    if (groupSelect) {
      const groupDetail: any = await userGroupServices.getUserGroupByGroupId(
        groupSelect
      );
      const dataUser: any = await userGroupServices.getdataUserAll();
      const users = dataUser.map((user: any) => ({
        value: user.userId,
        label: `${user.firstNameTh} ${user.lastNameTh}`,
      }));
      setUserSelect(users);
      const resRole = await userRolesServices.getUserRoleAll();
      editform.setFieldsValue(groupDetail);
      editform.setFieldValue(
        "userRole",
        groupDetail.userGroupUserRoleMap.length > 0
          ? groupDetail.userGroupUserRoleMap.map(
              (item: { id: number; roleId: string; userGroupId: string }) =>
                item.roleId
            )
          : []
      );

      await onChangeSaleGroupSelect(groupDetail.saleUserGroupId);
      await onChangeEngineerGroupSelect(groupDetail.engineerUserGroupId);
      permissionform.setFieldsValue({
        exceptionalSatatus: groupDetail.exceptionalSatatus,
        saleUserGroupId: groupDetail.saleUserGroupId,
        saleUsersId: groupDetail.saleUsersId,
        engineerUserGroupId: groupDetail.engineerUserGroupId,
        engineerUsersId: groupDetail.engineerUsersId,
      });

      setGroupDetail(groupDetail);
      setSeleceRole(resRole);

      const userGroupMapHeader =
        await userGroupServices.getUserGroupMapHeader();
      // const userGroupIds = userGroupMapHeader.map(
      //   (item: any) => item.userGroupId
      // );
      // console.log(userGroupIds);
      setUserGroupIds(userGroupMapHeader.map((item: any) => item.userGroupId));

      userpermissionform.setFieldsValue({
        leaveGroupId: groupDetail.userGroupMapHeader[0].leaveGroupId,
        leaveUserId: groupDetail.userGroupMapHeader[0].leaveUserId,
      });
    }
  };
  const createTree = (obj: any[], parentId: string | null) => {
    const tree: any[] = [];
    obj.forEach((item) => {
      if (item.group.parentGroupId === parentId) {
        const children = createTree(obj, item.group.groupId);
        if (children.length > 0) {
          (item.group.icon = <CarryOutOutlined />),
            (item.group.children = children);
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

  async function onChangeSaleGroupSelect(group: string[]): Promise<void> {
    const data = await userGroupServices.findUsersByOwnerGroup(group);
    setSaleUsersFormGroup(data);
  }
  async function onChangeEngineerGroupSelect(group: string[]): Promise<void> {
    const data = await userGroupServices.findUsersByOwnerGroup(group);
    setEngineerUsersFormGroup(data);
  }
  const onCloseDetail = () => {
    setGroupDetail(null);
    propDataManage({
      selectOrganize: selectOrganize,
      groupSelect: null,
      loading: true,
    });
  };

  const onFinishFailed = (errorInfo: any) => {};

  const onFinishEdit = async (values: groupDetail) => {
    setbuttonLoading(true);
    await userGroupServices
      .updateUserGroup(values.groupId, values)
      .then(() => {
        message.success(`Edit success`);
        setOpenAddModel(false);
        propDataManage({
          selectOrganize: selectOrganize,
          loading: true,
          groupSelect: values.groupId,
        });
      })
      .catch((err) => message.error(err));
    setbuttonLoading(false);
  };

  const handleDelete = async () => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this sub group",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okButtonProps: { danger: true },
      okText: "Confirm",
      async onOk() {
        if (groupDetail) {
          await userGroupServices
            .deleteUserGroup(groupDetail.groupId)
            .then((res) => {
              if (res.data.status === 401) {
                message.error(res.data.message);
              } else {
                message.success("Delete Success");
                propDataManage({
                  selectOrganize: selectOrganize,
                  loading: true,
                  groupSelect: null,
                });
              }
            });
        } else {
          message.error(`ผิดพลาด กรุณาลองใหม่`);
        }
        setbuttonLoading(false);
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };

  const onFinishAdd = async (values: any) => {
    setbuttonLoading(true);
    const form = {
      groupName: values.groupName,
      description: values.description,
      parentGroupId: groupDetail?.groupId,
      organizeId: selectOrganize,
    };
    await userGroupServices
      .addUserGroup(form)
      .then(() => {
        message.success(`Add success`);
        setOpenAddModel(false);
      })
      .catch((err) => message.error(err));
    propDataManage({
      selectOrganize: selectOrganize,
      loading: true,
      groupSelect: null,
    });
    setbuttonLoading(false);
  };

  const onClickEdit = async () => {
    setEditState(!editState);
  };

  const onSetPermission = async (form: {
    exceptionalSatatus: boolean;
    saleUserGroupId: string[];
    saleUsersId: string[];
    engineerUserGroupId: string[];
    engineerUsersId: string[];
  }): Promise<void> => {
    const data = {
      exceptionalSatatus: form.exceptionalSatatus,
      saleUserGroupId: form.saleUserGroupId,
      saleUsersId: form.saleUsersId,
      engineerUserGroupId: form.engineerUserGroupId,
      engineerUsersId: form.engineerUsersId,
    };
    if (groupSelect) {
      await userGroupServices
        .updateUserGroupPermission(groupSelect, data)
        .then(() => {
          message.success(`Edit success`);
          setShowModalPermission(false);
        })
        .catch((err) => message.error(err));
    }
  };

  const setUserPermission = async (value: {
    leaveGroupId: string[];
    leaveUserId: string[];
    expenseGroupId: string[];
    expenseUserId: string[];
  }): Promise<void> => {
    const data = {
      userGroupId: groupSelect,
      leaveGroupId: value.leaveGroupId,
      leaveUserId: value.leaveUserId,
      expenseGroupId: value.expenseGroupId,
      expenseUserId: value.expenseUserId,
    };
    const dataUp = {
      leaveGroupId: value.leaveGroupId,
      leaveUserId: value.leaveUserId,
      expenseGroupId: value.expenseGroupId,
      expenseUserId: value.expenseUserId,
    };
    console.log("groupSelect:", groupSelect);
    console.log("userGroupIds:", userGroupIds);

    if (groupSelect && userGroupIds.includes(groupSelect)) {
      try {
        console.log(1);
        await userGroupServices.updateUserGroupHeaderPermission(
          groupSelect,
          dataUp
        );
        message.success(`Updated successfully`);
      } catch (err) {
        message.error("Update failed");
      }
    } else {
      try {
        console.log(2);

        await userGroupServices.createdUserGroupHeaderPermission(data);
        message.success(`Created successfully`);
      } catch (err) {
        message.error("Creation failed");
      }
    }

    setShowModalUserPermission(false);
  };

  const onShowSetPermission = () => {
    setShowModalPermission(true);
  };
  return groupDetail ? (
    <>
      <Card className="mx-2 my-2 md:my-0  " style={{ minHeight: " 500px" }}>
        <div className="grid grid-cols-1 gap-0 space-y-5 ">
          <Row>
            <Col span={10}>
              <div>
                <div className=" text-2xl  font-semibold inline-block mb-3">
                  Group Detail
                </div>
                <div className=" text-slate-400">
                  {!groupDetail.parentGroupId
                    ? `*หากต้องการเพิ่มกลุ่มย่อยภายใต้ชื่อกลุ่มนี้ให้กด Add Sub Group`
                    : ``}
                </div>
              </div>
            </Col>
            <Col span={14} style={{ justifyContent: "end", display: "flex" }}>
              <div className=" inline-block space-x-2 ">
                <Button
                  type="primary"
                  onClick={() => {
                    setOpenAddModel(true);
                  }}
                  icon={<PlusOutlined />}
                >
                  Add Sub Group
                </Button>
                {!editState ? (
                  <>
                    {editRule ? (
                      <Button
                        type="primary"
                        onClick={onClickEdit}
                        loading={buttonLoading}
                      >
                        Edit
                      </Button>
                    ) : (
                      <></>
                    )}
                    {deleteRule ? (
                      <Button
                        type="primary"
                        danger
                        onClick={handleDelete}
                        disabled={!groupDetail.parentGroupId ? true : false}
                        loading={buttonLoading}
                      >
                        Delete
                      </Button>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  ``
                )}
                <Button onClick={onCloseDetail}>Close</Button>
              </div>
            </Col>
          </Row>
          {/* </div> */}

          <Form
            form={editform}
            onFinish={onFinishEdit}
            onFinishFailed={onFinishFailed}
            name="editForm"
            layout="vertical"
            initialValues={groupDetail}
          >
            <div>
              <Form.Item name="groupId" label="Group Id :">
                <Input className="read-only-input" disabled />
              </Form.Item>
              <Form.Item hidden name={`organizeId`}>
                <Input className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                name="groupName"
                label="Name :"
                rules={[
                  { required: true, message: "Please enter sub group name" },
                ]}
              >
                <Input
                  disabled={editState === false ? true : false}
                  className={!editState ? "read-only-input" : ""}
                />
              </Form.Item>
            </div>
            <div>
              {" "}
              <ConfigProvider
                theme={{
                  token: {
                    colorBgContainerDisabled: "#fff",
                    colorTextDisabled: "#000",
                  },
                  components: {
                    Select: { colorBorder: !editState ? "#fff" : "#d9d9d9" },
                  },
                }}
              >
                <Form.Item name="headId" label="Head:">
                  <Select
                    disabled={editState === false ? true : false}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    options={userSelect}
                  />
                </Form.Item>
              </ConfigProvider>
            </div>
            <div>
              <Form.Item name="description" label="Description :">
                <Input.TextArea
                  disabled={editState === false ? true : false}
                  className={!editState ? "read-only-input" : ""}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="userRole" label="user role :">
                <Select
                  mode="multiple"
                  options={selectRole.map((item: TSelectRoleDto) => ({
                    value: item.roleId,
                    label: item.roleName,
                  }))}
                  disabled={editState === false ? true : false}
                  className={!editState ? "read-only-input" : ""}
                />
              </Form.Item>
            </div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <div>
                <Button onClick={onShowSetPermission} type="primary">
                  Set CRM Permission
                </Button>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <Button
                  onClick={() => setShowModalUserPermission(true)}
                  type="primary"
                >
                  {`Set User Permission`}
                </Button>
              </div>
            </div>

            {editState ? (
              <div className="flex justify-end space-x-4 ">
                <Form.Item>
                  <Button
                    onClick={() => {
                      setEditState(false);
                      editform.resetFields();
                    }}
                  >
                    Back
                  </Button>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={buttonLoading}
                >
                  Save Change
                </Button>
              </div>
            ) : (
              <></>
            )}
          </Form>
        </div>
      </Card>

      <Modal
        title="Add Sub Group"
        open={openAddModel}
        onCancel={() => {
          setOpenAddModel(false);
          addform.resetFields();
        }}
        footer={[]}
      >
        <Form
          form={addform}
          initialValues={{ parentName: groupDetail.groupName }}
          onFinish={onFinishAdd}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 7 }}
          style={{ marginBottom: "-30px" }}
        >
          <Form.Item
            label="Group Parent"
            name="parentName"
            style={{ marginTop: "22px" }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Sub Group Name"
            name="groupName"
            rules={[{ required: true, message: "Please enter sub group name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Row
            gutter={[8, 8]}
            style={{ justifyContent: "end", display: "flex" }}
          >
            <Col>
              <Button
                key="cancel"
                onClick={() => {
                  addform.resetFields();
                  setOpenAddModel(false);
                }}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              {addRule ? (
                <Form.Item>
                  <Button
                    key="submit"
                    htmlType="submit"
                    type="primary"
                    loading={buttonLoading}
                  >
                    Add
                  </Button>
                </Form.Item>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
      <GroupPermissionComponent
        groupOption={groupOption}
        onChangeSaleGroupSelect={onChangeSaleGroupSelect}
        onChangeEngineerGroupSelect={onChangeEngineerGroupSelect}
        saleUsersFormGroup={saleUsersFormGroup}
        engineerUsersFormGroup={engineerUsersFormGroup}
        showModalPermission={showModalPermission}
        onShowModalPermission={(status: boolean) =>
          setShowModalPermission(status)
        }
        permissionform={permissionform}
        onSetPermission={onSetPermission}
      />
      <GroupUserPermission
        groupOption={groupOption}
        onChangeEngineerGroupSelect={onChangeEngineerGroupSelect}
        // saleUsersFormGroup={saleUsersFormGroup}
        usersFormGroup={engineerUsersFormGroup}
        showModalUserPermission={showModalUserPermission}
        setShowModalUserPermission={(e: boolean) =>
          setShowModalUserPermission(e)
        }
        userpermissionform={userpermissionform}
        setUserPermission={setUserPermission}
      />
    </>
  ) : (
    <GroupManageSkeleton />
  );
};

export default GroupManage;
