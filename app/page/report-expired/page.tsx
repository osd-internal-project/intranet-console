"use client";
import { exportIcon } from "@/components/icon";
import { FilterOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Table,
} from "antd";
import ExpiredServices from "./services/sm-re-ex-h.service";
import StockServices from "./services/stock.service";
import {
  useAxiosStock,
  useAxiosReport,
} from "@/app/lib/axios/hooks/userAxiosAuth";
import { ReportTable } from "./components/ReportTable";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";

type searchType = {
  casNo?: string;
  productName?: string;
  location?: number;
  inventory?: number;
  updatedAt?: Date[];
};

const InitialFilter = {
  take: 10,
  skip: 0,
  current: 1,
};

export default function TransectionPage() {
  const { RangePicker } = DatePicker;
  const stockAuth = useAxiosStock();
  const reportAuth = useAxiosReport();
  const expiredServices = ExpiredServices(reportAuth);
  const stockServices = StockServices(stockAuth);
  const [gatdataAll, setdataAll] = useState<any>();
  const [getloading, setloading] = useState<boolean>(true);
  const [search, setSearch] = useState<object>({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterForm] = Form.useForm();
  const [paginationConfig, setPaginationConfig] = useState<number>(0);
  const [filter, setFilter] = useState<{
    take: number;
    skip: number;
    current: number;
  }>(InitialFilter);
  const [location, setLocation] = useState<{ value: number; label: string }[]>(
    []
  );
  const [inventorySelectDisable, setInventorySelectDisable] = useState(true);
  const [inventory, setInventory] = useState<
    { value: number; label: string }[]
  >([]);
  const [disableExport, setDisableExport] = useState(true);
  const [checknumber, setScheckNumber] = useState<number | undefined>(0);

  useEffect(() => {
    getloading === true ? getdataAll() : null;
  }, [getloading]);
  useEffect(() => {
    if (gatdataAll?.length > 0) {
      setDisableExport(false);
    }
  }, [gatdataAll]);
  const getdataAll = async () => {
    const getLocation = await stockServices.getLocation();
    setLocation(
      getLocation.map((location: any) => ({
        value: location.id,
        label: location.locationName,
      }))
    );
    if (Object.keys(search).length !== 0) {
      const count = await expiredServices.count(search);
      setPaginationConfig(count);
      const res = await expiredServices.getInventorylotByExpiredDate(
        search,
        filter
      );
      if (res) {
        setdataAll(res);
      }
    } else {
      setdataAll([]);
    }
    setloading(false);
  };

  const onFilter = async (value: searchType) => {
    let search = {};
    if (value.casNo) {
      search = {
        ...search,
        inventoryStock: { masterProduct: { casNo: { contains: value.casNo } } },
      };
    }
    if (value.productName) {
      search = {
        ...search,
        inventoryStock: {
          masterProduct: {
            masterProductDetails: {
              some: { name: { contains: value.productName } },
            },
          },
        },
      };
    }
    if (value.location) {
      search = {
        ...search,
        inventoryStock: { inventory: { locationId: value.location } },
      };
    }
    if (value.inventory) {
      search = { ...search, inventoryStock: { inventoryId: value.inventory } };
    }
    if (value.updatedAt) {
      search = {
        ...search,
        expiryDate: {
          gte: dateToStartofDay(value.updatedAt[0]),
          lte: dateToEndofDay(value.updatedAt[1]),
        },
      };
    }

    setFilter((prevState) => ({
      ...prevState,
      take: 10,
      skip: 0,
      current: 1,
    }));

    setSearch(search);
    setloading(true);
    setOpenFilter(false);
  };
  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const handleResetFilter = () => {
    filterForm.resetFields();
    setSearch({});
  };

  const handleChangeLocation = async (locationId?: number) => {
    setScheckNumber(locationId);

    if (locationId !== checknumber) {
      filterForm.setFieldsValue({
        ["inventory"]: undefined,
      });
    }

    if (locationId) {
      const getInventory = await stockServices.getInventoryByLocationId(
        locationId
      );
      setInventory(
        getInventory.map((inv: any) => ({
          value: inv.id,
          label: inv.inventoryName,
        }))
      );
      setInventorySelectDisable(false);
    } else {
      filterForm.setFieldsValue({
        ["inventory"]: undefined,
      });
      setInventorySelectDisable(true);
    }
  };

  const handlerPaginationTable = (paginate: any) => {
    const skip = paginate.current * paginate.pageSize - paginate.pageSize;
    const { current, pageSize } = paginate;
    setFilter((prevState) => ({
      ...prevState,
      skip: skip,
      take: pageSize,
      current: current,
    }));
    setloading(true);
  };

  const searchContent = (
    <Form
      form={filterForm}
      name="filter"
      layout="vertical"
      onFinish={onFilter}
      autoComplete="off"
    >
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Cas No. :" name="casNo">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Product Name :" name="productName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Location :" name="location">
          <Select
            allowClear
            options={location}
            placeholder="Select"
            onChange={handleChangeLocation}
          />
        </Form.Item>
        <Form.Item label="Inventory :" name="inventory">
          <Select
            disabled={inventorySelectDisable}
            options={inventory}
            allowClear
            placeholder="Select "
          />
        </Form.Item>
        <Form.Item
          label="Expried Date :"
          name="updatedAt"
          rules={[{ required: true, message: "Please enter date" }]}
        >
          <RangePicker className=" w-full" />
        </Form.Item>
      </div>
      <Row
        gutter={[8, 8]}
        style={{ justifyContent: "end", display: "flex", width: "100%" }}
      >
        <Col>
          <Form.Item
            style={{
              justifyContent: "end",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              type="default"
              onClick={handleResetFilter}
            >{`Reset`}</Button>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            style={{
              justifyContent: "start",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button type="primary" htmlType="submit">
              {`Search`}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  async function exportExcel() {
    try {
      const response = await expiredServices.export(search);
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `report-transaction-expired-${dayjs(new Date()).format(
        "YYYYMMDDHHmmss"
      )} .xlsx`;
      link.click();
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  }

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>{`Home`}</span>,
              },
              {
                href: "/page/setting",
                title: <span>{`Setting`}</span>,
              },
              {
                title: <span>{`รายงานการหมดอายุ`}</span>,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <div className="title-page-font">{`รายงานการหมดอายุ`}</div>
        </Col>
        <Col span={24}>
          <div className=" grid grid-cols-1 gap-y-2">
            <div className=" flex justify-between md:col-span-2 ">
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
                    {`Filters`}
                  </Button>
                </Popover>
              </div>
              <div>
                <Button
                  type="primary"
                  icon={exportIcon}
                  disabled={disableExport}
                  className="button-blue"
                  onClick={exportExcel}
                >
                  {`Export`}
                </Button>
              </div>
            </div>
            <div>
              <Card>
                <div className=" col-span-1 space-y-5 md:top-1">
                  <div className=" overflow-auto md:overflow-hidden">
                    <ReportTable
                      gatdataAll={gatdataAll}
                      getloading={getloading}
                      paginationConfig={paginationConfig}
                      handlerPaginationTable={(e: any) =>
                        handlerPaginationTable(e)
                      }
                      filter={filter}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
