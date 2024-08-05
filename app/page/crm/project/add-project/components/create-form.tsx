import React, { useEffect, useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  SelectProps,
  TableColumnsType,
  TableColumnType,
} from "antd";
import dayjs from "dayjs";
import {
  Badge,
  Button,
  Calendar,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Select,
  Switch,
  Table,
  Tag,
  TreeSelect,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  ITBranchAddress,
  ITBranchContact,
  ITBranchForSelect,
  ITCustomerForSelect,
  ITProject,
  ITProjectCreateForm,
  ITSelectUsers,
} from "../../common";
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";
import { FilterOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import "../../style.css";
import { useForm } from "antd/es/form/Form";
import moment from "moment";
const { RangePicker } = DatePicker;
export interface props {
  customerList: ITCustomerForSelect[];
  branchList: ITBranchForSelect[];
  userList: ITSelectUsers[];
  groupOption: SelectProps["options"];
  saleList: { uid: string; name: string }[];
  usersFormGroup: ITSelectUsers[];
  onFinishAdd: (form: ITProjectCreateForm) => void;
  changeCustomerSelect: (id: number) => void;
  onChangeGroupSelect: (value: string[]) => void;
}

const layout = {
  labelCol: {
    // xs: { span: 24 },
  },
  wrapperCol: {
    md: { span: 22 },
  },
};

const CreateProjectForm: React.FC<props> = ({
  customerList,
  branchList,
  groupOption,
  saleList,
  userList,
  usersFormGroup,
  onFinishAdd,
  changeCustomerSelect,
  onChangeGroupSelect,
}): React.ReactElement => {
  const [form] = useForm();
  const [addressSelect, setAddressSelect] = useState<ITBranchAddress[]>([]);
  const [contactSelect, setContactSelect] = useState<ITBranchContact[]>([]);
  useEffect(() => {
    const users = usersFormGroup.map((user) => user.userId);
    form.setFieldValue("relatedUsersId", users);
  }, [usersFormGroup]);
  const calculateDuration = (type: string) => {
    let startDate = form.getFieldValue("startDate");
    let endDate = form.getFieldValue("endDate");
    console.log(1);
    if (startDate && endDate) {
      if (startDate.valueOf() > endDate.valueOf()) {
        if (type === "start") {
          message.error("กรุณากรอก Start Date ให้ถูกต้อง");
          form.setFieldValue("startDate", endDate);
          startDate = endDate;
        } else {
          message.error("กรุณากรอก End Date ให้ถูกต้อง");
          form.setFieldValue("endDate", startDate);
          endDate = startDate;
        }
      }
      const diff = dayjs(endDate)
        .endOf("day")
        .diff(dayjs(startDate).endOf("day"), "days");
      // const diffDuration = moment.duration(diff);
      // console.log(diff);
      form.setFieldValue("duration", diff + 1);
    } else {
      form.setFieldValue("duration", 0);
    }
  };

  async function onChangeBranchSelect(value: number) {
    const branch = branchList.findLast((branch) => value === branch.id);
    if (branch) {
      setAddressSelect(branch.customerAddress);
      setContactSelect(branch.customerContact);
    }
  }
  const onChangeCustomerSelect = (id: number) => {
    form.setFieldValue("customerBranchId", undefined);
    changeCustomerSelect(id);
  };
  return (
    <Form
      form={form}
      size="small"
      layout="vertical"
      onFinish={onFinishAdd}
      autoComplete="off"
      {...layout}
    >
      <div className="fix-form grid grid-cols-1 md:grid-cols-3 md:mb-0 md:mt-0">
        <div className=" md:col-span-3 font-bold">ข้อมูลเบื้องต้น </div>
        <div className=" md:col-span-3">
          <Form.Item
            label="Project Name"
            name={"projectName"}
            rules={[{ required: true, message: "กรุณากรอก Project Name" }]}
          >
            <Input placeholder="Enter Text" />
          </Form.Item>
        </div>
        <div className=" md:col-span-3">
          <Form.Item label="Product Name" name={"productName"}>
            <Input placeholder="Enter Text" />
          </Form.Item>
        </div>
        <Form.Item
          label="Start Date"
          name={"startDate"}
          rules={[{ required: true, message: "กรุณาเลือก Start Date" }]}
        >
          <DatePicker
            className=" w-full"
            onChange={() => {
              calculateDuration("start");
            }}
          />
        </Form.Item>
        <Form.Item
          label="End Date"
          name={"endDate"}
          rules={[{ required: true, message: "กรุณาเลือก End Date" }]}
        >
          <DatePicker
            className=" w-full"
            onChange={() => {
              calculateDuration("end");
            }}
          />
        </Form.Item>
        <Form.Item label="Duration" name={"duration"}>
          <Input readOnly className=" w-20" />
        </Form.Item>
        <Form.Item
          label="Customer"
          name={"customerId"}
          rules={[{ required: true, message: "กรุณาเลือก Customer" }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Please select Customer"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={onChangeCustomerSelect}
            options={customerList.map((customer) => ({
              value: customer.id,
              label: `${customer.prefixTh} ${customer.firstNameTh} ${customer.lastNameTh}`,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Branch"
          name={"customerBranchId"}
          rules={[{ required: true, message: "กรุณาเลือก Branch" }]}
        >
          <Select
            showSearch
            placeholder="Please select Branch"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            disabled={branchList.length > 0 ? false : true}
            allowClear
            onChange={onChangeBranchSelect}
            options={branchList.map((branch) => ({
              value: branch.id,
              label: branch.branchName,
            }))}
          />
        </Form.Item>
        <Form.Item hidden name={"taxAddressText"}>
          <Input />
        </Form.Item>
        <div className=" md:col-span-3">
          <Form.Item label="ที่อยู่ใบกำกับภาษี" name={"taxAddressId"}>
            <Select
              allowClear
              disabled={branchList.length > 0 ? false : true}
              onSelect={(value, option) => {
                form.setFieldValue("taxAddressText", option.label);
              }}
              options={addressSelect.map((address) => ({
                value: address.id,
                label: `บ้านเลขที่ ${
                  address.houseNumber ? address.houseNumber : "-"
                } เลขที่ห้อง ${
                  address.roomNumber ? address.roomNumber : "-"
                } อาคาร/หมู่บ้าน ${
                  address.building ? address.building : "-"
                } ชั้น ${address.floor ? address.floor : "-"} ซอย ${
                  address.alley ? address.alley : "-"
                } หมู่ที่ ${address.village ? address.village : "-"} ถนน ${
                  address.road ? address.road : "-"
                } ตำบล/แขวง ${
                  address.subDistrict ? address.subDistrict : "-"
                } อำเภอ/เขต ${
                  address.district ? address.district : "-"
                } จังหวัด ${
                  address.province ? address.province : "-"
                } รหัสไปรษณีย์ ${
                  address.houseNumber ? address.houseNumber : "-"
                }`,
              }))}
            />
          </Form.Item>
          <Form.Item hidden name={"deliveryAddressText"}>
            <Input />
          </Form.Item>
          <Form.Item label="ที่อยู่การจัดส่งบริการ" name={"deliveryAddressId"}>
            <Select
              allowClear
              disabled={branchList.length > 0 ? false : true}
              onSelect={(value, option) => {
                form.setFieldValue("deliveryAddressText", option.label);
              }}
              options={addressSelect.map((address) => ({
                value: address.id,
                label: `บ้านเลขที่ ${
                  address.houseNumber ? address.houseNumber : "-"
                } เลขที่ห้อง ${
                  address.roomNumber ? address.roomNumber : "-"
                } อาคาร/หมู่บ้าน ${
                  address.building ? address.building : "-"
                } ชั้น ${address.floor ? address.floor : "-"} ซอย ${
                  address.alley ? address.alley : "-"
                } หมู่ที่ ${address.village ? address.village : "-"} ถนน ${
                  address.road ? address.road : "-"
                } ตำบล/แขวง ${
                  address.subDistrict ? address.subDistrict : "-"
                } อำเภอ/เขต ${
                  address.district ? address.district : "-"
                } จังหวัด ${
                  address.province ? address.province : "-"
                } รหัสไปรษณีย์ ${
                  address.houseNumber ? address.houseNumber : "-"
                }`,
              }))}
            />
          </Form.Item>
          <Form.Item hidden name={"notiAddressText"}>
            <Input />
          </Form.Item>
          <Form.Item label="ที่อยู่จัดส่งใบแจ้งบริการ" name={"notiAddressId"}>
            <Select
              allowClear
              disabled={branchList.length > 0 ? false : true}
              onSelect={(value, option) => {
                form.setFieldValue("notiAddressText", option.label);
              }}
              options={addressSelect.map((address) => ({
                value: address.id,
                label: `บ้านเลขที่ ${
                  address.houseNumber ? address.houseNumber : "-"
                } เลขที่ห้อง ${
                  address.roomNumber ? address.roomNumber : "-"
                } อาคาร/หมู่บ้าน ${
                  address.building ? address.building : "-"
                } ชั้น ${address.floor ? address.floor : "-"} ซอย ${
                  address.alley ? address.alley : "-"
                } หมู่ที่ ${address.village ? address.village : "-"} ถนน ${
                  address.road ? address.road : "-"
                } ตำบล/แขวง ${
                  address.subDistrict ? address.subDistrict : "-"
                } อำเภอ/เขต ${
                  address.district ? address.district : "-"
                } จังหวัด ${
                  address.province ? address.province : "-"
                } รหัสไปรษณีย์ ${
                  address.houseNumber ? address.houseNumber : "-"
                }`,
              }))}
            />
          </Form.Item>
          <Form.Item label="ผู้ติดต่อ" name={"contactId"}>
            <Select
              allowClear
              disabled={branchList.length > 0 ? false : true}
              options={contactSelect.map((contact) => ({
                value: contact.id,
                label: contact.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Description" name={"description"}>
            <TextArea />
          </Form.Item>
        </div>
        <Form.Item
          label="Sale"
          name={"saleId"}
          rules={[{ required: true, message: "กรุณาเลือก " }]}
        >
          <Select
            disabled={saleList.length > 0 ? false : true}
            allowClear
            showSearch
            options={saleList.map((sale) => ({
              value: sale.uid,
              label: `${sale.name}`,
            }))}
          />
        </Form.Item>

        {/* <Form.Item label="Sale Manager" name={"saleManagerId"}>
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            options={userList.map((user) => ({
              value: user.userId,
              label: `${user.firstNameTh} ${user.lastNameTh}`,
            }))}
          />
        </Form.Item> */}
        <Form.Item
          label="Project Manager"
          name={"projectManagerId"}
          rules={[{ required: true, message: "กรุณาเลือก " }]}
        >
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            options={userList.map((user) => ({
              value: user.userId,
              label: `${user.firstNameTh} ${user.lastNameTh}`,
            }))}
          />
        </Form.Item>
        <div className=" md:col-span-3 mt-5">
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

export default CreateProjectForm;
