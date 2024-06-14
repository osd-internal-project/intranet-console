import React from "react";
import { ITypeDataLeave } from "../../common";
import { Button, Col, Form, Input, Modal, Row, Table, Tag } from "antd";
import { dateToStringThNoTime } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";

export interface props {
  dataLeaveUser: ITypeDataLeave[];
  setOpenModalDetail: (e: boolean) => void;
  openModalDetail: boolean;
  formdetail: any;
}

export const TableDetail: React.FC<props> = ({ dataLeaveUser, setOpenModalDetail, openModalDetail, formdetail }): React.ReactElement => {
  const columns: any = [
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      render: (e: string) => {
        return e === "waitting" ? (
          <Tag color="blue">{`WAITTING`}</Tag>
        ) : e === "approve" ? (
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
          createAt: dateToStringThNoTime(row?.createdAt as any),
          detail: row.detail,
          leaveHour: `${row.leaveHour} ชม.`,
          startDate: dateToStringThNoTime(row.startDate as any),
          endDate: dateToStringThNoTime(row.endDate as any),
          phoneNumber: row.phoneNumber,
          typeLeave: row.typeName,
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
      render: (e: string, row: any) => {
        return `${dateToStringThNoTime(row.startDate)} ถึง ${dateToStringThNoTime(row.endDate)}`;
      },
    },
    { key: "typeName", dataIndex: "typeName", title: "Type Leave" },
    { key: "userApproved", dataIndex: "userApproved", title: "Approved By" },
    {
      key: "id",
      dataIndex: "id",
      title: "ACTIVE",
      align: "center",
      render: (e: string, row: any) => {
        return (
          <>
            <Row gutter={[8, 8]} className="flex justify-center">
              <Col>
                <Button type="primary">{editIcon}</Button>
              </Col>
              <Col>
                <Button type="primary" danger>
                  {deleteIcon}
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
      <Table dataSource={dataLeaveUser} columns={columns} />
      <Modal title="รายละเอียด" open={openModalDetail} footer={false} onCancel={() => setOpenModalDetail(false)}>
        <div className="w-full justify-center flex mb-2">{`ข้อมูลใบลา`}</div>
        <Form autoComplete="off" form={formdetail}>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`วันที่`} name={`createAt`}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เรียนถึง :`}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เนื่องจาก`} name={`detail`}>
              <Input disabled />
            </Form.Item>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`จึงขอ`} name={`typeLeave`}>
                <Input disabled />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`เป็นเวลา`} name={`leaveHour`}>
                <Input disabled />
              </Form.Item>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-y-2 mt-2">
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ตั้งแต่วันที่`} name={`startDate`}>
                <Input disabled />
              </Form.Item>
            </div>
            <div className=" col-span-3 md:col-span-1 ml-5">
              <Form.Item label={`ถึงวันที่`} name={`endDate`}>
                <Input disabled />
              </Form.Item>
            </div>
          </div>
          <div className=" col-span-3 md:col-span-1 ml-5">
            <Form.Item label={`เบอร์ติดต่อระหว่างลา`} name={`phoneNumber`}>
              <Input disabled />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
