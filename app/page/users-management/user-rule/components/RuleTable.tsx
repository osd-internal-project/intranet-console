"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, Dropdown, Form, Input, Popover, Space, Table, Tag, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import Title from "antd/es/skeleton/Title";
import RuleServices from "../services/rule.service";
import { useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { FilterOutlined } from "@ant-design/icons";
import data from "@iconify/icons-icon-park-outline/setting-two";
import { dateToEndofDay, dateToStartofDay, dateToStringTh } from "@/app/utils/format";

export interface props {
  propDataTable: (res: { status: string | null; ruleCode: string | null; ruleName: string | null; description: string | null }) => void;
  propLoading: (loading: boolean) => void;
  loading: boolean;
  handlerPaginationTable: (event: any) => void;
  filter: { take: number; skip: number; current: number };
  setPaginationConfig: (no: number) => void;
  paginationConfig: number;
}

const { RangePicker } = DatePicker;
const RuleTable: React.FC<props> = ({
  propDataTable,
  propLoading,
  loading,
  handlerPaginationTable,
  filter,
  setPaginationConfig,
  paginationConfig,
}): React.ReactElement => {
  const userAuth = useAxiosUser();
  const ruleServices = RuleServices(userAuth);
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});
  const [dataTable, setDataTable] = useState<any[]>([]);

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      render: (event: string, row: any, index: number) => {
        let skip = (filter.current - 1) * filter.take;
        return index + skip + 1;
      },
    },
    {
      title: "Rule Name",
      dataIndex: "ruleName",
      key: "ruleCode",
      width: "20%",
      render: (text: string) => <Tag className="bg-gray-100 text-gray-800 font-medium mr-2 rounded  border border-gray-500">{text}</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "ruleCode",
      width: "30%",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "ruleCode",
      render: (d: Date, r: any, i: number) => (d ? dateToStringTh(d) : ""),
    },

    {
      title: "Action",
      dataIndex: "ruleCode",
      key: "ruleCode",
      width: "20%",
      render: (text: string, record: any) => (
        <div className="space-x-2">
          <Button size="small" type="primary" onClick={() => toManage("edit", text, record.ruleName, record.description)} ghost>
            Edit
          </Button>
          <Button size="small" type="primary" onClick={() => toManage("delete", text, record.ruleName, record.description)} ghost danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (loading) {
      loaddata();
    }
  }, [loading]);

  const loaddata = async () => {
    setCurrentPage(1);
    const data = await ruleServices.getMasterRuleByFilter(search);
    setPaginationConfig(data.length);
    setDataTable(data);
    propLoading(false);
  };

  const toManage = (status: string, id: string | null, name: string | null, description: string | null) => {
    propDataTable({
      status: status,
      ruleCode: id,
      ruleName: name,
      description: description,
    });
  };
  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const onFilter = async (value: any) => {
    let search = {};
    if (value.ruleName) {
      search = { ...search, ruleName: { contains: value.ruleName } };
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
    propLoading(true);
    setOpenFilter(false);
  };
  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Rule Name" name="ruleName">
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
    <div className=" grid grid-cols-1 gap-y-2">
      <div className=" flex justify-end">
        <Space>
          <Popover
            onOpenChange={handleOpenFilter}
            open={openFilter}
            content={searchContent}
            placement="bottomLeft"
            title="Search"
            trigger="click"
            overlayStyle={{ width: "calc(100% - 240px)" }}
          >
            <Button type="primary" className="button-blue" icon={<FilterOutlined />}>
              Filters
            </Button>
          </Popover>
          <Button type="primary" className="button-blue" onClick={() => toManage("add", null, null, null)}>
            Add Rule
          </Button>
        </Space>
      </div>

      <div>
        <div className=" col-span-1 space-y-5 md:top-1">
          <div className=" overflow-auto md:overflow-hidden">
            <Table
              size="small"
              loading={loading}
              columns={columns}
              dataSource={dataTable}
              rowKey={"ruleCode"}
              pagination={{ total: paginationConfig, current: filter?.current, showSizeChanger: false }}
              onChange={handlerPaginationTable}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default RuleTable;
