"use client";
import OrderManagementServices from "../../services/order-management.service";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Spin, Switch, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { ITypeOrderLotForm } from "../../common";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { dateToStringThNoTime, numberWithCommas } from "@/app/utils/format";
// import masterProductGroupServices from "@/app/page/stock-management/category-group-type/services/master-product-group.service";

export interface props {
  openModal: boolean;
  inventoryId: number;
  difLotId: number[];
  propDataManage: (res: { openModal: boolean; selectedProduct?: ITypeOrderLotForm }) => void;
  selectedProduct: any;
}

export const SearchStockTable: React.FC<props> = ({ openModal, inventoryId, difLotId, propDataManage, selectedProduct }) => {
  const stockAuth = useAxiosStock();
  // const masterproductgroupservices = masterProductGroupServices(stockAuth);
  const orderManagementServices = OrderManagementServices(stockAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState<ITypeOrderLotForm[]>([]);
  const [expiredStatus, setExpiredStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<object>({});
  const [groupall, setgroupAll] = useState<any[]>([]);

  useEffect(() => {
    setIsModalOpen(openModal);
  }, [openModal]);

  useEffect(() => {
    if (loading === true) getDeta();
    getdatagroup();
  }, [loading]);

  const getDeta = async () => {
    if (inventoryId) {
      const productList = await orderManagementServices.getOrderLotsByInventoryID(inventoryId, expiredStatus, difLotId, search);
      const data = await Promise.all(
        productList
          ?.filter((event: any) => event.remain !== 0)
          .map(async (event: any) => ({
            inventoryLotId: event.id,
            lotNo: event.lotNo,
            detail: event.detail,
            masterProductDetails: event.inventoryStock.masterProduct.masterProductDetails,
            casNo: event.inventoryStock.masterProduct.casNo,
            masterProductGroup: event.inventoryStock.masterProduct.masterProductGroup,
            balance: event.remain,
            expiryDate: event.expiryDate,
            price: event.price,
            totalPrice: Number((event.price * event.qty).toFixed(2)),
            unit: event.inventoryStock.masterProduct.unit,
            stockid: event.inventoryStock.id,
            brand: event.inventoryStock.masterProduct.brandName,
            vender: event.inventoryStock.masterProduct.venderName,
            chemicalFormula: event.inventoryStock.masterProduct.chemicalFormula,
          })),
      );
      setProductList(data);
    }
    setLoading(false);
  };
  const getdatagroup = async () => {
    // const groupAll =
    //   await masterproductgroupservices.getMasterProductGroupAll();
    // const result = groupAll.map((event: any, index: number) => ({
    //   value: event.id,
    //   label: event.groupName,
    // }));
    // setgroupAll(result);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    propDataManage({ openModal: false });
  };
  const onSelectOrder = (r: any) => {
    const selected = {
      stockid: r.stockid,
      lotNo: r.lotNo,
      masterProductDetails: r.masterProductDetails,
      casNo: r.casNo,
      expiredStatus: expiredStatus,
      balance: r.balance,
      unit: r.unit?.unitName,
      qty: 0,
      orderPrice: 0,
      inventoryLotId: r.inventoryLotId,
      groupId: r.masterProductGroup.id,
      groupName: r.masterProductGroup.groupName,
      expiryDate: r.expiryDate,
      price: r.price,
      brand: r.brand,
      vender: r.vender,
      chemicalFormula: r.chemicalFormula,
      detailLot: r.detail,
    };

    propDataManage({ openModal: false, selectedProduct: selected });
  };
  const columns: ColumnsType<ITypeOrderLotForm> = [
    {
      title: "PRODUCT NAME",
      dataIndex: "masterProductDetails",
      key: "masterProductDetails",
      render: (data: { name: string }[]) =>
        data.map((d, i) => (
          <React.Fragment key={i}>
            <Tag color="blue" className=" mb-1">
              {d.name}
            </Tag>
            <br />
          </React.Fragment>
        )),
    },
    {
      title: "CAS NO.",
      dataIndex: "casNo",
      key: "casNo",
    },
    { title: "LOT NO.", dataIndex: "lotNo", key: "lotNo" },
    { title: "DETAIL", dataIndex: "detail", key: "detail" },
    {
      title: "GROUP",
      dataIndex: ["masterProductGroup", "groupName"],
      key: "id",
    },
    {
      title: "EXPIRED DATE",
      dataIndex: "expiryDate",
      key: "id",
      render: (d: Date) => dateToStringThNoTime(d),
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "id",
      align: "right",
      render: (d: number) => numberWithCommas(d),
    },
    {
      title: "UNIT",
      dataIndex: ["unit", "unitName"],
      key: "id",
    },
    {
      title: "UNIT PRICE",
      dataIndex: "price",
      key: "id",
      align: "right",
      render: (d: number, r: ITypeOrderLotForm) => `${numberWithCommas(d)} THB`,
    },
  ];

  const onFinishSearch = (value: any) => {
    let search = {};
    if (value.casNo) {
      search = { ...search, casNo: { contains: value.casNo } };
    }
    if (value.productName) {
      search = {
        ...search,
        masterProductDetails: {
          some: { name: { contains: value.productName } },
        },
      };
    }
    if (value.group) {
      search = {
        ...search,
        masterProductGroupId: value.group,
      };
    }
    setSearch(search);
    setLoading(true);
  };
  return (
    <div>
      <Row
        gutter={[8, 8]}
        style={{
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}>
        <Col>
          <Modal
            title={
              <>
                <Space>
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      fontWeight: "bold",
                    }}>
                    <SearchOutlined />
                  </div>
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      fontWeight: "bold",
                    }}>{`Search Product`}</div>
                </Space>
              </>
            }
            footer={[]}
            open={isModalOpen}
            width={1200}
            onOk={handleOk}
            onCancel={handleCancel}>
            <Spin spinning={loading}>
              <div className=" flex space-x-2  mb-2 justify-start">
                <Form onFinish={onFinishSearch} className=" flex space-x-2 ite mt-1  ">
                  <Form.Item name="casNo">
                    <Input className=" w-60" placeholder="Search by  CAS no." />
                  </Form.Item>
                  <Form.Item name="productName">
                    <Input className=" w-60" placeholder="Search by Product Name" />
                  </Form.Item>
                  <Form.Item name="group">
                    <Select className=" w-60" placeholder="Filter by Group" options={groupall} allowClear />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" icon={<SearchOutlined />}>
                      Search
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Switch
                      checkedChildren="หมดอายุ"
                      unCheckedChildren="ไม่หมดอายุ"
                      onChange={() => {
                        setExpiredStatus(!expiredStatus);
                        setLoading(true);
                      }}
                      checked={expiredStatus}
                      defaultChecked={expiredStatus}
                      className={expiredStatus === true ? "active-expired-switch" : "inactive-expired-switch"}
                    />
                  </Form.Item>
                </Form>
              </div>
              <Table
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () => onSelectOrder(record),
                  };
                }}
                rowKey={(r: ITypeOrderLotForm) => r.inventoryLotId}
                columns={columns}
                dataSource={productList}
              />
            </Spin>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};
