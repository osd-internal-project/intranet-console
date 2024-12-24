"use client";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Row,
  TablePaginationConfig,
  Tabs,
} from "antd";
import Link from "next/link";

import { useEffect, useState } from "react";
import VenderTableComponent from "./components/vender-table";
import { ITCustomerGroup } from "@/app/common/customer";
export default function Venders() {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataTable, setDataTable] = useState<any[]>([]);
  useEffect(() => {
    const dataTable = [
      { id: 1, venderName: "Vender 1", createdDate: new Date() },
    ];
    setDataTable(dataTable);
  }, []);

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              title: <Link href={"/page"}>Home</Link>,
            },
            {
              title: <span>Vender</span>,
            },
            {
              title: <span>Venders</span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`Venders`}</div>
      </Col>

      <Col span={24}>
        <div className="grid grid-cols-1 ">
          <div className=" flex justify-end mb-2">
            <Button type="primary">Add Vender</Button>
          </div>
          <Card>
            <div className=" font-bold">ข้อมูลผู้ขาย</div>
          </Card>
          <div>
            <VenderTableComponent
              dataTable={dataTable}
              pagination={pagination}
              changePagination={function (page: TablePaginationConfig): void {
                throw new Error("Function not implemented.");
              }}
              onOpenEdit={function (data: ITCustomerGroup): void {
                throw new Error("Function not implemented.");
              }}
              handdleDelete={function (id: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}
