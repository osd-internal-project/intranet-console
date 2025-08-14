import React from "react";
import { Button, Image, Table, TablePaginationConfig, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { dateToStringTh } from "@/app/utils/format";
import { deleteIcon, editIcon } from "@/components/icon";
import { ITMasterProduct } from "../../common/master-product";
import { createRoot } from "react-dom/client";
import { QRCodeSVG } from "qrcode.react";
import { DownloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export interface props {
  dataSource: { data: ITMasterProduct[]; count: number };
  changePagination: (values: TablePaginationConfig) => void;
  pagination: TablePaginationConfig;
  handleManage: (status: boolean, type: string, value?: ITMasterProduct) => void;
}

const TableMasterProductPage: React.FC<props> = ({ dataSource, changePagination, pagination, handleManage }): React.ReactElement => {
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
  const columns: ColumnsType<ITMasterProduct> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => (pagination.current && pagination.pageSize ? (pagination.current - 1) * pagination.pageSize + (index + 1) : ""),
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "prdName",
      key: "prdName",
      render: (_, record, index) => {
        return (
          <div className="grid grid-cols-3">
            <div className="grid col-span-1 justify-center items-center align-middle">
              <Image
                width={"40px"}
                height={"40px"}
                src={`${process.env.REACT_APP_API_BASE_URL_INVENTORY}/master-product-image/get-image/${
                  record?.masterProductImage?.[0]?.prdImageId ?? ""
                }`}
              />
            </div>
            <div className="grid grid-cols-1 col-span-2">
              <div className="grid col-span-1">
                <Typography.Text className="font-bold text-lg">{_}</Typography.Text>
              </div>
              <div className="grid col-span-1">
                <Typography.Text className="text-gray-400">{record.description}</Typography.Text>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "หน่วย",
      dataIndex: ["unit", "unitName"],
      key: "updatedBy",
    },
    {
      title: "จำนวนทั้งหมด",
      dataIndex: "totalQty",
      key: "totalQty",
    },
    {
      title: "นำเข้าโดย",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },
    {
      title: "บาร์โคด",
      dataIndex: "barcode",
      key: "barcode",
      align: "center",
      render: (value) => {
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-center gap-2">
              <Button
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadSVG(`${window.location.origin}/scan-by-product/${value}`)}>{`Download`}</Button>
            </div>
          </div>
        );
      },
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value, record, index) => (value ? dateToStringTh(value) : ""),
    },
    {
      title: "...",
      key: "id",
      dataIndex: "id",
      fixed: "right" as "right",
      align: "center",
      render: (value, record, index) => (
        <div className=" space-x-2">
          <Button type="link" className="p-1" onClick={() => handleManage(true, "edit", record)}>
            {editIcon}
          </Button>
          <Button type="link" className="p-1" danger onClick={() => handleManage(true, "delete", record)}>
            {deleteIcon}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource.data}
        pagination={{ ...pagination, total: dataSource.count }}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        onChange={changePagination}
      />
    </div>
  );
};

export default TableMasterProductPage;
