"use client";
import React, { useEffect, useState } from "react";
import {
  AutoComplete,
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  CarLite,
  DocSuggestions,
  DocType,
  MaCarDocumentFile,
  MaCarDocumentType,
} from "../../common";
import { DOC_TYPE_LABEL, DOC_TYPES } from "../../common/doc-status";
import MacarFileList from "../../common/macar-file-list";
import { defaultDatePickerFormat, handleCompress } from "@/app/utils";

export type ManageMode = "create" | "renew" | "edit";

interface DocManageModalProps {
  open: boolean;
  mode: ManageMode;
  cars: CarLite[];
  suggestions: DocSuggestions;
  /** รถ + ประเภทที่ถูกเลือกไว้ล่วงหน้า (มาจากการกด chip ในตาราง) */
  presetCarId?: string;
  presetDocType?: DocType;
  /** เอกสารตั้งต้น: ตอน renew ใช้เป็นค่าเริ่มต้น, ตอน edit คือแถวที่กำลังแก้ */
  record?: MaCarDocumentType | null;
  /** สิทธิ์ลบไฟล์ (แสดงปุ่มลบในรายการไฟล์เดิม) */
  canDelete?: boolean;
  /** ลบไฟล์เดิม 1 รายการ (ตอนแก้ไข) */
  onDeleteFile?: (id: number) => void | Promise<void>;
  onCancel: () => void;
  onSubmit: (values: any, files: UploadFile[]) => Promise<void>;
}

const MODE_TITLE: Record<ManageMode, string> = {
  create: "เพิ่มเอกสาร",
  renew: "ต่ออายุเอกสาร",
  edit: "แก้ไขเอกสาร",
};

/**
 * ฟอร์มเพิ่ม / ต่ออายุ / แก้ไขเอกสาร
 *
 * สองอย่างที่ทำให้กรอกเร็วขึ้น (สำคัญเพราะทีมกรอกมือทั้งหมด ไม่ได้ import จาก Excel):
 * 1. วันหมดอายุเติมให้อัตโนมัติ = วันเริ่มต้น + 1 ปี (เอกสารทั้ง 3 ประเภทมีอายุ 1 ปีพอดี)
 * 2. ช่องบริษัท/ชั้นประกันเป็น combobox ที่ดึงค่าที่เคยพิมพ์ไว้แล้วมาให้เลือก
 */
export default function DocManageModal({
  open,
  mode,
  cars,
  suggestions,
  presetCarId,
  presetDocType,
  record,
  canDelete = false,
  onDeleteFile,
  onCancel,
  onSubmit,
}: DocManageModalProps) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  // ไฟล์เดิมของงวดนี้ (ตอนแก้ไข) — เก็บใน state เพื่อให้รายการอัปเดตทันทีเมื่อลบ
  const [existingFiles, setExistingFiles] = useState<MaCarDocumentFile[]>([]);

  // docType คุมว่าจะโชว์ช่องบริษัท/ชั้นประกันไหม จึงต้อง watch ไว้
  const docType: DocType | undefined = Form.useWatch("docType", form);

  useEffect(() => {
    if (!open) return;

    setFiles([]);
    setExistingFiles(mode === "edit" && record ? record.files ?? [] : []);

    if (mode === "edit" && record) {
      form.setFieldsValue({
        carId: presetCarId,
        docType: record.docType,
        insuranceType: record.insuranceType ?? undefined,
        vender: record.vender ?? undefined,
        policyNo: record.policyNo ?? undefined,
        cost: record.cost ?? undefined,
        startDate: dayjs(record.startDate),
        expireDate: dayjs(record.expireDate),
        paidDate: record.paidDate ? dayjs(record.paidDate) : undefined,
        remark: record.remark ?? undefined,
      });
      return;
    }

    if (mode === "renew" && record) {
      // ต่ออายุ: งวดใหม่เริ่มตอนงวดเก่าหมดอายุ (ถ้าเลยมาแล้วให้เริ่มวันนี้)
      const previousExpire = dayjs(record.expireDate);
      const start = previousExpire.isBefore(dayjs()) ? dayjs() : previousExpire;
      form.setFieldsValue({
        carId: presetCarId,
        docType: record.docType,
        insuranceType: record.insuranceType ?? undefined,
        vender: record.vender ?? undefined,
        policyNo: undefined, // เลขกรมธรรม์เป็นของงวดใหม่ ไม่ copy มา
        cost: record.cost ?? undefined,
        startDate: start,
        expireDate: start.add(1, "year"),
        paidDate: undefined,
        remark: undefined,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      carId: presetCarId,
      docType: presetDocType,
      startDate: dayjs(),
      expireDate: dayjs().add(1, "year"),
    });
  }, [open, mode, record, presetCarId, presetDocType, form]);

  /** เลื่อนวันเริ่มต้น -> เลื่อนวันหมดอายุตามให้ 1 ปี (ผู้ใช้แก้เองทับได้) */
  const onStartDateChange = (value: dayjs.Dayjs | null) => {
    if (value) form.setFieldValue("expireDate", value.add(1, "year"));
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await onSubmit(values, files);
      setSaving(false);
    } catch (err) {
      // validateFields โยน error เมื่อฟอร์มไม่ผ่าน — antd แสดงข้อความใต้ช่องให้แล้ว
      setSaving(false);
    }
  };

  /** ลบไฟล์เดิม 1 รายการ แล้วเอาออกจากลิสต์ทันที */
  const handleDeleteExisting = async (id: number) => {
    await onDeleteFile?.(id);
    setExistingFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const carOptions = cars.map((car) => ({
    value: car.carId,
    label: car.licensePlate
      ? `${car.licensePlate} — ${car.carName}`
      : car.carName,
  }));

  const toOptions = (values: string[]) =>
    values.map((value) => ({ value, label: value }));

  return (
    <Modal
      title={MODE_TITLE[mode]}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={saving}
      okText="บันทึก"
      cancelText="ยกเลิก"
      width={640}
      destroyOnClose
    >
      {mode === "renew" && (
        <Alert
          type="info"
          showIcon
          className="mb-4"
          message="การต่ออายุจะบันทึกเป็นงวดใหม่ ข้อมูลงวดเดิมยังอยู่ในประวัติ"
        />
      )}

      <Form form={form} layout="vertical">
        <Form.Item
          label="รถ"
          name="carId"
          rules={[{ required: true, message: "กรุณาเลือกรถ!" }]}
        >
          <Select
            options={carOptions}
            showSearch
            optionFilterProp="label"
            placeholder="เลือกรถ"
            disabled={mode !== "create"}
          />
        </Form.Item>

        <Form.Item
          label="ประเภทเอกสาร"
          name="docType"
          rules={[{ required: true, message: "กรุณาเลือกประเภทเอกสาร!" }]}
        >
          <Select
            options={DOC_TYPES.map((type) => ({
              value: type,
              label: DOC_TYPE_LABEL[type],
            }))}
            placeholder="เลือกประเภทเอกสาร"
            disabled={mode !== "create"}
          />
        </Form.Item>

        {/* ภาษีจ่ายกับกรมการขนส่ง ไม่มีคู่สัญญาให้กรอก จึงซ่อนช่องบริษัท */}
        {docType !== "tax" && (
          <Form.Item label="บริษัท / ผู้ให้บริการ" name="vender">
            <AutoComplete
              options={toOptions(suggestions.vender)}
              placeholder="เช่น คุ้มภัยโตเกียวมารีน"
              filterOption={(input, option) =>
                (option?.value ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        )}

        {/* ชั้นประกันมีเฉพาะประกันภัย พ.ร.บ. และภาษีไม่มี */}
        {docType === "insurance" && (
          <Form.Item label="ประเภท / ชั้นประกัน" name="insuranceType">
            <AutoComplete
              options={toOptions(suggestions.insuranceType)}
              placeholder="เช่น ชั้น 1"
              filterOption={(input, option) =>
                (option?.value ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        )}

        <Form.Item label="เลขกรมธรรม์ / เลขที่ใบเสร็จ" name="policyNo">
          <Input placeholder="เลขที่เอกสาร" />
        </Form.Item>

        <Form.Item label="ค่าใช้จ่าย (บาท)" name="cost">
          <InputNumber<number>
            className="w-full"
            min={0}
            step={100}
            formatter={(value) =>
              value === undefined || value === null
                ? ""
                : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => Number((value ?? "").replace(/,/g, ""))}
          />
        </Form.Item>

        <Form.Item
          label="วันเริ่มต้น"
          name="startDate"
          rules={[{ required: true, message: "กรุณาเลือกวันเริ่มต้น!" }]}
        >
          <DatePicker
            className="w-full"
            format={defaultDatePickerFormat}
            onChange={onStartDateChange}
          />
        </Form.Item>

        <Form.Item
          label="วันหมดอายุ"
          name="expireDate"
          rules={[
            { required: true, message: "กรุณาเลือกวันหมดอายุ!" },
            // วันหมดอายุก่อนวันเริ่มต้น = กรอกผิดแน่นอน และจะทำให้สถานะเพี้ยนทั้งหน้า
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue("startDate");
                if (!value || !start || value.isAfter(start)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("วันหมดอายุต้องอยู่หลังวันเริ่มต้น!")
                );
              },
            }),
          ]}
          extra="เติมให้อัตโนมัติเป็น 1 ปีหลังวันเริ่มต้น แก้ไขได้"
        >
          <DatePicker className="w-full" format={defaultDatePickerFormat} />
        </Form.Item>

        <Form.Item
          label="วันที่ชำระ"
          name="paidDate"
          extra="ใช้คำนวณกราฟงบประมาณรายเดือน"
        >
          <DatePicker className="w-full" format={defaultDatePickerFormat} />
        </Form.Item>

        <Form.Item label="หมายเหตุ" name="remark">
          <Input.TextArea rows={2} />
        </Form.Item>

        {mode === "edit" && existingFiles.length > 0 && (
          <Form.Item label="ไฟล์แนบเดิม">
            <MacarFileList
              items={existingFiles.map((file) => ({
                id: file.id,
                filePath: file.filePath,
                name: file.name ?? file.fileName,
                fileType: file.fileType,
              }))}
              onDelete={handleDeleteExisting}
              canDelete={canDelete}
            />
          </Form.Item>
        )}

        <Form.Item label="ไฟล์แนบ" extra="รองรับ PDF และรูปภาพ (.pdf .jpg .png)">
          <Upload
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            maxCount={10}
            fileList={files}
            beforeUpload={async (file) => {
              const compressed = await handleCompress(file);
              // คืน false เพื่อไม่ให้ antd อัปโหลดเอง — เราส่งเป็น FormData ทีเดียวตอนกดบันทึก
              setFiles((prev) => [
                ...prev,
                {
                  uid: `${Date.now()}-${file.name}`,
                  name: file.name,
                  originFileObj: compressed,
                } as UploadFile,
              ]);
              return false;
            }}
            onRemove={(file) => {
              setFiles((prev) => prev.filter((item) => item.uid !== file.uid));
            }}
          >
            <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
