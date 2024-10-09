import React, { useState } from "react";
import { ITypeDataLeave } from "../../common";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Flex,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon, CancelIcon, CheckIcon } from "@/components/icon";
import { PaperClipOutlined } from "@ant-design/icons";
import ExportDataLeaveAll from "../../common/export-excel";
import dayjs from "dayjs";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import DataLeaveService from "../../services/index.service";
import { useSession } from "next-auth/react";
import "../../common/style.css";

export interface props {
  dataLeaveUser: ITypeDataLeave[];
  setOpenModalDetail: (e: boolean) => void;
  openModalDetail: boolean;
  formdetail: any;
  onFinishUpdate: (type: string, id: number) => void;
  onFinishDelete: (type: string, id: number) => void;
  downloadFile: (id: number, filename: string) => void;
  userGroupIds: string[];
}

export const TableDetail: React.FC<props> = ({
  dataLeaveUser,
  setOpenModalDetail,
  openModalDetail,
  formdetail,
  onFinishUpdate,
  onFinishDelete,
  downloadFile,
  userGroupIds,
}): React.ReactElement => {
  const Auth = useAxiosIntranet();
  const dataleaveservice = DataLeaveService(Auth);
  const [statusById, setStatusById] = useState<any | null>(null);
  const [dataById, setDataById] = useState<number | undefined>(undefined);
  const { data: session } = useSession();

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
      render: (e: string) => {
        let color = "";
        let text = "";
        let icon = null;

        switch (e) {
          case "waitting":
            color = "DodgerBlue";
            text = "WAITING";
            icon = <SyncOutlined spin />;
            break;
          case "cancel":
            color = "silver";
            text = "CANCEL";
            icon = <CloseCircleOutlined />;
            break;
          case "approved":
            color = "LimeGreen";
            text = "APPROVED";
            icon = <CheckCircleOutlined />;
            break;
          default:
            color = "gray";
            text = "UNKNOWN";
            icon = <MinusCircleOutlined />;
            break;
        }

        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      key: "userApproved",
      dataIndex: "userApproved",
      title: "Approved By",
      render: (text: any) => (text ? text : "-"),
    },
    {
      key: "approvedDate",
      dataIndex: "approvedDate",
      title: "Approved Date",
      render: (_: any, row: any) => (
        <span>
          {row.approvedDate
            ? dayjs(row.approvedDate).format("DD-MM-YYYY")
            : "-"}
        </span>
      ),
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
                {/* <Tooltip title={`รายละเอียด`}> */}
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
                {/* </Tooltip> */}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Row gutter={[18, 18]}>
        <Col md={18}>
          <ExportDataLeaveAll data={dataLeaveUser} />
        </Col>
        <Col
          md={6}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        ></Col>
      </Row>
      <Table
        dataSource={dataLeaveUser}
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
        <div className="w-full justify-center flex mb-2 font-bold text-lg">{`< รายละเอียดการลา >`}</div>
        <Form
          autoComplete="off"
          form={formdetail}
          // layout="vertical"
        >
          <div style={{ paddingLeft: "380px", margin: "10px  " }}>
            <div className=" col-span-3 md:col-span-1 ml-1">
              <Form.Item
                label={`วันที่ :`}
                name={`createAt`}
                style={{ marginBottom: 0 }}
              >
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
            <Input />{" "}
          </Form.Item>
        </Form>
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
              {/* {session?.user.userId &&
                userGroupIds.includes(session?.user.userId) && (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      onFinishUpdate("approved", dataById ? dataById : 0);
                    }}
                    style={{ width: "60px", height: "30px" }}
                    disabled={
                      statusById === "cancel" || statusById === "approved"
                    }
                  >
                    {CheckIcon}
                  </Button>
                )} */}
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
