"use client";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { dateToStringThNoTime } from "@/app/utils/format";
import { IconEye } from "@/components/icon";
import { Button, Space, Table, Tag } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { InventoryStockServices } from "../services/inventory-stock.service";
import { ColumnsType } from "antd/es/table";
import { ITypeInventory } from "../common";

export interface props {
  groupID: any;
  search: object;
}

export const TableInventory: React.FC<props> = ({
  groupID,
  search,
}): React.ReactElement => {
  const stockAuth = useAxiosStock();

  const inventorystockservices = InventoryStockServices(stockAuth);
  const [loading, setLoading] = useState<boolean>(true);
  const [getdataResult, setdataResult] = useState<[]>([]);
  useEffect(() => {
    if (loading === true) loaddata();
  }, [groupID?.grouplist, loading]);
  const loaddata = async () => {
    const result = await inventorystockservices.getInventoryByGroup(
      groupID?.grouplist,
      search
    );
    if (result) setdataResult(result);
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
  }, [search]);
  const columns: ColumnsType<ITypeInventory> = [
    {
      key: "inventoryName",
      title: "INVENTORY NAME",
      dataIndex: "inventoryName",
    },
    {
      key: "locationId",
      title: "LOCATION",
      dataIndex: "locationId",
      render: (event: string, row: any, index: number) => {
        return row.location.locationName;
      },
    },
    {
      key: "locationId",
      title: "LOCATION PLACE",
      dataIndex: "locationPlace",
      render: (event: string, row: any, index: number) => {
        return row.locationPlace;
      },
    },
    {
      key: "phoneNumber",
      title: "PHONE NUMBER",
      dataIndex: "phoneNumber",
    },
    {
      key: "createdAt",
      title: "CREATED",
      dataIndex: "createdAt",
      render: (event: Date) => dateToStringThNoTime(event),
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      render: (d: boolean, r: any, index: number) =>
        d ? (
          <Tag key={`atag-${1}`} color="green">
            Active
          </Tag>
        ) : (
          <Tag key={`atag-${2}`} color="red">
            InActive
          </Tag>
        ),
    },

    {
      key: "id",
      title: "ACTIVE",
      dataIndex: "id",
      align: "center",
      fixed: "right",
      width: "180px",
      render: (event: string, row: any, index: number) => {
        return (
          <>
            <Link
              href={{
                pathname: `/page/inventory/${row.id}`,
                query: {
                  id: row.id,
                  location: row.location.locationPlace,
                  userId: groupID.user.userId,
                  inventoryName: row.inventoryName,
                  groupID: groupID.user.ownerGroup,
                },
              }}
            >
              <Button type="link">
                <Space>
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {IconEye}
                  </div>
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >{`check stock`}</div>
                </Space>
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        size="small"
        dataSource={getdataResult}
        scroll={{ x: "calc(500px + 80%)" }}
        rowKey={(e: any) => e.id}
      />
    </div>
  );
};
