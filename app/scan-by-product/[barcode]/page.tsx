"use client";
import { loadAppConfig } from "@/app/config/app-config";
import OrderServices from "@/app/page/stock/services/order.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, Button, Card, Typography, Image, Space, InputNumber, Input, message } from "antd";
import { ShoppingCartOutlined, HeartOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import MasterProductServices from "@/app/page/stock/services/stock.service";

const { Title, Text } = Typography;

interface ProductFormData {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export default function ScanBarcodeByProductPage() {
  const params = useParams<{ barcode: string }>();
  const { id24Axios } = useId24();
  const baseUrlInventory = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INVENTORY);
  const masterproductServices = MasterProductServices(baseUrlInventory);
  const [form] = Form.useForm<ProductFormData>();
  const [valueNumber, setValueNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const getImage = form.getFieldsValue(true);

  useEffect(() => {
    if (loading) {
      fecthData();
    }
  }, [loading]);

  const fecthData = async () => {
    const response = await masterproductServices.findByBarcode(params.barcode);
    form.setFieldsValue(response);
    setLoading(false);
  };

  const increase = () => {
    setValueNumber(valueNumber + 1);
  };

  const decrease = () => {
    if (valueNumber > 1) setValueNumber(valueNumber - 1);
  };

  const onFinish = async (values: ProductFormData) => {
    const { text, data, status } = await masterproductServices.updateQty(getImage.id, { totalQty: valueNumber });
    if (status == 200) {
      message.success(`ซื้อสินค้า ${data.prdName} จำนวน ${valueNumber} ชิ้น สำเร็จ`);
      form.resetFields();
      setValueNumber(0);
    } else {
      message.warning(`${text}`);
    }
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <Title level={3} className="!text-white !mb-0 text-center">
          สหกรณ์ OSD
        </Title>
      </div>
      <div className="px-4 py-4 max-w-md mx-auto">
        <Form form={form} onFinish={onFinish} layout="vertical" autoComplete="off" name="form-buy-products">
          <Card className="shadow-md border-0 rounded-xl overflow-hidden mb-4">
            <div className="relative bg-white p-3 mb-3">
              {/* <Image
                src={`${process.env.REACT_APP_API_BASE_URL_INVENTORY}/master-product-image/get-image/${
                  getImage?.masterProductImage[0]?.prdImageId ?? ""
                }`}
                alt="สินค้าตัวอย่าง"
                className="w-full h-48 object-cover rounded-lg"
                preview={false}
              /> */}
              {getImage?.masterProductImage?.length > 0 && (
                <Image
                  src={`${process.env.REACT_APP_API_BASE_URL_INVENTORY}/master-product-image/get-image/${getImage.masterProductImage[0].prdImageId}`}
                  alt="สินค้าตัวอย่าง"
                  className="w-full h-48 object-cover rounded-lg"
                  preview={false}
                />
              )}
            </div>
            <div className="px-1">
              <Form.Item name="prdName" className="mb-0">
                <Input className="text-lg font-semibold !mb-0 text-gray-800 border-none p-0" readOnly style={{ boxShadow: "none" }} />
              </Form.Item>
              <div className="flex justify-start items-baseline mb-0 gap-1">
                <Typography.Text className="text-sm !mb-0 text-gray-500 border-none p-0">{`Seriel : `}</Typography.Text>
                <Form.Item name={"barcode"} className="mb-0">
                  <Input className="text-sm !mb-0 text-gray-500 border-none p-0" readOnly style={{ boxShadow: "none" }} />
                </Form.Item>
              </div>
              <Form.Item name={"description"} className="mb-0">
                <Input.TextArea
                  className="text-sm !mb-0 text-gray-500 border-none p-0"
                  readOnly
                  autoSize={{ minRows: 2, maxRows: 3 }}
                  style={{ boxShadow: "none" }}
                />
              </Form.Item>
              <div className="flex justify-start items-baseline mb-3">
                <Typography.Text className="text-2xl font-bold text-blue-600 mr-1">฿</Typography.Text>
                <Form.Item name="price" className="mb-0">
                  <Input className="text-2xl font-bold text-blue-600 border-none p-0" readOnly style={{ boxShadow: "none" }} />
                </Form.Item>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">จำนวนที่เหลือ</span>
                  <Form.Item name={"totalQty"} className="mb-0">
                    <Input
                      className="text-sm text-gray-600 border-none p-0 font-medium text-right"
                      readOnly
                      style={{ boxShadow: "none", background: "transparent" }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>
          <Card className="shadow-md border-0 rounded-xl mb-4">
            <div className="text-center">
              <Text className="text-base font-medium text-gray-700 mb-4 block">เลือกจำนวน</Text>

              <Form.Item className="mb-3">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={decrease}
                    disabled={valueNumber <= 1}
                    size="large"
                    shape="circle"
                    icon={<MinusOutlined />}
                    className="flex items-center justify-center w-12 h-12 border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:text-blue-700 disabled:border-gray-200 disabled:text-gray-400 transition-all duration-200"
                  />

                  <div className="relative">
                    <InputNumber
                      min={1}
                      value={valueNumber}
                      onChange={(e: any) => setValueNumber(e)}
                      controls={false}
                      size="large"
                      className="w-20 text-center text-xl font-semibold rounded-lg border-2 border-gray-200 focus:border-blue-400 transition-colors duration-200"
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                    />
                  </div>

                  <Button
                    onClick={increase}
                    // disabled={valueNumber >= 10}
                    size="large"
                    shape="circle"
                    icon={<PlusOutlined />}
                    className="flex items-center justify-center w-12 h-12 border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:text-blue-700 disabled:border-gray-200 disabled:text-gray-400 transition-all duration-200"
                  />
                </div>

                <div className="text-center mt-3 flex justify-center gap-2">
                  <div className="">
                    <span className="text-sm text-gray-500">จำนวนที่เลือก: </span>
                    <span className="text-base font-semibold text-blue-600">{valueNumber}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ราคา: </span>
                    <span className="text-base font-semibold text-blue-600">{`${valueNumber * form.getFieldValue("price")} `}</span>
                    <span className="text-sm text-gray-500">บาท </span>
                  </div>
                </div>
              </Form.Item>
            </div>
          </Card>
          <Form.Item className="mb-4">
            <Button
              disabled={getImage.status === "out-stock"}
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              htmlType="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-xl font-medium text-base shadow-lg">
              ยืนยันการสั่งซื้อ
            </Button>
          </Form.Item>
          <Card className="shadow-sm border-0 rounded-xl bg-blue-50">
            <div className="text-center">
              <Text className="text-xs text-gray-600 leading-relaxed">
                💡 สั่งซื้อก่อน 17:30 น.
                {/* <br />
                📞 สอบถามเพิ่มเติม: 02-xxx-xxxx */}
              </Text>
            </div>
          </Card>
        </Form>
      </div>
    </div>
  );
}
