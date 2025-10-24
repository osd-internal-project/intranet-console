"use client";
import { Button, Card, Form, Input, Modal, Select, Switch, message, Image, Upload, type UploadFile, type UploadProps } from "antd";
import React, { useState, useEffect } from "react";
import UserServices from "../services/index.service";
import { useForm } from "antd/es/form/Form";
import { dateToStringThNoTime } from "@/app/utils/format";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { validateOnlyNumbers } from "@/app/utils/validatefield";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import { handleCompress } from "@/app/utils";
import type { TUpdateUserDto } from "../../users-management/users/common";
import { UsersServices } from "@/app/services/users.service";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const customInputStyle = {
  border: "none",
  borderRadius: "0",
  boxShadow: "none",
  background: "transparent",
  padding: "4px 0",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};

export interface props {
  userid: string;
}

type detailType = {
  userId: string | null;
  username: string | null;
  firstNameTh: string | null;
  lastNameTh: string | null;
  firstNameEn: string | null;
  lastNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  activeStatus: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  masterPosition: any | null;
  empId: string | null;
  startWork: Date | null;
};

type option = {
  label: number;
  value: string;
};

const ShowDetailComponent: React.FC<props> = ({ userid }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const userServices = UserServices(baseUrlUser);
  const [detailForm] = useForm();
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateWork, setDateWork] = useState<string>("");
  const [positionOption, setPositionOption] = useState<option[]>([]);
  const [clickUpdate, setClickUpdate] = React.useState(false);
  const image = detailForm.getFieldsValue(true);

  useEffect(() => {
    if (loading) {
      loadingDetail();
    }
  }, [loading]);

  const loadingDetail = async () => {
    if (userid) {
      const data = (await userServices.getUsersByUserId(userid)) as detailType;
      const start = dayjs(data.startWork);
      const end = dayjs();
      const years = end.diff(start, "year");
      const months = end.diff(start.add(years, "year"), "month");
      const days = end.diff(start.add(years, "year").add(months, "month"), "day");
      const formattedDuration = `${years} ปี ${months} เดือน ${days} วัน`;
      setDateWork(formattedDuration);
      const formdata = {
        ...data,
        empId: data.empId,
        startWork: data.startWork ? dateToStringThNoTime(data.startWork) : "",
        userId: data.userId,
        username: data.username,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        email: data.email,
        phoneNumber: data.phoneNumber,
        createdAt: data.createdAt ? dateToStringThNoTime(data.createdAt) : "",
        updatedAt: data.updatedAt ? dateToStringThNoTime(data.updatedAt) : "",
        masterPositionId: data.masterPosition.posId,
      };
      detailForm.setFieldsValue(formdata);
      const positions = await userServices.getMasterPositionAll();
      const positionOption: option[] = positions.map((d: any) => ({ label: d.nameTh, value: d.id }));
      setPositionOption(positionOption);
    }
    setLoading(false);
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleChangeImageFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    return setImageFiles(newFileList);
  };

  const beforeUploadImageFiles = async (file: RcFile) => {
    // const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    // if (file.size > maxSizeInBytes) {
    //   message.error(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 2MB`);
    //   return false;
    // }
    if (imageFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return false;
    }
    const compressed = await handleCompress(file);
    return compressed;
  };

  const handleUpdate = async (values: { extension: string; phoneNumber: string }) => {
    const base = {
      extension: values.extension,
      phoneNumber: values.phoneNumber,
    };

    if (userid) {
      const resUpdate = await UsersServices(baseUrlUser).updateProfile(userid, base);
      if (resUpdate) {
        if (resUpdate && imageFiles.length > 0) {
          console.log(resUpdate && imageFiles.length > 0);
          imageFiles.forEach(async (file) => {
            const formData: any = new FormData();
            formData.append("type", "create-attend");
            formData.append("files", file.originFileObj);
            await UsersServices(baseUrlUser).uploadFiles(resUpdate.userId, formData);
          });
        }
        message.success("Update Success");
        setImageFiles([]);
        detailForm.resetFields();
        setLoading(true);
        setClickUpdate(false);
      }
    }
  };

  return (
    <>
      <Form form={detailForm} name="basic" autoComplete="off" layout="vertical" onFinish={handleUpdate}>
        <div className="p-4">
          <Card
            className="shadow-sm border border-gray-200"
            bodyStyle={{ padding: "20px" }}
            title={`🫵 ข้อมูลส่วนตัว`}
            extra={
              <Button size="small" type="primary" onClick={() => (clickUpdate ? setClickUpdate(false) : setClickUpdate(true))}>
                {clickUpdate ? `ยกเลิก` : `แก้ไข`}
              </Button>
            }>
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3">
                {clickUpdate ? (
                  <>
                    <Upload
                      accept="image/png, image/jpeg"
                      fileList={imageFiles}
                      onChange={handleChangeImageFiles}
                      beforeUpload={beforeUploadImageFiles}
                      multiple={false}
                      maxCount={1}
                      listType="picture">
                      <Button className="w-full" icon={<UploadOutlined />}>
                        upload
                      </Button>
                    </Upload>
                  </>
                ) : (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image
                      className="w-full h-full object-cover"
                      src={image.imageId ? `${process.env.NEXT_PUBLIC_API_BASE_URL_USER}/id24users/get-image-user/${image.imageId}` : ""}
                      fallback="/api/placeholder/64/64"
                      preview={true}
                    />
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {detailForm.getFieldValue("firstNameTh")} {detailForm.getFieldValue("lastNameTh")}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {detailForm.getFieldValue("firstNameEn")} {detailForm.getFieldValue("lastNameEn")}
                  </p>
                  <p className="text-sm text-gray-500">@{detailForm.getFieldValue("username")}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className="text-red-500 text-xs">*</span>
                  <span className="text-sm font-medium text-gray-700">อายุงาน {dateWork}</span>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-800 mb-3 pb-1 border-b border-blue-200">ข้อมูลบัญชีผู้ใช้</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item label="รหัสพนักงาน" name="empId" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                <Form.Item label="Username" name="username" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                <Form.Item label="Email" name="email" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-800 mb-3 pb-1 border-b border-green-200">ข้อมูลส่วนตัว</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item label="ชื่อจริง" name="firstNameTh" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>

                <Form.Item label="นามสกุล" name="lastNameTh" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                <Form.Item label="ตำแหน่ง" name="masterPositionId" className="mb-2">
                  <Select
                    options={positionOption}
                    disabled
                    className="text-sm text-gray-700"
                    style={{
                      ...customInputStyle,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  />
                </Form.Item>
                <Form.Item label="เบอร์โต๊ะทำงาน" name="extension" className="mb-2" rules={[{ required: clickUpdate }]}>
                  <Input
                    disabled={clickUpdate ? false : true}
                    style={clickUpdate ? {} : customInputStyle}
                    className={clickUpdate ? "" : "text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none"}
                  />
                </Form.Item>

                <Form.Item
                  label="เบอร์โทรศัพท์"
                  name="phoneNumber"
                  className="mb-2"
                  rules={[{ required: clickUpdate, validator: validateOnlyNumbers }]}>
                  <Input
                    disabled={clickUpdate ? false : true}
                    style={clickUpdate ? {} : customInputStyle}
                    className={clickUpdate ? "" : "text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none"}
                  />
                </Form.Item>
              </div>
            </div>

            {/* System Information Section */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-3 pb-1 border-b border-purple-200">ข้อมูลระบบ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item label="วันที่สร้างบัญชี" name="createdAt" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                <Form.Item label="วันที่เริ่มงาน" name="startWork" className="mb-2">
                  <Input disabled style={customInputStyle} className="text-sm text-gray-700 bg-transparent border-0 shadow-none focus:shadow-none" />
                </Form.Item>
                {clickUpdate ? (
                  <div className="flex justify-end items-end">
                    <Button htmlType="submit" type="primary">
                      ยืนยัน
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </Form>
    </>
  );
};

export default ShowDetailComponent;
