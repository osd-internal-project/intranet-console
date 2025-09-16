import React, { useContext, useEffect, useState } from "react";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import DataLeaveService from "../../../../services/leave-management.service";
import { Spin, Table, Typography, type TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import { dateFormatTimeNoTIme } from "@/app/utils";

export const TableTotalLeaveDetailPage = () => {
  const { id24Axios, tokenAccess } = useId24();
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const sideMenuGroups =
    tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];
  const baseUrlIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const [params, setParams] = useState<{ type: string; value: string }>({ type: "", value: "" });
  const [getdata, setData] = useState<{
    data: {
      id: number;
      email: string;
      firstNameTh: string;
      lastNameTh: string;
      leaveSummary: { id: number; userId: string; type_leave: string; count: number; leaveHour: number; limit: number }[];
      startWork: string | Date;
      totalCount: 0;
      totalLeaveHour: 0;
      userId: string;
      username: string;
    }[];
    count: number;
  }>({ data: [], count: 0 });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      fecthData();
    }
  }, [loading]);

  const fecthData = async () => {
    setLoading(true);
    const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take = Number(pagination.pageSize);
    const response = await DataLeaveService(baseUrlIntranet).getdataLeaveDetailBygroup(params, skip, take);
    setData(response);
    console.log(response);
    setLoading(false);
  };

  const columns: ColumnsType<{
    id: number;
    email: string;
    firstNameTh: string;
    lastNameTh: string;
    leaveSummary: { id: number; userId: string; type_leave: string; count: number; leaveHour: number; limit: number }[];
    startWork: string | Date;
    totalCount: 0;
    totalLeaveHour: 0;
    userId: string;
    username: string;
  }> = [
    {
      title: "username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "ชื่อ - นามสกุล",
      dataIndex: "userId",
      key: "userId",
      render: (value: string, records: any) => {
        return (
          <div>
            <Typography>{`${records.firstNameTh} ${records.lastNameTh}`}</Typography>
          </div>
        );
      },
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "วันที่เริ่มงาน",
      dataIndex: "startWork",
      key: "startWork",
      render: (value: string | Date) => dateFormatTimeNoTIme(value),
    },
  ];

  const orderColumns: ColumnsType<{ id: number; type_leave: string; count: number; leaveHour: number; limit: number; userId: string }> = [
    {
      title: "ประเภทการลา",
      dataIndex: "type_leave",
      key: "type_leave",
    },
    {
      title: "จำนวนครั้งที่ลา",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "ลาไปแล้ว",
      dataIndex: "leaveHour",
      key: "leaveHour",
      render: (value: number) => {
        const days = value / 8;
        return `${Number.isInteger(days) ? days : days.toFixed(1)} วัน`;
      },
    },
    {
      title: "สามารถลาได้สูงสุด",
      dataIndex: "limit",
      key: "limit",
      render: (value: number) => {
        const days = value / 8;
        return `${Number.isInteger(days) ? days : days.toFixed(1)} วัน`;
      },
    },
    {
      title: "เหลือวันลา",
      dataIndex: "limit",
      key: "limit",
      render: (value: number, record: { type_leave: string; count: number; leaveHour: number; limit: number; userId: string }) => {
        const days = (value - record.leaveHour) / 8;
        return `${Number.isInteger(days) ? days : days.toFixed(1)} วัน`;
      },
    },
  ];

  const expandedRowRender = (record: {
    email: string;
    firstNameTh: string;
    lastNameTh: string;
    leaveSummary: { id: number; type_leave: string; count: number; leaveHour: number; limit: number; userId: string }[];
    startWork: string | Date;
    totalCount: 0;
    totalLeaveHour: 0;
    userId: string;
    username: string;
  }) => {
    return (
      <Table<{ id: number; type_leave: string; count: number; leaveHour: number; limit: number; userId: string }>
        size="small"
        columns={orderColumns}
        dataSource={record.leaveSummary}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />
    );
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };
  return (
    <div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={getdata.data}
          pagination={{ ...pagination, total: getdata.count }}
          onChange={changePagination}
          rowKey={"userId"}
          scroll={{ x: "max-content" }}
          size="small"
          expandable={{
            expandedRowRender,
            columnTitle: "รายละเอียดเพิ่มเติม",
            columnWidth: 140,
          }}
        />
      </Spin>
    </div>
  );
};
