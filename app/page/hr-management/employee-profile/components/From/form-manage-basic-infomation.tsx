import { PlusOutlined } from "@ant-design/icons";
import { Card, DatePicker, Form, Input, Select, Upload } from "antd";
import React from "react";

export interface props {
  fileList: any;
  handlePreview: (events: any) => void;
  handleChange: (events: any) => void;
}

const FormManageBasicInformation: React.FC<props> = ({ fileList, handlePreview, handleChange }): React.ReactElement => {
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <Card className="mb-2">
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-circle"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}>
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <div>
          <div>{`Upload Profile Image`}</div>
          <div>{`Image should be below 4 mb`}</div>
        </div>
      </Card>
      <div className="grid col-span-4 grid-cols-2 gap-4">
        <Form.Item name={`firstNameTH`} label={`ชื่อ ( ภาษาไทย )`}>
          <Input />
        </Form.Item>
        <Form.Item name={`lastNameTH`} label={`นามสกุล ( ภาษาไทย )`}>
          <Input />
        </Form.Item>
        <Form.Item name={`firstNameEN`} label={`ชื่อ ( ภาษาอังกฤษ )`}>
          <Input />
        </Form.Item>
        <Form.Item name={`lastNameEN`} label={`นามสกุล ( ภาษาอังกฤษ )`}>
          <Input />
        </Form.Item>
        <Form.Item name={`address`} label={`ที่อยู่`}>
          <Input.TextArea showCount maxLength={250} rows={5} />
        </Form.Item>
        <Form.Item name={`gender`} label={`เพศ`}>
          <Select
            placeholder={"Please Select"}
            allowClear
            options={[
              { value: "male", label: "ชาย" },
              { value: "famale", label: "หญิง" },
            ]}
          />
        </Form.Item>
        <Form.Item name={`birthDate`} label={`วันเกิด`}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name={`empId`} label={`รหัสพนักงาน`}>
          <Input />
        </Form.Item>
        <Form.Item name={`startWork`} label={`เริ่มงาน`}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name={`username`} label={`Username`}>
          <Input />
        </Form.Item>
        <Form.Item name={`email`} label={`อีเมล`}>
          <Input type="mail" />
        </Form.Item>
        <Form.Item name={`phoneNumber`} label={`เบอร์โทรศัพท์`}>
          <Input min={10} />
        </Form.Item>
        <Form.Item name={`departmentId`} label={`บริษัท`}>
          <Select />
        </Form.Item>
        <Form.Item name={`departmentId`} label={`แผนก`}>
          <Select />
        </Form.Item>
        <Form.Item name={`positionId`} label={`ตำแหน่ง`}>
          <Select />
        </Form.Item>
      </div>
    </div>
  );
};

export default FormManageBasicInformation;
