"use client";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import OrderServices from "../../../services/order.service";
import { ITOrderLot } from "../../../common/order";
import { Breadcrumb, Card, Col, Divider, Form, Input, Row, TablePaginationConfig } from "antd";
import { dateToStringThNoTime } from "@/app/utils/format";
import DetailOrderPage from "./components/detail-order";
import TableOrderLotPage from "./components/table-order-lot";

const OrderLotDetail: React.FC = (): React.ReactElement => {
  const params = useParams<{ orderId: string }>();
  const { id24Axios } = useId24();
  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const orderServices = OrderServices(baseUrlInventory);
  const [formDetailOrder] = Form.useForm();
  const [dataOrderLot, setDataOrderLot] = useState<{ data: ITOrderLot[]; count: number }>({ data: [], count: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fecthMasterData();
    if (loading) {
      fecthData();
    }
  }, [params, formDetailOrder, loading]);

  const fecthMasterData = async () => {
    const responseOrder = await orderServices.findOneOrder(params.orderId);
    formDetailOrder.setFieldsValue(responseOrder);
  };

  const fecthData = async () => {
    try {
      const filter = {
        oderId: params.orderId,
      };
      const skip: number = (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take: number = Number(pagination.pageSize);
      const { data, count } = await orderServices.findManyOrderLot(filter, skip, take);
      setDataOrderLot({ data, count });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
    setLoading(true);
  };

  return (
    <div>
      <Row className="mb-2">
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>{`หน้าหลัก`}</span>,
              },
              {
                href: "/page/stock",
                title: <span>{`การจัดการสินค้า`}</span>,
              },
              { href: "/page/stock/order", title: <span>{`นำเข้าสินค้า`}</span> },
              { title: <span>{`รายละเอียดการนำเข้าสินค้า`}</span> },
            ]}
          />
        </Col>
        <Col span={24}>
          <Divider orientation="left" orientationMargin="0">
            <div className="title-page-font">{`รายละเอียดการนำเข้าสินค้า`}</div>
          </Divider>
        </Col>
      </Row>
      <Card className="max-w-full mx-auto ">
        <div>
          <DetailOrderPage formDetailOrder={formDetailOrder} />
        </div>
        <div>
          <TableOrderLotPage dataOrderLot={dataOrderLot} changePagination={changePagination} pagination={pagination} />
        </div>
      </Card>
    </div>
  );
};

export default OrderLotDetail;
