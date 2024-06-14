"use client";

import { FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popover,
  Row,
  Space,
} from "antd";
import Link from "next/link";
import { typeVenderFilter } from "../common";
import { checkRule } from "@/app/utils/rules";

export interface props {
  setLoading: (value: boolean) => void;
  onFilter: (value: typeVenderFilter) => void;
  handleOpenFilter: (event: boolean) => void;
  openFilter: boolean;
}

export const FilterVender: React.FC<props> = ({
  setLoading,
  onFilter,
  handleOpenFilter,
  openFilter,
}): React.ReactElement => {
  const { RangePicker } = DatePicker;
  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Vender Name" name="venderName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Created" name="createdAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item style={{ marginTop: "30px" }}>
          <Button type="primary" htmlType="submit" className="button-blue">
            {`Search`}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
  return (
    <>
      <Row
        gutter={[8, 8]}
        style={{ justifyContent: "space-between", display: "flex" }}
      >
        <Col>
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
              <Button
                className="button-blue"
                type="primary"
                icon={<FilterOutlined />}
              >
                {`Filters`}
              </Button>
            </Popover>
          </Space>
        </Col>
        <Col>
          {checkRule("sm-vender-a") ? (
            <Space>
              <Link href={`/page/stock-management/vender/addvender`}>
                <Button type="primary" icon={<PlusCircleOutlined />}>
                  <Space>{`Add Vender`}</Space>
                </Button>
              </Link>
            </Space>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </>
  );
};
