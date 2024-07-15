"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Input, Modal, Row, Select, Space, Table, Tag, Form, message, Switch, Popover, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BrandService } from "../services/brand.service";
import { ITypeGetdataAll, FieldType } from "../common/index";
// import { Icon } from "@iconify/react";
// import editIcon from "@iconify/icons-tabler/edit";
// import trashIcon from "@iconify/icons-tabler/trash";

import { editIcon, deleteIcon } from "@/components/icon";
import { ExclamationCircleFilled, FilterOutlined } from "@ant-design/icons";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { checkRule } from "@/app/utils/rules";
import { dateToEndofDay, dateToStartofDay, dateToStringTh } from "@/app/utils/format";
export interface props {
  onCloseDialog: (dataField: boolean) => void;
  loading: boolean;
}

export const TableBrand: React.FC<props> = ({ onCloseDialog, loading }): React.ReactElement => {
  const { RangePicker } = DatePicker;
  const axiosStock = useAxiosStock();
  const editRule = checkRule("sm-brand-e");
  const deleteRule = checkRule("sm-brand-d");
  const brandservice = BrandService(axiosStock);
  const [form] = Form.useForm();
  const [getdataAll, setdataAll] = useState<ITypeGetdataAll[]>([]);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [getdataEdit, setDataEdit] = useState<ITypeGetdataAll>();
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [search, setSearch] = useState<object>({});
  const [paginationConfig, setPaginationConfig] = useState<number>(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    skip: 0,
  });

  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
  };

  useEffect(() => {
    loaddata();
  }, [loading, switchChecked]);

  const showModal = (row: ITypeGetdataAll) => {
    form.setFieldValue("name", row.name);
    form.setFieldValue("id", row.id);
    form.setFieldValue("status", row.status);
    setSwitchChecked(row.status);
    setDataEdit(row);
    setOpenEdit(true);
  };
  const handleCancel = () => {
    setOpenEdit(false);
    form.resetFields();
  };
  const loaddata = async () => {
    const getdataResult = await brandservice.findMany(search);
    if (getdataResult) {
      setdataAll(getdataResult);
      setPaginationConfig(getdataResult.length);
    }
    onCloseDialog(false);
  };
  const onfinishEdit = async (event: ITypeGetdataAll) => {
    setbuttonLoading(true);
    const dataUpdate = {
      id: event.id,
      data: {
        name: event.name,
        status: switchChecked,
        updatedAt: new Date().toISOString(),
      },
    };
    const dataResult = await brandservice.update(dataUpdate);
    if (dataResult) {
      message.success(`Edit success`);
      onCloseDialog(true);
      setOpenEdit(false);
    }
    setbuttonLoading(false);
  };

  const onfinishDel = (event: number) => {
    setbuttonLoading(true);
    Modal.confirm({
      title: "Delete this brand",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete this ?",
      okText: "Confirm",
      okButtonProps: { type: "primary", danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const dataResult = await brandservice.remove(event);
        if (dataResult) {
          message.success(`Delete success`);
          onCloseDialog(true);
          setbuttonLoading(false);
        }
      },
      onCancel() {
        setbuttonLoading(false);
      },
    });
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
    { title: "BRAND", dataIndex: "name", key: "name", render: (event: string) => <div className="text-blue">{event}</div> },
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
              {editRule ? (
                <Col>
                  <Button type="link" onClick={() => showModal(row)}>
                    {editIcon}
                  </Button>
                </Col>
              ) : (
                <></>
              )}
              {deleteRule ? (
                <Col>
                  <Button type="link" onClick={() => onfinishDel(Number(event))} disabled={buttonLoading} danger>
                    {deleteIcon}
                  </Button>
                </Col>
              ) : (
                <></>
              )}
            </Row>
          </>
        );
      },
    },
  ];

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const onFilter = async (value: any) => {
    let search = {};
    if (value.name) {
      search = { ...search, name: { contains: value.name } };
    }

    if (value.createdAt) {
      search = {
        ...search,
        createdAt: {
          gte: dateToStartofDay(value.createdAt[0]),
          lte: dateToEndofDay(value.createdAt[1]),
        },
      };
    }
    setPagination({
      current: 1,
      pageSize: 10,
      skip: 0,
    });
    setSearch(search);
    onCloseDialog(true);
    setOpenFilter(false);
  };

  const handlerPaginationTable = (paginate: any) => {
    const skip = paginate.current * paginate.pageSize - paginate.pageSize;
    const { current, pageSize } = paginate;
    setPagination((prevState) => ({
      ...prevState,
      skip: skip,
      current: current || 1,
      pageSize: pageSize || 10,
    }));
    onCloseDialog(true);
  };

  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Brand" name="name">
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
  return (
    <React.Fragment>
      <div>
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
            loading={loading}
            dataSource={getdataAll}
            rowKey={(value: ITypeGetdataAll) => value.id}
            columns={columns}
            pagination={{ total: paginationConfig, current: pagination?.current, showSizeChanger: false }}
            onChange={(e: any) => handlerPaginationTable(e)}
          />
        </Card>
      </div>

      <Modal title="Edit Brand" open={openEdit} onCancel={handleCancel} footer={false}>
        <Form style={{ width: "100%" }} name="edit" autoComplete="off" layout="vertical" form={form} onFinish={onfinishEdit}>
          <Form.Item<FieldType> name={`id`} hidden />
          <div className=" grid grid-cols-4 space-x-2">
            <div className=" col-span-3">
              <Form.Item<FieldType> name={`name`} label={`Brand Name:`} rules={[{ required: true, message: "Please enter brand name" }]}>
                <Input />
              </Form.Item>
            </div>
            <div>
              <Form.Item<FieldType> name={`status`} label={`Status :`}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  checked={switchChecked}
                  onChange={handleChange}
                  className={switchChecked === true ? "active-switch" : "inactive-switch"}
                />
              </Form.Item>
            </div>
            <div className=" col-span-4">
              <Row gutter={[8, 8]} style={{ justifyContent: "end", display: "flex" }}>
                <Col>
                  <Button
                    onClick={() => {
                      setOpenEdit(false);
                      form.resetFields();
                      setbuttonLoading(false);
                    }}
                  >{`Cancel`}</Button>
                </Col>
                <Col>
                  <Button htmlType="submit" type="default" loading={buttonLoading} className="button-blue">{`Save Change`}</Button>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
