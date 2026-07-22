"use client";
import React, { useEffect, useState } from "react";
import { Button, List, Select, Space, Spin, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { UsersServices } from "@/app/services/users.service";
import { NotificationSettingServices } from "../services/notification-setting.service";
import { TNotificationRecipient } from "@/app/common/notification";

interface UserOption {
  userId: string;
  email: string;
  firstNameTh?: string;
  lastNameTh?: string;
}

/**
 * ตัวจัดการรายชื่อผู้รับแบบกระชับ ฝังในการ์ดของประเภทที่ target = รายชื่อเจาะจง
 * @param alertType key ของประเภทที่กำลังจัดการ (ผูกรายชื่อกับประเภทนี้)
 */
const TypeRecipients: React.FC<{ alertType: string }> = ({ alertType }) => {
  const { id24Axios } = useId24();
  const services = NotificationSettingServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_NOTIFICATION),
  );
  const usersServices = UsersServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_USER),
  );

  const [recipients, setRecipients] = useState<TNotificationRecipient[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [picked, setPicked] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [recs, userRes] = await Promise.all([
      services.getRecipients(alertType),
      users.length ? Promise.resolve({ data: users }) : usersServices.findAllUser({}),
    ]);
    setRecipients(recs);
    if (!users.length) setUsers((userRes as any)?.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertType]);

  const handleAdd = async () => {
    const u = users.find((x) => x.userId === picked);
    if (!u) return message.warning("กรุณาเลือกผู้ใช้");
    if (!u.email) return message.error("ผู้ใช้นี้ไม่มีอีเมล");
    if (recipients.some((r) => r.userId === u.userId && r.alertType === alertType))
      return message.warning("อยู่ในรายชื่อแล้ว");
    setAdding(true);
    const res = await services.addRecipient({
      userId: u.userId,
      email: u.email,
      name: `${u.firstNameTh ?? ""} ${u.lastNameTh ?? ""}`.trim(),
      alertType,
    });
    setAdding(false);
    if (res) {
      setPicked(undefined);
      fetchData();
    } else {
      message.error("เพิ่มไม่สำเร็จ");
    }
  };

  const handleRemove = async (id: number) => {
    const res = await services.removeRecipient(id);
    if (res) fetchData();
    else message.error("ลบไม่สำเร็จ");
  };

  return (
    <div className="mt-1">
      <div className="text-sm font-medium mb-1">รายชื่อผู้รับ</div>
      <Space.Compact className="w-full" style={{ maxWidth: 460 }}>
        <Select
          showSearch
          className="w-full"
          placeholder="เลือกผู้ใช้เพื่อเพิ่ม"
          optionFilterProp="label"
          value={picked}
          onChange={setPicked}
          options={users.map((u) => ({
            value: u.userId,
            label: `${u.firstNameTh ?? ""} ${u.lastNameTh ?? ""} (${
              u.email || "ไม่มีอีเมล"
            })`,
          }))}
        />
        <Button type="primary" loading={adding} onClick={handleAdd}>
          เพิ่ม
        </Button>
      </Space.Compact>

      {loading ? (
        <div className="py-3">
          <Spin size="small" />
        </div>
      ) : recipients.length === 0 ? (
        <div className="text-gray-400 text-sm py-2">ยังไม่มีผู้รับ</div>
      ) : (
        <List
          size="small"
          className="mt-2"
          style={{ maxWidth: 460 }}
          dataSource={recipients}
          renderItem={(r) => (
            <List.Item
              actions={[
                <Button
                  key="del"
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(r.id)}
                />,
              ]}
            >
              <span>
                {r.name || r.userId}{" "}
                <span className="text-gray-400">
                  {r.email}
                  {!r.alertType ? " · ทั่วไป" : ""}
                </span>
              </span>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default TypeRecipients;
