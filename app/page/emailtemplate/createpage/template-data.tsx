import React, { useState } from "react";
import { Button, Modal, Upload, message } from "antd";
import { UploadOutlined, CopyOutlined } from "@ant-design/icons";
import mammoth from "mammoth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextToHtmlConverter = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleConvert = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const options = {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "b => strong", // Bold
          "i => em", // Italic
          "u => span.text-decoration-underline", // Underline
          "strike => del", // Strikethrough
          "p[style-name='Normal'] => p",
          "p[style-name='Quote'] => blockquote",
          "table => table.table-bordered", // Table
          "tr => tr.table-row",
          "th => th.table-header",
          "td => td.table-cell",
          "p[style-name='List Paragraph'] => li", // List paragraph to list
        ],
        convertImage: mammoth.images.imgElement(async (image) => {
          const base64 = await image.read("base64");
          return {
            src: `data:${image.contentType};base64,${base64}`,
          };
        }),
      };
      const result = await mammoth.convertToHtml({ arrayBuffer }, options);
      setHtmlContent(result.value);
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      message.error("Failed to convert file");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent).then(
      () => {
        message.success("Copied to clipboard!");
      },
      () => {
        message.error("Failed to copy.");
      }
    );
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div>
      <h2>การสร้าง form เอกสาร</h2>

      <Upload
        accept=".docx,.doc"
        showUploadList={false}
        beforeUpload={(file) => {
          handleFileUpload(file);
          return false;
        }}
      >
        <Button
          icon={<UploadOutlined />}
          style={{ margin: "10px 10px 10px 0px" }}
        >
          Upload file word
        </Button>
      </Upload>

      <ReactQuill
        value={htmlContent}
        onChange={(content) => setHtmlContent(content)}
        modules={modules}
        theme="snow"
        style={{
          margin: "10px 10px 10px 0px",
          width: "800px",
        }}
      />

      <Button type="primary" onClick={handleConvert}>
        Convert to HTML
      </Button>

      <Modal
        title="Converted HTML"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={handleCopy}>
            Copy HTML
          </Button>,
          <Button key="close" type="primary" onClick={handleOk}>
            Close
          </Button>,
        ]}
        bodyStyle={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          <code>{htmlContent}</code>
        </pre>
      </Modal>
    </div>
  );
};

export default TextToHtmlConverter;
