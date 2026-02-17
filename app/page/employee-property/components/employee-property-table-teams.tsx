import type { ITEmployeePropertyCommon } from "@/app/common/epmployee-property";
import { loadAppConfig } from "@/app/config/app-config";
import { UserContext, type UserContectType } from "@/app/config/userContext";
import employeePropertyService from "@/app/services/employee-property.service";
import UserServices from "@/app/services/user.service";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Button, Form, Input, message, Popover, Select, Table, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { saveAs } from "file-saver";

export interface props {
  reloadKey: number;
}

const EmployeePropertyTeamsTable: React.FC<props> = ({ reloadKey }): React.ReactElement => {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET);
  const baseUrUser = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER);
  const baseUrlReport = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_REPORT);
  const employeepropertyservice = employeePropertyService(baseUrIntranet);
  const employeepropertyserviceReprot = employeePropertyService(baseUrlReport);
  const userservices = UserServices(baseUrUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataTableTeams, setDataTableTeams] = useState<ITEmployeePropertyCommon[]>([]);
  const [dropdown, setDropdown] = useState<{ value: string; label: string }[]>([]);

  const [params, setParams] = useState<{ type: string; name: string; userId: string }>({ type: "", name: "", userId: "" });
  const [filterForm] = Form.useForm();
  useEffect(() => {
    if (loading) {
      fetchData();
    }
    masterData();
  }, [loading, user, params]);

  useEffect(() => {
    fetchData();
  }, [reloadKey]);

  const fetchData = async () => {
    if (!user) {
      return false;
    }
    const dataTeams = await employeepropertyservice.findTeamsByUserId(user?.userId, params);
    setDataTableTeams(dataTeams);
    setLoading(false);
  };

  const masterData = async () => {
    if (!user) {
      return false;
    }
    const userInOwnerGroup = await userservices.findUsersInOwnerGroupIds(user?.userId);
    setDropdown(userInOwnerGroup.map((item: any) => ({ value: item.userId, label: `${item.firstNameTh} ${item.lastNameTh}` })));
  };

  const employeePropertyColumns: ColumnsType<ITEmployeePropertyCommon> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (value: string, record: ITEmployeePropertyCommon, index: number) => index + 1,
    },
    {
      title: "ชื่อพนักงาน",
      key: "employeeName",
      render: (_, record) => `${record.users.firstNameTh} ${record.users.lastNameTh}`,
    },
    {
      title: "แผนก",
      dataIndex: ["users", "masterPosition", "nameTh"],
      key: "department",
    },
    {
      title: "ประเภททรัพย์สิน",
      dataIndex: "type",
      key: "type",
      render: (value: string, record: ITEmployeePropertyCommon) => {
        if (value === "computer_equipment") return "อุปกรณ์คอมพิวเตอร์";
        if (value === "office_equipment") return "อุปกรณ์สำนักงาน";
        if (value === "other_asset") {
          return `อื่นๆ (${record.nameOther || "-"})`;
        }
        return "-";
      },
    },
    {
      title: "ชื่อทรัพย์สิน",
      dataIndex: "name",
      key: "name",
      render: (e: string, record: ITEmployeePropertyCommon) => {
        return (
          <div className="flex items-center gap-3">
            {/* Image */}
            <div className="w-[50px] h-[50px] rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
              {record.imageUrl ? (
                <Image src={record.imageUrl} alt={e} width={50} height={50} className="object-cover" />
              ) : (
                <span className="text-xs text-gray-400">No Image</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{e}</span>
              <span className="text-xs text-gray-500">{`${record.brand}`}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "ยี่ห้อ",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial",
    },
    {
      title: "Asset No.",
      dataIndex: "assetNumber",
      key: "assetNumber",
    },
    {
      title: "สถานะ",
      dataIndex: "assetStatus",
      key: "assetStatus",
    },
    {
      title: "ที่ตั้ง",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString("en-GB"),
    },
  ];
  const onFinish = (values: { type: string; name: string; userId: string }) => {
    setParams(values);
    setLoading(true);
  };

  const handleExport = async () => {
    if (!user) {
      return false;
    }
    const data = await employeepropertyserviceReprot.exportTeams(user?.userId, params);
    if (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `รายงานอุปกรณ์-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.xlsx`);
      message.success("สำเร็จ");
    }
  };

  const content = (
    <div className="w-full">
      <Form<ITEmployeePropertyCommon>
        name="filters"
        form={filterForm}
        layout="horizontal"
        className="w-full"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Form.Item label="รายชื่อ" name="userId">
          <Select showSearch allowClear optionFilterProp="label" placeholder="Please Select" options={dropdown} />
        </Form.Item>
        <Form.Item label="ประเภททรัพย์สิน" name="type">
          <Select
            showSearch
            allowClear
            optionFilterProp="label"
            placeholder="Please Select"
            options={[
              { label: "อุปกรณ์คอมพิวเตอร์", value: "computer_equipment" },
              { label: "อุปกรณ์สำนักงาน", value: "office_equipment" },
              { label: "อื่นๆ", value: "other_asset" },
            ]}
          />
        </Form.Item>
        <Form.Item label="สถานะทรัพย์สิน" name="name">
          <Input placeholder="Please Input" />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button htmlType="submit" type="primary">
            {`ค้นหา`}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  return (
    <div>
      <div className="flex justify-between mb-2 w-full">
        <Popover placement="bottomLeft" content={content} trigger="click" overlayStyle={{ width: 500 }}>
          <Button type="primary">Filters</Button>
        </Popover>
        <Button onClick={() => handleExport()}>Export</Button>
      </div>
      <Table dataSource={dataTableTeams} columns={employeePropertyColumns} rowKey={"id"} scroll={{ x: "max-content" }} />
    </div>
  );
};

export default EmployeePropertyTeamsTable;
