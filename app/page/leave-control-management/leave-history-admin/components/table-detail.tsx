import "../../styles/style.css";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Table, Tooltip } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, CancelIcon, CheckIcon } from "@/components/icon";
import ExportDataLeaveAll from "../../until/export-excel";
import { ITypeDataLeave } from "../../common";
import DataLeaveService from "../../../../services/leave-management.service";
import { CheckStatusLeaveType, showStatus, showStatusLeave } from "@/app/utils/validatefield";
import { dateFormatTime } from "@/app/utils";
import { LeaveDetailForm } from "./leave-detail-form";

export interface props {
  dataLeaveUser: ITypeDataLeave[];
  setOpenModalDetail: (e: boolean) => void;
  openModalDetail: boolean;
  formdetail: any;
  onFinishUpdate: (type: string, id: number) => void;
  onFinishDelete: (type: string, id: number) => void;
  downloadFile: (id: number, filename: string) => void;
}

export const TableDetail: React.FC<props> = ({
  dataLeaveUser,
  setOpenModalDetail,
  openModalDetail,
  formdetail,
  onFinishUpdate,
  onFinishDelete,
  downloadFile,
}): React.ReactElement => {
  const { Search } = Input;
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const [statusById, setStatusById] = useState<any | null>(null);
  const [dataById, setDataById] = useState<number | undefined>(undefined);
  const [dataSource, setDataSource] = React.useState<any[]>([]);

  useEffect(() => {
    setDataSource(dataLeaveUser);
  }, [dataLeaveUser]);

  const dataLeaveSearch = (value: string) => {
    const filteredData = dataLeaveUser.filter(
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
        id: record.id,
        name: `${record.firstName} ${record.lastName}`,
        createAt: record.createdAt ? dateToStringThNoTime(record.createdAt) : "-",
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
      render: (userApproved: string) => (userApproved ? userApproved : "-"),
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
      <>
        <Modal forceRender open={openModalDetail} footer={false} onCancel={() => setOpenModalDetail(false)} width={600}>
          <LeaveDetailForm formdetail={formdetail} downloadFile={(id: number, filename: string) => downloadFile(id, filename)} />
          <Row gutter={[12, 12]} className="flex justify-center">
            <Col>
              <Tooltip title={`Approved`}>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    onFinishUpdate("approved", dataById ? dataById : 0);
                  }}
                  style={{ width: "60px", height: "30px" }}
                  disabled={statusById === "cancel" || statusById === "approved"}>
                  {CheckIcon}
                </Button>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title={`Cancel`}>
                <Button
                  size="small"
                  type="primary"
                  style={{
                    width: "60px",
                    height: "30px",
                  }}
                  onClick={() => {
                    onFinishUpdate("cancel", dataById ? dataById : 0);
                  }}
                  disabled={statusById === "cancel"}
                  danger>
                  {CancelIcon}
                </Button>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title={`Delete`}>
                <Button
                  size="small"
                  type="primary"
                  style={{ width: "60px", height: "30px" }}
                  onClick={() => {
                    onFinishDelete("delete", dataById ? dataById : 0);
                  }}
                  danger>
                  {deleteIcon}
                </Button>
              </Tooltip>
            </Col>
          </Row>
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
      <Table dataSource={dataSource} columns={columns} size="small" rowKey="id" scroll={{ x: "max-content" }} />
    </div>
  );
};
