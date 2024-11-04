import React, { CSSProperties, useEffect, useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  CollapseProps,
  TableColumnsType,
  TableColumnType,
  TablePaginationConfig,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Card,
  Collapse,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import { ITCustomerGroup } from "@/app/common/customer";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
import { CaretRightOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { ITCustomerProduct } from "@/app/common/product";
import ProjectTable from "./project-table";
import { ITProject } from "@/app/common/project";

export interface props {
  customerGroupId: string;
  customerProductsByCustomerGroup: ITCustomerProduct[];
  projectDatas: ITProject[];
  getProductDataTable: (
    productId: string,
    parentId: string,
    type: string
  ) => void;
}

const CustomerGroupProductList: React.FC<props> = ({
  customerGroupId,
  customerProductsByCustomerGroup,
  projectDatas,
  getProductDataTable,
}): React.ReactElement => {
  const panelStyle: React.CSSProperties = {
    marginBottom: 10,
    background: "#fff",
    borderRadius: 5,
    border: "1px solid #dcf0fa",
  };
  const dataList: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) =>
    customerProductsByCustomerGroup.map((product) => {
      const label = (
        <div className="  text-xs text-center grid grid-cols-7">
          <div>
            <div>Name</div>
            <div className=" font-bold">{product.name}</div>
          </div>

          <div>
            <div>Active Status</div>
            <div className=" font-bold">
              {product.activeStatus ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">not Active</Tag>
              )}
            </div>
          </div>
        </div>
      );
      return {
        key: product.id,
        label: label,
        children: (
          <ProjectTable
            productId={product.id}
            projectDatas={projectDatas}
            parentId={customerGroupId}
            getProductDataTable={getProductDataTable}
            parentType={"customer-group"}
          />
        ),
        style: panelStyle,
      };
    });

  return (
    <div>
      <div className=" flex justify-start mb-2">
        <div className=" font-bold text-base">Products</div>
      </div>
      <div>
        <Form layout="vertical" size="small">
          <div className=" grid grid-cols-4 gap-2">
            <Form.Item name={"referenceCode"} label={"Reference Code"}>
              <Input />
            </Form.Item>
            <Form.Item name={"name"} label={"Name"}>
              <Input />
            </Form.Item>
            <Form.Item name={"status"} label={"Status"}>
              <Select />
            </Form.Item>
          </div>
          <div className=" flex justify-end">
            <Button type="primary" size="small">
              Search
            </Button>
          </div>
        </Form>
        <div className=" mt-2 p-2 bg-slate-100" style={{ borderRadius: 5 }}>
          <div
            style={{ maxHeight: "500px" }}
            className=" bg-slate-100 mt-2  overflow-x-auto"
          >
            <Collapse
              accordion
              destroyInactivePanel={true}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{ background: " #f1f5f9" }}
              items={dataList(panelStyle)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerGroupProductList;
