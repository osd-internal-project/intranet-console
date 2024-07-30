"use client";

import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Divider,
  Row,
  Tabs,
  TabsProps,
  Form,
  TablePaginationConfig,
} from "antd";
import MaCarBook from "./components/maCarBook";
import MaCarReturn from "./components/maCarReturn";
import { useSession } from "next-auth/react";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { MaCarBookServices } from "./services/ma-car-book.service";
import { MaCarType, MaCarBookType } from "../common/index";
import { useSearchParams } from "next/navigation";

const MaCarBooking: React.FC = () => {
  const { data: session } = useSession();
  const intraAuth = useAxiosIntranet();
  const maCarBookServices = MaCarBookServices(intraAuth);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [maCarBookData, setMaCarBookData] = useState<MaCarBookType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const searchParams = useSearchParams();

  const action = searchParams.get("action");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ทำการจองรถ",
      children: <MaCarBook maCarData={maCarData} setLoading={setLoading} />,
    },

    {
      key: "2",
      label: "การคืนรถ",
      children: (
        <MaCarReturn
          maCarBookData={maCarBookData}
          loading={loading}
          setLoading={setLoading}
        />
      ),
    },
  ];

  const fetchData = async () => {
    form.setFieldsValue({
      createdByName: `${session?.user.firstNameTh || ""} ${
        session?.user.lastNameTh || ""
      }`,
    });
  
    try {
      const maCar = await maCarBookServices.getMaCarQuery();
      setMaCarData(maCar);

      setPagination({ ...pagination, total: maCar.count });
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    const userIdData = session?.user.userId;

    const maCarBook = await maCarBookServices.getMaCarBookQuery(userIdData);

    const MaCarBook: MaCarBookType[] = maCarBook.map(
      (item: any, index: number) => ({
        ...item,
        key: index.toString(),
      })
    );
    setMaCarBookData(MaCarBook);

    setLoading(false);
  };

  useEffect(() => {
    if (loading) fetchData();
  }, [loading]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Ma Car Management</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>Ma Car Book</span>
          </div>
        </Divider>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card>
              <Tabs defaultActiveKey={action ?? "1"} items={items} />
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MaCarBooking;
