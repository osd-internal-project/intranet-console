import { ITOrder, ITOrderLot } from "@/app/page/stock/common/order";
import { dateToStringThNoTime } from "@/app/utils/format";
import { Button, Table, TablePaginationConfig, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { createRoot } from "react-dom/client";
import { QRCodeSVG } from "qrcode.react";
import { DownloadOutlined } from "@ant-design/icons";
export interface props {
  dataOrderLot: { data: ITOrderLot[]; count: number };
  changePagination: (page: TablePaginationConfig) => void;
  pagination: TablePaginationConfig;
}

const TableOrderLotPage: React.FC<props> = ({ dataOrderLot, changePagination, pagination }): React.ReactElement => {
  const handleDownloadSVG = (value: string) => {
    // Download as 512x512 SVG
    downloadQRCodeSVG(value, "my-qrcode", 512);
  };
  const downloadQRCodeSVG = (value: string, filename: string = "qrcode", size: number = 512) => {
    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Create QR code element with desired size
    const qrElement = document.createElement("div");
    container.appendChild(qrElement);

    // Render QR code using React
    const root = createRoot(qrElement);
    root.render(<QRCodeSVG value={value} size={size} level="H" includeMargin={true} marginSize={4} bgColor="#FFFFFF" fgColor="#000000" />);

    // Wait a bit for rendering
    setTimeout(() => {
      const svgElement = qrElement.querySelector("svg");
      if (svgElement) {
        // Get SVG content
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

        // Create download link
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(svgBlob);
        downloadLink.download = `${filename}.svg`;

        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Cleanup
        URL.revokeObjectURL(downloadLink.href);
      }

      // Cleanup container
      root.unmount();
      document.body.removeChild(container);
    }, 100);
  };

  const columns: ColumnsType<ITOrder> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => (pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : ""),
    },
    {
      title: "Product Name",
      dataIndex: "prdName",
      key: "prdName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },

    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => dateToStringThNoTime(value),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) => dateToStringThNoTime(value),
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
      render: (value) => {
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-center">{`${value}`}</div>
            <div className="flex justify-center">
              <QRCodeSVG value={`${window.location.origin}/scan-by-product/${value}`} size={64} level="H" />
            </div>
            <div className="flex justify-center gap-2">
              <Button icon={<DownloadOutlined />} onClick={() => handleDownloadSVG(`${window.location.origin}/scan-by-product/${value}`)}>
                SVG
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (e) => (e === "in-stock" ? <Tag color="blue-inverse">{`มีสินค้าในคลัง`}</Tag> : <Tag color="error">{`สินค้าถูกนำจ่าย`}</Tag>),
    },
  ];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">ข้อมูล Order Lot</h2>
        <div className="h-1 w-20 bg-blue-500 rounded"></div>
      </div>
      <Table
        dataSource={dataOrderLot.data}
        columns={columns}
        size="small"
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{ ...pagination, total: dataOrderLot.count }}
        onChange={changePagination}
      />
    </div>
  );
};

export default TableOrderLotPage;
