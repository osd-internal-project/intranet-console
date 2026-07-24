"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Switch,
  message,
} from "antd";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import {
  TTestTemplate,
  TTestTemplateField,
} from "@/app/common/notification";
import { TestMailServices } from "../services/test-mail.service";

/**
 * ฟอร์มทดสอบส่งอีเมล — เลือก template, กรอกอีเมลปลายทาง, กรอกข้อมูลของ template นั้น ๆ
 * ดึงรายการ template จากทั้ง service notification และ intranet แล้วรวมเป็นชุดเดียว
 */
const TestSendMail: React.FC = () => {
  const { id24Axios } = useId24();
  const [form] = Form.useForm();
  const [templates, setTemplates] = useState<TTestTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>();

  // สร้าง service ของแต่ละ backend (ผูก base URL ต่างกัน) — memo กัน re-create ทุก render
  const cfg = loadAppConfig();
  const notiService = useMemo(
    () =>
      TestMailServices(id24Axios(cfg.NEXT_PUBLIC_API_BASE_URL_NOTIFICATION), {
        list: "/notification/test-templates",
        send: "/notification/test-send",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const intranetService = useMemo(
    () =>
      TestMailServices(id24Axios(cfg.NEXT_PUBLIC_API_BASE_URL_INTRANET), {
        list: "/mail-test/templates",
        send: "/mail-test/send",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // โหลด template จากทั้งสอง service พร้อมกัน แล้ว tag origin ไว้เลือก service ตอนส่ง
  useEffect(() => {
    let active = true;
    (async () => {
      const [noti, intra] = await Promise.all([
        notiService.getTemplates(),
        intranetService.getTemplates(),
      ]);
      if (!active) return;
      const merged: TTestTemplate[] = [
        ...noti.map((t) => ({ ...t, origin: "notification" as const })),
        ...intra.map((t) => ({ ...t, origin: "intranet" as const })),
      ];
      setTemplates(merged);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [notiService, intranetService]);

  const selected = templates.find((t) => t.key === selectedKey);

  // แปลงค่า sample ของ field ให้เป็นค่าเริ่มต้นของฟอร์ม (datetime → dayjs)
  const toInitialValue = (field: TTestTemplateField): unknown => {
    if (field.type === "datetime")
      return field.sample ? dayjs(field.sample as string) : undefined;
    if (field.type === "boolean") return Boolean(field.sample);
    return field.sample ?? undefined;
  };

  // เมื่อเปลี่ยน template — เติมค่า sample ให้ field ทั้งหมด (คง email ปลายทางไว้)
  useEffect(() => {
    if (!selected) return;
    const values: Record<string, unknown> = {};
    selected.fields.forEach((f) => {
      values[f.name] = toInitialValue(f);
    });
    form.setFieldsValue(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  /** render 1 ช่องกรอกตามชนิดของ field */
  const renderInput = (field: TTestTemplateField) => {
    switch (field.type) {
      case "textarea":
        return <Input.TextArea rows={3} />;
      case "datetime":
        return <DatePicker showTime format="DD-MM-YYYY HH:mm" className="w-full" />;
      case "boolean":
        return <Switch />;
      case "select":
        return <Select options={field.options ?? []} />;
      default:
        return <Input />;
    }
  };

  /** รวมค่าจากฟอร์มเป็น object data (datetime → ISO string) แล้วยิงไป service ต้นทาง */
  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!selected) return;
    setSending(true);
    const data: Record<string, unknown> = {};
    selected.fields.forEach((f) => {
      const v = values[f.name];
      if (f.type === "datetime") {
        data[f.name] = v ? (v as dayjs.Dayjs).toISOString() : "";
      } else if (f.type === "boolean") {
        data[f.name] = Boolean(v);
      } else {
        data[f.name] = v ?? "";
      }
    });

    const service =
      selected.origin === "notification" ? notiService : intranetService;
    const res = await service.sendTest({
      key: selected.key,
      to: values.to as string,
      data,
    });
    setSending(false);

    if (res.ok) {
      message.success(`ส่งอีเมลทดสอบไปยัง ${values.to} สำเร็จ`);
    } else {
      message.error(res.error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
      <Form.Item
        label="เลือก template อีเมล"
        name="__template"
        rules={[{ required: true, message: "กรุณาเลือก template" }]}
      >
        <Select
          placeholder="เลือกประเภทอีเมลที่จะทดสอบส่ง"
          onChange={(v) => setSelectedKey(v)}
          options={templates.map((t) => ({ value: t.key, label: t.label }))}
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item
        label="ส่งไปยังอีเมล"
        name="to"
        rules={[
          { required: true, message: "กรุณากรอกอีเมลปลายทาง" },
          { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
        ]}
      >
        <Input placeholder="example@osd.co.th" />
      </Form.Item>

      {selected && (
        <>
          <Form.Item label="หัวข้ออีเมล">
            <Input value={selected.subject} disabled />
          </Form.Item>
          {selected.fields.map((f) => (
            <Form.Item
              key={f.name}
              label={f.label}
              name={f.name}
              valuePropName={f.type === "boolean" ? "checked" : "value"}
              rules={
                f.required
                  ? [{ required: true, message: `กรุณากรอก${f.label}` }]
                  : undefined
              }
            >
              {renderInput(f)}
            </Form.Item>
          ))}
        </>
      )}

      <Space>
        <Button
          type="primary"
          htmlType="submit"
          loading={sending}
          disabled={!selected}
        >
          ส่งอีเมลทดสอบ
        </Button>
      </Space>
    </Form>
  );
};

export default TestSendMail;
