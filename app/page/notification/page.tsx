"use client";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Divider, Empty, List, Row, Tag } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { NotificationServices } from "@/app/services/notification.service";
import { TNotification } from "@/app/common/notification";

import { notifySuccess } from "@/app/utils/message";
/** หน้ารวมการแจ้งเตือนทั้งหมดของผู้ใช้ */
export default function NotificationPage() {
  const { user } = (useContext(UserContext) as UserContectType) || {
    user: null,
  };
  const router = useRouter();
  const { id24Axios } = useId24();
  const services = NotificationServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_NOTIFICATION),
  );

  const [items, setItems] = useState<TNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.userId) return;
    setLoading(true);
    setItems(await services.getByUser(user.userId));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  const handleClick = async (item: TNotification) => {
    if (!item.isRead) await services.markRead(item.id);
    if (item.path) router.push(item.path);
  };

  const handleMarkAll = async () => {
    if (!user?.userId) return;
    await services.markAllRead(user.userId);
    notifySuccess("notification.readall");
    fetchData();
  };

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              { href: "/page", title: <span>หน้าหลัก</span> },
              { title: <span>การแจ้งเตือน</span> },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`การแจ้งเตือน`}</div>
        </Divider>
      </Row>
      <Card>
        <Row className="mb-2 flex justify-end">
          <Col>
            <Button onClick={handleMarkAll}>อ่านทั้งหมด</Button>
          </Col>
        </Row>
        {!loading && items.length === 0 ? (
          <Empty description="ไม่มีการแจ้งเตือน" />
        ) : (
          <List
            loading={loading}
            dataSource={items}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleClick(item)}
                className={`cursor-pointer ${item.isRead ? "" : "bg-blue-50"}`}
                style={{ paddingLeft: 12, paddingRight: 12 }}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center gap-2">
                      <span>{item.title}</span>
                      {item.level === "expired" ? (
                        <Tag color="red">เลยกำหนด</Tag>
                      ) : item.level === "warning" ? (
                        <Tag color="orange">ใกล้ครบกำหนด</Tag>
                      ) : item.level === "info" ? (
                        <Tag color="blue">แจ้งเตือน</Tag>
                      ) : null}
                      {!item.isRead ? <Tag color="blue">ใหม่</Tag> : null}
                    </div>
                  }
                  description={item.message}
                />
                <div className="text-xs text-gray-400">
                  {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
