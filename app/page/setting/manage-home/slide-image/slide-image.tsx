"use client";
import { Card, Col, message, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CreateSlideImage } from "./components/create-slide-image";
import { TableSlideImage } from "./components/table-slide-image";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import { SlideImageType } from "./common";
import ManageHomeService from "./services/index.service";
import { useForm } from "antd/es/form/Form";
import { RcFile } from "antd/es/upload";
import { UserContectType, UserContext } from "@/app/config/userContext";

export default function SlideImageSetting() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const Auth = useAxiosIntranet();
  const intraAuthService = ManageHomeService(Auth);
  const [slideImage, setSlideImage] = useState<SlideImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createSlideImageForm] = useForm();
  const [modalAddSlide, setModalAddSlide] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<any[]>([]);
  const [messages, messageHeader] = message.useMessage();

  useEffect(() => {
    if (loading) loadData();
  }, [loading]);

  const loadData = async () => {
    const dataSlideImage = await intraAuthService.getSlideImageByOrder();
    setSlideImage(dataSlideImage);
    setLoading(false);
  };

  const showModal = () => {
    createSlideImageForm.setFieldsValue({
      createByName: `${user?.firstNameTh || ""} ${user?.lastNameTh || ""}`,
    });
    setModalAddSlide(true);
  };

  const handleDeleteSlideImage = async (id: number) => {
    setSubmitLoading(true);
    try {
      await intraAuthService.deleteSlideImage(id);
      setSlideImage(slideImage.filter((item) => item.id !== id));
      messages.success("ลบข้อมูลรูปภาพสำเร็จ");
      setSubmitLoading(false);
    } catch (error) {
      messages.error("ลบข้อมูลรูปภาพไม่สำเร็จ");
    }
  };

  const beforeUploadAddFiles = (file: RcFile) => {
    if (slideImage.find((oneFile) => oneFile.fileName === file.name)) {
      messages.warning(`ชื่อไฟล์นี้ซ้ำ ${file.name} `);
      return false;
    }
    return false;
  };

  const onfinishCreateSlide = async (values: any) => {
    try {
      if (slideImage && slideImage.length >= 10) {
        messages.error("ไม่สามารถอัปโหลดได้ เนื่องจากรูปภาพครบ 10 รูปแล้ว !");
        return;
      }
      const newFileName = values.addFile.fileList[0].name;
      const isDuplicate = slideImage.some((image) => image.fileName === newFileName);
      if (isDuplicate) {
        messages.error("ไม่สามารถอัปโหลดไฟล์ที่มีชื่อซ้ำกันได้");
        return;
      }
      if (imageFiles.length > 0) {
        let createdByName = user?.firstNameTh && user?.lastNameTh ? `${user?.firstNameTh} ${user?.lastNameTh}` : "";
        let createdById = user?.userId;
        let formData: any = new FormData();
        formData.append("files", imageFiles[0].originFileObj);
        formData.append("createdByName", createdByName);
        formData.append("createdById", createdById);
        await intraAuthService.uploadImage(formData);
        createSlideImageForm.resetFields();
        messages.success("อัปโหลดรูปสำเร็จ");
      }
    } catch (error) {
      messages.error("การอัปโหลดล้มเหลว");
    } finally {
      setSubmitLoading(false);
      setModalAddSlide(false);
      setLoading(true);
      createSlideImageForm.resetFields();
    }
  };
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Card className="grid grid-cols-1 ">
          <CreateSlideImage
            submitLoading={submitLoading}
            onfinishCreateSlide={onfinishCreateSlide}
            modalAddSlide={modalAddSlide}
            setModalAddSlide={setModalAddSlide}
            createSlideImageForm={createSlideImageForm}
            showModal={showModal}
            setImageFiles={setImageFiles}
            imageFiles={imageFiles}
            slideImage={slideImage}
          />
          <TableSlideImage slideImage={slideImage} handleDeleteSlideImage={handleDeleteSlideImage} />
        </Card>
      </Col>
    </Row>
  );
}
