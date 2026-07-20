import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import React from "react";
import { FormInstance } from "antd/lib";
import { MaCarType } from "@/app/page/macar/common";
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";

export interface props {
  form: FormInstance;
  handleCloseModal: () => void;
  openModal: boolean;
  checkType: string;
  onFinish: (status: string, values: any) => void;
  handleChangeAttendFiles: (info: any) => void;
  beforeUploadAttendFiles: (file: any) => Promise<any>;
  attendFiles: any[];
  /** ตัวเลือกประเภทรถจาก master maVehicleType (รถ 4 ล้อ/2 ล้อ) */
  vehicleTypeOptions?: { label: string; value: string }[];
}

const ManagementCarAvailableManage: React.FC<props> = ({
  form,
  handleCloseModal,
  openModal,
  checkType,
  onFinish,
  handleChangeAttendFiles,
  beforeUploadAttendFiles,
  attendFiles,
  vehicleTypeOptions = [],
}): React.ReactElement => {
  return (
    <div>
      <Modal
        title={
          checkType === "create"
            ? "เพิ่มรถ"
            : checkType === "edit"
              ? "แก้ไขข้อมูล"
              : "ลบข้อมูล"
        }
        open={openModal}
        onCancel={handleCloseModal}
        footer={null}
        width={640}
      >
        <Form
          form={form}
          layout="vertical"
          name="create"
          onFinish={(e) => onFinish(checkType, e)}
          autoComplete="off"
          size="small"
        >
          <Row>
            <Col span={24}>
              <Form.Item
                label="ชื่อรถ"
                name="carName"
                rules={[{ required: true, message: "กรุณากรอกชื่อรถ!" }]}
              >
                <Input
                  placeholder="กรอกชื่อรถ"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            {/* ทะเบียน + รายละเอียดรถ — ใช้อ้างอิงในหน้าเอกสารรถยนต์ (ประกัน/พรบ./ภาษี) */}
            <Col span={12}>
              <Form.Item label="ทะเบียนรถ" name="licensePlate">
                <Input
                  placeholder="เช่น 2ฒร 424"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* ประเภทรถ = master (รถ 4 ล้อ/2 ล้อ) จัดการในหน้าตั้งค่าระบบรถ */}
              <Form.Item label="ประเภทรถ" name="carType">
                <Select
                  placeholder="เลือกประเภทรถ"
                  options={vehicleTypeOptions}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* ลักษณะ/ตัวถัง = free-text แยกจากประเภทรถ */}
              <Form.Item label="ลักษณะ/ตัวถัง" name="carCategory">
                <Input
                  placeholder="เช่น กระบะ, เก๋ง, ตู้"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ยี่ห้อ" name="brand">
                <Input
                  placeholder="เช่น Toyota"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="รุ่น" name="model">
                <Input
                  placeholder="เช่น Revo"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* คนละเรื่องกับ "ระดับของน้ำมัน" ด้านล่าง ซึ่งเก็บว่าน้ำมันในถังเหลือมาก/น้อย */}
              <Form.Item label="เชื้อเพลิง" name="fuelType">
                <Input
                  placeholder="เช่น ดีเซล"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ผู้ถือกรรมสิทธิ์" name="ownerName">
                <Input
                  placeholder="เช่น CDN"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="เลขตัวถัง" name="chassisNumber">
                <Input
                  placeholder="เลขตัวถัง / VIN"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="สี" name="color">
                <Input
                  placeholder="เช่น ขาว"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ปีรุ่น" name="modelYear">
                <Input
                  placeholder="เช่น 2020"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item<MaCarType>
                label="ระดับของน้ำมัน"
                name="carPetrol"
                rules={[{ required: true, message: "กรุณาเลือกระดับน้ำมัน!" }]}
              >
                <Select
                  placeholder="เลือกระดับน้ำมัน"
                  disabled={checkType === "delete" ? true : false}
                >
                  <Select.Option value="high">{`มาก`}</Select.Option>
                  <Select.Option value="medium">{`ปานกลาง`}</Select.Option>
                  <Select.Option value="low">{`น้อย`}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="สถานะ"
                name="status"
                rules={[{ required: true, message: "กรุณาเลือกระสถานะรถ!" }]}
              >
                <Select
                  placeholder="เลือกสถานะรถ"
                  disabled={checkType === "delete" ? true : false}
                >
                  <Select.Option value={true}>{`ใช้งานได้ปกติ`}</Select.Option>
                  <Select.Option
                    value={false}
                  >{`ไม่สามารถใช้งานได้`}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="เลขไมล์รถ"
                name="carMile"
                rules={[{ required: true, message: "กรุณากรอกเลขไมล์รถ!" }]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  disabled={checkType === "delete" ? true : false}
                  placeholder="กรอกเลขไมล์รถ"
                  onKeyDown={(event) => {
                    if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
          
            <Col span={24}>
              <Form.Item
                label="รายละเอียด"
                name="detail"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียดรถ!" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="รายละเอียด"
                  disabled={checkType === "delete" ? true : false}
                />
              </Form.Item>
            </Col>
            {checkType === "edit" ? (
              <div className="flex justify-end">
                <Upload
                  accept=".pdf"
                  showUploadList={true}
                  fileList={attendFiles}
                  onChange={handleChangeAttendFiles}
                  beforeUpload={beforeUploadAttendFiles}
                  multiple={true}
                  maxCount={10}
                >
                  <Button
                    icon={<UploadOutlined />}
                    type="primary"
                  >{`อัปโหลดไฟล์`}</Button>
                </Upload>
              </div>
            ) : null}
          </Row>
          <Row className="flex justify-center" gutter={[8, 8]}>
            {checkType !== "delete" ? (
              <>
                <Col>
                  <Button type="default" onClick={handleCloseModal}>
                    {`ยกเลิก`}
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    {`ตกลง`}
                  </Button>
                </Col>
              </>
            ) : (
              <Button type="primary" htmlType="submit" danger>
                {`ลบ`}
              </Button>
            )}
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagementCarAvailableManage;
