"use client";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Table,
  Tag,
  message,
} from "antd";
import { useState, useEffect } from "react";
import Link from "next/link";
import UserServices from "../services/user.service";
import { Dayjs } from "dayjs";
import { deleteIcon, editIcon } from "@/components/icon";
import {
  ExclamationCircleFilled,
  FilterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
type RangeValue = [Dayjs | null, Dayjs | null] | null;
type dataType = {
  userId: string;
  username: string;
  position: string;
  phoneNumber: string;
  status: string;
  created: string;
  createdDate: Date;
};
const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
import MasterPositionServices from "../services/position.service";
import { ITypeOption } from "../common";
import { checkRule } from "@/app/utils/rules";
import { dateToStringTh } from "@/app/utils/format";
export interface props {
  propLoading: (load: boolean, search: object) => void;
  loading: boolean;
  search: object;
}

const UserTable: React.FC<props> = ({
  propLoading,
  loading,
  search,
}): React.ReactElement => {
  const userAuth = useAxiosUser();
  const userServices = UserServices(userAuth);
  const masterPositionService = MasterPositionServices(userAuth);
  const [filterForm] = Form.useForm();
  const [dataTable, setDataTable] = useState<dataType[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [positionOption, setPositionOption] = useState<ITypeOption[]>([]);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const userEditRules = checkRule("um-e");
  const userDeleteRules = checkRule("um-d");
  useEffect(() => {
    if (loading) {
      loadingData();
    }
  }, [loading]);

  const loadingData = async () => {
    const positions = await masterPositionService.getMasterPositionAll();
    const positionOption: ITypeOption[] = positions.map((d: any) => ({
      label: d.nameTh,
      value: d.id,
    }));
    setPositionOption(positionOption);
    const data = await userServices.getUsersAll(search);
    if (data) {
      let datamap: dataType[] = data.map((d: any, index: number) => ({
        no: index + 1,
        userId: d.userId,
        username: d.username,
        position: d.masterPosition?.nameTh,
        phoneNumber: d.phoneNumber,
        email: d.email,
        status: d.activeStatus ? "Active" : "Inactive",
        fullname: `${d.firstNameTh} ${d.lastNameTh}`,
        created: d.createdAt,
        createdDate: d.createdAt,
      }));

      setDataTable(datamap);
    }

    propLoading(false, search);
  };

  const columns: any = [
    {
      title: "NO.",
      dataIndex: "no",
      key: "no",
      width: 100,
    },

    {
      title: "USERNAME",
      dataIndex: "username",
      key: "username",
      width: 200,
      render: (d: string, r: any, i: number) => (
        <>
          <b>{d}</b>
          <br /> <p className=" text-gray-400 m-0">{r.email}</p>
        </>
      ),
    },
    {
      title: "FULL NAME",
      dataIndex: "fullname",
      key: "fullname",
      width: 200,
    },
    {
      title: "POSITION",
      dataIndex: "position",
      key: "position",
      width: 200,
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 200,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (d: string, r: any, i: number) =>
        d === "Active" ? (
          <Tag color="green">{d}</Tag>
        ) : (
          <Tag color="volcano">{d}</Tag>
        ),
    },
    {
      title: "CREATED",
      dataIndex: "created",
      key: "created",
      width: 300,
      render: (d: Date, r: any, i: number) => (d ? dateToStringTh(d) : ""),
    },

    {
      title: "ACTIVE",
      key: "userId",
      dataIndex: "userId",
      fixed: "right" as "right",
      width: 200,
      align: "center",
      render: (d: string) => (
        <div className=" space-x-2">
          {userEditRules ? (
            <Link href={`/page/users-management/users/${d}`}>
              <Button type="link" className="p-1">
                {editIcon}
              </Button>
            </Link>
          ) : (
            <></>
          )}
          {userDeleteRules ? (
            <Button
              className="p-1"
              danger
              type="link"
              onClick={() => onfinishDel(d)}
              disabled={buttonLoading}
            >
              {deleteIcon}
            </Button>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];
  const onSearch = async (value: object) => {
    propLoading(true, value);
    setOpenFilter(false);
  };

  const searchContent = (
    <Form
      layout="vertical"
      form={filterForm}
      onFinish={onSearch}
      autoComplete="off"
    >
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="User Id" name="userId">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Name" name="userName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Position" name="positionId">
          <Select
            placeholder="Please Select"
            options={positionOption}
            allowClear
          />
        </Form.Item>
        <Form.Item label="First Name" name="firstNameTh">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Last Name" name="lastNameTh">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Status" name="activeStatus">
          <Select
            placeholder="All"
            allowClear
            options={[
              { value: true, label: <Tag color="green">Active</Tag> },
              { value: false, label: <Tag color="red">Inactive</Tag> },
            ]}
          />
        </Form.Item>
        <Form.Item label="Created" name="created">
          <RangePicker className=" w-full" />
        </Form.Item>
        {/* <div></div> */}
        <Form.Item className=" md:col-span-4  text-right">
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );

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
          propLoading(true, search);
          setbuttonLoading(false);
        }
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };
  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-2">
        <div className=" col-span-4  flex justify-between">
          <div>
            <Popover
              onOpenChange={handleOpenFilter}
              open={openFilter}
              content={searchContent}
              placement="bottomLeft"
              title="Search"
              trigger="click"
              overlayStyle={{ width: "calc(100% - 240px)" }}
            >
              <Button type="primary" icon={<FilterOutlined />}>
                Filters
              </Button>
            </Popover>
          </div>
          <div className=" space-x-2">
            {/* <RangePicker
              format={dateFormat}
              onChange={(val: any) => {
                setDateRange(val);
                propLoading(true, search);
              }}
            /> */}
            {checkRule("um-a") ? (
              <Link href="/page/users-management/users/add">
                <Button icon={<PlusCircleOutlined />} className="button-blue">
                  Add User
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
        <Card className="col-span-4 md:col-span-4">
          <Table
            rowKey="userId"
            columns={columns}
            loading={loading}
            dataSource={dataTable}
            scroll={{ x: true }}
            pagination={{ showSizeChanger: false }}
          />
        </Card>
      </div>
    </>
  );
};

export default UserTable;
