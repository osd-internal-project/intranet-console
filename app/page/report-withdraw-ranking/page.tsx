"use client";
import { exportIcon } from "@/components/icon";
import { FilterOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
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
import ReportService from "./services/report.service";
import {
  useAxiosReport,
  useAxiosStock,
} from "@/app/lib/axios/hooks/userAxiosAuth";
import { ReportTable } from "./components/ReportTable";
import { ITypeSearchShow, typedata } from "./common";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";
import StockServices from "../report-expired/services/stock.service";
export default function TransactionPage() {
  const reportAuth = useAxiosReport();
  const stockAuth = useAxiosStock();
  const reportService = ReportService(reportAuth);
  const stockServices = StockServices(stockAuth);
  const [loading, setLoading] = useState<boolean>(true);
  const [getdataresult, setdataResult] = useState<typedata[]>([]);
  const [location, setLocation] = useState<
    { key: number; value: string; label: string }[]
  >([]);
  const [search, setSearch] = useState<object>({});
  const [openFilter, setOpenFilter] = useState(false);
  const [disableExport, setDisableExport] = useState(true);
  const [filterForm] = Form.useForm();
  const [searchShow, setSearchShow] = useState<ITypeSearchShow[]>([]);
  useEffect(() => {
    if (loading) {
      fecthdata();
    }
  }, [loading]);
  useEffect(() => {
    if (getdataresult.length > 0) {
      setDisableExport(false);
    }
  }, [getdataresult]);
  const fecthdata = async () => {
    const getLocation = await stockServices.getLocation();
    setLocation(
      getLocation.map((location: any) => ({
        key: location.id,
        value: location.id,
        label: location.locationName,
      }))
    );
    if (Object.keys(search).length !== 0) {
      const result = await reportService.findBycondition(search);
      console.log(result);
      if (result) {
        setdataResult(result);
      }
    } else {
      setdataResult([]);
    }
    setLoading(false);
  };
  const exportExcel = async () => {
    try {
      const response = await reportService.export(search);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `report-withdraw-ranking- ${dayjs(new Date()).format(
        "YYYYMMDDHHmmss"
      )} .xlsx`;
      link.click();
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };
  const onFilter = async (value: typedata) => {
    let search = {};
    if (value.casNo) {
      // setSearchShow([...searchShow, { label: "Cas No ", value: value.casNo }]);
      search = { ...search, casNo: value.casNo };
    }
    if (value.productName) {
      // setSearchShow([...searchShow, { label: "Product Name ", value: value.productName }]);
      search = { ...search, productName: value.productName };
    }
    if (value.location) {
      // setSearchShow([...searchShow, { label: "Location ", value: value.location }]);
      search = { ...search, locationId: value.location };
    }

    if (value.updatedAt) {
      // setSearchShow([...searchShow, { label: "Date", value: `${dayjs(value.updatedAt[0]).toString()} - ${dayjs(value.updatedAt[1]).toString()}` }]);
      search = {
        ...search,
        startDate: dateToStartofDay(value.updatedAt[0]),
        endDate: dateToEndofDay(value.updatedAt[1]),
      };
    }
    const show = Object.entries(value).map(([key, value]) => ({
      label: key,
      value: value,
    }));
    setSearch(search);
    setLoading(true);
    setOpenFilter(false);
  };

  const handleOpenFilter = (state: boolean) => {
    setOpenFilter(state);
  };
  const handleResetFilter = () => {
    filterForm.resetFields();
    setSearch({});
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
        <Form.Item label="Cas No :" name="casNo">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Product Name :" name="productName">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="Location :" name="location">
          {/* <Input placeholder="Search Text" /> */}
          <Select allowClear options={location} placeholder="Select" />
        </Form.Item>
        <Form.Item
          label="Last Order Date :"
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
              {
                title: <span>10 อันดับการเบิกจ่ายที่มากที่สุด</span>,
              },
            ]}
          />
        </Col>

        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`10 อันดับการเบิกจ่ายที่มากที่สุด`}</div>
        </Divider>

        <Col span={24}>
          <div className=" grid grid-cols-1 gap-y-2">
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
                <ReportTable getdataresult={getdataresult} loading={loading} />
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
