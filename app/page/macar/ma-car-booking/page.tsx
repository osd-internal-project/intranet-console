"use client";
import React, { useState, useEffect, useContext } from "react";
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
import MaCarBook from "./components/ma-car-book";
import MaCarReturn from "./components/ma-car-return";
import { MaCarBookServices } from "../../../services/ma-car-book.service";
import { MaCarType, MaCarBookType, ProvincesType } from "../common/index";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { MasterProvinceThailandServices } from "@/app/services/master-province-thailaind.service";

const MaCarBooking: React.FC = () => {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );
  const intraAuthService = MaCarBookServices(baseUrIntranet);
  const masterprovincethailandServices =
    MasterProvinceThailandServices(baseUrIntranet);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [maCarBookData, setMaCarBookData] = useState<MaCarBookType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [masterDataProvinces, setMasterDataProvinces] = useState<
    { value: string; label: string }[]
  >([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    if (loading) fetchData();
  }, [loading, user]);

  // คืนรถ
  const fetchData = async () => {
    if (!user) {
      return true;
    }
    try {
      const maCarBook = await intraAuthService.getMaCarBookQuery(user?.userId);
      setMaCarBookData(maCarBook);
      setPagination({ ...pagination });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    masterFecthData();
  }, []);

  const masterFecthData = async () => {
    const masterdataProvince = await masterprovincethailandServices.findAll();
    const optionsProvinces = masterdataProvince.map((event: ProvincesType) => ({
      value: event.nameProvinceTH,
      label: event.nameProvinceTH,
    }));
    const maCar = await intraAuthService.getMaCarQuery();
    setMasterDataProvinces(optionsProvinces);
    setMaCarData(maCar);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "การจองรถ",
      children: (
        <MaCarBook
          maCarData={maCarData}
          masterDataProvinces={masterDataProvinces}
        />
      ),
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

  return (
    <>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                title: <span>แบบฟอร์มการจองรถ</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>แบบฟอร์มการจองรถ</span>
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
