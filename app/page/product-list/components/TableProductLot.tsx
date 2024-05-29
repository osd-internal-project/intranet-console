"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import MasterProductServices from "../services/product-list.service";
import { dateToStringThNoTime, numberWithCommas } from "@/app/utils/format";
import { ColumnsType } from "antd/lib/table";
import { ITypeMasterProduct, inventoryStockByProduct, masterProductInSubTable } from "../common";

export interface props {
  record: ITypeMasterProduct;
}

export const TableProductLot: React.FC<props> = ({ record }) => {
  const stockAuth = useAxiosStock();
  const productListService = MasterProductServices(stockAuth);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<inventoryStockByProduct[]>([]);
  const [getQTY, settotalQTY] = useState<number>(0);
  const [gettotalPrice, settotalPrice] = useState<number>(0);
  useEffect(() => {
    if (record.inventoryStock[0]?.id) loaddatalot();
  }, [record.inventoryStock[0]?.id]);

  const loaddatalot = async () => {
    setLoading(true);
    const result: masterProductInSubTable = await productListService.getProductQtyOfDepartmentByInventorystockId(record.id);

    if (result.inventoryStock) {
      const data = await Promise.all(
        result.inventoryStock.map(async (d) => {
          const usable = await productListService.getUsableRemain(d.id);
          const expired = await productListService.getExpiredRemain(d.id);
          return {
            id: d.id,
            unit: result.unit.unitName,
            inventoryName: d.inventory.inventoryName,
            locationName: d.inventory.location.locationName,
            locationPlace: d.inventory.locationPlace,
            remainQty: usable ? Number(usable) : 0,
            expiryQty: expired ? Number(expired) : 0,
          };
        }),
      );
      setDataTable(data);
    }

    setLoading(false);
  };

  const columns: ColumnsType<inventoryStockByProduct> = [
    { key: "id", title: "NO.", dataIndex: "id", render: (data: number, r, index: number) => index + 1 },
    { key: "inventory", title: "INVENTORY", dataIndex: "inventoryName" },
    { key: "department", title: "DEPARTMENT", dataIndex: "locationName" },
    { key: "locationPlace", title: "LOCATION", dataIndex: "locationPlace" },
    {
      key: "qty",
      title: "QTY",
      dataIndex: "remainQty",
      align: "right",
      render: (event: number, row: any, index: number) => {
        return <>{numberWithCommas(event)}</>;
      },
    },
    {
      key: "qty",
      title: "QTY (EXP.)",
      dataIndex: "expiryQty",
      align: "right",
      render: (event: number, row: any, index: number) => {
        return <>{numberWithCommas(event)}</>;
      },
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      key: "unit",
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      <Table
        rowKey={(r: any) => r.id}
        rowClassName=" bg-neutral-50"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={dataTable}
        pagination={false}
      />
    </div>
  );
};
