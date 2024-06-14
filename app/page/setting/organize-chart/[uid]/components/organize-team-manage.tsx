import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Form,
  Input,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Row,
  Select,
  Skeleton,
  Table,
  Tree,
  message,
} from "antd";
import { useAxiosIntranet, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { checkRule } from "@/app/utils/rules";
import { OrganizeManageSkeleton } from "./Skeleton";
import Link from "next/link";
import { editIcon } from "@/components/icon";
import { TcreateOrganizeDto, TfindAllOrganizeDto, TupdateOrganizeDto } from "../../common";
import OrganizeServices from "../../services/organize-chart.service";
import UserServices from "@/app/page/users-management/users/services/user.service";
import { render } from "react-dom";

export interface props {
  propDataManage: (res: { organizeSelect: string | null; loading: boolean }) => void;
  organizeSelect: string | null;
}

type TUserFindDto = {
  userId: string;
  username: string;
  firstNameTh: string | null;
  lastNameTh: string | null;
  firstNameEn: string | null;
  lastNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  activeStatus: boolean;
  clientId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  masterPosition: string | null;
};

type TUserFindListDto = {
  users: {
    userId: string;
    username: string;
    email: string | null;
  };
};

const OrganizeTeamManage: React.FC<props> = ({ propDataManage, organizeSelect }): React.ReactElement => {
  const intranetAuth = useAxiosIntranet();
  const userAuth = useAxiosUser();
  const organizeServices = OrganizeServices(intranetAuth);
  const userServices = UserServices(userAuth);
  const addRule = checkRule("um-ug-a");
  const editRule = checkRule("um-ug-e");
  const deleteRule = checkRule("um-ug-d");
  const [addform] = Form.useForm();
  const [editform] = Form.useForm();
  const [searchUser] = Form.useForm();
  const [addUser] = Form.useForm();
  const [organizeDetail, setOrganizeDetail] = useState<TfindAllOrganizeDto | null>(null);
  const [openAddModel, setOpenAddModel] = useState<boolean>(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [statusModalAddUser, setStatusModalAddUser] = useState<boolean>(false);
  const [selectUsers, setSelectUsers] = useState<TUserFindDto[]>([]);
  const [dataUserAll, setDataUserAll] = useState<TUserFindListDto[]>([]);
  const columns = [
    {
      title: "username",
      dataIndex: ["users", "username"],
      key: "username",
    },
    {
      title: "email",
      dataIndex: ["users", "email"],
      key: "email",
    },
    {
      title: "ลบ",
      dataIndex: ["users", "userId"],
      key: "userId",
      render: (value: string) => {
        return (
          <Popconfirm
            title="ยืนยันที่จะลบ"
            description="ยืนยันที่จะลบ บุคคลนี้ออกจากตำแหน่ง?"
            onConfirm={async () => {
              const resDelete = await organizeServices.deleteUserMapOrganizeByUserId(value);
              if (resDelete.status === 500) {
                message.error("Fail!!");
              } else {
                message.success("success!!");
                propDataManage({
                  loading: true,
                  organizeSelect: null,
                });
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>
              ลบ
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  useEffect(() => {
    loading();
  }, [organizeSelect]);

  const loading = async () => {
    setEditState(false);
    setOrganizeDetail(null);
    if (organizeSelect) {
      const organizeDetail = await organizeServices.getOneOrganizeById(organizeSelect);
      const resUserInposition = await organizeServices.findUserMapOrganizeUrl(organizeSelect);
      setDataUserAll(resUserInposition);
      editform.setFieldsValue(organizeDetail);
      setOrganizeDetail(organizeDetail);
    }
  };

  const onCloseDetail = () => {
    setOrganizeDetail(null);
    propDataManage({ organizeSelect: null, loading: true });
  };

  const onFinish = async (values: TupdateOrganizeDto) => {
    setbuttonLoading(true);
    await organizeServices
      .updateOrganize(values.positionId, values)
      .then(() => {
        message.success(`Edit success`);
        setOpenAddModel(false);
        propDataManage({
          loading: true,
          organizeSelect: values.positionId,
        });
      })
      .catch((err) => message.error(err));
    setbuttonLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleDelete = async () => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this sub position",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okButtonProps: { danger: true },
      okText: "Confirm",
      async onOk() {
        if (organizeDetail) {
          const resDelete = await organizeServices.deleteOrganize(organizeDetail.positionId);
          if (resDelete.status === 500) {
            message.error(resDelete.message);
          } else {
            message.success("Delete Success");
            propDataManage({
              loading: true,
              organizeSelect: null,
            });
          }
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

  const onFinishAdd = async (values: TcreateOrganizeDto) => {
    setbuttonLoading(true);
    await organizeServices
      .createOrganize(values)
      .then(() => {
        message.success(`Add success`);
        setOpenAddModel(false);
      })
      .catch((err) => message.error(err));
    propDataManage({
      loading: true,
      organizeSelect: null,
    });
    setbuttonLoading(false);
  };

  const onCancelModalAddUser = () => {
    addUser.resetFields();
    setStatusModalAddUser(false);
  };

  const finishSearchUser = async (value: { username: string; email: string }) => {
    const resSearchUser = await userServices.getUsersAll(value);
    setSelectUsers(resSearchUser.map((item: TUserFindDto) => ({ label: item.email, value: item.userId })));
  };

  const finishAddUser = async (value: { userId: string }) => {
    const resCreateUserMapOrganize = await organizeServices.createUserMapOrganizeUrl({ ...value, positionId: organizeSelect });
    if (resCreateUserMapOrganize === 500) {
      message.error("Fail");
    } else {
      message.success("success");
      propDataManage({
        loading: true,
        organizeSelect: null,
      });
    }
    addUser.resetFields();
    setStatusModalAddUser(false);
  };

  return organizeDetail ? (
    <>
      <Card className="mx-2 my-2 md:my-0  " style={{ minHeight: " 500px" }}>
        <div className="grid grid-cols-1 gap-0 space-y-5 ">
          <Row>
            <Col span={12}>
              <div>
                <div className=" text-2xl  font-semibold inline-block mb-3">Position Detail</div>
                <div className=" text-slate-400">
                  {!organizeDetail.positionId ? `*หากต้องการเพิ่มกลุ่มย่อยภายใต้ชื่อกลุ่มนี้ให้กด Add Sub Position` : ``}
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
                  Add Sub Position
                </Button>
                {!editState ? (
                  <>
                    {editRule ? (
                      <Button
                        type="primary"
                        onClick={() => setEditState(!editState)}
                        disabled={!organizeDetail.parentPositionId ? true : false}
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
                        disabled={!organizeDetail.parentPositionId ? true : false}
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

          <Form form={editform} onFinish={onFinish} onFinishFailed={onFinishFailed} name="editForm" layout="vertical" initialValues={organizeDetail}>
            <div>
              <Form.Item name="positionId" label="Position Id :">
                <Input disabled={true} className={!editState ? "read-only-input" : ""} />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="positionName" label="Name :" rules={[{ required: true, message: "Please enter sub position name" }]}>
                <Input
                  disabled={!organizeDetail.parentPositionId || editState === false ? true : false}
                  className={!editState ? "read-only-input" : ""}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="description" label="Description :">
                <Input.TextArea
                  disabled={!organizeDetail.parentPositionId || editState === false ? true : false}
                  className={!editState ? "read-only-input" : ""}
                />
              </Form.Item>
            </div>
            <div>
              <div className="flex justify-between">
                <div>User :</div>
                <div></div>
                <div>
                  <Button size="small" type="primary" onClick={() => setStatusModalAddUser(true)}>
                    Add
                  </Button>
                </div>
              </div>
              <Form.Item name="users">
                <Table columns={columns} dataSource={dataUserAll} rowKey={(record) => record.users.userId} size="small" />
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
                    disabled={!organizeDetail.parentPositionId ? true : false}
                  >
                    Back
                  </Button>
                </Form.Item>
                <Button type="primary" htmlType="submit" disabled={!organizeDetail.parentPositionId ? true : false} loading={buttonLoading}>
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
        title="Add Sub Position"
        open={openAddModel}
        onCancel={() => {
          setOpenAddModel(false);
          addform.resetFields();
        }}
        footer={[]}
      >
        <Form
          form={addform}
          onFinish={onFinishAdd}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 7 }}
          style={{ marginBottom: "-30px" }}
          initialValues={{ positionParent: organizeDetail.positionName, parentPositionId: organizeDetail.positionId }}
        >
          <Form.Item name="parentPositionId" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Sub Position Name" name="positionName" rules={[{ required: true, message: "Please enter sub position name" }]}>
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
      <Modal title="Add User :" open={statusModalAddUser} onCancel={onCancelModalAddUser} footer={[]} width={650}>
        <Form form={searchUser} onFinish={finishSearchUser}>
          <div className="flex justify-between gap-1">
            <div>
              <Form.Item name={`username`} label={`username`} rules={[{ required: true, message: "Please enter username" }]}>
                <Input />
              </Form.Item>
            </div>
            <div>
              <Form.Item name={`email`} label={`email`}>
                <Input />
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button htmlType="submit">search</Button>
              </Form.Item>
            </div>
          </div>
        </Form>
        <Form form={addUser} name="addUser" onFinish={finishAddUser}>
          <div>
            <Form.Item name={`userId`} label={`User :`} rules={[{ required: true, message: "Please select User" }]}>
              <Select className="w-full" options={selectUsers} />
            </Form.Item>
          </div>
          <div className=" flex justify-end">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  ) : (
    <OrganizeManageSkeleton />
  );
};

export default OrganizeTeamManage;
