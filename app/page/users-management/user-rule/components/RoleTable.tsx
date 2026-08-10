"use client";
import React, { useMemo, useState } from "react";
import { Input, Table, Tag } from "antd";
import { ROLE_LIST, RoleDefinition } from "@/app/config/user-roles";
import { useUserAccess } from "@/app/config/userContext";

/**
 * ตารางแสดงสิทธิ์การใช้งานทั้งหมดของระบบ (อ่านอย่างเดียว)
 * ข้อมูลมาจาก ROLES ใน app/config/user-roles.ts ซึ่งเป็นแหล่งข้อมูลหลักที่เมนูและปุ่มต่าง ๆ ใช้อ้างอิง
 */
const RoleTable: React.FC = (): React.ReactElement => {
  const { roleCodes } = useUserAccess();
  const [keyword, setKeyword] = useState<string>("");

  /** กรองรายการสิทธิ์จากคำค้นในฝั่ง client (ข้อมูลเป็น config จึงไม่ต้องเรียก API) */
  const dataSource = useMemo<readonly RoleDefinition[]>(() => {
    const search = keyword.trim().toLowerCase();
    if (!search) {
      return ROLE_LIST;
    }
    return ROLE_LIST.filter((role) =>
      [role.code, role.name, role.description].some((field) =>
        field.toLowerCase().includes(search),
      ),
    );
  }, [keyword]);

  const columns = [
    {
      title: "No.",
      dataIndex: "code",
      key: "no",
      width: "8%",
      render: (_: string, __: RoleDefinition, index: number) => index + 1,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: "15%",
      render: (text: string) => (
        <Tag className="bg-gray-100 text-gray-800 font-medium mr-2 rounded border border-gray-500">
          {text}
        </Tag>
      ),
    },
    {
      title: "ชื่อสิทธิ์",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "คำอธิบาย",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "สถานะ",
      dataIndex: "code",
      key: "status",
      width: "15%",
      render: (code: string) =>
        roleCodes.includes(code) ? <Tag color="green">สิทธิ์ของคุณ</Tag> : null,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-y-2">
      <div className="flex justify-end">
        <Input.Search
          allowClear
          placeholder="ค้นหา code / ชื่อสิทธิ์ / คำอธิบาย"
          style={{ width: 320 }}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>
      <div className="overflow-auto md:overflow-hidden">
        <Table
          size="small"
          columns={columns}
          dataSource={dataSource as RoleDefinition[]}
          rowKey={"code"}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </div>
    </div>
  );
};

export default RoleTable;
