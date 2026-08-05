"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, Form, Input, Modal, Popover, Select, Space, Spin, Table, Tag, Tree } from "antd";
import RolesServices from "../services/role.service";
import ProfileRuleServices from "../services/profile.service";
import { useForm } from "antd/es/form/Form";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ExclamationCircleFilled, FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { deleteIcon, editIcon } from "@/components/icon";
import { checkRule } from "@/app/utils/rules";
import { dateToEndofDay, dateToStartofDay, dateToStringTh } from "@/app/utils/format";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

import { notifyError, notifySuccess } from "@/app/utils/message";
const { confirm } = Modal;

type ProfileList = {
  profileId: string;
  profileName: string;
};
const { RangePicker } = DatePicker;
const RoleComponent: React.FC = (): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const addRule = checkRule("um-ro-a");
  const editRule = checkRule("um-ro-e");
  const deleteRule = checkRule("um-ro-d");

  const [addform] = Form.useForm();
  const [editform] = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [profileList, setProfileList] = useState<ProfileList[]>([]);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [openAddProfileModel, setOpenAddProfileModel] = useState<boolean>(false);
  const [openEditProfileModel, setOpenEditProfileModel] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  useEffect(() => {
    if (loading === true) {
      loadingDetail();
    }
    setLoading(false);
  }, [loading]);
  useEffect(() => {
    getDefaultData();
  }, []);

  const loadingDetail = async () => {
    setCurrentPage(1);
    const data = await RolesServices(baseUrlUser).getUserRoleByFilter(search);
    setDataTable(data);

    setLoading(false);
  };
  const getDefaultData = async () => {
    const profileList = await ProfileRuleServices(baseUrlUser).getProfileRuleByFilter({});
    setProfileList(profileList);
  };
  const columns: any = [
    {
      title: "No.",
      dataIndex: "roleId",
      key: "roleId",
      render: (value: string, record: any, index: number) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleName",

      render: (d: string) => <b className=" text-indigo-700">{d}</b>,
    },
    {
      title: "Group of Rules",
      dataIndex: "roleProfileMap",
      key: "roleProfileMap",
      width: "30%",
      render: (items: any[]) => (
        <div>
          {items
            ? items.map((item, index) => (
                <Tag key={index} className="bg-gray-100 text-gray-800 text-sm font-medium m-1 rounded  border border-gray-500">
                  {item?.profileRule?.profileName}
                </Tag>
              ))
            : ``}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "roleId",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "roleId",
      width: "16%",
      render: (d: Date, r: any, i: number) => (d ? dateToStringTh(d) : ""),
    },
    {
      title: "Active",
      dataIndex: "roleId",
      key: "roleId",
      width: "15%",
      align: "center",
      render: (text: string, record: any) => (
        <div className="space-x-2">
          {editRule ? (
            <Button size="small" type="link" onClick={() => onOpenEditModal(record)}>
              {editIcon}
            </Button>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button size="small" type="link" onClick={() => onOpenDelete(record.roleId)} disabled={buttonLoading} danger>
              {deleteIcon}
            </Button>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  //Add
  // const onOpenAddModal = () => {
  //   addform.resetFields();
  //   setOpenAddProfileModel(true);
  // };

  const onFinishAdd = async (values: any) => {
    setbuttonLoading(true);
    const role = {
      roleName: values.roleName,
      description: values.description,
    };
    let profiles: string[] = [];
    if (values.profiles) {
      profiles = values.profiles;
    }

    await RolesServices(baseUrlUser)
      .addUserRole(role, profiles)
      .then(() => {
        notifySuccess("userrole.create");
        setLoading(true);
        setOpenAddProfileModel(false);
      })
      .catch((err) => notifyError(err, "userrole.create"));
    setbuttonLoading(false);
  };
  //Edit
  const onOpenEditModal = async (record: any) => {
    setbuttonLoading(true);
    editform.resetFields();
    const formvalue = {
      roleId: record.roleId,
      roleName: record.roleName,
      description: record.description,
      profiles: record.roleProfileMap.map((item: any) => item.profileRule.profileId),
    };
    editform.setFieldsValue(formvalue);
    setbuttonLoading(false);
    setOpenEditProfileModel(true);
  };
  const onFinishEdit = async (values: any) => {
    setbuttonLoading(true);
    const userRole = {
      roleName: values.roleName,
      description: values.description,
    };
    await RolesServices(baseUrlUser)
      .updateUserRole(values.roleId, userRole, values.profiles)
      .then(() => {
        notifySuccess("userrole.update");
        setLoading(true);
        setOpenEditProfileModel(false);
      })
      .catch((err) => notifyError(err, "userrole.update"));
    setbuttonLoading(false);
  };

  const onOpenDelete = (profileId: string) => {
    setbuttonLoading(true);
    confirm({
      title: "Delete this user role",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okButtonProps: { danger: true },
      okText: "Confirm",
      async onOk() {
        if (profileId) {
          await RolesServices(baseUrlUser)
            .deleteUserRole(profileId)
            .then(() => {
              notifySuccess("userrole.delete");
              setLoading(true);
              setbuttonLoading(false);
            });
        } else {
          notifyError(undefined, "userrole.delete");
          setbuttonLoading(false);
        }
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };
  // const onCloseDelete = () => {
  //   setDeleteId(null);
  //   setOpenDeleteProfileModel(false);
  // };
  // const onSubmitDelete = async () => {
  //   if (deleteId) {
  //     await userRolesServices.deleteUserRole(deleteId).then(() => {
  //       notifyError(undefined, "userrole.delete");
  //       setLoading(true);
  //       setDeleteId(null);
  //       setOpenDeleteProfileModel(false);
  //     });
  //   } else {
  //     notifyError(undefined, "userrole.delete");
  //     setDeleteId(null);
  //     setOpenDeleteProfileModel(false);
  //   }
  // };

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const onFilter = async (value: any) => {
    let search = {};

    if (value.roleName) {
      search = { ...search, roleName: { contains: value.roleName } };
    }
    if (value.description) {
      search = { ...search, description: { contains: value.description } };
    }
    if (value.created) {
      search = {
        ...search,
        createdAt: {
          gte: dateToStartofDay(value.created[0]),
          lte: dateToEndofDay(value.created[1]),
        },
      };
    }
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };
  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Role Name" name="roleName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Search Text" />
        </Form.Item>

        <Form.Item label="Created" name="created">
          <RangePicker className=" w-full" />
        </Form.Item>
        <div></div>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="button-blue">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
  return (
    <>
      <div className="grid grid-cols-1 mb-5">
        <div className=" flex justify-end ">
          <Space>
            <Popover
              onOpenChange={handleOpenFilter}
              open={openFilter}
              content={searchContent}
              placement="bottomLeft"
              title="Search"
              trigger="click"
              overlayStyle={{ width: "calc(100% - 240px)" }}>
              <Button type="primary" icon={<FilterOutlined />} className="button-blue">
                Filters
              </Button>
            </Popover>
            {addRule ? (
              <Button
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  addform.resetFields();
                  setOpenAddProfileModel(true);
                }}
                type="primary"
                className="button-blue">
                Add User Role
              </Button>
            ) : (
              <></>
            )}
          </Space>
        </div>
      </div>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 md:grid-cols-1">
          <div>
            <Table
              size="small"
              loading={loading}
              rowKey="roleId"
              columns={columns}
              dataSource={dataTable}
              pagination={{ current: currentPage, onChange: handlePageChange, showSizeChanger: false }}
            />
          </div>
        </div>
      </Spin>
      <div>
        <Modal title="Add User Role" onCancel={() => setOpenAddProfileModel(false)} open={openAddProfileModel} footer={[]}>
          <Form form={addform} layout="vertical" labelCol={{ span: 6 }} onFinish={onFinishAdd} style={{ marginBottom: "-20px" }}>
            <Form.Item label="Role Name" name="roleName" rules={[{ required: true, message: "Please enter role name" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item label="Group of Rules" name="profiles">
              <Select
                allowClear
                showSearch={false}
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Please Select"
                options={profileList.map((opt) => ({
                  value: opt.profileId,
                  label: opt.profileName,
                }))}
              />
            </Form.Item>
            <Form.Item>
              <div className=" flex justify-end space-x-4">
                <Button onClick={() => setOpenAddProfileModel(false)}>Cancel</Button>

                <Button type="primary" htmlType="submit" className="button-blue" loading={buttonLoading}>
                  Add
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        <Modal title="Edit User Role" open={openEditProfileModel} onCancel={() => setOpenEditProfileModel(false)} footer={[]}>
          <Form
            form={editform}
            layout="vertical"
            // initialValues={{ parentName: groupDetail.groupName }}
            onFinish={onFinishEdit}
            labelCol={{ span: 6 }}
            style={{ marginBottom: "-30px" }}>
            <Form.Item label="Role Id" name="roleId" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="Role Name" name="roleName" rules={[{ required: true, message: "Please enter role name" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item label="Group of Rules" name="profiles">
              <Select
                allowClear
                showSearch={false}
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Please Select"
                options={profileList.map((opt) => ({
                  value: opt.profileId,
                  label: opt.profileName,
                }))}
              />
            </Form.Item>

            <div className=" flex justify-end space-x-4">
              <Button key="cancel" onClick={() => setOpenEditProfileModel(false)}>
                Cancel
              </Button>
              <Form.Item>
                <Button key="submit" htmlType="submit" type="primary" className="button-blue" loading={buttonLoading}>
                  Save Change
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
      {/* <div>
        <Modal title="Delete User Role" open={openDeleteProfileModel} onCancel={onCloseDelete} footer={[]}>
          <div className=" col-span-1">
            <div>{`Are you sure you want to delete this ?`}</div>
            <div className=" flex justify-end space-x-5">
              <Button key="cancel" onClick={onCloseDelete}>
                Cancel
              </Button>
              <Button key="submit" htmlType="submit" onClick={onSubmitDelete} type="primary" danger>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div> */}
    </>
  );
};

export default RoleComponent;
