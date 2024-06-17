"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Form, Input, Modal, Popover, Row, Spin, Switch, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import { ExclamationCircleFilled, FilterOutlined } from "@ant-design/icons";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { UnitServices } from "../services/unit.service";
import { FieldTypeUnit, ITypeGetdataAll } from "../common";
import { editIcon, deleteIcon } from "@/components/icon";
import { checkRule } from "@/app/utils/rules";
import { dateToStringTh } from "@/app/utils/format";

export interface props {
  getloading: boolean;
  getdataAll: ITypeGetdataAll[];
  setLoading: (value: boolean) => void;
  handleOpenFilter: (event: boolean) => void;
  openFilter: boolean;
  onFilter: (value: any) => void;
  paginationConfig: number;
  pagination: { current: number; pageSize: number; skip: number };
  handlerPaginationTable: (e: any) => void;
}

export const TableUnit: React.FC<props> = ({
  getloading,
  getdataAll,
  setLoading,
  handleOpenFilter,
  openFilter,
  onFilter,
  handlerPaginationTable,
  pagination,
  paginationConfig,
}): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const editRule = checkRule("sm-unit-e");
  const deleteRule = checkRule("sm-unit-d");
  const unitServices = UnitServices(stockAuth);
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [switchChecked, setSwitchChecked] = useState<boolean>();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);

  useEffect(() => {}, [switchChecked]);

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Unit" name="unitName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Created" name="createdAt">
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item style={{ marginTop: "30px" }}>
          <Button type="primary" htmlType="submit" className="button-blue">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );

  const showModal = (row: ITypeGetdataAll) => {
    if (row) {
      form.setFieldValue("unitName", row.unitName);
      form.setFieldValue("id", row.id);
      form.setFieldValue("status", row.status);
      setSwitchChecked(row.status);
    }
    setOpenEdit(true);
  };

  const handleCancel = () => {
    setOpenEdit(false);
    form.resetFields();
  };
  const onfinishEdit = async (event: ITypeGetdataAll) => {
    setbuttonLoading(true);
    const dataUpdate = {
      id: event.id,
      data: {
        unitName: event.unitName,
        status: switchChecked,
        updatedAt: new Date().toISOString(),
      },
    };
    const dataResult = await unitServices.update(dataUpdate);
    if (dataResult) {
      message.success(`Edit success`);
      setLoading(true);
      setOpenEdit(false);
      setbuttonLoading(false);
    }
  };
  const columns: ColumnsType<ITypeGetdataAll> = [
    {
      title: "NO.",
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (event: string, row: ITypeGetdataAll, index: number) => {
        let skip = (pagination.current - 1) * pagination.pageSize;
        return index + skip + 1;
      },
    },
    { title: "UNIT", dataIndex: "unitName", key: "unitName", render: (event: string) => <div className="text-blue">{event}</div> },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (event: boolean, row: ITypeGetdataAll, index: number) =>
        event === true ? <Tag color="green">{`Active`}</Tag> : <Tag color="volcano">{`Inactive`}</Tag>,
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "20%",
      render: (event: Date, row: ITypeGetdataAll, index: number) => {
        return `${dateToStringTh(event)} น.`;
      },
    },
    {
      title: "ACTIVE",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "20%",
      render: (event: string, row: ITypeGetdataAll, index: number) => {
        return (
          <>
            <Row gutter={[8, 8]} className="card-filter" style={{ justifyContent: "center", display: "flex" }}>
              <Col>
                {editRule ? (
                  <Button type="link" className="text-blue" onClick={() => showModal(row)}>
                    {editIcon}
                  </Button>
                ) : (
                  <></>
                )}
              </Col>
              <Col>
                {deleteRule ? (
                  <Button type="link" danger disabled={buttonLoading} onClick={() => onfinishDel(Number(event))}>
                    {deleteIcon}
                  </Button>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  const onfinishDel = (event: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this unit",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await unitServices.remove(event);
        if (dataResult) {
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
  return getloading ? (
    <>
      <Spin />
    </>
  ) : (
    <div className=" grid grid-cols-1 gap-y-2">
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Card className="card-filter">
            <div className=" flex justify-end pb-4">
              <Popover
                onOpenChange={handleOpenFilter}
                open={openFilter}
                content={searchContent}
                placement="bottomLeft"
                title="Search"
                trigger="click"
                overlayStyle={{ width: "calc(100% - 240px)" }}
              >
                <Button className="button-blue" type="primary" icon={<FilterOutlined />}>
                  Filters
                </Button>
              </Popover>
            </div>
            <Table
              size="small"
              loading={getloading}
              dataSource={getdataAll}
              rowKey={(value: ITypeGetdataAll) => value.id}
              columns={columns}
              pagination={{ total: paginationConfig, current: pagination?.current, showSizeChanger: false }}
              onChange={handlerPaginationTable}
            />
          </Card>
        </Col>
      </Row>
      <Modal title="Edit Unit" open={openEdit} onCancel={handleCancel} footer={false} width={800}>
        <Row gutter={[8, 8]}>
          <Form style={{ width: "100%" }} name="edit" autoComplete="off" layout="inline" form={form} onFinish={onfinishEdit}>
            <Form.Item<FieldTypeUnit> name={`id`} hidden />
            <Col span={12}>
              <Form.Item<FieldTypeUnit> name={`unitName`} label={`UNIT :`} rules={[{ required: true, message: "Please enter unit name" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldTypeUnit> name={`status`} label={`STATUS :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  checked={switchChecked}
                  onChange={handleChange}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Row gutter={[8, 8]} style={{ justifyContent: "end", display: "flex" }}>
                <Col>
                  <Button
                    type="default"
                    onClick={() => {
                      setOpenEdit(false);
                      form.resetFields();
                    }}
                  >{`Cancel`}</Button>
                </Col>
                <Col>
                  <Button htmlType="submit" type="default" loading={buttonLoading} className="button-blue">{`Save Change`}</Button>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>
      </Modal>
    </div>
  );
};
