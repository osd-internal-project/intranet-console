import { IOverTimeForm } from "@/app/common/overtime";
import { dateFormat, dateFormatTime, dateFormatTimeNoTIme } from "@/app/utils";
import { CheckCircleOutlined, CloseCircleOutlined, StopOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Table, TablePaginationConfig, TableProps, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { intersection } from "lodash";
import React from "react";
import { CalculationDetailCard, PersonalDetailCard, TravelDetailCard, WorkDetailCard } from "./detail-view";

export interface Props {
  dataResource: { data: IOverTimeForm[]; total: number };
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
  onFinishUpdate: (values: IOverTimeForm, type: string) => void;
  onFinishDelete: (id: string) => void;
  sideMenuGroups: any;
  handleOpenModal: (status: boolean, data: IOverTimeForm) => void;
  setOpenModal: (approved: { status: boolean; type: string }) => void;
  openModal: { status: boolean; type: string };
}

const TableOvertimeHistory: React.FC<Props> = ({
  dataResource,
  pagination,
  changePagination,
  onFinishUpdate,
  onFinishDelete,
  sideMenuGroups,
  handleOpenModal,
  setOpenModal,
  openModal,
}): React.ReactElement => {
  const [formUpdate] = Form.useForm();
  const dataDetail = formUpdate.getFieldsValue(true);

  const handleUpdateApproved = (status: boolean, data: IOverTimeForm | null, type: string) => {
    setOpenModal({ status, type });
    formUpdate.setFieldsValue({
      ...data,
      dateStart: data?.dateStart ? dayjs(data?.dateStart) : null,
      startTime: data?.startTime,
      endTime: data?.endTime,
      approvedDate: data?.approvedDate ? dayjs(data?.approvedDate) : null,
      createdAt: data?.createdAt ? dayjs(data?.createdAt) : null,
      updatedAt: data?.updatedAt ? dayjs(data?.updatedAt) : null,
    });
  };

  const columns: TableProps<IOverTimeForm>["columns"] = [
    {
      key: "no",
      title: "ลำดับ",
      dataIndex: "no",
      align: "center",
      render: (id, record, index) =>
        pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : null,
    },
    {
      key: "status",
      title: "สถานะ",
      dataIndex: "status",
      align: "center",
      render: (status: string) => {
        let color = "";
        let text = "";
        switch (status) {
          case "waiting":
            color = "blue";
            text = "กำลังรออนุมัติ";
            break;
          case "approved":
            color = "green";
            text = "อนุมัติสำเร็จ";
            break;
          case "reject":
            color = "red";
            text = "ไม่อนุมัติ";
            break;
          case "cancel":
            color = "red";
            text = "ยกเลิก";
            break;
          default:
            color = "default";
            text = "Unknown Status";
            break;
        }
        return (
          <div className="flex justify-center">
            <Tag color={color}>{text}</Tag>
          </div>
        );
      },
    },
    {
      key: "fullname",
      title: "ชื่อ - สกุล",
      dataIndex: "fullname",
    },
    {
      key: "createdAt",
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      render: (_) => dateFormat(_),
    },
    {
      key: "dateStart",
      title: "วันที่ทำ OT",
      dataIndex: "dateStart",
      render: (_) => dateFormatTimeNoTIme(_),
    },
    {
      key: "detailWork",
      title: "รายละเอียด",
      dataIndex: "detailWork",
      width: "120px",
    },
    {
      key: "id",
      title: "เวลาเริ่ม - สิ้นสุด",
      dataIndex: "id",
      align: "center",
      render: (_, record) => (
        <span>
          {record.startTime} - {record.endTime}
        </span>
      ),
    },
    {
      key: "typeDate",
      title: "วันที่ทำการ",
      dataIndex: "typeDate",
      render: (_) => <span>{_ === "normal" ? "วันปกติ" : "วันหยุด"}</span>,
    },
    {
      key: "totalTime",
      title: "รวม",
      dataIndex: "totalTime",
      align: "center",
    },
    {
      key: "workingTime",
      title: "ทำงาน",
      dataIndex: "workingTime",
      align: "center",
    },
    {
      key: "breakTime",
      title: "พัก",
      dataIndex: "breakTime",
      align: "center",
    },
    {
      key: "id",
      title: "รายละเอียด",
      dataIndex: "id",
      render: (status, record) => {
        return <Button type="primary" size="small" onClick={() => handleOpenModal(true, record)}>{`รายละเอียด`}</Button>;
      },
    },
    {
      fixed: "right",
      key: "id",
      title: "...",
      dataIndex: "id",
      render: (_, record) => {
        return (
          <div className="flex justify-center gap-1">
            <Tooltip title="อนุมัติ">
              <Button
                size="small"
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateApproved(true, record, "approved")}
                disabled={record.status !== "waiting"}
              />
            </Tooltip>

            <Tooltip title="ไม่อนุมัติ">
              <Button size="small" type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleUpdateApproved(true, record, "reject")} />
            </Tooltip>

            <Tooltip title="ยกเลิก">
              <Button
                size="small"
                type="link"
                danger
                icon={<StopOutlined />}
                onClick={() => handleUpdateApproved(true, record, "cancel")}
                disabled={record.status !== "waiting"}
              />
            </Tooltip>

            {intersection(sideMenuGroups, ["hr"]).length ? (
              <Tooltip title="ลบ">
                <Button
                  size="small"
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onFinishDelete(record.overTimeID ? record.overTimeID : "")}
                />
              </Tooltip>
            ) : null}
          </div>
        );
      },
      width: 150,
      align: "center",
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        size="small"
        dataSource={dataResource.data}
        rowKey="id"
        onChange={changePagination}
        pagination={{ ...pagination, total: dataResource.total, showSizeChanger: true }}
        scroll={{ x: "max-content" }}
      />
      {openModal.status ? (
        <>
          <Modal
            width={900}
            title={`${openModal.type === "cancel" ? "ยกเลิก" : openModal.type === "reject" ? "ไม่อนุมัติ" : "อนุมัติ"}`}
            closable={{ "aria-label": "Custom Close Button" }}
            open={openModal.status}
            footer={false}
            onCancel={() => handleUpdateApproved(false, null, "close")}>
            <Form form={formUpdate} layout="vertical" onFinish={(record) => onFinishUpdate(record, openModal.type)} className="space-y-4">
              <Form.Item name="overTimeID" label="Overtime ID" hidden>
                <Input readOnly />
              </Form.Item>
              <Row gutter={24}>
                <Col span={24}>
                  <PersonalDetailCard data={dataDetail} />
                </Col>

                <Col span={24}>
                  <WorkDetailCard data={dataDetail} />
                </Col>

                <Col span={24}>
                  <TravelDetailCard data={dataDetail} />
                </Col>

                <Col span={24}>
                  <CalculationDetailCard data={dataDetail} />
                </Col>
              </Row>

              <Form.Item name="approvedDetail" label="รายละเอียดการดำเนินการ">
                <Input.TextArea rows={3} placeholder="เช่น งานเรียบร้อยดี / มีปัญหา..." />
              </Form.Item>
              <div className="flex justify-center gap-2">
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{
                    backgroundColor: openModal.type === "reject" || openModal.type === "cancel" ? "#ff4d4f" : "#228B22",
                    borderColor: openModal.type === "reject" || openModal.type === "cancel" ? "#ff4d4f" : "#228B22",
                  }}>
                  {`${openModal.type === "cancel" ? "ยกเลิก" : openModal.type === "reject" ? "ไม่อนุมัติ" : "อนุมัติ"}`}
                </Button>
              </div>
            </Form>
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default TableOvertimeHistory;
