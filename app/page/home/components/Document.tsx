import { PaperClipOutlined } from "@ant-design/icons";
import { Button, Card, Tooltip } from "antd";
import React from "react";
import { HandbookFileType } from "../common";
import { downloadLoopIcon } from "@/components/icon";

export interface props {
  handbookFile: HandbookFileType[];
  downloadFile: (id: string, filename: string) => void;
}

const DocumentComponent: React.FC<props> = ({ handbookFile, downloadFile }): React.ReactElement => {
  if (!handbookFile || handbookFile.length === 0) {
    return <div>No Data...</div>;
  }

  return (
    <div
      style={{
        textAlign: "left",
        padding: "5px",
        background: "#f0f2f5",
        height: "410px",
        overflowY: "auto",
      }}>
      {handbookFile.map((file, index) => (
        <Card
          key={file.fileId}
          hoverable
          style={{
            margin: "5px",
            borderRadius: "8px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
          size="small"
          type="inner">
          <div>
            <h2
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                margin: 0,
                fontSize: "16px",
                lineHeight: "1.2",
                fontWeight: "bold",
                marginLeft: "10px",
              }}>
              {file.fileName || "Not fileName"}
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "10px",
              }}>
              <div>
                <p />
                <h5 style={{ fontSize: "14px", margin: 0, color: "#595959" }}>
                  <strong>ประเภทเอกสาร : </strong> {file.filetype || "Not specified"}
                </h5>
                <h5 style={{ fontSize: "14px", margin: 0, color: "#595959" }}>
                  <strong>วันที่อัปโหลด : </strong> {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "Date not available"}
                </h5>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  margin: 0,
                  fontSize: "16px",
                  lineHeight: "1.2",
                  flexBasis: "50%",
                }}>
                <strong style={{ marginRight: "5px" }}>ไฟล์ : </strong>
                <Tooltip title="ดาวน์โหลด">
                  <Button
                    type="link"
                    onClick={() => downloadFile(file.fileId, file.fileName)}
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                    }}>
                    <PaperClipOutlined style={{ marginRight: "5px" }} />
                    <span
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        display: "inline-block",
                      }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: "8px" }}>{file.fileName}</span>
                        {downloadLoopIcon}
                      </div>
                    </span>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DocumentComponent;
