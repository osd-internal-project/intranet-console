"use client";
import { dateToStartofDay, dateToEndofDay } from "@/app/utils/format";
import { IconExport } from "@/components/icon";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Popover, Row, Space } from "antd";
import React, { useState } from "react";
import { ITypeInventoryFIlters } from "../common";
export interface props {
  prop: (search: object) => void;
}
export const FiltersInventory: React.FC<props> = ({ prop }) => {
  const { RangePicker } = DatePicker;
  const [openFilter, setOpenFilter] = useState(false);
  const onFilter = async (value: ITypeInventoryFIlters) => {
    let search = {};
    if (value.inventoryName) {
      search = { ...search, inventoryName: { contains: value.inventoryName } };
    }
    if (value.locationPlace) {
      search = { ...search, locationPlace: { contains: value.locationPlace } };
    }
    if (value.phoneNumber) {
      search = { ...search, phoneNumber: { contains: value.phoneNumber } };
    }
    if (value.createdAt) {
      search = {
        ...search,
        createdAt: {
          gte: dateToStartofDay(value.createdAt[0]),
          lte: dateToEndofDay(value.createdAt[1]),
        },
      };
    }
    prop(search);
    setOpenFilter(false);
  };
  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Inventory Name" name="inventoryName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Location Place" name="locationPlace">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Created" name="createdAt">
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

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };

  return (
    <div>
      <Row gutter={[8, 8]} style={{ justifyContent: "space-between", display: "flex", alignItems: "center" }}>
        <Col>
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
        </Col>
        <Col>
          {/* <Button style={{ justifyContent: "space-between", display: "flex", alignItems: "center" }} className="button-blue">
            <Space>
              {IconExport}
              {`Export`}
            </Space>
          </Button> */}
        </Col>
      </Row>
    </div>
  );
};
