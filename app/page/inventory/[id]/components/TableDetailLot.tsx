"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Button, Col, DatePicker, Form, Input, Row, Space, Table, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { InventoryStockServices } from "../../services/inventory-stock.service";
import { dateToEndofDay, dateToStringThNoTime, numberWithCommas, dateToStartofDay } from "@/app/utils/format";
import { inventoryLot } from "@/app/page/product-list/common";
import { ColumnsType } from "antd/lib/table";
import { DownloadOutlined } from "@ant-design/icons";

export interface props {
  getId: string;
  getUnit: string;
  getMinStock: string;
  formdetaillot: any;
  setSearchLot: (e: any) => void;
  searchLot: any;
}

export const TableDetailLot: React.FC<props> = ({ getId, getUnit, getMinStock, formdetaillot, setSearchLot, searchLot }): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const inventorystockservices = InventoryStockServices(stockAuth);
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState<boolean>(true);
  const [getdata, setdataAll] = useState<inventoryLot[]>([]);
  const [getQTY, settotalQTY] = useState<number>(0);
  const [gettotalPrice, settotalPrice] = useState<number>(0);

  useEffect(() => {
    loaddatalot();
  }, [getId, loading, searchLot]);

  const filters = async (event: { lotNo: string; date: Date[]; venderName: string }) => {
    const { lotNo, date, venderName } = event;
    let searchdata = {};
    if (lotNo) {
      searchdata = { ...searchdata, lotNo: { contains: lotNo } };
    }
    if (venderName) {
      searchdata = { ...searchdata, venderName: { contains: venderName } };
    }
    if (date) {
      searchdata = { ...searchdata, receiptDate: { gte: dateToStartofDay(date[0]), lte: dateToEndofDay(date[1]) } };
    }
    setSearchLot(searchdata);
    setLoading(true);
  };

  const loaddatalot = async () => {
    if (getId || getId !== "") {
      const result = await inventorystockservices.getInventorylotByInventorystockIdFilter(getId, searchLot);
      console.log(result);
      let totalQty: number = 0;
      let totalPrice: number = 0;
      const res = result?.map((value: inventoryLot, index: number) => {
        const mapdata = {
          ...value,
          unitName: getUnit,
          minimumStock: getMinStock,
        };
        totalQty += value.qty;
        totalPrice += value.totalPrice;
        return mapdata;
      });
      settotalQTY(totalQty);
      settotalPrice(totalPrice);
      setdataAll(res);
    } else {
      setdataAll([]);
    }
    setLoading(false);
  };
  const downloadFile = async (id: any, name: string) => {
    if (id) {
      console.log(id);
      const response = await inventorystockservices.downloadfileRecieve(id);
      console.log(response);
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  const columns: ColumnsType<inventoryLot> = [
    { key: "lotNo", title: "LOT NO.", dataIndex: "lotNo", width: "100px", align: "center" },
    { key: "receiptDate", dataIndex: "receiptDate", title: "RECEIPT DATE", render: (event: Date) => (event ? dateToStringThNoTime(event) : "-") },
    { key: "detail", dataIndex: "detail", title: "DETAIL" },
    // { key: "brandName", dataIndex: "brandName", title: "BRAND" },
    // { key: "venderName", dataIndex: "venderName", title: "VENDER" },
    {
      key: "qty",
      title: "QTY",
      width: "150px",
      dataIndex: "qty",
      align: "right",
      render: (value: string, row: inventoryLot, index: number) => {
        if (row.minimumStock > value) {
          return <Typography color="red">{`${numberWithCommas(value)}`}</Typography>;
        } else {
        }
        return <Typography>{`${numberWithCommas(value)}`}</Typography>;
      },
    },
    {
      key: "unitName",
      dataIndex: "unitName",
      title: "UNIT",
    },
    { key: "productionDate", dataIndex: "productionDate", title: "PRODUCTON DATE", render: (event: Date) => dateToStringThNoTime(event) },
    { key: "expiryDate", dataIndex: "expiryDate", title: "EXPIRY DATE", render: (event: Date) => dateToStringThNoTime(event) },
    { key: "updateName", dataIndex: "updateName", title: "UPDATER" },
    {
      key: "totalPrice",
      dataIndex: "totalPrice",
      title: "TOTAL",
      align: "right",
      render: (event: string) => {
        return (
          <>
            <Space>
              <div>{`${numberWithCommas(event)}`}</div> <div style={{ color: "#9E9E9E" }}>{`THB`}</div>
            </Space>
          </>
        );
      },
    },
    {
      key: "fileRecieve",
      dataIndex: "fileRecieve",
      title: "FILE",
      render: (event: any[]) => {
        return (
          <>
            {event.length > 0 ? (
              <Tooltip title={`${event[0].namefile}`}>
                <Button type="link" icon={<DownloadOutlined />} onClick={() => downloadFile(event[0].id, event[0].namefile)} />
              </Tooltip>
            ) : (
              <Button type="link" disabled icon={<DownloadOutlined />} />
            )}
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Form name={`filtertablelot`} form={formdetaillot} layout="vertical" onFinish={filters}>
        <Row gutter={[8, 8]}>
          <Col span={4}>
            <Form.Item name={"lotNo"} label={"Lot No. :"}>
              <Input placeholder="Search by Lot No." />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item name={"venderName"} label={"Vender Name :"}>
              <Input placeholder="Search by Vender Name" />
            </Form.Item>
          </Col> */}
          <Col span={4}>
            <Form.Item name={"date"} label={"Receipt Date :"}>
              <RangePicker />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={" "}>
              <Button type="primary" htmlType="submit">{`Search`}</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        size="small"
        loading={loading}
        dataSource={getdata}
        rowKey={(e) => e.id}
        columns={columns}
        scroll={{ x: "calc(800px + 50%)" }}
        summary={() => {
          return (
            <>
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <Typography style={{ fontWeight: "bold" }}>{`Total Balance in inventory`}</Typography>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={3} align="right"></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={1} align="right">
                    <Typography style={{ fontWeight: "bold" }}>{`${numberWithCommas(getQTY)}`}</Typography>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={1}>
                    <Typography style={{ fontWeight: "400" }}>{`${getdata.length > 0 ? getUnit : ""}`}</Typography>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} colSpan={5} align="right">
                    <Space>
                      <Typography style={{ fontWeight: "bold" }}>{`${numberWithCommas(gettotalPrice)}`}</Typography>
                      <Typography style={{ fontWeight: "400", color: "#9E9E9E" }}>{`THB`}</Typography>
                    </Space>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            </>
          );
        }}
      />
    </div>
  );
};
