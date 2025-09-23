"use client";
import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Breadcrumb, Card, Col, Divider, Form, message, Row, Spin, UploadFile } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ITMasterProductCreateInput } from "../../common/master-product";
import MasterProductServices from "../../services/stock.service";
import ManageMasterProductPage from "./components/manage-master-product";
import { RcFile, UploadProps } from "antd/es/upload";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { UserContectType, UserContext } from "@/app/config/userContext";
import UnitServices from "@/app/page/setting/unit/services";
import dayjs from "dayjs";

const StockManagement: React.FC = (): React.ReactElement => {
  const { id24Axios } = useId24();
  const navigate = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = params.status;
  const prdId = searchParams.get("prdId");
  const { user } = useContext(UserContext) as UserContectType;
  const baseUrlInventory = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INVENTORY);
  const masterproductServices = MasterProductServices(baseUrlInventory);
  const unitServices = UnitServices(baseUrlInventory);
  const [formManage] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [optionsUnit, setOptionsUnit] = useState<{ value: string; label: string }[]>([]);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (loading) {
      fecthData();
    }
    masterData();
  }, [loading, user]);

  const fecthData = async () => {
    try {
      if (prdId !== "undefined") {
        const data = await masterproductServices.findOne(prdId as string);
        formManage.setFieldsValue({
          ...data,
          createdAt: dayjs(data.createdAt),
          updatedAt: dayjs(data.updatedAt),
          unitId: data?.unit?.unitID,
        });
        if (data.masterProductImage && data.masterProductImage.length > 0) {
          const initialImage = data.masterProductImage[0];
          setImageFiles([
            {
              uid: "-1",
              name: initialImage.fileName || "image.jpg",
              status: "done",
              url: `${process.env.NEXT_PUBLIC_API_BASE_URL_INVENTORY}/master-product-image/get-image/${initialImage?.prdImageId}`,
            },
          ]);
        }
        setLoading(false);
      }
    } catch (err) {
      message.error(`error fecth-data 🚀 ${err}`);
    }
  };

  const masterData = async () => {
    const data = await unitServices.findOptions();
    setOptionsUnit(data);
  };

  const beforeUploadImageFiles = (file: RcFile) => {
    if (imageFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    return false;
  };

  const handleChangeImageFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return setImageFiles(newFileList);
  };

  const onFinish = async (values: ITMasterProductCreateInput, type: string) => {
    const data = { ...values, updatedBy: `${user?.firstNameTh} ${user?.lastNameTh}` };
    try {
      const records = formManage.getFieldsValue(true);
      const response = type === "create" ? await masterproductServices.create(data) : await masterproductServices.update(records.id, data);
      if (response) {
        if (imageFiles.length > 0 && !imageFiles[0].status) {
          imageFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "create-attend");
            formData.append("files", file.originFileObj);
            await masterproductServices.uploadImage(response.prdId, formData);
          });
        }
        setLoading(true);
        formManage.resetFields();
        setImageFiles([]);
        message.info(type === "create" ? "create success" : "edit success");
        navigate.push(`${window.location.origin}/page/stock/stock-management`);
      }
    } catch (err) {
      message.error(`error manage 🚀 ${err}`);
    }
  };
  return user && type ? (
    <div>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page/home",
                title: <span>หน้าหลัก</span>,
              },
              {
                href: "/page/stock",
                title: <span>การจัดการสินค้า</span>,
              },
              { href: "/page/stock/stock-management", title: <span>รายการสินค้า</span> },
              {
                title: <span>{type === "create" ? "เพิ่มรายการสินค้า" : "แก้ไขรายการสินค้า"}</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font" style={{ display: "flex", alignItems: "left" }}>
            <span style={{ marginRight: "8px" }}>{`${type === "create" ? "เพิ่มรายการสินค้า" : "แก้ไขรายการสินค้า"}`}</span>
          </div>
        </Divider>
      </Row>
      <Card styles={{ body: { padding: "10px" } }}>
        <div>
          <ManageMasterProductPage
            status={type as string}
            user={user}
            formManage={formManage}
            onFinish={onFinish}
            handleChangeImageFiles={handleChangeImageFiles}
            beforeUploadImageFiles={beforeUploadImageFiles}
            imageFiles={imageFiles}
            optionsUnit={optionsUnit}
          />
        </div>
      </Card>
    </div>
  ) : (
    <Spin></Spin>
  );
};
export default StockManagement;
