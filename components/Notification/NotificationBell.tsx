"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Badge, Dropdown, Empty, Spin, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { NotificationServices } from "@/app/services/notification.service";
import { TNotification } from "@/app/common/notification";

/** รอบการ poll จำนวนที่ยังไม่อ่าน (ms) — ไม่มี websocket จึงใช้ polling */
const POLL_MS = 60_000;

interface Props {
  userId?: string;
}

/**
 * กระดิ่งแจ้งเตือนบน header — แสดง badge จำนวนที่ยังไม่อ่าน,
 * เปิด dropdown ดูรายการล่าสุด, คลิกเพื่ออ่าน+ไปยังหน้าที่เกี่ยวข้อง
 */
const NotificationBell: React.FC<Props> = ({ userId }) => {
  const router = useRouter();
  const { id24Axios } = useId24();
  const services = NotificationServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_NOTIFICATION),
  );

  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<TNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUnread = useCallback(async () => {
    if (!userId) return;
    setUnread(await services.getUnreadCount(userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchList = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setItems(await services.getByUser(userId));
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // poll จำนวนที่ยังไม่อ่านเป็นรอบ
  useEffect(() => {
    if (!userId) return;
    fetchUnread();
    const timer = setInterval(fetchUnread, POLL_MS);
    return () => clearInterval(timer);
  }, [userId, fetchUnread]);

  // โหลดรายการเมื่อเปิด dropdown
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) fetchList();
  };

  const handleClickItem = async (item: TNotification) => {
    setOpen(false);
    if (!item.isRead) {
      await services.markRead(item.id);
      fetchUnread();
    }
    if (item.path) router.push(item.path);
  };

  const handleMarkAll = async () => {
    if (!userId) return;
    await services.markAllRead(userId);
    setUnread(0);
    fetchList();
  };

  const dropdownContent = (
    <div
      className="bg-white rounded-md shadow-lg border border-gray-100"
      style={{ width: 360, maxHeight: 460, overflow: "hidden" }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <span className="font-semibold text-sm">การแจ้งเตือน</span>
        <Button type="link" size="small" onClick={handleMarkAll}>
          อ่านทั้งหมด
        </Button>
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <Empty
            className="py-8"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="ไม่มีการแจ้งเตือน"
          />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClickItem(item)}
              className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${
                item.isRead ? "" : "bg-blue-50"
              }`}
            >
              <div className="flex items-start gap-2">
                <span
                  className="mt-1 inline-block w-2 h-2 rounded-full shrink-0"
                  style={{
                    background:
                      item.level === "expired"
                        ? "#cf1322"
                        : item.level === "warning"
                          ? "#d46b08"
                          : "#1677ff",
                  }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.message}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <Button
          type="link"
          size="small"
          onClick={() => {
            setOpen(false);
            router.push("/page/notification");
          }}
        >
          ดูทั้งหมด
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      trigger={["click"]}
      placement="bottomRight"
      dropdownRender={() => dropdownContent}
    >
      <a onClick={(e) => e.preventDefault()} className="cursor-pointer">
        <Badge count={unread} size="small" overflowCount={99}>
          <BellOutlined style={{ fontSize: 20, color: "#1f1f1f" }} />
        </Badge>
      </a>
    </Dropdown>
  );
};

export default NotificationBell;
