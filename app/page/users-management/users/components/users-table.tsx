"use client";
import { Avatar, Button, Card, FormInstance, Table, TablePaginationConfig, Tag } from "antd";
import { useContext } from "react";
import { editIcon } from "@/components/icon";
import { dateToStringTh } from "@/app/utils/format";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { TManageUserPageDto, TUserAllDto } from "../common";
import { UsersServices } from "@/app/services/users.service";
import { UserContectType, UserContext } from "@/app/config/userContext";
import dayjs from "dayjs";
import { AntDesignOutlined } from "@ant-design/icons";
export interface Props {
  setManagePage: (event: TManageUserPageDto) => void;
  managePage: TManageUserPageDto;
  filterForm: FormInstance;
  createForm: FormInstance;
  setSelectUserType: (status: "ldap" | "local") => void;
  selectUserType: "ldap" | "local";
  setImage: (value: any) => void;
}

const UserTable: React.FC<Props> = ({ setManagePage, managePage, createForm, setImage }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
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
      render: (value: string, record: TUserAllDto) => {
        return (
          <>
            <div className="grid grid-cols-3 items-center">
              <div className="flex col-span-1 justify-center">
                <Avatar icon={<AntDesignOutlined />} />
              </div>
              <div className="col-span-2">
                <b>{value}</b>
                <p className="text-gray-400 m-0">{record.email}</p>
              </div>
            </div>
          </>
        );
      },
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
      render: (value: string, record: TUserAllDto) => record.masterPosition?.nameEn,
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
      width: 30,
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

  const onClickEdit = async (record: TUserAllDto) => {
    if (user) {
      const data = await UsersServices(baseUrlUser).getImage(user.userId);
      setImage(data);
    }
    createForm.setFieldsValue({
      ...record,
      masterPositionId: record.masterPosition?.posId,
      startWork: record.startWork ? dayjs(record.startWork) : null,
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
