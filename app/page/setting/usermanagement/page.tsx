"use client";
import { Breadcrumb, Button, Card, Col, Row, Table } from "antd";
import UserTable from "./components/UserTable";
import { useState } from "react";
import Link from "next/link";
import { checkRule } from "@/app/utils/rules";
import { useRouter } from "next/router";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";
export default function UsermanagementPage() {
  // const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<object>({});
  const propLoading = (load: boolean, searchdata: any) => {
    let search = {};
    if (searchdata.userId) {
      search = { ...search, userId: { contains: searchdata.userId } };
    }
    if (searchdata.userName) {
      search = { ...search, username: { contains: searchdata.userName } };
    }
    if (searchdata.phoneNumber) {
      search = { ...search, phoneNumber: { contains: searchdata.phoneNumber } };
    }
    if (searchdata.email) {
      search = { ...search, email: { contains: searchdata.email } };
    }
    if (searchdata.firstNameTh) {
      search = { ...search, firstNameTh: { contains: searchdata.firstNameTh } };
    }
    if (searchdata.lastNameTh) {
      search = { ...search, lastNameTh: { contains: searchdata.lastNameTh } };
    }
    if (searchdata.activeStatus !== null || searchdata.activeStatus !== undefined) {
      search = { ...search, activeStatus: searchdata.activeStatus };
    }
    if (searchdata.positionId) {
      search = { ...search, masterPositionId: searchdata.positionId };
    }
    if (searchdata.created) {
      search = {
        ...search,
        createdAt: {
          gte: dateToStartofDay(searchdata.created[0]),
          lte: dateToEndofDay(searchdata.created[1]),
        },
      };
    }
    setSearch(search);
    setLoading(load);
  };
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Breadcrumb
          items={[
            {
              href: "/page",
              title: <span>Home</span>,
            },
            {
              href: "/page/setting",
              title: <span>Setting</span>,
            },
            {
              title: <span>User Management </span>,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <div className="title-page-font">{`USER MANAGEMENT`}</div>
      </Col>
      <Col span={24}>
        <UserTable loading={loading} propLoading={propLoading} search={search} />
      </Col>
    </Row>
  );
}
