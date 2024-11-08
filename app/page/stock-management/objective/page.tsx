"use client";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Popover,
  Row,
  Spin,
  Table,
  Tag,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import ObjectiveManage from "./components/ObjectiveManage";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterObjectiveServices from "./services/master-objective.service";
import { deleteIcon, editIcon } from "@/components/icon";
import {
  dateToStartofDay,
  dateToEndofDay,
  dateToStringTh,
} from "@/app/utils/format";
import { checkRule } from "@/app/utils/rules";
type ObjectiveType = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  createdAt?: Date;
  updatedat?: Date;
};
export default function ObjectivePage() {
  const stockAuth = useAxiosStock();
  const addRule = checkRule("sm-objective-a");
  const editRule = checkRule("sm-objective-e");
  const deleteRule = checkRule("sm-objective-delete");
  const masterObjectiveServices = MasterObjectiveServices(stockAuth);
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState<boolean>(true);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [manageStatus, setManageStatus] = useState<any>({
    status: undefined,
    id: undefined,
  });
  const [dataTable, setDataTable] = useState<ObjectiveType[]>([]);
  const [search, setSearch] = useState<object>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    if (loading === true) {
      loaddata();
    }
  }, [loading]);

  const loaddata = async () => {
    const dataTable = await masterObjectiveServices.getMasterObjectiveByFilter(
      search
    );
    setCurrentPage(1);
    setDataTable(dataTable);
    setLoading(false);
  };

  const onFilter = async (value: any) => {
    let search = {};
    if (value.name) {
      search = { ...search, name: { contains: value.name } };
    }
    if (value.createdAt) {
      const startOfDay = dateToStartofDay(value.createdAt[0]);
      const endofDay = dateToEndofDay(value.createdAt[1]);
      search = {
        ...search,
        createdAt: {
          gte: startOfDay,
          lte: endofDay,
        },
      };
    }
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };
  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Objective" name="name">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Created" name="createdAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item className=" col-span-4 text-right">
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
  const columns: any = [
    {
      title: "NO.",
      dataIndex: "id",
      key: "id",
      width: "100px",
      render: (text: string, record: any, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "OBJECTIVE",
      dataIndex: "name",
      key: "name",
      width: "50%",
      render: (text: string, record: any, index: number) => (
        <div className=" font-bold text-base">{text}</div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (event: boolean, row: any, index: number) =>
        event === true ? (
          <Tag color="green">{`Active`}</Tag>
        ) : (
          <Tag color="volcano">{`Inactive`}</Tag>
        ),
    },

    {
      title: "CREATED",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string, record: any, index: number) =>
        dateToStringTh(text as any),
    },

    {
      title: "ACTIVE",
      dataIndex: "id",
      key: "id",
      width: "200px",
      align: "center",
      render: (data: string, record: any, index: number) => (
        <>
          <div className="space-x-2">
            {editRule ? (
              <Button
                type="link"
                onClick={() => setManageStatus({ status: "edit", id: data })}
              >
                {editIcon}
              </Button>
            ) : (
              <></>
            )}
            {deleteRule ? (
              <Button
                type="link"
                danger
                onClick={() => setManageStatus({ status: "delete", id: data })}
                disabled={buttonLoading}
              >
                {deleteIcon}
              </Button>
            ) : (
              <></>
            )}
          </div>
        </>
      ),
    },
  ];

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
              href: "/page/setting",
              title: <span>Setting</span>,
            },
            {
              title: <span>Set Objective </span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`SET OBJECTIVE`}</div>
      </Col>
      <Col span={24}>
        <div className="grid grid-cols-1  gap-y-2">
          <div className="flex justify-between md:col-span-2">
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
            <div>
              {addRule ? (
                <Button
                  type="primary"
                  onClick={() => {
                    setManageStatus({ status: "add", id: undefined });
                    // setbuttonLoading(true);
                  }}
                  disabled={buttonLoading}
                >
                  Add Objective
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div>
            <Card>
              <div className=" col-span-1 space-y-5 md:top-1">
                <div className=" overflow-auto md:overflow-hidden">
                  <Table
                    loading={loading}
                    columns={columns}
                    dataSource={dataTable}
                    pagination={{
                      current: currentPage,
                      onChange: handlePageChange,
                      showSizeChanger: false,
                    }}
                    rowKey="id"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Col>
      <div>
        <ObjectiveManage
          propDataManage={function (e): void {
            setLoading(e.loading);
            setManageStatus(e.manageStatus);
          }}
          manageStatus={manageStatus}
          setbuttonLoading={(e: boolean) => setbuttonLoading(e)}
          buttonLoading={buttonLoading}
        />
      </div>
    </Row>
  );
}
