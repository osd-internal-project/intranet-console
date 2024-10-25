import React from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Divider,
  InputNumber,
  FormInstance,
  ConfigProvider,
  Select,
} from "antd";
import { MaCarBookType } from "../../common/index";

interface props {
  formReturn: FormInstance<MaCarBookType>;
  onFinishReturn: (e: any) => void;
  handleReturn: (e: any) => void;
  carBookApprovedStatus: string;
  submitLoading: boolean;
}

export const CarReturnForm: React.FC<props> = ({
  formReturn,
  onFinishReturn,
  handleReturn,
  carBookApprovedStatus,
  submitLoading,
}) => {
  return (
    <>
      <Form
        form={formReturn}
        onFinish={onFinishReturn}
        autoComplete="off"
        size="small"
      >
        <Divider orientation="left">ข้อมูลการคืนรถ</Divider>
        <Col span={24}>
          <Form.Item name="carName" label="ชื่อรถ :">
            <Input
              disabled
              placeholder="กรอกชื่อรถ"
              className="read-only-input"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="createdByName" label="ชื่อผู้คืนรถ :">
            <Input
              disabled
              placeholder="กรอกชื่อ"
              className="read-only-input"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="carMile" label="เลขไมล์รถ">
            <InputNumber
              disabled
              style={{ width: "100%" }}
              placeholder="กรอกเลขไมล์รถ"
              className="read-only-input"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainerDisabled: "#fff",
                colorTextDisabled: "#000",
              },
              components: {
                Select: { colorBorder: "#fff" },
              },
            }}
          >
            <Form.Item label="ระดับน้ำมันรถ :" name="carPetrol">
              <Select placeholder="เลือกระดับน้ำมัน" disabled>
                <Select.Option value="high">มาก</Select.Option>
                <Select.Option value="medium">ปานกลาง</Select.Option>
                <Select.Option value="low">น้อย</Select.Option>
              </Select>
            </Form.Item>
          </ConfigProvider>
        </Col>
        <Col span={24}>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainerDisabled: "#fff",
                colorTextDisabled: "#000",
              },
              components: {
                Select: { colorBorder: "#fff" },
              },
            }}
          >
            <Form.Item label="สถานะของรถ :" name="status">
              <Select placeholder="เลือกสถานะรถ" disabled>
                <Select.Option value={true}>ใช้งานได้ปกติ</Select.Option>
                <Select.Option value={false}>ไม่สามารถใช้งานได้</Select.Option>
              </Select>
            </Form.Item>
          </ConfigProvider>
        </Col>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Row justify="end" gutter={16}>
            <Button
              type="default"
              onClick={handleReturn}
              style={{ marginRight: "16px" }}
            >
              ยกเลิก
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={carBookApprovedStatus === "Completed"}
              loading={submitLoading}
            >
              รับคืนรถ
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};
