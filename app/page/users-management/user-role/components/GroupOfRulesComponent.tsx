"use client";
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Popover, Select, SelectProps, Space, Spin, Table, Tag, message } from "antd";
import ProfileServices from "../services/profile.service";
import RulesServices from "../services/rule.service";
import { useForm } from "antd/lib/form/Form";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ExclamationCircleFilled, FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { deleteIcon, editIcon } from "@/components/icon";
import { checkRule } from "@/app/utils/rules";
import { dateToEndofDay, dateToStartofDay, dateToStringTh } from "@/app/utils/format";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

type profileType = {
  profileId: string;
  profileName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  profileRuleMap: any[];
};
const { RangePicker } = DatePicker;
const GroupOfRulesComponent: React.FC = (): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  // const userAuth = useAxiosUser();
  // const profileRuleServices = ProfileServices(baseUrlUser);
  // const rulesServices = RulesServices(baseUrlUser);
  const addRule = checkRule("um-ru-g-d");
  const editRule = checkRule("um-ru-g-e");
  const deleteRule = checkRule("um-ru-g-d");
  const [addform] = useForm();
  const [editform] = useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataTable, setDataTable] = useState<profileType[]>([]);
  const [openAddProfileModel, setOpenAddProfileModel] = useState<boolean>(false);
  const [openEditProfileModel, setOpenEditProfileModel] = useState<boolean>(false);
  const [openDeleteProfileModel, setOpenDeleteProfileModel] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const [search, setSearch] = useState<object>({});
  const [ruleOptions, setRuleOptions] = useState<SelectProps["options"]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [buttonConfirm, setbuttonConfirm] = useState<boolean>(false);

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
    const data = await ProfileServices(baseUrlUser).getProfileRuleByFilter(search);
    setDataTable(data);
  };

  const getDefaultData = async () => {
    const rules = await RulesServices(baseUrlUser).getMasterRuleAll();
    setRuleOptions(
      rules.map((x: any) => ({
        label: x.ruleName,
        value: x.ruleCode,
      })),
    );
  };

  const columns: any = [
    {
      title: "No.",
      dataIndex: "profileId",
      key: "profileId",
      render: (value: string, record: any, index: number) => (currentPage - 1) * 10 + index + 1,
      width: "5%",
    },
    {
      title: "Group Name",
      dataIndex: "profileName",
      key: "profileName",
      width: "15%",
    },
    {
      title: "Rules",
      dataIndex: "profileRuleMap",
      key: "profileRuleMap",
      width: "30%",
      render: (items: any[]) => (
        <div>
          {items
            ? items.map((item, index) => (
                <Tag key={index} className="bg-gray-100 text-gray-800 text-sm font-medium m-1 rounded  border border-gray-500">
                  {item.masterRule.ruleName}
                </Tag>
              ))
            : ``}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: Date, r: any, i: number) => (d ? dateToStringTh(d) : ""),
    },
    {
      title: "Active",
      dataIndex: "profileId",
      key: "profileId",
      width: "15%",
      align: "center",
      render: (text: string, record: any) => (
        <div className="space-x-2">
          {editRule ? (
            <Button size="small" type="link" onClick={() => onOpenEditModal(record.profileId)}>
              {editIcon}
            </Button>
          ) : (
            <></>
          )}
          {deleteRule ? (
            <Button size="small" type="link" onClick={() => onOpenDelete(record.profileId)} disabled={buttonLoading} danger>
              {deleteIcon}
            </Button>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  //Process
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  //Add
  const onOpenAddModal = () => {
    setbuttonLoading(true);
    setOpenAddProfileModel(true);
    addform.resetFields();
  };
  const onFinishAdd = async (values: any) => {
    setbuttonLoading(true);
    setbuttonConfirm(true);
    const profile = {
      profileName: values.profileName,
      description: values.description,
    };
    let rules: string[] = [];
    if (values.rules) {
      rules = values.rules;
    }
    await ProfileServices(baseUrlUser)
      .addProfileRule(profile, rules)
      .then(() => {
        message.success(`Add success`);
        setLoading(true);
        setOpenAddProfileModel(false);
      })
      .catch((err) => message.error(err));
    setbuttonLoading(false);
    setbuttonConfirm(false);
  };
  //Edit
  const onOpenEditModal = async (profileId: string) => {
    editform.resetFields();
    const filter = {
      profileId: profileId,
    };
    const data = await ProfileServices(baseUrlUser).getProfileRuleOne(filter);
    if (data) {
      const formvalue = {
        profileId: data.profileId,
        profileName: data.profileName,
        description: data.description,
        rules: data.profileRuleMap.map((item: any) => item.masterRule.ruleCode),
      };
      editform.setFieldsValue(formvalue);
    }
    setOpenEditProfileModel(true);
  };
  const onFinishEdit = async (values: any) => {
    setbuttonLoading(true);
    const profile = {
      profileName: values.profileName,
      description: values.description,
    };
    await ProfileServices(baseUrlUser)
      .updateProfileRule(values.profileId, profile, values.rules)
      .then(() => {
        message.success(`Edit success`);
        setLoading(true);
        setOpenEditProfileModel(false);
      })
      .catch((err) => message.error(err));
    setbuttonLoading(false);
  };

  //Delete
  const onOpenDelete = (profileId: string) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this group of rules",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okButtonProps: { danger: true },
      okText: "Confirm",
      async onOk() {
        setbuttonLoading(true);
        if (profileId) {
          await ProfileServices(baseUrlUser)
            .deleteProfileRule(profileId)
            .then(() => {
              message.success("Delete success");
              setLoading(true);
              setDeleteId(null);
              setOpenDeleteProfileModel(false);
              setbuttonLoading(false);
            })
            .catch((err) => message.error(err.message));
        } else {
          message.error(`ผิดพลาด กรุณาลองใหม่`);
          setDeleteId(null);
          setOpenDeleteProfileModel(false);
        }
        setbuttonLoading(false);
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const onFilter = async (value: any) => {
    let search = {};

    if (value.profileName) {
      search = { ...search, profileName: { contains: value.profileName } };
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
    setCurrentPage(1);
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Group Name" name="profileName">
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
          <Button type="primary" htmlType="submit">
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
              <Button icon={<PlusCircleOutlined />} type="primary" onClick={() => onOpenAddModal()} className="button-blue" disabled={buttonLoading}>
                Add Group of Rules
              </Button>
            ) : (
              <></>
            )}
          </Space>
        </div>
      </div>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 ">
          <div>
            <Table
              size="small"
              loading={loading}
              rowKey="profileId"
              columns={columns}
              dataSource={dataTable}
              pagination={{ current: currentPage, onChange: handlePageChange, showSizeChanger: false }}
            />
          </div>
          <div></div>
        </div>
        <div>
          <Modal
            title="Add Group of Rules"
            open={openAddProfileModel}
            onCancel={() => {
              setOpenAddProfileModel(false), setbuttonLoading(false);
            }}
            footer={[]}>
            <Form
              form={addform}
              onFinish={onFinishAdd}
              onFinishFailed={onFinishFailed}
              labelCol={{ span: 6 }}
              style={{ marginBottom: "-20px", marginTop: "20px" }}>
              <Form.Item label="Group Name" name="profileName" rules={[{ required: true, message: "Please enter group name" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input />
              </Form.Item>
              <Form.Item label="Rules" name="rules">
                <Select allowClear showSearch={false} mode="multiple" style={{ width: "100%" }} placeholder="Please Select" options={ruleOptions} />
              </Form.Item>
              <Form.Item>
                <div className=" flex justify-end space-x-4">
                  <Button
                    key="cancel"
                    onClick={() => {
                      setOpenAddProfileModel(false), setbuttonLoading(false);
                    }}>
                    Cancel
                  </Button>
                  <Button key="submit" htmlType="submit" type="primary" className="button-blue" loading={buttonConfirm}>
                    Add
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>

        <div>
          <Modal title="Edit Group of Rules" open={openEditProfileModel} onCancel={() => setOpenEditProfileModel(false)} footer={[]}>
            <Form
              form={editform}
              onFinish={onFinishEdit}
              onFinishFailed={onFinishFailed}
              labelCol={{ span: 6 }}
              style={{ marginBottom: "-30px", marginTop: "20px" }}>
              <Form.Item label="Profile Id" name="profileId" hidden>
                <Input />
              </Form.Item>
              <Form.Item label="Group Name" name="profileName" rules={[{ required: true, message: "Please enter group name" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input />
              </Form.Item>
              <Form.Item label="Rules" name="rules">
                <Select allowClear showSearch={false} mode="multiple" style={{ width: "100%" }} placeholder="Please Select" options={ruleOptions} />
              </Form.Item>

              <div className=" flex justify-end space-x-5">
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
      </Spin>
    </>
  );
};

export default GroupOfRulesComponent;
