"use client";
import React, { useContext, useEffect, useState } from "react";
import { ManageFormPage } from "./components/manage-form";
import { Breadcrumb, Col, Form, message, Row } from "antd";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { useParams, useRouter } from "next/navigation";
import { loadAppConfig } from "@/app/config/app-config";
import OrderServices from "../../services/order.service";
import MasterProductServices from "../../services/stock.service";
import { UserContectType, UserContext } from "@/app/config/userContext";

interface OrderFormData {
  oderId?: string;
  prdId: string;
  prdName: string;
  price: number;
  totalPrice: number;
  totalQty: number;
  unit?: string;
  expiredAt?: Date;
  updatedBy: string;
  masterProductId?: string;
  orderLot: any[];
}

const ManageOrderPage: React.FC = (): React.ReactElement => {
  const { id24Axios } = useId24();
  const navigate = useRouter();
  const { user } = useContext(UserContext) as UserContectType;
  const params = useParams();
  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const orderServices = OrderServices(baseUrlInventory);
  const masterproductServices = MasterProductServices(baseUrlInventory);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      fecthData();
    }
  }, [loading, user]);

  const fecthData = async () => {
    try {
      if (params.prdId && user) {
        const data = await masterproductServices.findOne(params.prdId as string);
        const currentValues = form.getFieldsValue(true);
        form.setFieldsValue({
          ...currentValues,
          price: data.price,
          prdId: data.prdId,
          prdName: data.prdName,
          unit: data.unit?.unitName,
          updatedBy: `${user?.firstNameTh} ${user?.lastNameTh}`,
        });
        setLoading(false);
      }
    } catch (err) {
      message.error(`error fecth-data 🚀 ${err}`);
    }
  };

  const handleCalculateTotal = () => {
    const price = form.getFieldValue("price") || 0;
    const qty = form.getFieldValue("totalQty") || 0;
    const total = price * qty;
    form.setFieldsValue({ totalPrice: total });
  };

  const onFinish = async (values: OrderFormData) => {
    if (values.totalQty !== values.orderLot.length) {
      message.warning(`กรุณากรอกข้อมูล Order Lot ให้ตรงกับจำนวนสินค้าทั้งหมด`);
      return false;
    }
    try {
      const response = await orderServices.createOrder({ ...values, masterProductId: params.prdId as string });
      if (response) {
        message.success("บันทึกข้อมูลออเดอร์เรียบร้อยแล้ว!");
        form.resetFields();
        setLoading(true);
        navigate.push(`${window.location.origin}/page/stock/order`);
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(true);
    }
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
              { title: <span>{`สร้างออเดอร์ใหม่`}</span> },
            ]}
          />
        </Col>
      </Row>
      <ManageFormPage form={form} handleCalculateTotal={handleCalculateTotal} onFinish={onFinish} />
    </div>
  );
};

export default ManageOrderPage;
