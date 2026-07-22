"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Collapse,
  Divider,
  Form,
  InputNumber,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  message,
} from "antd";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { NotificationSettingServices } from "../services/notification-setting.service";
import TypeRecipients from "./type-recipients";
import {
  TNotificationSetting,
  TNotiCatalogItem,
  TNotiTarget,
} from "@/app/common/notification";

const TARGET_OPTIONS: { value: TNotiTarget; label: string }[] = [
  { value: "REQUESTER", label: "เจ้าของงาน (ผู้ขอ)" },
  { value: "APPROVER", label: "หัวหน้าผู้อนุมัติ" },
  { value: "FIXED_LIST", label: "รายชื่อเจาะจง" },
];
const TARGET_LABEL: Record<string, string> = Object.fromEntries(
  TARGET_OPTIONS.map((o) => [o.value, o.label]),
);

const MODULE_OPTIONS = [
  { value: "intranet:approveleave", label: "อนุมัติการลา" },
  { value: "intranet:approvebookingcar", label: "อนุมัติจองรถ" },
  { value: "intranet:approvebookingroom", label: "อนุมัติจองห้องประชุม" },
  { value: "intranet:approveot", label: "อนุมัติ OT" },
];

/** เนื้อหาในแต่ละ panel (ฟอร์มตั้งค่า 1 ประเภท) */
const TypeBody: React.FC<{
  def: TNotiCatalogItem;
  setting?: TNotificationSetting;
  onSaved: () => void;
}> = ({ def, setting, onSaved }) => {
  const { id24Axios } = useId24();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const target: TNotiTarget =
    Form.useWatch("targetStrategy", form) ??
    setting?.targetStrategy ??
    def.defaultTarget;

  const services = NotificationSettingServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_NOTIFICATION),
  );

  const handleSave = async (values: any) => {
    setSaving(true);
    const payload: Partial<TNotificationSetting> = {
      enabled: values.enabled,
      emailEnabled: values.emailEnabled,
      webEnabled: values.webEnabled,
      targetStrategy: values.targetStrategy,
      moduleCode:
        values.targetStrategy === "APPROVER" ? values.moduleCode : null,
    };
    if (def.hasThresholds) {
      payload.thresholds = Array.from(
        new Set(
          [values.milestone1, values.milestone2].filter(
            (v): v is number => typeof v === "number" && v > 0,
          ),
        ),
      ).sort((a, b) => b - a);
      payload.notifyWhenExpiredDaily = values.notifyWhenExpiredDaily;
    }
    const res = await services.updateSetting(def.key, payload);
    setSaving(false);
    if (res) {
      message.success("บันทึกสำเร็จ");
      onSaved();
    } else {
      message.error("บันทึกไม่สำเร็จ");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        enabled: setting?.enabled ?? true,
        emailEnabled: setting?.emailEnabled ?? true,
        webEnabled: setting?.webEnabled ?? true,
        targetStrategy: setting?.targetStrategy ?? def.defaultTarget,
        moduleCode: setting?.moduleCode ?? def.moduleCode,
        notifyWhenExpiredDaily: setting?.notifyWhenExpiredDaily ?? true,
        milestone1: setting?.thresholds?.[0] ?? 60,
        milestone2: setting?.thresholds?.[1] ?? 30,
      }}
      onFinish={handleSave}
    >
      <Space size={32} wrap align="start">
        <Form.Item name="enabled" label="เปิดใช้งาน" valuePropName="checked">
          <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
        </Form.Item>
        <Form.Item name="webEnabled" label="แจ้งบนเว็บ" valuePropName="checked">
          <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
        </Form.Item>
        <Form.Item name="emailEnabled" label="ส่งอีเมล" valuePropName="checked">
          <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
        </Form.Item>
        <Form.Item name="targetStrategy" label="ส่งถึงใคร">
          <Select options={TARGET_OPTIONS} style={{ width: 200 }} />
        </Form.Item>
        {target === "APPROVER" && (
          <Form.Item name="moduleCode" label="กลุ่มผู้อนุมัติ">
            <Select
              options={MODULE_OPTIONS}
              style={{ width: 220 }}
              placeholder="เลือกโมดูล"
            />
          </Form.Item>
        )}
      </Space>

      {def.hasThresholds && (
        <>
          <Divider className="my-1" />
          <Space size={24} align="end" wrap>
            <Form.Item name="milestone1" label="แจ้งล่วงหน้า ครั้งที่ 1 (วัน)">
              <InputNumber min={1} max={365} style={{ width: 130 }} />
            </Form.Item>
            <Form.Item name="milestone2" label="แจ้งล่วงหน้า ครั้งที่ 2 (วัน)">
              <InputNumber min={1} max={365} style={{ width: 130 }} />
            </Form.Item>
            <Form.Item
              name="notifyWhenExpiredDaily"
              label="แจ้งซ้ำทุกวันเมื่อเลยกำหนด"
              valuePropName="checked"
            >
              <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
            </Form.Item>
          </Space>
        </>
      )}

      {target === "FIXED_LIST" && (
        <>
          <Divider className="my-1" />
          <TypeRecipients alertType={def.key} />
        </>
      )}

      <div className="mt-3">
        <Button type="primary" htmlType="submit" loading={saving}>
          บันทึก
        </Button>
      </div>
    </Form>
  );
};

/**
 * แท็บตั้งค่าประเภทการแจ้งเตือน — accordion จัดกลุ่มตามหมวด (dynamic จาก catalog)
 * แต่ละประเภทเลือกช่องทาง + ผู้รับ; ถ้า "รายชื่อเจาะจง" จัดการรายชื่อได้ในการ์ดเลย
 */
const AlertTypesConfig: React.FC = () => {
  const { id24Axios } = useId24();
  const services = NotificationSettingServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_NOTIFICATION),
  );

  const [catalog, setCatalog] = useState<TNotiCatalogItem[]>([]);
  const [settings, setSettings] = useState<TNotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [cat, sett] = await Promise.all([
      services.getCatalog(),
      services.getSettings(),
    ]);
    setCatalog(cat);
    setSettings(sett);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settingByKey = useMemo(
    () => new Map(settings.map((s) => [s.alertType, s])),
    [settings],
  );

  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, TNotiCatalogItem[]>();
    for (const def of catalog) {
      if (!map.has(def.category)) {
        map.set(def.category, []);
        order.push(def.category);
      }
      map.get(def.category)!.push(def);
    }
    return order.map((c) => ({ category: c, items: map.get(c)! }));
  }, [catalog]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spin />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.category}>
          <div className="font-semibold text-base mb-2">{g.category}</div>
          <Collapse
            items={g.items.map((def) => {
              const s = settingByKey.get(def.key);
              const tgt = s?.targetStrategy ?? def.defaultTarget;
              return {
                key: def.key,
                label: def.label,
                extra: (
                  <Space size={4}>
                    <Tag color="blue">{TARGET_LABEL[tgt]}</Tag>
                    <Tag color={s?.enabled === false ? "default" : "green"}>
                      {s?.enabled === false ? "ปิด" : "เปิด"}
                    </Tag>
                  </Space>
                ),
                children: (
                  <TypeBody def={def} setting={s} onSaved={fetchData} />
                ),
              };
            })}
          />
        </div>
      ))}
    </div>
  );
};

export default AlertTypesConfig;
