"use client";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Tabs, Divider, Form, Modal, Row, TabsProps, message, TablePaginationConfig } from "antd";
import { DepartmentCalendarDetail } from "./components/leave-history-calendar";
import DataLeaveService from "../../../services/leave-management.service";
import { ITypeDataLeave } from "../common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { TableDetail } from "./components/table-detail";
import { IFindAllDayDto } from "../../setting/master-holidays/common";
import dayjs, { Dayjs } from "dayjs";
import MasterHolidaysService from "../../setting/master-holidays/services/index.service";

export default function Page() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const [loading, setLoading] = useState<boolean>(true);
  const [month, setMonth] = useState<Dayjs | string>(dayjs());
  const [dataSource, setDataSource] = useState<{ data: ITypeDataLeave[]; count: number }>({ data: [], count: 0 });
  const [dataCalendarUser, setDataCalendar๊User] = useState<ITypeDataLeave[]>([]);
  const [dataCalendarGroup, setDataCalendarGroup] = useState<ITypeDataLeave[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [formdetail] = Form.useForm();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    if (loading) loadData();
  }, [loading, user]);

  const loadData = async () => {
    if (!user) return;
    const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take = Number(pagination.pageSize);
    try {
      const yearNow = dayjs().format("YYYY");
      const holidayService = MasterHolidaysService(baseUrlIntranet);
      const leaveService = DataLeaveService(baseUrlIntranet);
      const [holidayData, calendarTeams, calendarUser, { data, count }] = await Promise.all([
        holidayService.getHolidayByYear(yearNow),
        leaveService.getdataLeaveCalendarTeamsByMonth(month),
        leaveService.getdataLeaveCalendarByMonth(month),
        leaveService.getdataLeaveAll(user.userId, skip, take),
      ]);
      const holidayMappedData = holidayData.map((item: IFindAllDayDto) => ({
        id: item.id,
        firstName: item.holidaysName,
        lastName: "",
        startDate: item.holidaysDate,
        endDate: item.holidaysDate,
        description: "",
        typeName: "วันหยุด",
        status: "holiday",
      }));
      const mergedUserData = [...calendarUser, ...holidayMappedData];
      const mergedGroupData = [...calendarTeams, ...holidayMappedData];
      setDataCalendarGroup(mergedGroupData);
      setDataCalendar๊User(mergedUserData);
      setDataSource({ data, count });
    } catch (error) {
      console.error("Failed to load calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangemonth = (month: Dayjs | string) => {
    setMonth(month);
    setLoading(true);
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };
  const onFinishUpdate = async (type: string, id: number) => {
    Modal.confirm({
      title: <>{type === "cancel" ? "Cancel" : "Approved"}</>,
      icon: <ExclamationCircleFilled />,
      content: <>{type === "cancel" ? "Are you sure you want to cancel this ?" : "Are you sure you want to Approved this ?"}</>,
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const res = await DataLeaveService(baseUrlIntranet).approvedDataLeave("", type, id, user, "");
        if (res) {
          type === "cancel" ? message.error("cancel success") : message.success("approved success");
          setLoading(true);
          setOpenModalDetail(false);
        }
      },
      onCancel() {},
    });
  };

  async function downloadFile(id: number, name: string): Promise<void> {
    if (id) {
      const response = await DataLeaveService(baseUrlIntranet).downloadFile(id);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ปฏิทินการลา",
      children: (
        <DepartmentCalendarDetail
          handleChangemonth={handleChangemonth}
          dataSource={dataCalendarUser}
          downloadFile={(id: number, filename: string) => downloadFile(id, filename)}
        />
      ),
    },
    {
      key: "2",
      label: "ปฏิทินการลาทีม",
      children: (
        <DepartmentCalendarDetail
          handleChangemonth={handleChangemonth}
          dataSource={dataCalendarGroup}
          downloadFile={(id: number, filename: string) => downloadFile(id, filename)}
        />
      ),
    },
    {
      key: "3",
      label: "รายละเอียดการลา",
      children: (
        <TableDetail
          dataSource={dataSource}
          setOpenModalDetail={(e: boolean) => setOpenModalDetail(e)}
          openModalDetail={openModalDetail}
          formdetail={formdetail}
          onFinishUpdate={onFinishUpdate}
          downloadFile={(id: number, filename: string) => downloadFile(id, filename)}
          pagination={pagination}
          changePagination={changePagination}
        />
      ),
    },
  ];

  const onChange = () => {
    setLoading(true);
  };

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
                title: <span>ประวัติการลา</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`ประวัติการลา`}</div>
        </Divider>
        <div className="w-full">
          <Card>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Card>
        </div>
      </Row>
    </>
  );
}
