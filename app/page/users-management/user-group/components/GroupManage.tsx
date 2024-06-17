import React, { useEffect, useState } from "react";
import { Button, Card, Col, Descriptions, DescriptionsProps, Form, Input, Modal, Row, Select, Skeleton, Tree, message } from "antd";
import UserGroupServices from "../services/usergroup.service";
import { GroupManageSkeleton } from "./Skeleton";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { checkRule } from "@/app/utils/rules";
import RolesServices from "../../user-role/services/role.service";
export interface props {
  propDataManage: (res: { selectOrganize: string | null; groupSelect: string | null; loading: boolean }) => void;
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
  parentGroupId: string;
  // organizedGroupId: string;
};

const GroupManage: React.FC<props> = ({ propDataManage, groupSelect, selectOrganize }): React.ReactElement => {
  const userAuth = useAxiosUser();
  const addRule = checkRule("um-ug-a");
  const editRule = checkRule("um-ug-e");
  const deleteRule = checkRule("um-ug-d");
  const [addform] = Form.useForm();
  const [editform] = Form.useForm();
  const userGroupServices = UserGroupServices(userAuth);
  const userRolesServices = RolesServices(userAuth);
  const [groupDetail, setGroupDetail] = useState<groupDetail | null>(null);
  const [openAddModel, setOpenAddModel] = useState<boolean>(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [selectRole, setSeleceRole] = useState<TSelectRoleDto[]>([]);

  useEffect(() => {
    featchData();
  }, [groupSelect]);

  const featchData = async () => {
    setEditState(false);
    setGroupDetail(null);
    if (groupSelect) {
      const groupDetail: any = await userGroupServices.getUserGroupByGroupId(groupSelect);
      const resRole = await userRolesServices.getUserRoleAll();
      editform.setFieldsValue(groupDetail);
      editform.setFieldValue(
        "userRole",
        groupDetail.userGroupUserRoleMap.length > 0
          ? groupDetail.userGroupUserRoleMap.map((item: { id: number; roleId: string; userGroupId: string }) => item.roleId)
          : []
      );
      setGroupDetail(groupDetail);
      setSeleceRole(resRole);
    }
  };

  const onCloseDetail = () => {
    setGroupDetail(null);
    propDataManage({ selectOrganize: selectOrganize, groupSelect: null, loading: true });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onFinishEdit = async (values: groupDetail) => {
    setbuttonLoading(true);
    await userGroupServices
      .updateUserGroup(values.groupId, values)
      .then(() => {
        message.success(`Edit success`);
        setOpenAddModel(false);
        propDataManage({ selectOrganize: selectOrganize, loading: true, groupSelect: values.groupId });
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
          await userGroupServices.deleteUserGroup(groupDetail.groupId).then((res) => {
            if (res.data.status === 401) {
              message.error(res.data.message);
            } else {
              message.success("Delete Success");
              propDataManage({ selectOrganize: selectOrganize, loading: true, groupSelect: null });
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
    propDataManage({ selectOrganize: selectOrganize, loading: true, groupSelect: null });
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
            <Col span={12}>
              <div>
                <div className=" text-2xl  font-semibold inline-block mb-3">Group Detail</div>
                <div className=" text-slate-400">
                  {!groupDetail.parentGroupId ? `*หากต้องการเพิ่มกลุ่มย่อยภายใต้ชื่อกลุ่มนี้ให้กด Add Sub Group` : ``}
                </div>
              </div>
            </Col>
            <Col span={12} style={{ justifyContent: "end", display: "flex" }}>
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
                      <Button type="primary" onClick={onClickEdit} disabled={!groupDetail.parentGroupId ? true : false} loading={buttonLoading}>
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
                <Input disabled={!groupDetail.parentGroupId || editState === false ? true : false} className={!editState ? "read-only-input" : ""} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="description" label="Description :">
                <Input.TextArea
                  disabled={!groupDetail.parentGroupId || editState === false ? true : false}
                  className={!editState ? "read-only-input" : ""}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="userRole" label="user role :">
                <Select
                  mode="multiple"
                  options={selectRole.map((item: TSelectRoleDto) => ({ value: item.roleId, label: item.roleName }))}
                  disabled={!groupDetail.parentGroupId || editState === false ? true : false}
                  className={!editState ? "read-only-input" : ""}
                />
              </Form.Item>
            </div>
            {editState ? (
              <div className="flex justify-end space-x-4 ">
                <Form.Item>
                  <Button
                    onClick={() => {
                      setEditState(false);
                      editform.resetFields();
                    }}
                    disabled={!groupDetail.parentGroupId ? true : false}
                  >
                    Back
                  </Button>
                </Form.Item>
                <Button type="primary" htmlType="submit" disabled={!groupDetail.parentGroupId ? true : false} loading={buttonLoading}>
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
                }}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              {addRule ? (
                <Form.Item>
                  <Button key="submit" htmlType="submit" type="primary" loading={buttonLoading}>
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
    </>
  ) : (
    <GroupManageSkeleton />
  );
};

export default GroupManage;
