import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import { dateToStringThNoTime } from "@/app/utils/format";
import { CancelIcon } from "@/components/icon";
import { PaperClipOutlined } from "@ant-design/icons";
import { ITypeDataLeave } from "../../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../../services/index.service";
import { CheckStatusLeaveType } from "@/app/utils/validatefield";
import { dateFormatTime } from "@/app/utils";

export interface props {
  dataLeaveUser: ITypeDataLeave[];
  setOpenModalDetail: (e: boolean) => void;
  openModalDetail: boolean;
  formdetail: any;
  onFinishUpdate: (type: string, id: number) => void;
  downloadFile: (id: number, filename: string) => void;
}

export const TableDetail: React.FC<props> = ({
  dataLeaveUser,
  setOpenModalDetail,
  openModalDetail,
  formdetail,
  onFinishUpdate,
  downloadFile,
}): React.ReactElement => {
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const [statusById, setStatusById] = useState<any | null>(null);
  const [dataById, setDataById] = useState<number | undefined>(undefined);

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
      render: (status: string) => CheckStatusLeaveType(status),
    },
    {
      key: "userApproved",
      dataIndex: "userApproved",
      title: "Approved By",
      render: (text: string) => (text ? text : "-"),
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
            <Button
              type="primary"
              ghost
              onClick={async () => {
                const dataLeaveById = await dataleaveservice.getdataLeaveById(
                  row.id as number
                );
                setStatusById(dataLeaveById[0].status);
                setDataById(row.id);
                setOpenModalDetail(true);
                formdetail.setFieldsValue(base);
              }}
            >
              {`รายละเอียด`}
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        dataSource={dataLeaveUser}
        columns={columns}
        size="small"
        scroll={{ x: "max-content" }}
        rowKey={(e: any) => e.id}
      />
      <Modal
        forceRender
        title=""
        open={openModalDetail}
        footer={false}
        onCancel={() => setOpenModalDetail(false)}
        width={600}
      >
        <div className="w-full justify-center flex mb-2 font-bold text-lg">{`< รายละเอียดการลา >`}</div>
        <Form autoComplete="off" form={formdetail}>
          <div>
            <p />
          </div>
          <div style={{ paddingLeft: "380px", margin: "10px  " }}>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`วันที่ :`} name={`createAt`}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เรียนถึง :`} name={`ownerName`}>
              <Input disabled className="read-only-input" />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เนื่องจาก :`} name={`detail`}>
              <Input disabled className="read-only-input" />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`จึงขอ :`} name={`typeLeave`}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`เป็นเวลา :`} name={`leaveHour`}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ตั้งแต่วันที่ :`} name={`startDate`}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ถึงวันที่ :`} name={`endDate`}>
                <Input disabled className="read-only-input" />
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เบอร์ติดต่อระหว่างลา :`} name={`phoneNumber`}>
              <Input disabled className="read-only-input" />
            </Form.Item>
          </div>
          {Array.isArray(formdetail.getFieldValue("dataLeaveFiles")) &&
            formdetail.getFieldValue("dataLeaveFiles").length > 0 && (
              <>
                {
                  <div className=" col-span-3 md:col-span-1 ml-5">
                    <Form.Item
                      label={`ไฟล์ `}
                      name={`endDate`}
                      layout={`horizontal`}
                      // noStyle
                    >
                      {formdetail
                        .getFieldValue("dataLeaveFiles")
                        .map((file: any, index: number) => (
                          <div key={index}>
                            <Tooltip title={`ดาวน์โหลด`}>
                              <Button
                                type="link"
                                onClick={() =>
                                  downloadFile(file.id, file.fileName)
                                }
                              >
                                <Space>
                                  <PaperClipOutlined />
                                  {file.fileName}
                                </Space>
                              </Button>
                            </Tooltip>
                          </div>
                        ))}
                    </Form.Item>
                  </div>
                }
              </>
            )}
          {formdetail.getFieldValue("userApproved") ? (
            <>
              <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
                <div className=" col-span-3 md:col-span-1 ml-5">
                  <Form.Item label={`ผู้อนุมัติ :`} name={`userApproved`}>
                    <Input disabled className="read-only-input" />
                  </Form.Item>
                </div>
                <div className=" col-span-3 md:col-span-1 ml-5">
                  <Form.Item label={`วันที่อนุมัติ :`} name={`approvedDate`}>
                    <Input disabled className="read-only-input" />
                  </Form.Item>
                </div>
              </div>
            </>
          ) : null}
          <Form.Item hidden name={`id`}>
            <Input />
          </Form.Item>
          <Form.Item hidden name={`approvedDate`}>
            <Input />
          </Form.Item>
          <Form.Item hidden name={`status`}>
            <Input />
          </Form.Item>
        </Form>
        <>
          <Row gutter={[8, 8]} className="flex justify-center">
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
                  disabled={
                    statusById === "cancel" || statusById === "approved"
                  }
                  danger
                >
                  {CancelIcon}
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </>
      </Modal>
    </div>
  );
};
