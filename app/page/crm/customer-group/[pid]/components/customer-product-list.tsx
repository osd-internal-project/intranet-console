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
  customerId: number;
  projectDatas: ITProject[];
  customerProductsByCustomer: ITCustomerProduct[];
  getProjectDataTable: (
    productId: string,
    parentId: string,
    type: string,
    search: any
  ) => void;
}

const CustomerProductList: React.FC<props> = ({
  customerId,
  projectDatas,
  customerProductsByCustomer,
  getProjectDataTable,
}): React.ReactElement => {
  const panelStyle: React.CSSProperties = {
    marginBottom: 10,
    background: "#fff",
    borderRadius: 5,
    border: "1px solid #dcf0fa",
  };
  console.log(customerProductsByCustomer);
  const dataList: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) =>
    customerProductsByCustomer &&
    customerProductsByCustomer.map((product) => {
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
      // const children = <CustomerSubDetails details={branch} />;
      return {
        key: product.id,
        label: label,
        children: (
          <>
            <ProjectTable
              productId={product.id}
              parentId={String(customerId)}
              parentType={"customer"}
              projectDatas={projectDatas}
              getProjectDataTable={getProjectDataTable}
            />
          </>
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
        <div className=" mt-2 p-2 bg-slate-100" style={{ borderRadius: 5 }}>
          <div
            style={{ maxHeight: "500px" }}
            className=" bg-slate-100 mt-2  overflow-x-auto"
          >
            {customerProductsByCustomer.length > 0 ? (
              <Collapse
                collapsible="icon"
                destroyInactivePanel={true}
                accordion
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                style={{ background: " #f1f5f9" }}
                items={dataList(panelStyle)}
              />
            ) : (
              <div className=" flex justify-center">Products Not Found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductList;
