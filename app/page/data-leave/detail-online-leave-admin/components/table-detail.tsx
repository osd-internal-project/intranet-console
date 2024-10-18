import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Table, Tooltip } from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, CancelIcon, CheckIcon } from "@/components/icon";
import ExportDataLeaveAll from "../../common/export-excel";
import { ITypeDataLeave } from "../../common";
import DataLeaveService from "../../services/index.service";
import { CheckStatusLeaveType } from "@/app/utils/validatefield";
import { dateFormatTime } from "@/app/utils";
import { LeaveDetailForm } from "./leave-detail-form";
import "../../common/style.css";

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
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const [statusById, setStatusById] = useState<any | null>(null);
  const [dataById, setDataById] = useState<number | undefined>(undefined);
  const { Search } = Input;
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
        item.typeName?.toLowerCase().includes(value.toLowerCase())
    );
    setDataSource(filteredData);
  };

  const columns: any = [
    {
      key: "id",
      dataIndex: "id",
      title: "Full Name",
      render: (e: string, row: ITypeDataLeave) => {
        return <p>{`${row.firstName} ${row.lastName}`}</p>;
      },
    },
    { key: "typeName", dataIndex: "typeName", title: "Type Leave" },
    {
      key: "id",
      dataIndex: "id",
      title: "Date Leave",
      render: (e: string, row: ITypeDataLeave) => {
        return row?.startDate && row?.endDate
          ? `${dateToStringThNoTime(row?.startDate)} ถึง ${dateToStringThNoTime(
              row?.endDate
            )}`
          : "-";
      },
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      align: "center",
      render: (status: string) => {
        CheckStatusLeaveType(status);
      },
    },
    {
      key: "userApproved",
      dataIndex: "userApproved",
      title: "Approved By",
      render: (userApproved: string) => (userApproved ? userApproved : "-"),
    },
    {
      key: "approvedDate",
      dataIndex: "approvedDate",
      title: "Approved Date",
      render: (value: any) => dateFormatTime(value),
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Active",
      align: "center",
      render: (e: string, row: ITypeDataLeave, index: number) => {
        const base = {
          id: row.id,
          name: `${row.firstName} ${row.lastName}`,
          createAt: row.createdAt ? dateToStringThNoTime(row.createdAt) : "-",
          detail: row.detail,
          leaveHour: row.leaveHour
            ? row.leaveHour % 8 === 0
              ? `${row.leaveHour / 8} วัน`
              : `${row.leaveHour} ชม.`
            : "ไม่มีข้อมูล",
          startDate: row?.startDate
            ? dateToStringThNoTime(row?.startDate)
            : "-",
          endDate: row?.endDate ? dateToStringThNoTime(row?.endDate) : "-",
          phoneNumber: row.phoneNumber,
          typeLeave: row.typeName,
          approvedDate: row.approvedDate
            ? dateToStringThNoTime(row?.approvedDate)
            : "-",
          userApproved: row.userApproved,
          dataLeaveFiles: row.dataLeaveFiles,
          ownerId: row.ownerId,
          ownerName: row.ownerName,
        };
        return (
          <>
            <Row gutter={[8, 8]} className="flex justify-center">
              <Col>
                <Button
                  type="primary"
                  ghost
                  onClick={async () => {
                    const dataLeaveById =
                      await dataleaveservice.getdataLeaveById(row.id as number);
                    setStatusById(dataLeaveById[0].status);
                    setDataById(row.id);

                    setOpenModalDetail(true), formdetail.setFieldsValue(base);
                  }}
                >
                  {`รายละเอียด`}
                </Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <div>
        {/* <Collapse
          bordered={false}
          items={[
            {
              key: "1",
              label: <b>Filter</b>,
              children: ( */}
        {/* ),
            },
          ]}
          defaultActiveKey={[]}
        /> */}
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "15px" }}>
          <Form size="small" layout="inline">
            <Form.Item label="Search">
              <Search
                placeholder="input search text"
                onSearch={dataLeaveSearch}
                enterButton
              />
            </Form.Item>
          </Form>
        </div>
        <div style={{ marginLeft: "10px" }}>
          <ExportDataLeaveAll data={dataLeaveUser} />
        </div>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        rowKey="id"
      />
      <Modal
        title=""
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
        />
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
                disabled={statusById === "cancel" || statusById === "approved"}
              >
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
                danger
              >
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
                danger
              >
                {deleteIcon}
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
