import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Space, Upload, UploadFile, UploadProps, Image, Switch } from "antd";
import { FormInstance } from "antd/lib";
import TextArea from "antd/lib/input/TextArea";
import { RcFile } from "antd/lib/upload";
import dayjs from "dayjs";
import imageCompression from "browser-image-compression";
import React from "react";
import { handleCompress } from "@/app/utils";

export interface props {
  form: FormInstance;
  carDetail: any[];
  checkType: string;
  openModal: boolean;
  handleClose: () => void;
  handleChangeSelect: (values: string) => void;
  carMileage: number;
  optionsType: { value: string; label: string; key: number }[];
  setAttendFiles: (newFileList: UploadFile[]) => void;
  attendFiles: UploadFile[];
  onFinish: (status: string, values: any) => void;
  setCheckApprovedStatus: (status: string) => void;
  Files: any;
}

const ManagementCarWrapupManage: React.FC<props> = ({
  form,
  carDetail,
  checkType,
  openModal,
  handleClose,
  handleChangeSelect,
  carMileage,
  optionsType,
  setAttendFiles,
  attendFiles,
  onFinish,
  setCheckApprovedStatus,
  Files,
}): React.ReactElement => {
  const nextCheckDate = Form.useWatch("nextCheckDate", form) || {};

  const handleChangeAttendFiles: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    if (newFileList.length > 3) {
      message.warning("คุณไม่สามารถอัปโหลดภาพเกิน 3 ภาพ");
      return Upload.LIST_IGNORE;
    }
    return setAttendFiles(newFileList);
  };

  const beforeUploadAttendFiles = async (file: RcFile) => {
    if (attendFiles.find((oneFile) => oneFile.name === file.name)) {
      message.warning(`ชื่อไฟล์ ${file.name} ซ้ำ`);
      return Upload.LIST_IGNORE;
    }
    const compressed = await handleCompress(file);
    return compressed;
  };
  return (
    <div>
      <Modal
        title={checkType === "create" ? "เพิ่มข้อมูลตรวจสภาพรถ" : "แก้ไขข้อมูลตรวจสภาพรถ"}
        open={openModal}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        <Form
          name="formmanage"
          form={form}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(e) => onFinish(checkType, e)}
        >
          <Form.Item name="carId" label="ชื่อรถ" rules={[{ required: true, message: "กรุณาเลือกชื่อรถ" }]}>
            <Select
              allowClear
              placeholder="โปรดเลือกรถ"
              style={{ width: "100%" }}
              onChange={handleChangeSelect}
              options={carDetail.map((car: any, index: number) => {
                return { key: index, value: car.carId, label: car.carName };
              })}
              disabled={checkType !== "create" ? true : false}
            />
          </Form.Item>
          <Form.Item name="typeId" label="ประเภทการตรวจสภาพ" rules={[{ required: true, message: "กรุณาเลือกประเภทการตรวจสภาพ" }]}>
            <Select allowClear placeholder="โปรดเลือกประเภทการตรวจสภาพ" options={optionsType} disabled={checkType !== "create" ? true : false} />
          </Form.Item>
          <Form.Item
            name="wrapupMiles"
            label="เลขไมล์"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              placeholder="กรอกจำนวนเลขไมล์"
              min={carMileage || 0}
              className="w-full"
              disabled={checkType !== "create" && checkType !== "edit" ? true : false}
            />
          </Form.Item>
          <Form.Item name="vender" label="สถานที่การตรวจสภาพ" rules={[{ required: true, message: "กรุณากรอกสถานที่การตรวจสภาพ" }]}>
            <Input placeholder="โปรดเลือกสถานที่การตรวจสภาพ" disabled={checkType === "approved"} />
          </Form.Item>
          <Form.Item name="cost" label="ราคา" rules={[{ required: true, message: "กรุณากรอกราคา" }]}>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\฿\s?|(,*)/g, "") as any}
              min={0}
              disabled={checkType !== "create" && checkType !== "edit" ? true : false}
            />
          </Form.Item>
          <Form.Item name="detail" label="รายละเอียดการตรวจสภาพ">
            <TextArea
              placeholder="รายละเอียดการตรวจสภาพ"
              rows={4}
              showCount
              maxLength={150}
              disabled={checkType !== "create" && checkType !== "edit" ? true : false}
            />
          </Form.Item>
          <Form.Item name="dateStart" label="วันที่ตรวจสภาพ" rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มต้น" }]}>
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              disabled={checkType !== "create" && checkType !== "edit"}
              format={"DD/MM/YYYY"}
            />
          </Form.Item>
          <Form.Item name="nextCheckDate" label="มีเช็คครั้งถัดไป?" valuePropName="checked">
            <Switch unCheckedChildren="ไม่" checkedChildren="ใช่" />
          </Form.Item>
          {nextCheckDate === true && (
            <Form.Item name="dateEnd" label="วันที่่ตรวจสภาพครั้งถัดไป">
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => current && current < dayjs().startOf("day")}
                disabled={checkType !== "create" && checkType !== "edit" ? true : false}
                format={"DD/MM/YYYY"}
              />
            </Form.Item>
          )}
          <Form.Item name="remark" label="หมายเหตุ">
            <Input.TextArea rows={2} showCount maxLength={150} disabled={checkType !== "create" && checkType !== "edit" ? true : false} />
          </Form.Item>
          <Form.Item valuePropName="filelist" label="แนบไฟล์">
            <div>
              <Upload
                listType="picture"
                fileList={attendFiles}
                onChange={handleChangeAttendFiles}
                beforeUpload={beforeUploadAttendFiles}
                accept=".png,.jpg,.jpeg,.pdf"
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true,
                  showDownloadIcon: false,
                }}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} disabled={checkType !== "create" && checkType !== "edit" ? true : false}>
                  อัปโหลดรูปภาพและเอกสาร
                </Button>
              </Upload>
            </div>
          </Form.Item>
          {Files !== null ? (
            <div>
              <Image preview={true} src={""} style={{ width: "470px", height: "460px" }} alt="file" />
            </div>
          ) : null}
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            {checkType === "create" || checkType === "edit" ? (
              <>
                <Button onClick={handleClose}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit">
                  บันทึก
                </Button>
              </>
            ) : null}
            {checkType === "approved" ? (
              <>
                <Button danger type="primary" htmlType="submit" onClick={() => setCheckApprovedStatus("disabled")}>
                  ยกเลิกการตรวจ
                </Button>
                <Button type="primary" htmlType="submit" style={{ background: "green" }} onClick={() => setCheckApprovedStatus("approved")}>
                  เช็คสภาพแล้ว
                </Button>
              </>
            ) : null}
            {checkType === "delete" ? (
              <>
                <Button onClick={handleClose}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit" danger>
                  ลบ
                </Button>
              </>
            ) : null}
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagementCarWrapupManage;
