import { Button, DatePicker, Form, FormInstance, Input, Select, Typography, Upload, UploadFile, UploadProps } from "antd";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { ITMasterProductCreateInput } from "../../../common/master-product";
import { TUser } from "@/app/common";

export interface props {
  status: string;
  user: TUser;
  formManage: FormInstance;
  onFinish: (values: ITMasterProductCreateInput, status: string) => void;
  handleChangeImageFiles: UploadProps["onChange"];
  beforeUploadImageFiles: UploadProps["beforeUpload"];
  imageFiles: UploadFile[];
  optionsUnit: { value: string; label: string }[];
}

const ManageMasterProductPage: React.FC<props> = ({
  status,
  user,
  formManage,
  onFinish,
  handleChangeImageFiles,
  beforeUploadImageFiles,
  imageFiles,
  optionsUnit,
}): React.ReactElement => {
  const currentDate = new Date();
  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-full mx-auto p-2 bg-white">
      {/* Header */}
      <div className="mb-2 p-6 bg-gray-50 rounded-lg">
        <Typography.Text className="text-lg font-semibold block mb-2">{`${status === "create" ? "เพิ่ม" : "แก้ไข"}รายการสินค้า`}</Typography.Text>
        <Typography.Text className="text-gray-600">{`${formatDate(currentDate)} - โดย: ${user.firstNameTh} ${user.lastNameTh} 🚀`}</Typography.Text>
      </div>

      {/* Form */}
      <Form form={formManage} layout="vertical" autoComplete="off" onFinish={(e) => onFinish(e, status)} className="space-y-6">
        {/* Image Upload */}
        <Form.Item name="masterProductImages" label="รูปภาพ">
          <Upload
            fileList={imageFiles}
            onChange={handleChangeImageFiles}
            beforeUpload={beforeUploadImageFiles}
            multiple={false}
            maxCount={1}
            onPreview={() => {}}
            listType="picture-card"
            className="w-full">
            <div className="flex flex-col items-center p-4">
              <PlusOutlined className="text-base mb-2" />
              <div className="text-xs">อัปโหลด</div>
            </div>
          </Upload>
        </Form.Item>

        {/* Product Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item name="prdName" label="ชื่อสินค้า">
            <Input size="large" placeholder="กรอกชื่อสินค้า" />
          </Form.Item>

          <Form.Item name="unitId" label="หน่วยสินค้า">
            <Select size="large" placeholder="เลือกหน่วยสินค้า" options={optionsUnit} optionFilterProp="label" allowClear />
          </Form.Item>
          <Form.Item name="expired" label="วันหมดอายุ">
            <DatePicker size="large" placeholder="เลือกวันหมดอายุ" className="w-full md:w-full" />
          </Form.Item>
        </div>

        <Form.Item name="description" label="รายละเอียดสินค้า">
          <Input.TextArea rows={4} placeholder="กรอกรายละเอียดสินค้า" />
        </Form.Item>

        {/* Submit Button */}
        <div className="flex justify-end ">
          <Button htmlType="submit" type="primary" size="large" className="px-8">
            ยืนยัน
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ManageMasterProductPage;
