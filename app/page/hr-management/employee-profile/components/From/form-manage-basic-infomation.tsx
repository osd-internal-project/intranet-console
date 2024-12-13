import { PlusOutlined } from "@ant-design/icons";
import { Card, DatePicker, Form, Input, Select, Upload } from "antd";
import React from "react";

export interface props {
  fileList: any;
  handlePreview: (events: any) => void;
  handleChange: (events: any) => void;
  masterPosition: { key: number; value: number; label: string }[];
  masterDepartments: { key: number; value: number; label: string }[];
}

const FormManageBasicInformation: React.FC<props> = ({
  fileList,
  handlePreview,
  handleChange,
  masterPosition,
  masterDepartments,
}): React.ReactElement => {
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <Card>
        <div className="grid grid-cols-4 col-span-2">
          <div className="col-span-1 flex justify-center items-center">
            <Upload
              listType="picture-circle"
              fileList={fileList}
              multiple={false}
              maxCount={1}
              onPreview={handlePreview}
              onChange={handleChange}
              accept="image/png, image/jpeg">
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </div>
          <div className="col-span-3">
            <div>{`Upload Profile Image`}</div>
            <div>{`Image should be below 4 Mb.`}</div>
            <div>{`filename : ${fileList.length > 0 ? fileList[0].name : "-"}`}</div>
            <div>{`type : ${fileList.length > 0 ? fileList[0].type : "-"}`}</div>
            <div>{`size : ${fileList.length > 0 ? (fileList[0].size / (1024 * 1024)).toFixed(2) : "-"} Mb.`}</div>
          </div>
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
        <Form.Item name={`idCard`} label={`เลขบัตรประชาชน`}>
          <Input />
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
        <Form.Item name={`extensionNumber`} label={`เบอร์ที่ทำงาน`}>
          <Input min={10} />
        </Form.Item>
        <Form.Item name={`company`} label={`บริษัท`}>
          <Select />
        </Form.Item>
        <Form.Item name={`departmentId`} label={`แผนก`}>
          <Select options={masterDepartments} placeholder={"Please Select"} allowClear />
        </Form.Item>
        <Form.Item name={`positionId`} label={`ตำแหน่ง`}>
          <Select options={masterPosition} placeholder={"Please Select"} allowClear />
        </Form.Item>
      </div>
    </div>
  );
};

export default FormManageBasicInformation;
