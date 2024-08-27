import React from "react";
import { ITypeDataLeave } from "../../common";
import { Button, Col, Form, Input, Modal, Row, Space, Table, Tag } from "antd";
import { dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { PaperClipOutlined } from "@ant-design/icons";

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

  const columns: any = [
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      render: (e: string) => {
        return e === "waitting" ? (
          <Tag color="blue">{`WAITTING`}</Tag>
        ) : e === "approved" ? (
          <Tag color="green">{`APPROVED`}</Tag>
        ) : (
          <Tag color="volcano">{`CANCEL`}</Tag>
        );
      },
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Fullname",
      render: (e: string, row: ITypeDataLeave) => {
        const base = {
          name: `${row.firstName} ${row.lastName}`,
          createAt: row.createdAt ? dateToStringThNoTime(row.createdAt) : "-",
          detail: row.detail,
          leaveHour: `${row.leaveHour} ชม.`,
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
          <a
            onClick={() => {
              setOpenModalDetail(true), formdetail.setFieldsValue(base);
            }}
          >{`${row.firstName} ${row.lastName}`}</a>
        );
      },
    },
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
    { key: "typeName", dataIndex: "typeName", title: "Type Leave" },
    { key: "userApproved", dataIndex: "userApproved", title: "Approved By" },
    {
      key: "id",
      dataIndex: "id",
      title: "Active",
      align: "center",
      render: (e: string, row: ITypeDataLeave, index: number) => {
        return (
          <>
            <Row gutter={[8, 8]} className="flex justify-center">
              <Col>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    onFinishUpdate("cancel", row?.id ? row?.id : 0);
                  }}
                  disabled={row.approvedDate ? true : false}
                  danger
                >
                  {deleteIcon} {`Cancel`}
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
      <Table dataSource={dataLeaveUser} columns={columns} size="small" />
      <Modal
        title=""
        open={openModalDetail}
        footer={false}
        onCancel={() => setOpenModalDetail(false)}
      >
        <div className="w-full justify-center flex mb-2 font-bold text-lg">{`< รายละเอียดการลา >`}</div>
        <Form autoComplete="off" form={formdetail} layout="vertical">
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`วันที่ :`} name={`createAt`}>
              <Input
                readOnly
                style={{ border: "none", borderBottom: "1px solid #808080" }}
              />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เรียนถึง :`} name={`ownerName`}>
              <Input
                readOnly
                style={{ border: "none", borderBottom: "1px solid #808080" }}
              />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เนื่องจาก :`} name={`detail`}>
              <Input
                readOnly
                style={{ border: "none", borderBottom: "1px solid #808080" }}
              />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`จึงขอ :`} name={`typeLeave`}>
                <Input
                  readOnly
                  style={{ border: "none", borderBottom: "1px solid #808080" }}
                />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`เป็นเวลา :`} name={`leaveHour`}>
                <Input
                  readOnly
                  style={{ border: "none", borderBottom: "1px solid #808080" }}
                />
              </Form.Item>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ตั้งแต่วันที่ :`} name={`startDate`}>
                <Input
                  readOnly
                  style={{ border: "none", borderBottom: "1px solid #808080" }}
                />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ถึงวันที่ :`} name={`endDate`}>
                <Input
                  readOnly
                  style={{ border: "none", borderBottom: "1px solid #808080" }}
                />
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เบอร์ติดต่อระหว่างลา :`} name={`phoneNumber`}>
              <Input
                readOnly
                style={{ border: "none", borderBottom: "1px solid #808080" }}
              />
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
                    <Input
                      readOnly
                      style={{
                        border: "none",
                        borderBottom: "1px solid #808080",
                      }}
                    />
                  </Form.Item>
                </div>
                <div className=" col-span-3 md:col-span-1 ml-5">
                  <Form.Item label={`วันที่อนุมัติ :`} name={`approvedDate`}>
                    <Input
                      readOnly
                      style={{
                        border: "none",
                        borderBottom: "1px solid #808080",
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
};
