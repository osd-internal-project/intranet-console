import { IOverTimeForm } from "@/app/common/overtime";
import { FormInstance, Modal, Badge, Row, Col, Card, Typography, Tag } from "antd";
import React from "react";
import { UserOutlined, CheckCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { dateFormat } from "@/app/utils";
import {
  CalculationDetailCard,
  DetailItem,
  PersonalDetailCard,
  TravelDetailCard,
  WorkDetailCard,
  formatDate,
  statusColor,
  statusText,
} from "./detail-view";

const { Text, Title } = Typography;

export interface props {
  formDetail: FormInstance;
  openModal: boolean;
  handleOpenModal: (status: boolean, data: IOverTimeForm | null) => void;
}

export const ModalOvertimeHistory: React.FC<props> = ({ formDetail, openModal, handleOpenModal }): React.ReactElement => {
  const dataDetail = formDetail.getFieldsValue(true);

  return (
    <div className="p-8">
      <Modal
        title={
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
  {/* เพิ่ม items-center เพื่อจัด Icon ให้ตรงกลางแนวตั้งเทียบกับบล็อกข้อความ */}
  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
    <FileTextOutlined className="text-white text-lg" />
  </div>
  
  {/* ใช้ flex flex-col justify-center เพื่อจัดบรรทัดข้อความให้อยู่ตรงกลางแนวตั้ง */}
  <div className="flex flex-col justify-center leading-tight">
    <Title level={4} className="!mb-0 text-gray-800">
      รายละเอียดการทำงานล่วงเวลา
    </Title>
    <Text type="secondary" className="text-sm">
      Overtime Detail Information
    </Text>
  </div>
</div>
        }
        open={openModal}
        onCancel={() => handleOpenModal(false, null)}
        width={900}
        footer={null}
        className="top-4"
        styles={{
          body: { padding: 0 },
          header: { padding: "24px 24px 0" },
        }}>
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
            {/* Status Header */}
            <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge status={statusColor(dataDetail.status)} />
                  <Text strong className="text-lg">
                    สถานะ:{" "}
                  </Text>
                  <Tag color={statusColor(dataDetail.status)} className="px-3 py-1 rounded-full">
                    {statusText(dataDetail.status)}
                  </Tag>
                  {dataDetail.createdAt && (
                    <Text type="secondary" className="text-sm ml-4">
                      {dateFormat(dataDetail.createdAt)}
                    </Text>
                  )}
                </div>
                <Text type="secondary" className="text-sm">
                  ID: {dataDetail.overTimeID?.slice(-8)}
                </Text>
              </div>
            </div>

            <Row gutter={24}>
              <Col span={24}>
                <PersonalDetailCard data={dataDetail} />
              </Col>

              <Col span={24}>
                <WorkDetailCard data={dataDetail} />
              </Col>

              <Col span={24}>
                <TravelDetailCard data={dataDetail} />
              </Col>

              {/* Approval Information */}
              <Col span={24}>
                <Card
                  title={
                    <div className="flex items-center space-x-2">
                      <CheckCircleOutlined className="text-purple-500" />
                      <span>ข้อมูลการอนุมัติ</span>
                    </div>
                  }
                  className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  headStyle={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", color: "#374151" }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <DetailItem label="ผู้อนุมัติ" value={dataDetail.approvedUser} icon={<UserOutlined />} />
                    </Col>
                    <Col span={8}>
                      <DetailItem label="วันที่อนุมัติ" value={formatDate(dataDetail.approvedDate, true)} />
                    </Col>
                    <Col span={8}>
                      <DetailItem label="สถานะ" value={dataDetail.status ? statusText(dataDetail.status) : ""} />
                    </Col>
                  </Row>

                  <DetailItem label="หมายเหตุการอนุมัติ" value={dataDetail.approvedDetail} multiline />
                </Card>
              </Col>

              <Col span={24}>
                <CalculationDetailCard data={dataDetail} />
              </Col>
            </Row>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => handleOpenModal(false, null)}
                className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
