"use client";
import React, { useState } from "react";
import type { Dayjs } from "dayjs";
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Modal,
  Popover,
  Select,
  Table,
} from "antd";
import { dateToStringThNoTime } from "@/app/utils/format";
import { ExcelIcon } from "@/components/icon";
import { ITypeDataLeave, type ITypetypeleave } from "../../common";
import {
  CheckStatusLeaveType,
  showStatusLeave,
} from "@/app/utils/validatefield";
import { dateFormatTimeNoTIme } from "@/app/utils";
import { LeaveDetailForm } from "./leave-detail-form";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";

const { RangePicker } = DatePicker;

export interface props {
  dataLeaveUser: { data: ITypeDataLeave[]; count: number };
  setOpenModalDetail: (e: boolean) => void;
  openModalDetail: boolean;
  formdetail: FormInstance;
  onFinishUpdate: (values: string, type: string, id: number) => void;
  onFinishDelete: (type: string, id: number) => void;
  downloadFile: (id: number, filename: string) => void;
  sideMenuGroups: string[];
  setSubmitAction: (value: "approved" | "cancel") => void;
  submitAction: string;
  setParams: (data: object) => void;
  setLoading: (value: boolean) => void;
  handleExport: () => void;
  pagination: TablePaginationConfig;
  changePagination: (pagination: TablePaginationConfig) => void;
  dataDetailLeaveHour: (userId: string, typeId: number) => void;
  typeLeavebyTypeId?: ITypetypeleave;
}

export const TableDetail: React.FC<props> = ({
  dataLeaveUser,
  setOpenModalDetail,
  openModalDetail,
  formdetail,
  onFinishUpdate,
  onFinishDelete,
  downloadFile,
  sideMenuGroups,
  setSubmitAction,
  submitAction,
  setParams,
  setLoading,
  handleExport,
  pagination,
  changePagination,
  dataDetailLeaveHour,
  typeLeavebyTypeId,
}): React.ReactElement => {
  const [form] = Form.useForm();
  const [statusById, setStatusById] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  interface LeaveSearchFormValues {
    fullname?: string;
    typeName?: string;
    leaveAt?: [Dayjs, Dayjs];
    createdAt?: [Dayjs, Dayjs];
    status?: string;
  }

  const dataLeaveSearch = (value: LeaveSearchFormValues) => {
    const params = {
      ...value,
      leaveAt: value.leaveAt?.map((d) => d.format("YYYY-MM-DD")),
      createdAt: value.createdAt?.map((d) => d.format("YYYY-MM-DD")),
    };
    setIsFilterOpen(false);
    setParams(params);
    setLoading(true);
  };

  const fecthDataDetail = async (record: ITypeDataLeave) => {
    formdetail.resetFields();
    if (!record.userId || !record.typeId) {
      return false;
    }
    await dataDetailLeaveHour(record.userId, record.typeId);

    try {
      const base = {
        ...record,
        name: `${record.firstName} ${record.lastName}`,
        createAt: record.createdAt
          ? dateToStringThNoTime(record.createdAt)
          : "-",
        leaveHour: record.leaveHour
          ? record.leaveHour % 8 === 0
            ? `${record.leaveHour / 8} วัน`
            : `${record.leaveHour} ชม.`
          : "ไม่มีข้อมูล",
        startDate: record?.startDate
          ? dateToStringThNoTime(record?.startDate as any)
          : "-",
        endDate: record?.endDate
          ? dateToStringThNoTime(record?.endDate as any)
          : "-",
        typeLeave: record.typeName,
        approvedDate: record.approvedDate
          ? dateToStringThNoTime(record?.approvedDate)
          : "-",
        reqLeaveHour: record.leaveHour,
        yearLeaveHour: record.yearLeaveHour,
        usedLeaveHour: record.usedLeaveHour,
        beforeLeaveHour: record.beforeLeaveHour,
        afterLeaveHour: record.afterLeaveHour,
      };
      setStatusById(record.status);
      formdetail.setFieldsValue(base);
      setOpenModalDetail(true);
    } catch (err) {
      console.log(err);
    }
  };

  const columns: ColumnsType<ITypeDataLeave> = [
    {
      key: "status",
      dataIndex: "status",
      title: "สถานะ",
      align: "center",
      render: (status: string) => CheckStatusLeaveType(status),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "ชื่อ - นามสกุล",
      render: (e, row) => `${row.firstName} ${row.lastName}`,
    },
    { key: "typeName", dataIndex: "typeName", title: "ประเภทการลา" },
    {
      key: "id",
      dataIndex: "id",
      title: "วันที่ลา",
      render: (e, row) =>
        row?.startDate && row?.endDate
          ? `${dateToStringThNoTime(row?.startDate as any)} ถึง ${dateToStringThNoTime(row?.endDate as any)}`
          : "-",
    },
    {
      key: "leaveHour",
      dataIndex: "leaveHour",
      title: "จำนวนที่ลา",
      render: (e) => {
        if (!e) return "-";
        const sumHours = e / 8;
        return e < 8 ? `${e} ช.ม.` : `${sumHours} วัน`;
      },
    },
    {
      key: "userApproved",
      dataIndex: "userApproved",
      title: "ผู้อนุมัติ",
      render: (userApproved) => (userApproved ? userApproved : "-"),
    },
    {
      key: "approvedDate",
      dataIndex: "approvedDate",
      title: "วันที่อนุมัติ",
      render: (value) => dateFormatTimeNoTIme(value),
    },

    {
      key: "id",
      dataIndex: "id",
      title: "...",
      align: "center",
      render: (e, row) => {
        return (
          <Button
            size="small"
            type="primary"
            ghost
            onClick={() => fecthDataDetail(row)}
          >
            {`รายละเอียด`}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
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
              <Form layout="vertical" onFinish={dataLeaveSearch} form={form}>
                {/* <Form.Item
                  label={`Type`}
                  name={`type`}
                  rules={[{ required: true }]}
                  className="w-48"
                >
                  <Select
                    className="w-full"
                    allowClear
                    placeholder={`Select`}
                    options={[
                      { value: "fullname", label: "ชื่อ - สกุล" },
                      { value: "status", label: "สถานะ" },
                      { value: "type_name", label: "ประเภทการลา" },
                    ]}
                  />
                </Form.Item> */}
                {/* <Form.Item shouldUpdate>
                  {() => {
                    const type = form.getFieldValue("type");
                    if (type === "status") {
                      return (
                        <Form.Item name="value" noStyle>
                          <Select
                            placeholder="เลือกสถานะ"
                            options={[
                              { value: "approved", label: `อนุมัติ` },
                              { value: "waiting", label: `รอการอนุมัติ` },
                              { value: "cancel", label: `ไม่อนุมัติ` },
                            ]}
                            allowClear
                          />
                        </Form.Item>
                      );
                    } else {
                      return (
                        <Form.Item name="value" noStyle>
                          <Input placeholder="ค้นหา" />
                        </Form.Item>
                      );
                    }
                  }}
                </Form.Item> */}
                <div className=" grid grid-cols-4  gap-4">
                  <Form.Item name={"fullname"} label="ชื่อพนักงาน">
                    <Input placeholder="Full Name" />
                  </Form.Item>
                  <Form.Item name={"typeName"} label="ประเภทการลา">
                    <Input placeholder="ประเภทการลา" />
                  </Form.Item>
                  <Form.Item name={"leaveAt"} label="วันที่ลา">
                    <RangePicker format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item name={"createdAt"} label="วันที่ทำรายการ">
                    <RangePicker format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item name="status" label="สถานะการลา">
                    <Select
                      placeholder="เลือกสถานะ"
                      options={[
                        { value: "approved", label: `อนุมัติ` },
                        { value: "waiting", label: `รอการอนุมัติ` },
                        { value: "cancel", label: `ไม่อนุมัติ` },
                      ]}
                      allowClear
                    />
                  </Form.Item>
                </div>{" "}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                </Form.Item>
              </Form>
            }
          >
            <Button type="primary">Filters</Button>
          </Popover>
        </div>
        <div
          className=" space-x-2"
          style={{
            justifyContent: "end",
            display: "flex",
            alignItems: "center",
          }}
        >
          {showStatusLeave()}
          <Button
            type="default"
            onClick={handleExport}
            icon={<ExcelIcon width="1.5rem" height="1.5rem" />}
          >
            {`ดาวน์โหลดไฟล์`}
          </Button>
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Table
          dataSource={dataLeaveUser.data}
          columns={columns}
          size="small"
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{ ...pagination, total: dataLeaveUser.count }}
          onChange={changePagination}
        />
      </div>
      {openModalDetail ? (
        <Modal
          forceRender
          open={openModalDetail}
          footer={false}
          onCancel={() => setOpenModalDetail(false)}
          width={600}
        >
          <LeaveDetailForm
            formdetail={formdetail}
            downloadFile={(id: number, filename: string) =>
              downloadFile(id, filename)
            }
            statusById={statusById as string}
            sideMenuGroups={sideMenuGroups}
            onFinishUpdate={onFinishUpdate}
            onFinishDelete={onFinishDelete}
            setSubmitAction={setSubmitAction}
            submitAction={submitAction}
            typeLeavebyTypeId={typeLeavebyTypeId}
          />
        </Modal>
      ) : null}
    </div>
  );
};
