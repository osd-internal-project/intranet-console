"use client";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Button, Card, DatePicker, Form, FormInstance, Input, Modal, Popover, Select, Table, TablePaginationConfig, Tag, message } from "antd";
import { useState } from "react";
import Link from "next/link";
import { deleteIcon, editIcon } from "@/components/icon";
import { ExclamationCircleFilled, FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { checkRule } from "@/app/utils/rules";
import { dateToStringTh } from "@/app/utils/format";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import MasterPositionServices from "../services/position.service";
import { ITypeOption, TManageUserPageDto, TUserAllDto } from "../common";
import UserServices from "../services/user.service";

export interface Props {
  setManagePage: (event: TManageUserPageDto) => void;
  managePage: TManageUserPageDto;
  filterForm: FormInstance;
  createForm: FormInstance;
  setSelectUserType: (status: "ldap" | "local") => void;
  selectUserType: "ldap" | "local";
}

const UserTable: React.FC<Props> = ({ setManagePage, managePage, filterForm, createForm, setSelectUserType, selectUserType }): React.ReactElement => {
  const { id24Axios } = useId24();
  // const userAuth = useAxiosUser();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const userServices = UserServices(baseUrlUser);
  const masterPositionService = MasterPositionServices(baseUrlUser);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const userEditRules = checkRule("um-e");
  const userDeleteRules = checkRule("um-d");

  const columns: any = [
    {
      title: "NO.",
      dataIndex: "no",
      key: "no",
      render: (value: string, record: TUserAllDto, index: number) => index + 1 + (managePage.pagination.current - 1) * managePage.pagination.pageSize,
    },
    {
      title: "USERNAME",
      dataIndex: "username",
      key: "username",
      render: (value: string, record: TUserAllDto) => (
        <>
          <b>{value}</b>
          <br /> <p className=" text-gray-400 m-0">{record.email}</p>
        </>
      ),
    },
    {
      title: "FULL NAME",
      dataIndex: "fullname",
      key: "fullname",
      render: (value: string, record: TUserAllDto) => `${record.firstNameTh} ${record.lastNameTh}`,
    },
    {
      title: "POSITION",
      dataIndex: "position",
      key: "position",
      render: (value: string, record: TUserAllDto) => <>{record.masterPosition?.nameEn}</>,
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "STATUS",
      dataIndex: "activeStatus",
      key: "activeStatus",
      render: (value: string, record: TUserAllDto, index: number) => (value ? <Tag color="green">Active</Tag> : <Tag color="volcano">Inactive</Tag>),
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: Date, record: TUserAllDto, index: number) => (value ? dateToStringTh(value) : ""),
    },
    {
      title: "ACTIVE",
      key: "userId",
      dataIndex: "userId",
      fixed: "right" as "right",
      width: 200,
      align: "center",
      render: (value: string, record: TUserAllDto, index: number) => (
        <div className=" space-x-2">
          <Button type="link" className="p-1" onClick={() => onClickEdit(record)}>
            {editIcon}
          </Button>
        </div>
      ),
    },
  ];

  const onfinishDel = (d: string) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this user",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await userServices.remove(d);
        if (dataResult) {
          message.success(`Success`);
          setManagePage({ ...managePage, loading: true });
          setbuttonLoading(false);
        }
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };

  const onClickEdit = (record: TUserAllDto) => {
    // console.log(record);
    createForm.setFieldsValue({
      ...record,
      masterPositionId: record.masterPosition?.posId,
    });
    setManagePage({ ...managePage, modalStatus: true, modalTitle: "update" });
  };

  const onChangeTable = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    setManagePage({
      ...managePage,
      loading: true,
      pagination: { current: current || 1, pageSize: pageSize || 10 },
    });
  };

  // const loadingData = async () => {
  //   const data = await userServices.getUsersAll(search);
  //   if (data) {
  //     let datamap: TUserAllDto[] = data.map((d: any, index: number) => ({
  //       no: index + 1,
  //       userId: d.userId,
  //       username: d.username,
  //       position: d.masterPosition?.nameTh,
  //       phoneNumber: d.phoneNumber,
  //       email: d.email,
  //       status: d.activeStatus ? "Active" : "Inactive",
  //       fullname: `${d.firstNameTh} ${d.lastNameTh}`,
  //       created: d.createdAt,
  //       createdDate: d.createdAt,
  //     }));
  //     setDataTable(datamap);
  //   }
  //   propLoading(false, search);
  // };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-2">
        <Card className="col-span-4 md:col-span-4">
          <Table
            rowKey="userId"
            columns={columns}
            loading={managePage.loading}
            dataSource={managePage.dataUsers.data}
            scroll={{ x: true }}
            size="small"
            pagination={{
              ...managePage.pagination,
              defaultPageSize: 10,
              total: managePage.dataUsers.total,
              showSizeChanger: true,
            }}
            onChange={onChangeTable}
          />
        </Card>
      </div>
    </>
  );
};

export default UserTable;
