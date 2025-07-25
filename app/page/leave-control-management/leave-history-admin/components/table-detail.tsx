"use client";
import React, { useState } from "react";
import { Button, Form, FormInstance, Input, Modal, Select, Table } from "antd";
import { dateToStringThNoTime } from "@/app/utils/format";
import { ExcelIcon } from "@/components/icon";
import { ITypeDataLeave } from "../../common";
import { CheckStatusLeaveType, showStatusLeave } from "@/app/utils/validatefield";
import { dateFormatTimeNoTIme } from "@/app/utils";
import { LeaveDetailForm } from "./leave-detail-form";
import { ColumnsType } from "antd/es/table";

export interface props {
  dataLeaveUser: ITypeDataLeave[];
  setOpenModalDetail: (e: boolean) => void;
  openModalDetail: boolean;
  formdetail: FormInstance;
  onFinishUpdate: (values: string, type: string, id: number) => void;
  onFinishDelete: (type: string, id: number) => void;
  downloadFile: (id: number, filename: string) => void;
  sideMenuGroups: string[];
  setSubmitAction: (value: "approved" | "cancel") => void;
  submitAction: string;
  setParams: (data: { type: string; value: string }) => void;
  setLoading: (value: boolean) => void;
  handleExport: () => void;
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
}): React.ReactElement => {
  const [form] = Form.useForm();
  const [statusById, setStatusById] = useState<string | null>(null);

  const dataLeaveSearch = (value: any) => {
    setParams(value);
    setLoading(true);
  };

  const fecthDataDetail = async (record: ITypeDataLeave) => {
    try {
      const base = {
        ...record,
        name: `${record.firstName} ${record.lastName}`,
        createAt: record.createdAt ? dateToStringThNoTime(record.createdAt) : "-",
        leaveHour: record.leaveHour ? (record.leaveHour % 8 === 0 ? `${record.leaveHour / 8} วัน` : `${record.leaveHour} ชม.`) : "ไม่มีข้อมูล",
        startDate: record?.startDate ? dateToStringThNoTime(record?.startDate as any) : "-",
        endDate: record?.endDate ? dateToStringThNoTime(record?.endDate as any) : "-",
        typeLeave: record.typeName,
        approvedDate: record.approvedDate ? dateToStringThNoTime(record?.approvedDate) : "-",
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
        row?.startDate && row?.endDate ? `${dateToStringThNoTime(row?.startDate as any)} ถึง ${dateToStringThNoTime(row?.endDate as any)}` : "-",
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
      render: (e, row) => (
        <Button size="small" type="primary" ghost onClick={() => fecthDataDetail(row)}>
          {`รายละเอียด`}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ justifyContent: "space-between", display: "flex" }}>
        <div style={{ justifyContent: "start", display: "flex", alignItems: "center" }}>{showStatusLeave()}</div>
        <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
          <div>
            <Form layout="inline" onFinish={dataLeaveSearch} form={form}>
              <Form.Item label={`Type`} name={`type`} rules={[{ required: true }]} className="w-48">
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
              </Form.Item>
              <Form.Item shouldUpdate>
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
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Button type="default" onClick={handleExport} icon={<ExcelIcon width="1.5rem" height="1.5rem" />}>
            {`ดาวน์โหลดไฟล์`}
          </Button>
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Table dataSource={dataLeaveUser.length > 0 ? dataLeaveUser : []} columns={columns} size="small" rowKey="id" scroll={{ x: "max-content" }} />
      </div>
      {openModalDetail ? (
        <Modal forceRender open={openModalDetail} footer={false} onCancel={() => setOpenModalDetail(false)} width={600}>
          <LeaveDetailForm
            formdetail={formdetail}
            downloadFile={(id: number, filename: string) => downloadFile(id, filename)}
            statusById={statusById as string}
            sideMenuGroups={sideMenuGroups}
            onFinishUpdate={onFinishUpdate}
            onFinishDelete={onFinishDelete}
            setSubmitAction={setSubmitAction}
            submitAction={submitAction}
          />
        </Modal>
      ) : null}
    </div>
  );
};
