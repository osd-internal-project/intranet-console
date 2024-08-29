"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  message,
} from "antd";
import { CreateSlideImage } from "./components/create-slide-image";
import { TableSlideImage } from "./components/table-slide-image";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import ManageHomeService from "./services/index.service";
import { SlideImageType } from "./common";
import { dateToEndofDay, dateToStartofDay } from "@/app/utils/format";
import { RcFile, UploadProps } from "antd/es/upload";
import { useForm } from "antd/es/form/Form";

export default function TypeLeave() {
  const Auth = useAxiosIntranet();
  const manageHomeService = ManageHomeService(Auth);
  const [slideImage, setSlideImage] = useState<SlideImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addFile, setAddFile] = useState<any[]>([]);
  const [createSlideImageForm] = useForm();
  const [modalAddSlide, setModalAddSlide] = useState<boolean>(false);

  useEffect(() => {
    if (loading) loadData();
  }, [loading]);

  const loadData = async () => {
    const dataSlideImage = await manageHomeService.getSlideImageQuery();
    // const dataFilePath = dataSlideImage.map(
    //   (item: SlideImageType) => item.filePath
    // );
    // const dataFileName = dataSlideImage.map(
    //   (item: SlideImageType) => item.fileName
    // );
    // setFileName(dataFileName);
    // setFilePath(dataFilePath);
    setSlideImage(dataSlideImage);

    setLoading(false);
  };

  const handleDeleteSlideImage = async (id: number) => {
    setSubmitLoading(true);
    try {
      await manageHomeService.deleteSlideImage(id);
      setSlideImage(slideImage.filter((item) => item.id !== id));
      message.success("ลบข้อมูลรูปภาพสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      message.error("ลบข้อมูลรูปภาพไม่สำเร็จ");
    }
  };

  const beforeUploadAddFiles = (file: RcFile) => {
    if (slideImage.find((oneFile) => oneFile.fileName === file.name)) {
      message.warning(`ชื่อไฟล์นี้ซ้ำ ${file.name} `);
      return false;
    }
    return false;
  };

  const handleChangeAddFile: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setAddFile(newFileList);
  };

  const onfinishCreateSlide = async (values: any) => {
    try {
      setSubmitLoading(true);

      if (addFile.length > 0) {
        for (const file of addFile) {
          const formData: any = new FormData();
          formData.append("type", "attend");
          formData.append("files", file.originFileObj);
          await manageHomeService.uploadFilesSlide(values.id, formData);
        }
        message.success("อัปโหลดสำเร็จ");
      }
    } catch (error) {
      message.error("การอัปโหลดล้มเหลว");
    } finally {
      setSubmitLoading(false);
      setModalAddSlide(false);
      setLoading(true);
      createSlideImageForm.resetFields();
      setAddFile([]);
    }
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                href: "/page",
                title: <span>Home</span>,
              },
              {
                title: <span>Setting</span>,
              },
              {
                title: <span>Manage Home</span>,
              },
            ]}
          />
        </Col>
        <Divider orientation="left" orientationMargin="0">
          <div className="title-page-font">{`Set Slide Image`}</div>
        </Divider>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Card className="grid grid-cols-1 ">
            <CreateSlideImage
              addFile={addFile}
              handleChangeAddFile={handleChangeAddFile}
              beforeUploadAddFiles={beforeUploadAddFiles}
              submitLoading={submitLoading}
              onfinishCreateSlide={onfinishCreateSlide}
              modalAddSlide={modalAddSlide}
              setModalAddSlide={setModalAddSlide}
              createSlideImageForm={createSlideImageForm}
            />

            <TableSlideImage
              loading={loading}
              slideImage={slideImage}
              handleDeleteSlideImage={handleDeleteSlideImage}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
