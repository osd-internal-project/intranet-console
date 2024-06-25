import React, { useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  TableColumnsType,
  TableColumnType,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  ITConfigData,
  ITCustomerForm,
  ITPagination,
  ITSelectUsers,
} from "../../common";
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";
import { FilterOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import "../../style.css";
const { RangePicker } = DatePicker;
export interface props {
  customerGroup: ITConfigData[];
  customerTypes: ITConfigData[];
  customerResponsibles: ITSelectUsers[];
  onFinishAdd: (form: ITCustomerForm) => void;
}

const layout = {
  labelCol: {
    // xs: { span: 24 },
  },
  wrapperCol: {
    md: { span: 22 },
  },
};

const CreateCustomerForm: React.FC<props> = ({
  customerGroup,
  customerTypes,
  customerResponsibles,
  onFinishAdd,
}): React.ReactElement => {
  return (
    <Form
      size="small"
      layout="vertical"
      onFinish={onFinishAdd}
      autoComplete="off"
      {...layout}
    >
      <div className="fix-form grid grid-cols-1 md:grid-cols-3 md:mb-0 md:mt-0">
        <div className=" md:col-span-3 font-bold">ข้อมูลเบื้องต้น </div>

        <Form.Item label="รหัส" name={"customerCode"}>
          <Input placeholder="Enter Text" maxLength={50} />
        </Form.Item>

        <Form.Item label="อ้างอิงรหัสลูกค้า" name={"referenceCode"}>
          <Input placeholder="Enter Text" maxLength={50} />
        </Form.Item>
        <Form.Item label="Department Code" name={"departmentCode"}>
          <Input placeholder="Enter Text" maxLength={50} />
        </Form.Item>
        <Form.Item label="คำนำหน้า TH" name={"prefixTh"}>
          <Input placeholder="Enter Text" maxLength={10} />
        </Form.Item>
        <Form.Item label="ชื่อ TH" name={"firstNameTh"}>
          <Input placeholder="Enter Text" maxLength={200} />
        </Form.Item>
        <Form.Item label="นามสกุล TH" name={"lastNameTh"}>
          <Input placeholder="Enter Text" maxLength={200} />
        </Form.Item>
        <Form.Item label="คำนำหน้า EN" name={"prefixEn"}>
          <Input placeholder="Enter Text" maxLength={10} />
        </Form.Item>
        <Form.Item label="ชื่อ EN" name={"firstNameEn"}>
          <Input placeholder="Enter Text" maxLength={200} />
        </Form.Item>
        <Form.Item label="นามสกุล EN" name={"lastNameEn"}>
          <Input placeholder="Enter Text" maxLength={200} />
        </Form.Item>
        {/* <Form.Item
          label="สาขาใหญ่ ?"
          valuePropName="checked"
          name={"mainBranchStatus"}
          initialValue={true}
        >
          <Switch
            size="default"
            unCheckedChildren={"สาขาย่อย"}
            checkedChildren={"สาขาใหญ่"}
          />
        </Form.Item> */}
        {/* <Form.Item label="สาขา" name={"branchName"}>
          <Input placeholder="Enter Text" />
        </Form.Item> */}
        <Form.Item label="เลขที่ทะเบียนบริษัท" name={"companyRegisNumber"}>
          <Input placeholder="Enter Text" maxLength={20} />
        </Form.Item>
        <Form.Item label="วันที่จดทะเบียน" name={"regisDate"}>
          <DatePicker format={"DD/MM/YYYY"} className=" w-full" />
        </Form.Item>
        <Form.Item label="ทุนจดทะเบียน" name={"registration"}>
          <InputNumber
            min={0}
            className=" w-full"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item label="Type" name={"customerTypeId"}>
          <Select
            placeholder="Please Choose"
            options={customerTypes.map((data) => ({
              value: data.id,
              label: data.name,
            }))}
          />
        </Form.Item>
        <Form.Item label="กลุ่มลูกค้า" name={"customerGroupId"}>
          <Select
            placeholder="Please Choose"
            options={customerGroup.map((data) => ({
              value: data.id,
              label: data.name,
            }))}
          />
        </Form.Item>
        <Form.Item label="Grade" name={"grade"}>
          <Select
            placeholder="Please Choose "
            options={[
              { value: "A" },
              { value: "B" },
              { value: "C" },
              { value: "D" },
              { value: "N" },
            ]}
          />
        </Form.Item>
        <Form.Item label="ผู้รับผิดชอบ" name={"responsibleId"}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Please Choose"
            options={customerResponsibles.map((data) => ({
              value: data.userId,
              label: `${data.firstNameTh} ${data.lastNameTh}`,
            }))}
          />
        </Form.Item>
        {/* <Form.Item label="ผู้รับผิดชอบร่วม" name={"thirdPartyId"}>
          <Select
            placeholder="Please Choose"
            options={[
              { value: "11", label: "user1" },
              { value: "22", label: "user2" },
            ]}
          />
        </Form.Item> */}
        <Form.Item
          label="Status"
          valuePropName="checked"
          initialValue={true}
          name={"activeStatus"}
        >
          <Switch
            size="default"
            unCheckedChildren={"Not Active"}
            checkedChildren={"Active"}
          />
        </Form.Item>
        <Divider className=" md:col-span-3" />
        {/* <div className=" md:col-span-3 font-bold">ที่อยู่ใบกำกับภาษี </div>
        <Form.Item label="เลขที่บ้าน" name={"taxHouseNumber"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="เลขที่ห้อง" name={"taxRoomNumber"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="อาคาร/หมู่บ้าน" name={"taxBuilding"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ชั้น" name={"taxFloor"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ซอย" name={"taxAlley"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="หมู่ที่" name={"taxVillage"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ถนน" name={"taxRoad"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ตำบล" name={"taxSubDistrict"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="อำเภอ" name={"taxDistrict"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="จังหวัด" name={"taxProvince"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="รหัสไปรษณีย์" name={"taxZipCode"}>
          <Input placeholder="Enter Text" />
        </Form.Item>

        <Divider className=" md:col-span-3" />
        <div className=" md:col-span-3 font-bold">ที่อยู่การจัดส่งบริการ </div>
        <Form.Item label="เลขที่บ้าน" name={"deliveryHouseNumber"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="เลขที่ห้อง" name={"deliveryRoomNumber"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="อาคาร/หมู่บ้าน" name={"deliveryBuilding"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ชั้น" name={"deliveryFloor"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ซอย" name={"deliveryAlley"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="หมู่ที่" name={"deliveryVillage"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ถนน" name={"deliveryRoad"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ตำบล" name={"deliverySubDistrict"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="อำเภอ" name={"deliveryDistrict"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="จังหวัด" name={"deliveryProvince"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="รหัสไปรษณีย์" name={"deliveryZipCode"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Divider className=" md:col-span-3" />
        <div className=" md:col-span-3 font-bold">
          ที่อยู่จัดส่งใบแจ้งบริการ
        </div>
        <Form.Item label="เลขที่บ้าน" name={"notiHouseNumber"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="เลขที่ห้อง" name={"notiRoomNumber"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="อาคาร/หมู่บ้าน" name={"notiBuilding"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ชั้น" name={"notiFloor"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ซอย" name={"notiAlley"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="หมู่ที่" name={"notiVillage"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ถนน" name={"notiRoad"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="ตำบล" name={"notiSubDistrict"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="อำเภอ" name={"notiDistrict"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="จังหวัด" name={"notiProvince"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="รหัสไปรษณีย์" name={"notiZipCode"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <div></div> */}
        <Form.Item label="โทรศัพท์" name={"notiPhone"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="แฟกซ์" name={"notiFax"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="อีเมล์" name={"notiEmail"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <Form.Item label="Map" name={"notiMap"}>
          <Input placeholder="Enter Text" />
        </Form.Item>
        <div className=" md:col-span-3">
          <Form.Item label="หมวดธุรกิจ" name={"businessCategory"}>
            <TextArea />
          </Form.Item>
        </div>
        <div className=" md:col-span-3">
          <Form.Item label="วัตถุประสงค์" name={"objective"}>
            <TextArea />
          </Form.Item>
        </div>
        <div className=" md:col-span-3">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default CreateCustomerForm;
