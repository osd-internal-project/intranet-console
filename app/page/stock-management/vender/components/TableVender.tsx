"use client";
import { Button, Col, Modal, Row, Space, Table, Tag, Typography, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useState } from "react";
// import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { DetailVender } from "./DetailVender";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { VenderServices } from "../service/vender.service";
import Link from "next/link";
import { typeVender } from "../common";
import { checkRule } from "@/app/utils/rules";
import { dateToStringTh } from "@/app/utils/format";
import { editIcon, deleteIcon } from "@/components/icon";

export interface props {
  getdataallvender: typeVender[];
  setLoading: (value: boolean) => void;
  getloading: boolean;
  handlerPaginationTable: (e: any) => void;
  paginationConfig: number;
  pagination: { current: number; pageSize: number; skip: number };
}

export const TableVender: React.FC<props> = ({
  getdataallvender,
  setLoading,
  getloading,
  paginationConfig,
  pagination,
  handlerPaginationTable,
}): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const venderServices = VenderServices(stockAuth);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [getdatavender, setdataDetailvender] = useState<typeVender>();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const editVenderRule = checkRule("vender-edit");
  const deleteVenderRule = checkRule("vender-delete");
  const openDetailvender = async (row: typeVender) => {
    setdataDetailvender(row);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showDeleteConfirm = (venderID: string) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this vender",
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      async onOk() {
        const datadelete = await venderServices.delete(venderID);
        if (datadelete) {
          message.success(`Delete success`);
          setLoading(true);
          setbuttonLoading(false);
        }
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
  };

  const columns: ColumnsType<typeVender[]> = [
    {
      title: `NO.`,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (event: string, row: typeVender[], index: number) => {
        let skip = (pagination.current - 1) * pagination.pageSize;
        return index + skip + 1;
      },
    },
    {
      title: `VENDER NAME`,
      dataIndex: "venderName",
      key: "venderName",
      render: (event: string, row: typeVender[], index: number) => (
        <div style={{ color: "#00a1df" }}>
          <a key={index} className="text-blue" onClick={() => openDetailvender(row as any)}>
            {event}
          </a>
        </div>
      ),
    },
    { title: `DETAILS`, dataIndex: "description", key: "description" },
    { title: `PHONE NUMBER`, dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: `EMAIL`, dataIndex: "email", key: "email" },
    {
      title: `CREATED`,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (event: Date, row: typeVender[], index: number) => {
        return dateToStringTh(event);
      },
    },
    {
      title: `STATUS`,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (event: boolean, row: typeVender[], index: number) => (
        <>{event === true ? <Tag color="green">{`Active`}</Tag> : <Tag>{`Inactive`}</Tag>}</>
      ),
    },
    {
      title: `ACTIVE`,
      dataIndex: "venderID",
      key: "venderID",
      align: "center",
      render: (event: string, row: typeVender[], index: number) => {
        return (
          <>
            <Space key={index}>
              {editVenderRule ? (
                <Link href={`/page/setting/vender/${event}`}>
                  <Button type="link" style={{ border: "none" }}>
                    {editIcon}
                  </Button>
                </Link>
              ) : (
                <></>
              )}
              {deleteVenderRule ? (
                <Button type="link" style={{ border: "none" }} onClick={() => showDeleteConfirm(event)} disabled={buttonLoading} danger>
                  {deleteIcon}
                </Button>
              ) : (
                <></>
              )}
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Modal
        style={{ border: "none" }}
        width={1300}
        title={
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Typography style={{ fontSize: "24px", color: "black 85%" }}>{getdatavender?.venderName}</Typography>
            </Col>
            <Col span={24}>
              <Space>
                <span style={{ fontWeight: "200", fontSize: "12px", color: "#9E9E9E" }}> {`รายละเอียด : `}</span>
                <span style={{ fontWeight: "bold", fontSize: "12px", color: "black 45%" }}> {`${getdatavender?.description}`}</span>
              </Space>
            </Col>
          </Row>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <DetailVender row={getdatavender} contact={getdatavender?.contact} />
      </Modal>
      <Table
        loading={getloading}
        columns={columns}
        size="small"
        dataSource={getdataallvender}
        rowKey={(e: any) => e.id}
        pagination={{ total: paginationConfig, current: pagination?.current, showSizeChanger: false }}
        onChange={handlerPaginationTable}
      />
    </div>
  );
};
