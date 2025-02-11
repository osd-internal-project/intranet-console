import React, { useState } from "react";
import { Button, Table } from "antd";
import { dateToStringThNoTime } from "@/app/utils/format";
import { ITypeDataLeave } from "../../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../../../../services/leave-management.service";
import { CheckStatusLeaveType, showStatus, showStatusLeave } from "@/app/utils/validatefield";
import { dateFormatTime } from "@/app/utils";
import { LeaveHistoryDetail } from "./leave-history-detail";

export interface props {
  dataSource: ITypeDataLeave[];
  setOpenModalDetail: (e: boolean) => void;
  openModalDetail: boolean;
  formdetail: any;
  onFinishUpdate: (type: string, id: number) => void;
  downloadFile: (id: number, filename: string) => void;
}

export const TableDetail: React.FC<props> = ({
  dataSource,
  setOpenModalDetail,
  openModalDetail,
  formdetail,
  onFinishUpdate,
  downloadFile,
}): React.ReactElement => {
  const ShowStatusLeaves = showStatusLeave();
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const [statusById, setStatusById] = useState<any | null>(null);
  const [dataById, setDataById] = useState<number | undefined>(undefined);

  const fecthDataDetail = async (record: ITypeDataLeave) => {
    try {
      const base = {
        id: record.id,
        name: `${record.firstName} ${record.lastName}`,
        createdAt: record.createdAt ? dateToStringThNoTime(record.createdAt) : "-",
        detail: record.detail,
        leaveHour: record.leaveHour ? (record.leaveHour % 8 === 0 ? `${record.leaveHour / 8} วัน` : `${record.leaveHour} ชม.`) : "ไม่มีข้อมูล",
        startDate: record?.startDate ? dateToStringThNoTime(record?.startDate) : "-",
        endDate: record?.endDate ? dateToStringThNoTime(record?.endDate) : "-",
        phoneNumber: record.phoneNumber,
        typeLeave: record.typeName,
        approvedDate: record.approvedDate ? dateToStringThNoTime(record?.approvedDate) : "-",
        userApproved: record.userApproved,
        dataLeaveFiles: record.dataLeaveFiles,
        ownerId: record.ownerId,
        ownerName: record.ownerName,
      };
      setStatusById(record.status);
      setDataById(record.id);
      setOpenModalDetail(true);
      formdetail.setFieldsValue(base);
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
      title: "วันลา",
      render: (e: string, row: ITypeDataLeave) => {
        return row?.startDate && row?.endDate ? `${dateToStringThNoTime(row?.startDate)} ถึง ${dateToStringThNoTime(row?.endDate)}` : "-";
      },
    },
    {
      key: "status",
      dataIndex: "status",
      title: "สถานะ",
      align: "center",
      render: (status: string) => CheckStatusLeaveType(status),
    },
    {
      key: "userApproved",
      dataIndex: "userApproved",
      title: "ผู้อนุมัติ",
      render: (text: string) => (text ? text : "-"),
    },
    {
      key: "approvedDate",
      dataIndex: "approvedDate",
      title: "วันที่อนุมัติ",
      render: (value: any) => dateFormatTime(value),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "...",
      align: "center",
      render: (e: string, row: ITypeDataLeave, index: number) => {
        return (
          <>
            <Button type="primary" ghost onClick={() => fecthDataDetail(row)}>
              {`รายละเอียด`}
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {ShowStatusLeaves}
      <Table dataSource={dataSource} columns={columns} size="small" scroll={{ x: "max-content" }} rowKey={(e: any) => e.id} />
      {openModalDetail ? (
        <LeaveHistoryDetail
          openModalDetail={openModalDetail}
          setOpenModalDetail={setOpenModalDetail}
          formdetail={formdetail}
          downloadFile={downloadFile}
          onFinishUpdate={onFinishUpdate}
          dataById={dataById}
          statusById={statusById}
        />
      ) : null}
    </div>
  );
};
