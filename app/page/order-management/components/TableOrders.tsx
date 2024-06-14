import {
  DownOutlined,
  ExclamationCircleFilled,
  FilterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Popover,
  Table,
  Image,
  Tag,
  Form,
  Input,
  Modal,
  message,
  TableColumnsType,
  Badge,
  Dropdown,
  Space,
} from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import OrderManagementServices from "../services/order-management.service";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ITypeOrder } from "../common";
import { dateToStringTh, numberWithCommas } from "@/app/utils/format";
import { checkRule } from "@/app/utils/rules";
export interface props {
  location?: number;
  grouplist?: string[];
}

interface TableDataType {
  id: number;
  orderId: string;
  createdAt: Date;
  responsibleRerson: string;
  qty: number;
  total: number;
  orderLot: SubTableDataType[];
}

interface SubTableDataType {
  id: number;
  masterProductDetails?: { name: string }[];
  casNo: string;
  group: string;
  balance: string;
  unit: number;
  total: number;
}

const TableOrders: React.FC<props> = ({
  location,
  grouplist,
}): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const addOrderRule = checkRule("sm-order-a");
  const orderManagementServices = OrderManagementServices(stockAuth);
  const [dataTable, setDataTable] = useState<ITypeOrder[]>([]);
  const [subDataTable, setSubDataTable] = useState<SubTableDataType[]>([]);
  const [search, setSearch] = useState<object>({});
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    loadData();
  }, [location, search]);

  const loadData = async () => {
    setLoading(true);
    if (location) {
      const data = await orderManagementServices.findOrdersByLocation(
        Number(location),
        search
      );
      setDataTable(data);
    } else {
      if (grouplist) {
        const data = await orderManagementServices.findOrdersAllByOwnerGroup(
          grouplist,
          search
        );
        setDataTable(data);
      }
    }
    setLoading(false);
  };

  // const dataImagesGhs = async (e: any) => {
  //   const getImages = await masterProductService.dataImagesGhs(e);
  //   return getImages;
  // };

  const columns: TableColumnsType<ITypeOrder> = [
    {
      title: "ORDER ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (d: string, row) => (
        <div className=" text-blue">
          <Link href={`/page/order-management/${row.id}`}>{d}</Link>
        </div>
      ),
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: Date) => dateToStringTh(d),
    },
    {
      title: "RESPONSIBLE PERSON",
      dataIndex: "createdByName",
      key: "createdByName",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (d: string) =>
        d === "new" ? (
          <Tag color="blue">{d}</Tag>
        ) : d === "done" ? (
          <Tag color="green">{d}</Tag>
        ) : d === "cancel" ? (
          <Tag color="red">{d}</Tag>
        ) : (
          ""
        ),
    },
    {
      title: "QTY",
      dataIndex: "totalQty",
      key: "totalQty",
      align: "right",
      render: (d: number) => numberWithCommas(d),
    },
    {
      title: "TOTAL",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "right",
      render: (d: number) => numberWithCommas(d),
    },
    Table.EXPAND_COLUMN,
  ];
  const getSubTableData = async (orderId: number) => {
    return await orderManagementServices.findLotByOrderId(orderId);
  };
  const expandedRowRender = (e: ITypeOrder) => {
    const columns: TableColumnsType<SubTableDataType> = [
      {
        title: "CAS NO.",
        dataIndex: "casNo",
        key: "casNo",
        width: "15%",
      },
      {
        title: "PRODUCT NAME",
        dataIndex: "productName",
        key: "productName",
        width: "25%",
        render: (d: string) => <div className=" font-bold">{d}</div>,
      },

      {
        title: "GROUP",
        dataIndex: "groupName",
        width: "15%",
        key: "groupName",
      },
      {
        title: "BALANCE",
        dataIndex: "qty",
        key: "qty",
        width: "15%",
        render: (d: number) => numberWithCommas(d),
      },
      { title: "UNIT", dataIndex: "unit", width: "15%", key: "unit" },
      {
        title: "TOTAL",
        dataIndex: "totalPrice",
        width: "15%",
        key: "totalPrice",
        render: (d: number) => numberWithCommas(d),
      },
    ];
    return (
      <div key={e.id}>
        <Table
          rowClassName=" bg-neutral-50"
          rowKey={(r: SubTableDataType) => r.casNo}
          dataSource={e.orderLot}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  };
  const onFilter = async (value: any) => {
    let search = {};

    if (value.productName) {
      search = { ...search, productName: { contains: value.productName } };
    }
    if (value.chemicalFormula) {
      search = {
        ...search,
        chemicalFormula: { contains: value.chemicalFormula },
      };
    }
    if (value.casNo) {
      search = { ...search, casNo: { contains: value.casNo } };
    }

    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };
  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const searchContent = (
    <Form layout="vertical" onFinish={onFilter} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Product Name" name="productName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Chemical Formula" name="chemicalFormula">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Cas No." name="casNo">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item className=" flex items-end">
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-2">
        <div className=" col-span-4  flex justify-between">
          <div>
            <Popover
              onOpenChange={handleOpenFilter}
              open={openFilter}
              content={searchContent}
              placement="bottomLeft"
              title="Search"
              trigger="click"
              overlayStyle={{ width: "calc(100% - 240px)" }}
            >
              <Button
                type="primary"
                className="button-blue"
                icon={<FilterOutlined />}
              >
                Filters
              </Button>
            </Popover>
          </div>
          <div className=" space-x-2">
            {addOrderRule ? (
              <Link
                href={`/page/order-management/add${
                  location ? `?locationId=${location}` : ``
                }`}
              >
                <Button
                  icon={<PlusCircleOutlined />}
                  type="primary"
                  className="button-blue"
                >
                  Request Order
                </Button>
              </Link>
            ) : (
              <></>
            )}

            {/* <Button icon={exportIcon}> Export</Button> */}
          </div>
        </div>
        <Card className="col-span-4 md:col-span-4">
          <Table
            size="small"
            rowKey={(e: ITypeOrder) => e.orderId}
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => record.orderId !== "Not Expandable",
            }}
          />
        </Card>
      </div>
    </>
  );
};

export default TableOrders;
