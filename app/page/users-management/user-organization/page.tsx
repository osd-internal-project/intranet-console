"use client";
import { Breadcrumb, Button, Card, Col, DatePicker, Divider, Form, Input, Row, Table } from "antd";
import { useEffect, useState } from "react";
import OrganizationManage from "./components/OrgenizationManage";
import OrganizedServices from "./services/organized.service";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { PlusCircleOutlined } from "@ant-design/icons";
import { editIcon } from "@/components/icon";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
interface TypeTable {
  id: number;
  organizedId: string;
  organizedName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export default function Organization() {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_USER);
  const organizedServices = OrganizedServices(baseUrlUser);
  const [dataSource, setDataSource] = useState<TypeTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<object>({});
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [manageStatus, setManageStatus] = useState<{
    status: string | null;
    organizedId: string | null;
    organizedName: string | null;
    description: string | null;
  }>({
    status: null,
    organizedId: null,
    organizedName: null,
    description: null,
  });

  const propDataManage = (e: any) => {
    setLoading(e.loading);
  };

  useEffect(() => {
    if (loading) {
      reloading();
    }
  }, [loading]);

  const reloading = async () => {
    const dataTable = await organizedServices.getOrganizedByFilter(search);
    setDataSource(dataTable);
    setLoading(false);
  };

  const columns: any = [
    {
      title: "No.",
      dataIndex: "organizedId",
      key: "organizedId",
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: "Organize Id",
      dataIndex: "organizedId",
      key: "organizedId",
      width: "20%",
      // render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: "Organize Name",
      dataIndex: "organizedName",
      key: "organizedName",
      width: "20%",
      render: (text: string, record: any, index: number) => <div className="text-blue">{text}</div>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "30%",
      // render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: "Create",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "20%",
      render: (text: string, record: any, index: number) => dayjs(text).format("DD-MM-YYYY , HH:mm"),
    },
    {
      title: "Active",
      dataIndex: "organizedId",
      key: "organizedId",
      width: "20%",
      render: (data: string, record: any, index: number) => (
        <>
          <div className="space-x-2">
            <Button
              type="link"
              onClick={() =>
                setManageStatus({
                  status: "edit",
                  organizedId: data,
                  organizedName: record.organizedName,
                  description: record.description,
                })
              }>
              {editIcon}
            </Button>
          </div>
        </>
      ),
    },
  ];
  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const onFilter = async (value: any) => {
    let search = {};
    if (value.organizedId) {
      search = { ...search, organizedId: { contains: value.organizedId } };
    }
    if (value.organizedName) {
      search = { ...search, organizedName: { contains: value.organizedName } };
    }
    if (value.description) {
      search = { ...search, description: { contains: value.description } };
    }
    if (value.created) {
      search = {
        ...search,
        createdAt: {
          gte: value.created[0],
          lte: value.created[1],
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
        <Form.Item label="Organization Id" name="organizedId">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Name" name="organizedName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Created" name="created">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="button-blue">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>หน้าหลัก</span>,
            },
            {
              title: <span>Users Management</span>,
            },
            {
              title: <span>Organizations</span>,
            },
          ]}
        />
      </Col>

      <Divider orientation="left" orientationMargin="0">
        <div className="title-page-font">{`Organizations`}</div>
      </Divider>
      <Col span={24}>
        <div className=" grid grid-cols-1 gap-y-2">
          <div className="flex justify-between ">
            <div className="flex">
              {/* <Popover
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
              </Popover> */}
            </div>
            <div className="space-x-2">
              <Button
                disabled={dataSource.length > 0 ? true : false}
                icon={<PlusCircleOutlined />}
                type="primary"
                className="button-blue"
                onClick={() =>
                  setManageStatus({
                    status: "add",
                    organizedId: null,
                    organizedName: null,
                    description: null,
                  })
                }>
                Add Organization
              </Button>
            </div>
          </div>
          <Card className="grid grid-cols-1 ">
            <div className="grid grid-cols-1 md:grid-cols-1">
              <div>
                <Table size="small" loading={loading} dataSource={dataSource} rowKey={"organizedId"} columns={columns} />
              </div>
            </div>
          </Card>
        </div>
      </Col>

      <div>
        <OrganizationManage propDataManage={propDataManage} manageStatus={manageStatus} />
      </div>
    </Row>
  );
}
