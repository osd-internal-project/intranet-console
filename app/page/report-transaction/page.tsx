"use client";
import { exportIcon } from "@/components/icon";
import { FilterOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import ReportServices from "./services/report.service";
import UsersServices from "./services/users.service";
import {
  useAxiosUser,
  useAxiosReport,
  useAxiosStock,
} from "@/app/lib/axios/hooks/userAxiosAuth";
import { ReportTable } from "./components/ReportTable";
import { useEffect, useState } from "react";
import { typedata, ITypeRequester } from "./common";
import dayjs from "dayjs";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";

const InitialFilter = {
  take: 10,
  skip: 0,
  current: 1,
};

export default function TransactionPage() {
  const { RangePicker } = DatePicker;
  const stockAuth = useAxiosStock();
  const userAuth = useAxiosUser();
  const reportAuth = useAxiosReport();
  const reportService = ReportServices(reportAuth);
  const userService = UsersServices(userAuth);
  const stockServices = UsersServices(stockAuth);

  const [loading, setLoading] = useState<boolean>(true);
  const [getdataresult, setdataResult] = useState<typedata[]>([]);
  const [search, setSearch] = useState<object>({});
  const [openFilter, setOpenFilter] = useState(false);
  const [status, setStatus] = useState("pay");
  const [location, setLocation] = useState<
    { key: number; value: string; label: string }[]
  >([]);
  const [inventorySelectDisable, setInventorySelectDisable] = useState(true);
  const [inventory, setInventory] = useState<
    { value: number; label: string }[]
  >([]);
  const [paginationConfig, setPaginationConfig] = useState<number>(0);
  const [filterForm] = Form.useForm();
  const [filter, setFilter] = useState<{
    take: number;
    skip: number;
    current: number;
  }>(InitialFilter);
  const [onlyRequester, setOnlyRequester] = useState<boolean>(false);
  const [requester, setRequester] = useState<ITypeRequester[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [checkvaluestatus, setCheckValuestatus] = useState<string>("");
  const [disableExport, setDisableExport] = useState(true);

  useEffect(() => {
    if (loading) {
      fecthdata();
      getdataAll();
    }
    getDefault();
  }, [loading]);
  useEffect(() => {
    if (getdataresult.length > 0) {
      setDisableExport(false);
    }
  }, [getdataresult]);

  const getDefault = async () => {
    const req = await userService.getRequestUsers();
    setRequester(req);
  };

  const getdataAll = async () => {
    const getLocation = await stockServices.getLocation();
    setLocation(
      getLocation.map((location: any) => ({
        key: location.id,
        value: location.id,
        label: location.locationName,
      }))
    );
    setLoading(false);
  };

  const onFilter = async (value: typedata) => {
    let search = {};
    if (value.location) {
      search = { ...search, locationId: value.location };
    }
    if (value.inventory) {
      search = { ...search, inventoryId: value.inventory };
    }
    if (value.updatedAt) {
      search = {
        ...search,
        updatedAt: {
          gte: dateToStartofDay(value.updatedAt[0]),
          lte: dateToEndofDay(value.updatedAt[1]),
        },
      };
      if (onlyRequester) {
        search = {
          ...search,
          requesterId: { not: null },
        };
      }
    }
    if (value.status) {
      search = { ...search, status: { contains: value.status } };
    }
    if (value.status === "pay") {
      if (value.person) {
        search = {
          ...search,
          OR: [{ updatedById: value.person }, { requesterId: value.person }],
        };
      }
      search = { ...search, status: { contains: value.status } };
    } else if (value.status === "recieve") {
      if (value.person) {
        search = { ...search, updatedById: value.person };
      }
    }
    setFilter((prevState) => ({
      ...prevState,
      take: 10,
      skip: 0,
      current: 1,
    }));
    setCheckValuestatus(value.status);
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };
  const fecthdata = async () => {
    if (Object.keys(search).length !== 0) {
      const count = await reportService.count(search);
      setPaginationConfig(count);
      const result = await reportService.findDataTable(search, filter);
      if (result) {
        setdataResult(result);
      }
    } else {
      setdataResult([]);
    }
    setLoading(false);
  };

  const handlerPaginationTable = (paginate: any) => {
    const skip = paginate.current * paginate.pageSize - paginate.pageSize;
    const { current, pageSize } = paginate;
    setFilter((prevState) => ({
      ...prevState,
      skip: skip,
      take: Number(paginate.pageSize),
      current: paginate.current,
    }));
    setPagination((prevState) => ({
      ...prevState,
      current: current || 1,
      pageSize: pageSize || 10,
    }));
    setLoading(true);
  };

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const handleResetFilter = () => {
    filterForm.resetFields();
    setSearch({});
  };

  const handleChangeLocation = async (locationId?: number) => {
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

  const searchContent = (
    <Form
      initialValues={{ status: "pay" }}
      form={filterForm}
      name="filter"
      layout="vertical"
      onFinish={onFilter}
      autoComplete="off"
    >
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4">
        <Form.Item label="Location :" name="location">
          <Select
            allowClear
            options={location}
            placeholder="Select"
            onChange={(e: any, row: any) => handleChangeLocation(row.key)}
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
        <Form.Item label="Person :" name="person">
          <Select
            allowClear
            placeholder="Search Person"
            options={requester.map((req: ITypeRequester) => ({
              value: req.userId,
              label: `${req.firstNameTh} ${req.lastNameTh} (${req.ownerGroup?.groupName})`,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Order Date :"
          name="updatedAt"
          rules={[{ required: true, message: "Please enter date" }]}
        >
          <RangePicker className=" w-full" />
        </Form.Item>
        <Form.Item
          label="Status :"
          name="status"
          rules={[{ required: true, message: "Please enter status" }]}
        >
          <Select
            onChange={(value) => {
              setStatus(value);
              setOnlyRequester(false);
            }}
            placeholder={`Please Select`}
            options={[
              {
                key: 0,
                value: "recieve",
                label: "รับเข้า",
              },
              {
                key: 1,
                value: "pay",
                label: "เบิกจ่าย",
              },
            ]}
          />
        </Form.Item>
        {status === "pay" ? (
          <Form.Item label="Requester :" name="requester">
            <Checkbox
              checked={onlyRequester}
              onChange={(e) => {
                setOnlyRequester(e.target.checked);
              }}
            >
              เฉพาะการเบิกให้
            </Checkbox>
          </Form.Item>
        ) : (
          <></>
        )}
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

  const exportExcel = async () => {
    try {
      const response = await reportService.export(search, status);
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `report-transaction- ${dayjs(new Date()).format(
        "YYYYMMDDHHmmss"
      )} .xlsx`;
      link.click();
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>หน้าหลัก</span>,
              },
              // {
              //   href: "/page/setting",
              //   title: <span>Setting</span>,
              // },
              {
                title: <span>การรับเข้าเบิกจ่าย</span>,
              },
            ]}
          />
        </Col>

        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`การรับเข้าเบิกจ่าย`}</div>
        </Divider>

        <Col span={24}>
          <div className=" grid grid-cols-1 gap-y-2">
            <div>
              <Card>
                <div className=" flex justify-end pb-4">
                  <Space>
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

                    <Button
                      type="primary"
                      icon={exportIcon}
                      className="button-blue"
                      onClick={exportExcel}
                      disabled={disableExport}
                    >
                      Export
                    </Button>
                  </Space>
                </div>
                <div className=" col-span-1 space-y-5 md:top-1">
                  <div className=" overflow-auto md:overflow-hidden">
                    <ReportTable
                      status={status}
                      getdataresult={getdataresult}
                      paginationConfig={paginationConfig}
                      handlerPaginationTable={(e: any) =>
                        handlerPaginationTable(e)
                      }
                      filter={filter}
                      loading={loading}
                      checkvaluestatus={checkvaluestatus}
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
