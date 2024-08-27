import {
  Button,
  Carousel,
  Form,
  Modal,
  Popconfirm,
  Space,
  Table,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { SlideImageType } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import SlideImageService from "../services/index.service";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";

export interface Props {
  loading: boolean;
  slideImage: SlideImageType[];
  addFile: any[];
  handleChangeAddFile: (e: any) => void;
  beforeUploadAddFiles: (e: RcFile) => void;
  submitLoading: boolean;
  handleDeleteSlideImage: any;
}

export const BigCarouselComponent: React.FC<Props> = ({
  loading,
  slideImage,
  addFile,
  handleChangeAddFile,
  beforeUploadAddFiles,
  submitLoading,
  handleDeleteSlideImage,
}) => {
  const intraAuth = useAxiosIntranet();
  const slideImageService = SlideImageService(intraAuth);
  const [modalDetail, setModalDetail] = useState<boolean>(false);
  const [modalAddSlide, setModalAddSlide] = useState<boolean>(false);

  const columns: any = [
    {
      key: "id",
      dataIndex: "id",
      title: "ID",
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      key: "fileName",
      dataIndex: "fileName",
      title: "fileName",
    },
    {
      key: "fileType",
      dataIndex: "fileType",
      title: "fileType",
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Created At",
      render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      key: "createdByName",
      dataIndex: "createdByName",
      title: "createdByName",
    },
    {
      key: "id",
      dataIndex: "",
      title: "Active",
      align: "center",
      render: (_: any, record: { id: number }) => (
        <Space size="middle">
          <Popconfirm
            title="คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?"
            onConfirm={() => handleDeleteSlideImage(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <a>ลบ</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const contentStyle: React.CSSProperties = {
    height: "100vh",
    color: "#fff",
    lineHeight: "1080px",
    textAlign: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const imageUrls = [
    "/images/homeImg/slide-image/Slide1.jpeg",
    "/images/homeImg/slide-image/Slide2.jpeg",
    "/images/homeImg/slide-image/Slide3.jpeg",
    "/images/homeImg/slide-image/Slide4.jpeg",
    "/images/homeImg/slide-image/Slide5.jpeg",
    "/images/homeImg/slide-image/Slide6.jpeg",
    "/images/homeImg/slide-image/Slide7.jpeg",
    "/images/homeImg/slide-image/Slide8.jpeg",
    "/images/homeImg/slide-image/Slide9.jpeg",
    "/images/homeImg/slide-image/Slide10.jpeg",
  ];

  return (
    <>
      <div style={{ textAlign: "right" }}>
        <button
          type="button"
          style={{
            marginBottom: "20px",
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
          onClick={() => setModalDetail(true)}
        >
          Detail Slide
        </button>
      </div>

      <Modal
        title="Detail Slide "
        open={modalDetail}
        onCancel={() => setModalDetail(false)}
        width={700}
        footer={false}
      >
        <div style={{ textAlign: "right" }}>
          {" "}
          <Button
            type="primary"
            style={{
              marginBottom: "10px",
              marginInline: "10px",
              padding: "5px 10px",
            }}
            onClick={() => setModalAddSlide(true)}
          >
            Add Slide
          </Button>
        </div>

        <div className="">
          <Table
            dataSource={slideImage}
            columns={columns}
            size="small"
            // loading={loading}
          />
        </div>
      </Modal>

      <Modal
        title="Add Slide"
        open={modalAddSlide}
        onCancel={() => setModalAddSlide(false)}
        width={400}
        footer={false}
      >
        {" "}
        <div className=" col-span-3 md:col-span-1 ml-5">
          <Form
            // form={form}
            layout="vertical"
            name="create"
            // onFinish={createBooking}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label={`แนบไฟล์ :`} name={"addFile"}>
              <Upload
                fileList={addFile}
                onChange={handleChangeAddFile}
                beforeUpload={beforeUploadAddFiles}
                multiple={false}
                maxCount={1}
                accept=".jpg,.jpeg,.png,.gif"
              >
                <Button icon={<UploadOutlined />}>{`Click to Upload`}</Button>
              </Upload>
            </Form.Item>
            <Form.Item name={"addSlide"}>
              <div style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                >
                  ตกลง
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Carousel
        autoplay
        arrows
        infinite
        effect="fade"
        responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }]}
      >
        {imageUrls.map((url, index) => (
          <div key={index}>
            <h3
              style={{ ...contentStyle, backgroundImage: `url(${url})` }}
            ></h3>
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default BigCarouselComponent;
