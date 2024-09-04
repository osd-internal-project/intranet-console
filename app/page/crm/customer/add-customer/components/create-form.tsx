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
import { useForm } from "antd/es/form/Form";
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
  const [form] = useForm();
  const [customerType, setCustomerType] = useState<string | undefined>(
    undefined
  );
  return (
    <Form
      size="small"
      layout="vertical"
      onFinish={onFinishAdd}
      form={form}
      autoComplete="off"
      {...layout}
    >
      <div className="fix-form grid grid-cols-1 md:grid-cols-3 md:mb-0 md:mt-0">
        <div className=" md:col-span-3 font-bold">ข้อมูลเบื้องต้น </div>
        <Form.Item
          label="Type"
          name={"customerTypeId"}
          rules={[{ required: true, message: "กรุณาเลือก" }]}
        >
          <Select
            allowClear
            placeholder="Please Choose"
            onChange={(value) => setCustomerType(value)}
            options={customerTypes.map((data) => ({
              value: data.customerTypeId,
              label: data.name,
            }))}
          />
        </Form.Item>

        {customerType === "natural" ? (
          <div className=" col-span-3 grid grid-cols-3">
            <Form.Item
              label="คำนำหน้า TH"
              name={["details", "prefixTh"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" maxLength={10} />
            </Form.Item>
            <Form.Item
              label="ชื่อ TH"
              name={["details", "firstNameTh"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" maxLength={200} />
            </Form.Item>
            <Form.Item
              label="นามสกุล TH"
              name={["details", "lastNameTh"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" maxLength={200} />
            </Form.Item>
            <Form.Item
              label="คำนำหน้า EN"
              name={["details", "prefixEn"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" maxLength={10} />
            </Form.Item>
            <Form.Item
              label="ชื่อ EN"
              name={["details", "firstNameEn"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" maxLength={200} />
            </Form.Item>
            <Form.Item
              label="นามสกุล EN"
              name={["details", "lastNameEn"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" maxLength={200} />
            </Form.Item>
          </div>
        ) : customerType === "juristic" ? (
          <div className=" col-span-2 grid grid-cols-2">
            <Form.Item
              label="ชื่อลูกค้า TH"
              name={["details", "customerNameTh"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" maxLength={10} />
            </Form.Item>
            <Form.Item
              label="ชื่อลูกค้า En"
              name={["details", "customerNameEn"]}
              rules={[{ required: true, message: "Please Enter" }]}
            >
              <Input placeholder="Enter Text" maxLength={10} />
            </Form.Item>
            <Form.Item label={"ชื่อย่อ"} name={["details", "initials"]}>
              <Input placeholder="Enter Text" maxLength={50} />
            </Form.Item>
          </div>
        ) : (
          <div className=" col-span-2 grid grid-cols-2"></div>
        )}
        <Form.Item
          label="เลขประจำตัวผู้เสียภาษี"
          name={["details", "identificationNo"]}
          rules={[{ required: true, message: "Please Enter" }]}
        >
          <Input placeholder="Enter Text" maxLength={50} />
        </Form.Item>
        <Form.Item
          label="รหัส"
          name={"customerCode"}
          rules={[{ required: true, message: "Please Enter" }]}
        >
          <Input placeholder="Enter Text" maxLength={50} />
        </Form.Item>
        <Form.Item label="อ้างอิงรหัสลูกค้า" name={"referenceCode"}>
          <Input placeholder="Enter Text" maxLength={50} />
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
        {customerType === "juristic" && (
          <Form.Item
            label="วันที่จดทะเบียน"
            rules={[{ required: true, message: "Please Enter" }]}
          >
            <DatePicker format={"DD/MM/YYYY"} className=" w-full" />
          </Form.Item>
        )}
        {customerType === "juristic" && (
          <Form.Item
            label="ทุนจดทะเบียน"
            name={"registration"}
            rules={[{ required: true, message: "Please Enter" }]}
          >
            <InputNumber
              min={0}
              className=" w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
        )}
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
        <Form.Item name={"responsible"} hidden></Form.Item>
        <Form.Item
          label="พนักงานขาย"
          name={"responsibleId"}
          rules={[{ required: true, message: "กรุณาเลือก" }]}
        >
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

        <Form.Item
          label="โทรศัพท์"
          name={"notiPhone"}
          rules={[{ required: true, message: "Please Enter" }]}
        >
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
        {customerType === "juristic" && (
          <Form.Item label="Domain @" name={["details", "notiDomain"]}>
            <Input placeholder="Enter Text" />
          </Form.Item>
        )}
        {customerType === "juristic" && (
          <Form.Item label="Website" name={["details", "notiWebsite"]}>
            <Input placeholder="Enter Text" />
          </Form.Item>
        )}

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
