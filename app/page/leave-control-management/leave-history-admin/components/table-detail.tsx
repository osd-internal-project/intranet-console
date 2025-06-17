"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Table, Tooltip } from "antd";
import { dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, CancelIcon, CheckIcon } from "@/components/icon";
import ExportDataLeaveAll from "../../until/export-excel";
import { ITypeDataLeave } from "../../common";
import { CheckStatusLeaveType, showStatusLeave } from "@/app/utils/validatefield";
import { dateFormatTimeNoTIme } from "@/app/utils";
import { LeaveDetailForm } from "./leave-detail-form";
import { intersection } from "lodash";

export interface props {
  dataLeaveUser: ITypeDataLeave[];
  setOpenModalDetail: (e: boolean) => void;
  openModalDetail: boolean;
  formdetail: any;
  onFinishUpdate: (type: string, id: number) => void;
  onFinishDelete: (type: string, id: number) => void;
  downloadFile: (id: number, filename: string) => void;
  sideMenuGroups: string[];
  setSubmitAction: (value: "approved" | "cancel") => void;
  submitAction: string;
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
}): React.ReactElement => {
  const { Search } = Input;
  const [statusById, setStatusById] = useState<any | null>(null);
  const [dataSource, setDataSource] = React.useState<any[]>([]);

  useEffect(() => {
    if (dataLeaveUser) {
      setDataSource(dataLeaveUser);
    }
  }, [dataLeaveUser]);

  const dataLeaveSearch = (value: string) => {
    const filteredData = dataSource.filter(
      (item) =>
        item.firstName?.toLowerCase().includes(value.toLowerCase()) ||
        item.lastName?.toLowerCase().includes(value.toLowerCase()) ||
        item.userApproved?.toLowerCase().includes(value.toLowerCase()) ||
        item.typeName?.toLowerCase().includes(value.toLowerCase()),
    );
    setDataSource(filteredData);
  };

  const fecthDataDetail = async (record: ITypeDataLeave) => {
    try {
      const base = {
        ...record,
        name: `${record.firstName} ${record.lastName}`,
        createAt: record.createdAt ? dateToStringThNoTime(record.createdAt) : "-",
        leaveHour: record.leaveHour ? (record.leaveHour % 8 === 0 ? `${record.leaveHour / 8} วัน` : `${record.leaveHour} ชม.`) : "ไม่มีข้อมูล",
        startDate: record?.startDate ? dateToStringThNoTime(record?.startDate) : "-",
        endDate: record?.endDate ? dateToStringThNoTime(record?.endDate) : "-",
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

  const columns: any = [
    {
      key: "id",
      dataIndex: "id",
      title: "ชื่อ - นามสกุล",
      render: (e: string, row: ITypeDataLeave) => {
        return <>{`${row.firstName} ${row.lastName}`}</>;
      },
    },
    { key: "typeName", dataIndex: "typeName", title: "ประเภทการลา" },
    {
      key: "id",
      dataIndex: "id",
      title: "วันที่ลา",
      render: (e: string, row: ITypeDataLeave) => {
        return row?.startDate && row?.endDate ? `${dateToStringThNoTime(row?.startDate)} ถึง ${dateToStringThNoTime(row?.endDate)}` : "-";
      },
    },

    {
      key: "userApproved",
      dataIndex: "userApproved",
      title: "ผู้อนุมัติ",
      render: (userApproved: string) => (userApproved ? userApproved : "-"),
    },
    {
      key: "approvedDate",
      dataIndex: "approvedDate",
      title: "วันที่อนุมัติ",
      render: (value: any) => dateFormatTimeNoTIme(value),
    },
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
      title: "...",
      align: "center",
      render: (e: string, row: ITypeDataLeave, index: number) => {
        return (
          <>
            <Button size="small" type="primary" ghost onClick={() => fecthDataDetail(row)}>
              {`รายละเอียด`}
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <>
        <Modal forceRender open={openModalDetail} footer={false} onCancel={() => setOpenModalDetail(false)} width={600}>
          <LeaveDetailForm
            formdetail={formdetail}
            downloadFile={(id: number, filename: string) => downloadFile(id, filename)}
            statusById={statusById}
            sideMenuGroups={sideMenuGroups}
            onFinishUpdate={onFinishUpdate}
            onFinishDelete={onFinishDelete}
            setSubmitAction={setSubmitAction}
            submitAction={submitAction}
          />
        </Modal>
      </>

      <div style={{ justifyContent: "space-between", display: "flex" }}>
        <div style={{ justifyContent: "start", display: "flex", alignItems: "center" }}>{showStatusLeave()}</div>
        <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
          <div>
            <Form layout="inline">
              <Form.Item>
                <Search placeholder="ค้นหา" onSearch={dataLeaveSearch} enterButton />
              </Form.Item>
            </Form>
          </div>
          <div>
            <ExportDataLeaveAll data={dataLeaveUser} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Table dataSource={dataLeaveUser.length > 0 ? dataLeaveUser : []} columns={columns} size="small" rowKey="id" scroll={{ x: "max-content" }} />
      </div>
    </div>
  );
};
