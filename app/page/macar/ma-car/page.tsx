"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  TabsProps,
  Tabs,
  Divider,
  TablePaginationConfig,
} from "antd";
import { CalendarDays, Plus } from "lucide-react";
import { MaCarServices } from "../../../services/ma-car.service";
import { MaCarBookServices } from "../../../services/ma-car-book.service";
import {
  MaCarType,
  MaCarBookType,
  dataMaCarbook,
  ProvincesType,
  MaCarBookCalendarType,
} from "../common/index";

import CalendarComponent from "./components/car-calendar";
import MaCarTable from "./components/car-table";
import CarStatus from "./components/car-status";
import CarBookNew from "./components/car-book-new";
import MaCarReturn from "../ma-car-booking/components/ma-car-return";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import MasterHolidaysService from "../../setting/master-holidays/services/index.service";
import dayjs, { Dayjs } from "dayjs";
import { MasterProvinceThailandServices } from "@/app/services/master-province-thailaind.service";

const MaCar: React.FC = () => {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );
  const masterprovincethailandServices =
    MasterProvinceThailandServices(baseUrIntranet);
  const intraAuthService = MaCarServices(baseUrIntranet);
  const bookService = MaCarBookServices(baseUrIntranet);
  const holidayService = MasterHolidaysService(baseUrIntranet);
  const [maCarBookData, setMaCarBookData] = useState<dataMaCarbook[]>([]);
  const [maFetchCalendar, setMaFetchCalendar] = useState<
    MaCarBookCalendarType[]
  >([]);
  const [maCarData, setMaCarData] = useState<MaCarType[]>([]);
  const [myBookings, setMyBookings] = useState<MaCarBookType[]>([]);
  const [month, setMonth] = useState<Dayjs | string>(dayjs());
  const [loading, setLoading] = useState<boolean>(true);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [dataProvinces, setDataProvinces] = useState<
    { value: string; label: string }[]
  >([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (loading) {
      fetchData();
    }
    fecthMasterData();
  }, [loading, user]);

  const fetchData = async () => {
    const skip: number =
      (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take: number = Number(pagination.pageSize);
    try {
      if (user) {
        const maCarBook = await intraAuthService.findMaCarBook(skip, take);
        setMaCarBookData(maCarBook);
        const yearNow = dayjs().format("YYYY");
        const holidayData = await holidayService.getHolidayByYear(yearNow);
        const mapHoliday: MaCarBookCalendarType[] = holidayData.map(
          (events: any) => {
            const mapData = {
              id: events.id,
              carName: events.holidaysName,
              carBookStartDate: events.holidaysDate,
              carBookEndDate: events.holidaysDate,
              carBookApprovedStatus: "holiday",
              description: "",
              userName: "",
            };
            return mapData;
          },
        );
        const maCalender = await intraAuthService.getMaCarBookCalendar(month);
        const mergeCalendar: MaCarBookCalendarType[] = [
          ...maCalender,
          ...mapHoliday,
        ];
        setMaFetchCalendar(mergeCalendar);
        // รายการจองของ user เอง — เลี้ยงแท็บคืนรถ
        const myBooks = await bookService.getMaCarBookQuery(user.userId);
        setMyBookings(myBooks ?? []);
        setPagination({ ...pagination, total: maCarBook.count });
        setLoading(false);
      }
    } catch (error) {}
  };

  const fecthMasterData = async () => {
    const maCar = await intraAuthService.getMaCarQuery();
    setMaCarData(maCar);
    const masterdataProvince = await masterprovincethailandServices.findAll();
    // console.log(masterdataProvince);

    const optionsProvinces = masterdataProvince.map((event: ProvincesType) => ({
      value: event.nameProvinceTH,
      label: event.nameProvinceTH,
    }));
    setDataProvinces(optionsProvinces);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  const handleChangeMonth = (month: Dayjs | string) => {
    setMonth(month);
    setLoading(true);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "จองรถ",
      icon: <Plus size={12}/>,
      children: (
        <CarBookNew
          dataProvinces={dataProvinces}
          onBooked={() => {
            setActiveKey("1");
            setLoading(true);
          }}
        />
      ),
    },
    {
      key: "2",
      label: "คืนรถ",
      children: (
        <MaCarReturn
          maCarBookData={myBookings}
          loading={loading}
          setLoading={setLoading}
        />
      ),
    },
    {
      key: "3",
      label: "แสดงข้อมูลแบบปฎิทิน",
      icon:<CalendarDays size={12}/>,
      children: (
        <CalendarComponent
          maFetchCalendar={maFetchCalendar}
          handleChangeMonth={handleChangeMonth}
        />
      ),
    },
    {
      key: "4",
      label: "แสดงข้อมูลแบบตาราง",
      children: (
        <MaCarTable
          maCarBookData={maCarBookData}
          pagination={pagination}
          changePagination={changePagination}
          loading={loading}
          setLoading={setLoading}
          maCarData={maCarData}
          dataProvinces={dataProvinces}
          maFetchCalendar={maFetchCalendar}
        />
      ),
    },
    {
      key: "5",
      label: "สถานะรถ",
      children: <CarStatus maCarData={maCarData} />,
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
                title: <span>ข้อมูลการจองรถยนต์</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div
            className="title-page-font"
            style={{ display: "flex", alignItems: "left" }}
          >
            <span style={{ marginRight: "8px" }}>ข้อมูลการจองรถยนต์</span>
          </div>
        </Divider>
        <Col span={24}>
          <div className="grid-span-1 space-y-2">
            <Card styles={{ body: { padding: "0px 10px 10px 10px" } }}>
              <div className=" mt-2">
                <Tabs
                  activeKey={activeKey}
                  onChange={setActiveKey}
                  items={items}
                />
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MaCar;
