import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Upload } from "antd";
import React from "react";

const ManagementCarWrapupManage = () => {
  return (
    <div>
      {/* <Modal title="เพิ่มข้อมูลตรวจสภาพรถ" open={IsmodlaOpencreate} onCancel={handleclosecreate} footer={null} destroyOnClose>
        <Form form={form} onFinish={createMaCarWarpup} layout="vertical" initialValues={{ wrapupMiles: mileage }}>
          <Form.Item name="carId" label="ชื่อรถ" rules={[{ required: true, message: "กรุณาเลือกชื่อรถ" }]}>
            <Select placeholder="โปรดเลือกรถ" style={{ width: "100%" }} onChange={handleSelectChange}>
              {maCar.map((car, index) => (
                <Select.Option key={index} value={car.carId}>
                  {car.carName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="typeName" label="ประเภทการตรวจสภาพ" rules={[{ required: true, message: "กรุณาเลือกประเภทการตรวจสภาพ" }]}>
            <Select placeholder="โปรดเลือกประเภทการตรวจสภาพ">
              {maDataTypeOptions
                .filter((option) => {
                  const type = maDataType.find((type) => type.typeName === option.label);
                  return type && type.status;
                })
                .map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="wrapupMiles"
            label="เลขไมล์"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  if (value === undefined || value === "") {
                    return Promise.resolve();
                  }

                  const selectedCar = maData.find((car) => car.carName === formchange.getFieldValue("carName"));

                  if (selectedCar) {
                    if (value === undefined || value === "" || value === null) {
                      throw new Error(`กรุณากรอกเลขไมล์`);
                    }
                    if (value < 0) {
                      throw new Error(`กรุณากรอกเลขไมล์`);
                    }
                    if (value < selectedCar.carMile) {
                      throw new Error(`เลขไมล์ต้องไม่น้อยกว่าเลขไมล์ของรถ ${selectedCar.carMile}`);
                    }
                  }

                  return Promise.resolve();
                },
              },
            ]}>
            <InputNumber value={mileage} min={mileage || 0} />
          </Form.Item>
          <Form.Item name="vender" label="สถานที่การตรวจสภาพ" rules={[{ required: true, message: "กรุณากรอกสถานที่การตรวจสภาพ" }]}>
            <Input placeholder="โปรดเลือกสถานที่การตรวจสภาพ" />
          </Form.Item>
          <Form.Item name="cost" label="ราคา" rules={[{ required: true, message: "กรุณากรอกราคา" }]}>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\฿\s?|(,*)/g, "") as any}
              min={0}
            />
          </Form.Item>

          <Form.Item name="detail" label="รายละเอียดการตรวจสภาพ">
            <Input.TextArea placeholder="รายละเอียดการตรวจสภาพ" rows={4} showCount maxLength={150} />
          </Form.Item>
          <Form.Item name="dateStart" label="วันที่ตรวจสภาพ" rules={[{ required: true, message: "กรุณาเลือกเวลาเริ่มต้น" }]}>
            <DatePicker style={{ width: "100%" }} disabledDate={(current) => current && current < moment().startOf("day")} />
          </Form.Item>
          <Form.Item name="dateEnd" label="วันที่่ตรวจสภาพครั้งถัดไป ( ** สามารถแก้ไขย้อนหลังได้ )">
            <DatePicker style={{ width: "100%" }} disabledDate={(current) => current && current < moment().startOf("day")} />
          </Form.Item>
          <Form.Item name="remark" label="หมายเหตุ">
            <Input.TextArea rows={2} showCount maxLength={150} />
          </Form.Item>
          <Form.Item valuePropName="filelist">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                width: "150px",
              }}>
              <Upload
                listType="picture"
                fileList={attendFiles}
                onChange={handleChangeAttendFiles}
                beforeUpload={beforeUploadAttendFiles}
                multiple={true}
                accept=".png,.jpg,.jpeg,.pdf"
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true,
                  showDownloadIcon: false,
                }}>
                <Button icon={<UploadOutlined />}>อัปโหลดรูปภาพและเอกสาร</Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleclosecreate}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
};

export default ManagementCarWrapupManage;
