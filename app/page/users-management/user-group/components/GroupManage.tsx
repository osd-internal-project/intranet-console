import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, Modal, Row, SelectProps, Table, message } from "antd";
import { GroupManageSkeleton } from "./Skeleton";
import { CarryOutOutlined, ExclamationCircleFilled, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import UserGroupServices from "../../../../services/usergroup.service";
import UserServices from "../../users/services/user.service";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export interface props {
  propDataManage: (res: { selectOrganize: string | null; groupSelect: string | null; loading: boolean }) => void;
  groupSelect: string | null;
  selectOrganize: string | null;
}
type groupDetail = {
  groupId: string;
  groupName: string;
  description: string;
  headId?: string;
  parentGroupId: string;
  userGroupMapPermission: userGroupMapModule[];
};
type userGroupMapModule = {
  leaveGroupId: string;
  leaveUserId: string;
  expenseGroupId: string;
  expenseUserId: string;
};
export type ITSelectUsers = {
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
};
const GroupManage: React.FC<props> = ({ propDataManage, groupSelect, selectOrganize }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const { user, roles } = (useContext(UserContext) as UserContectType) || {
    user: null,
    roles: null,
  };
  const [addform] = Form.useForm();
  const [editform] = Form.useForm();
  const [groupDetail, setGroupDetail] = useState<groupDetail | null>(null);
  const [openAddModel, setOpenAddModel] = useState<boolean>(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [showModalUserList, setShowModalUserList] = useState<boolean>(false);
  const [groupOption, setGroupOption] = useState<SelectProps["options"]>([]);
  const [userSelect, setUserSelect] = useState<SelectProps["options"]>([]);
  const [userInGroupSelect, setUserInGroupSelect] = useState<SelectProps["options"]>([]);

  const [userGroupIds, setUserGroupIds] = useState<string[]>([]);

  useEffect(() => {
    featchData();
  }, [groupSelect]);

  const featchData = async () => {
    setEditState(false);
    setGroupDetail(null);
    if (user?.userId) {
      const groups = await UserGroupServices(baseUrlUser).getUserGroupAll();
      const tree = createTree(groups, null);
      setGroupOption(tree);
    }

    if (groupSelect) {
      const groupDetail: any = await UserGroupServices(baseUrlUser).getUserGroupByGroupId(groupSelect);
      editform.setFieldsValue(groupDetail);
      setGroupDetail(groupDetail);
      const usersInGroup: any = await UserServices(baseUrlUser).findUserInOnwerGroupByUserGroupId(groupSelect);
      const userInGroupSelect = usersInGroup.map((user: any) => ({
        value: user.userId,
        label: `${user.firstNameTh} ${user.lastNameTh}`,
      }));
      setUserInGroupSelect(userInGroupSelect);
      // const userGroupMapPermission = await UserGroupServices(baseUrlUser).getUserGroupMapPermission({});
      // setUserGroupIds(userGroupMapPermission.map((item: any) => item.userGroupId));
      // const usersAll: any = await UserGroupServices(baseUrlUser).getdataUserAll();
      // const userSelect = usersAll.map((user: any) => ({
      //   value: user.userId,
      //   label: `${user.firstNameTh} ${user.lastNameTh}`,
      // }));
      // setUserSelect(userSelect);
    }
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
          value: item.groupId,
          title: item.groupName,
          children: item.children,
        });
      }
    });
    return tree;
  };

  // async function onChangeSaleGroupSelect(group: string[]): Promise<void> {
  //   const data = await UserGroupServices(baseUrlUser).findUsersLowerByOwnerGroup(group);
  //   setSaleUsersFormGroup(data);
  // }

  // async function onChangeEngineerGroupSelect(group: string[]): Promise<void> {
  //   const data = await UserGroupServices(baseUrlUser).findUsersLowerByOwnerGroup(group);
  //   setEngineerUsersFormGroup(data);
  // }

  // async function onChangeLeaveGroupSelect(group: string[]): Promise<void> {
  //   const data = await UserGroupServices(baseUrlUser).findUsersLowerByOwnerGroup(group);
  //   setLeaveUsersFormGroup(data);
  // }

  // async function onChangeExpenseGroupSelect(group: string[]): Promise<void> {
  //   const data = await UserGroupServices(baseUrlUser).findUsersLowerByOwnerGroup(group);
  //   setExpenseUsersFormGroup(data);
  // }
  // async function onChangeHeaderGroupSelect(group: string[], type: string): Promise<void> {
  //   const data = await UserGroupServices(baseUrlUser).findUsersLowerByOwnerGroup(group);
  //   let lists = headerUsersFormGroup;
  //   const oldIndex = lists.findIndex((list) => list.type === type);
  //   if (oldIndex) {
  //     lists[oldIndex] = { type: type, users: data };
  //   } else {
  //     lists.push({ type: type, users: data });
  //   }
  //   setHeaderUsersFormGroup(lists);
  // }

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
    await UserGroupServices(baseUrlUser)
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
          await UserGroupServices(baseUrlUser)
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
    await UserGroupServices(baseUrlUser)
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

  return groupDetail ? (
    <>
      <Card className="mx-2 my-2 md:my-0  " style={{ minHeight: " 500px" }}>
        <div className="grid grid-cols-1 gap-0 space-y-5 ">
          <Row>
            <Col span={10}>
              <div>
                <div className="flex text-2xl space-x-2  font-semibold  mb-3">
                  <div>Group Detail</div>
                  <div>
                    <Button
                      size="small"
                      type="link"
                      onClick={() => {
                        setShowModalUserList(true);
                      }}>
                      <EyeOutlined />
                    </Button>
                  </div>
                </div>
                <div className=" text-slate-400">
                  {!groupDetail.parentGroupId ? `*หากต้องการเพิ่มกลุ่มย่อยภายใต้ชื่อกลุ่มนี้ให้กด Add Sub Group` : ``}
                </div>
              </div>
            </Col>
            <Col span={14} style={{ justifyContent: "end", display: "flex" }}>
              <div className=" inline-block space-x-2 ">
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    setOpenAddModel(true);
                  }}>
                  Add Sub Group
                </Button>

                {!editState ? (
                  <>
                    <Button size="small" type="primary" onClick={onClickEdit} loading={buttonLoading}>
                      Edit
                    </Button>

                    <Button
                      size="small"
                      type="primary"
                      danger
                      onClick={handleDelete}
                      disabled={!groupDetail.parentGroupId ? true : false}
                      loading={buttonLoading}>
                      Delete
                    </Button>
                  </>
                ) : null}
                <Button size="small" onClick={onCloseDetail}>
                  Close
                </Button>
              </div>
            </Col>
          </Row>
          <Form form={editform} onFinish={onFinishEdit} onFinishFailed={onFinishFailed} name="editForm" layout="vertical" initialValues={groupDetail}>
            <div>
              <Form.Item name="groupId" label="Group Id :">
                <Input className="read-only-input" disabled />
              </Form.Item>
              <Form.Item hidden name={`organizeId`}>
                <Input className="read-only-input" />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="groupName" label="Name :" rules={[{ required: true, message: "Please enter sub group name" }]}>
                <Input disabled={editState === false ? true : false} className={!editState ? "read-only-input" : ""} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="description" label="Description :">
                <Input.TextArea disabled={editState === false ? true : false} className={!editState ? "read-only-input" : ""} />
              </Form.Item>
            </div>
            {!editState && (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <div style={{ marginLeft: "20px" }}>
                  <Button href={`/page/users-management/user-group/${groupDetail.groupId}`} type="link">
                    {`Set User Permission`}
                  </Button>
                </div>
              </div>
            )}
            {editState ? (
              <div className="flex justify-end space-x-4 ">
                <Form.Item style={{ marginTop: "20px" }}>
                  <Button
                    onClick={() => {
                      setEditState(false);
                      editform.resetFields();
                    }}>
                    Back
                  </Button>
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={buttonLoading} style={{ marginTop: "20px" }}>
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
        footer={[]}>
        <Form
          form={addform}
          initialValues={{ parentName: groupDetail.groupName }}
          onFinish={onFinishAdd}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 7 }}
          style={{ marginBottom: "-30px" }}>
          <Form.Item label="Group Parent" name="parentName" style={{ marginTop: "22px" }}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Sub Group Name" name="groupName" rules={[{ required: true, message: "Please enter sub group name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Row gutter={[8, 8]} style={{ justifyContent: "end", display: "flex" }}>
            <Col>
              <Button
                key="cancel"
                onClick={() => {
                  addform.resetFields();
                  setOpenAddModel(false);
                }}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Form.Item>
                <Button key="submit" htmlType="submit" type="primary" loading={buttonLoading}>
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        open={showModalUserList}
        onCancel={() => {
          setShowModalUserList(false);
        }}
        title="รายชื่อ">
        <Table pagination={false} dataSource={userInGroupSelect} columns={[{ title: "Name", dataIndex: "label", key: "value" }]} />
      </Modal>
    </>
  ) : (
    <GroupManageSkeleton />
  );
};

export default GroupManage;
