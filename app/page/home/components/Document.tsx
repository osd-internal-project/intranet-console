import {
  RightOutlined,
  ArrowRightOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Button, Card, Modal, Space } from "antd";
import React, { useState } from "react";
import { HandbookFileType, HandbookType } from "../common";

export interface props {
  handbookFile: HandbookFileType[];
  handbookQuery: HandbookType[];
  downloadFile: (id: number, filename: string) => void;
}

const DocumentComponent: React.FC<props> = ({
  handbookFile,
  handbookQuery,
  downloadFile,
}): React.ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const limitedFiles = handbookQuery.slice(0, 3);

  return (
    <div style={{ textAlign: "left", padding: "20px", background: "#f0f2f5" }}>
      {limitedFiles.map((file, index) => (
        <Card
          key={file.idbook}
          hoverable
          style={{
            width: 900,
            height: "auto",
            marginBottom: 12,
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            padding: "8px",
            marginTop: 8,
          }}
          type="inner"
          title={
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              {file.fileName || "Untitled"}
            </span>
          }
        >
          <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", color: "#595959" }}>
                <strong>ประเภทเอกสาร:</strong>{" "}
                {file.filetype || "Not specified"}
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", color: "#595959" }}>
                <strong>วันที่เพิ่มไฟล์:</strong>{" "}
                {file.createdAt
                  ? new Date(file.createdAt).toLocaleDateString()
                  : "Date not available"}
              </p>
            </div>
            <div style={{ flex: 2 }} key={index}>
              <p style={{ fontSize: "14px", color: "#595959" }}>
                <strong>ไฟล์:</strong>{" "}
                <Button
                  type="link"
                  onClick={() => downloadFile(file.handbookid, file.fileName)}
                  // onClick={() => (file.id, file.fileName)}
                >
                  <Space>
                    <PaperClipOutlined />
                    {file.fileName}
                  </Space>
                </Button>
              </p>
            </div>
          </div>
        </Card>
      ))}

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <Button type="primary" onClick={showModal}>
          ทั้งหมด
        </Button>
      </div>

      <Modal
        title="เอกสาร ทั้งหมด"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={null}
      >
        {handbookQuery.map((file) => (
          <Card
            key={file.idbook}
            hoverable
            style={{
              marginBottom: 12,
              borderRadius: "8px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              padding: "8px",
              marginTop: 8,
            }}
            type="inner"
            title={
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {file.fileName || "Untitled"}
              </span>
            }
          >
            <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", color: "#595959" }}>
                  <strong>ประเภทเอกสาร:</strong>{" "}
                  {file.filetype || "Not specified"}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", color: "#595959" }}>
                  <strong>วันที่เพิ่มไฟล์:</strong>{" "}
                  {file.createdAt
                    ? new Date(file.createdAt).toLocaleDateString()
                    : "Date not available"}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", color: "#595959" }}>
                  <strong>ไฟล์:</strong> {file.fileName}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </Modal>
    </div>
  );
};

export default DocumentComponent;
