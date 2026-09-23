import React, { useContext, useEffect, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import * as XLSX from "xlsx";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import DataLeaveService from "../../../../services/leave-management.service";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Popover,
  Select,
  Spin,
  Table,
  Typography,
  type TablePaginationConfig,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { dateFormatTimeNoTIme } from "@/app/utils";
import { ExcelIcon } from "@/components/icon";
import type { ISelect, ITypetypeleave } from "../../common";
const { RangePicker } = DatePicker;
interface LeaveTotalRow {
  id: number;
  userId: string;
  username: string;
  firstNameTh: string;
  lastNameTh: string;
  email: string;
  startWork: string | Date;
  typeId: number;
  type_leave: string;
  count: number;
  leaveHour: number;
  limit: number;
}

interface LeaveTotalFilterValues {
  fullname?: string;
  typeId?: number;
  leaveAt?: [Dayjs, Dayjs];
}

interface LeaveTotalParams {
  fullname?: string;
  typeId?: number;
  startDate: string;
  endDate: string;
}

const defaultLeaveAt = (): [Dayjs, Dayjs] => [dayjs().startOf("year"), dayjs()];

const toLeaveTotalParams = (
  values: LeaveTotalFilterValues,
): LeaveTotalParams => {
  const [start, end] = values.leaveAt ?? defaultLeaveAt();
  return {
    fullname: values.fullname?.trim() || undefined,
    typeId: values.typeId,
    startDate: start.format("YYYY-MM-DD"),
    endDate: end.format("YYYY-MM-DD"),
  };
};

const formatDays = (hours: number) => {
  const days = hours / 8;
  return `${Number.isInteger(days) ? days : days.toFixed(1)} วัน`;
};

export const TableTotalLeaveDetailPage = () => {
  const { id24Axios, tokenAccess } = useId24();
  // const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  // const sideMenuGroups =
  //   tokenAccess && tokenAccess.userAccess.length > 0 ? Array.from(new Set(tokenAccess?.userAccess.map((item) => item.roles).flat())) : [];
  const baseUrlIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );
  const [form] = Form.useForm<LeaveTotalFilterValues>();
  const [params, setParams] = useState<LeaveTotalParams>(() =>
    toLeaveTotalParams({}),
  );
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [typeLeaveOptions, setTypeLeaveOptions] = useState<ISelect[]>([]);
  const [exporting, setExporting] = useState<boolean>(false);
  const [getdata, setData] = useState<{ data: LeaveTotalRow[]; count: number }>(
    { data: [], count: 0 },
  );
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

  useEffect(() => {
    DataLeaveService(baseUrlIntranet)
      .getdataAll()
      .then((types: ITypetypeleave[]) =>
        setTypeLeaveOptions(
          types.map((type) => ({ value: type.typeId, label: type.typeName })),
        ),
      );
  }, []);

  const onSearch = (values: LeaveTotalFilterValues) => {
    setParams(toLeaveTotalParams(values));
    setPagination((prev) => ({ ...prev, current: 1 }));
    setIsFilterOpen(false);
    setLoading(true);
  };

  const onResetFilter = () => {
    form.resetFields();
    onSearch({});
  };

  const handleExport = async () => {
    setExporting(true);
    const response =
      await DataLeaveService(baseUrlIntranet).getdataLeaveDetailBygroup(params);
    setExporting(false);
    if (!response.data.length) {
      message.warning("ไม่พบข้อมูลสำหรับดาวน์โหลด");
      return;
    }
    const rows = response.data.map((row: LeaveTotalRow, index: number) => ({
      ลำดับ: index + 1,
      username: row.username,
      "ชื่อ - นามสกุล": `${row.firstNameTh} ${row.lastNameTh}`,
      email: row.email,
      วันที่เริ่มงาน: row.startWork
        ? dayjs(row.startWork).format("DD/MM/YYYY")
        : "-",
      ประเภทการลา: row.type_leave,
      จำนวนครั้งที่ลา: row.count,
      "ลาไปแล้ว (วัน)": row.leaveHour / 8,
      "สามารถลาได้สูงสุด (วัน)": row.limit / 8,
      "เหลือวันลา (วัน)": (row.limit - row.leaveHour) / 8,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [8, 20, 30, 30, 15, 25, 15, 15, 20, 15].map((wch) => ({
      wch,
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ประวัติการลารวม");
    XLSX.writeFile(
      workbook,
      `ประวัติการลารวม-${params.startDate}_${params.endDate}.xlsx`,
    );
  };

  const fecthData = async () => {
    setLoading(true);
    const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
    const take = Number(pagination.pageSize);
    const response = await DataLeaveService(
      baseUrlIntranet,
    ).getdataLeaveDetailBygroup(params, skip, take);
    setData(response);
    console.log(response);
    setLoading(false);
  };

  // Rows arrive grouped by user; merge the user cells across that user's leave-type rows on this page
  const userRowSpan = (index: number) => {
    const rows = getdata.data;
    if (index > 0 && rows[index - 1]?.userId === rows[index].userId) return 0;
    let span = 1;
    while (rows[index + span]?.userId === rows[index].userId) span++;
    return span;
  };
  const mergeUserCell = (_: LeaveTotalRow, index?: number) => ({
    rowSpan: userRowSpan(index ?? 0),
  });

  const columns: ColumnsType<LeaveTotalRow> = [
    {
      title: "username",
      dataIndex: "username",
      key: "username",
      // onCell: mergeUserCell,
    },
    {
      title: "ชื่อ - นามสกุล",
      dataIndex: "userId",
      key: "fullname",
      // onCell: mergeUserCell,
      render: (_: string, record) => (
        <Typography>{`${record.firstNameTh} ${record.lastNameTh}`}</Typography>
      ),
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      // onCell: mergeUserCell,
    },
    {
      title: "วันที่เริ่มงาน",
      dataIndex: "startWork",
      key: "startWork",
      // onCell: mergeUserCell,
      render: (value: string | Date) => dateFormatTimeNoTIme(value),
    },
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
      render: (value: number) => formatDays(value),
    },
    {
      title: "สามารถลาได้สูงสุด",
      dataIndex: "limit",
      key: "limit",
      render: (value: number) => formatDays(value),
    },
    {
      title: "เหลือวันลา",
      dataIndex: "limit",
      key: "remaining",
      render: (value: number, record) => formatDays(value - record.leaveHour),
    },
  ];

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };
  return (
    <div>
      <Spin spinning={loading}>
        <div style={{ justifyContent: "space-between", display: "flex" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Popover
              onOpenChange={setIsFilterOpen}
              trigger={"click"}
              placement="bottomLeft"
              title={"Filters"}
              open={isFilterOpen}
              content={
                <Form
                  layout="vertical"
                  onFinish={onSearch}
                  form={form}
                  initialValues={{ leaveAt: defaultLeaveAt() }}
                >
                  <div className=" grid grid-cols-3  gap-4">
                    <Form.Item name={"fullname"} label="ชื่อพนักงาน">
                      <Input placeholder="Full Name" allowClear />
                    </Form.Item>
                    <Form.Item name={"typeId"} label="ประเภทการลา">
                      <Select
                        placeholder="ทั้งหมด"
                        options={typeLeaveOptions}
                        allowClear
                        className="min-w-40"
                      />
                    </Form.Item>
                    <Form.Item name={"leaveAt"} label="วันที่ลา">
                      <RangePicker format="YYYY-MM-DD" allowClear={false} />
                    </Form.Item>
                  </div>
                  <Form.Item>
                    <div className="space-x-2">
                      <Button type="primary" htmlType="submit">
                        Search
                      </Button>
                      <Button onClick={onResetFilter}>Reset</Button>
                    </div>
                  </Form.Item>
                </Form>
              }
            >
              <Button type="primary">Filters</Button>
            </Popover>
            <Typography.Text type="secondary" className="ml-3">
              {`วันที่ลา ${params.startDate} ถึง ${params.endDate}`}
            </Typography.Text>
          </div>
          <div
            className=" space-x-2"
            style={{
              justifyContent: "end",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              type="default"
              onClick={handleExport}
              loading={exporting}
              icon={<ExcelIcon width="1.5rem" height="1.5rem" />}
            >
              {`ดาวน์โหลดไฟล์`}
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={getdata.data}
          pagination={{ ...pagination, total: getdata.count }}
          onChange={changePagination}
          rowKey={(record) => `${record.userId}:${record.typeId}`}
          scroll={{ x: "max-content" }}
          size="small"
          bordered
        />
      </Spin>
    </div>
  );
};
