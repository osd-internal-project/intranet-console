"use client";
import { Button, Col, ConfigProvider, DatePicker, Form, Input, Modal, Row, Switch, Table } from "antd";
import React from "react";
import { ITypeMasterdataHolidys } from "../common";
import { deleteIcon, editIcon } from "@/components/icon";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Change this to the locale you need
import locale from "antd/es/locale/en_US";

export interface props {
  getdata: ITypeMasterdataHolidys[];
  setOpenModalEdit: (e: boolean) => void;
  openModalEdit: boolean;
  formedit: any;
  onFinishEdit: (e: ITypeMasterdataHolidys) => void;
  onFinishDel: (e: number) => void;
  loading: boolean;
  setdate: (e: any) => void;
  getdate: any;
}

export const TableMasterHolidays: React.FC<props> = ({
  getdata,
  setOpenModalEdit,
  openModalEdit,
  formedit,
  onFinishEdit,
  onFinishDel,
  loading,
  setdate,
  getdate,
}): React.ReactElement => {
  const columns: any = [
    { key: "holidaysName", title: "ชื่อวันหยุด", dataIndex: "holidaysName" },
    { key: "holidaysDate", title: "วันหยุด", dataIndex: "holidaysDate" },
    {
      key: "id",
      title: "Action",
      dataIndex: "id",
      align: "center",
      width: "100px",
      render: (event: number, row: ITypeMasterdataHolidys, index: number) => {
        const data = {
          holidaysName: row.holidaysName,
          id: row.id,
          updatedAt: new Date(),
        };
        return (
          <>
            <div className="flex justify-center">
              <Button
                type="link"
                onClick={() => {
                  setOpenModalEdit(true), formedit.setFieldsValue(data), setdate(row.holidaysDate);
                }}
              >
                {editIcon}
              </Button>
              <Button
                type="link"
                onClick={() => {
                  onFinishDel(row.id);
                }}
                danger
              >
                {deleteIcon}
              </Button>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Modal
        title="Edit"
        open={openModalEdit}
        onCancel={() => {
          setOpenModalEdit(false), setdate("");
        }}
        footer={false}
      >
        <Form layout="vertical" form={formedit} autoComplete="off" onFinish={onFinishEdit}>
          <Form.Item className=" mb-0" name="id" hidden>
            <Input />
          </Form.Item>
          <Row gutter={[8, 8]}>
            <Col span={8}>
              <Form.Item className=" mb-0" label="ชื่อวันหยุด:" name="holidaysName" rules={[{ required: true, message: "กรุณากรอกวันลา" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className=" mb-0" label="วันหยุด:" name="holidaysDate">
                <ConfigProvider locale={locale}>
                  <DatePicker
                    id={"holidaysDate"}
                    name={"holidaysDate"}
                    value={dayjs(getdate)}
                    onChange={(e: any) => {
                      if (e) {
                        setdate(e);
                      } else {
                        setdate(dayjs());
                      }
                    }}
                  />
                </ConfigProvider>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4">
              <Button
                onClick={() => {
                  setOpenModalEdit(false), formedit.resetFields(), setdate("");
                }}
              >{`Cancel`}</Button>
              <Button type="primary" htmlType="submit">
                {`Edit`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Table size="small" loading={loading} dataSource={getdata} columns={columns} rowKey={(e) => e.id} />
    </div>
  );
};
