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

  if (!handbookFile) {
    return <div>No Data...</div>;
  }

  const limitedFiles = handbookFile.slice(0, 3);

  return (
    <div style={{ textAlign: "left", padding: "20px", background: "#f0f2f5" }}>
      {handbookFile?.map((file, index) => (
        <Card
          key={file.fileId}
          hoverable
          style={{
            width: "90px",
            height: "1000px",
            marginBottom: 12,
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            padding: "8px",
            marginTop: 8,
            overflowY: "auto",
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
                  onClick={() =>
                    downloadFile(file.handbookid, file.fileLocation)
                  }
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

      {/* {handbookFile?.map((file, index) => (
  <Card
    key={file.fileId}
    hoverable
    style={{
      width: "90px", // ขนาดของการ์ด
      height: "auto", // ปรับให้ความสูงอัตโนมัติตามเนื้อหา
      marginBottom: 12,
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      padding: "8px",
      marginTop: 8,
      overflowY: "auto", // แสดงแถบเลื่อนเมื่อมีข้อมูลมาก
      maxHeight: "500px", // กำหนดความสูงสูงสุดของการ์ด
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
            onClick={() =>
              downloadFile(file.handbookid, file.fileLocation)
            }
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
))} */}
    </div>
  );
};

export default DocumentComponent;
