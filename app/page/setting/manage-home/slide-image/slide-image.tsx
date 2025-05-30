"use client";
import React, { useContext, useEffect, useState } from "react";
import { Card, Col, message, Row } from "antd";
import { CreateSlideImage } from "./components/create-slide-image";
import { TableSlideImage } from "./components/table-slide-image";
import { SlideImageType } from "./common";
import ManageHomeService from "./services/index.service";
import { useForm } from "antd/es/form/Form";
import { RcFile } from "antd/es/upload";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export default function SlideImageSetting() {
  const { user } = (useContext(UserContext) as UserContectType) || { user: null };
  const { id24Axios } = useId24();
  const baseUrlIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const intraAuthService = ManageHomeService(baseUrlIntranet);
  const [slideImage, setSlideImage] = useState<SlideImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createSlideImageForm] = useForm();
  const [modalAddSlide, setModalAddSlide] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<any[]>([]);

  useEffect(() => {
    if (loading) loadData();
  }, [loading]);

  const loadData = async () => {
    const dataSlideImage = await ManageHomeService(baseUrlIntranet).getSlideImageByOrder();
    console.log(dataSlideImage);
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

  const onfinishCreateSlide = async (values: any) => {
    try {
      if (slideImage && slideImage.length >= 10) {
        message.error("ไม่สามารถอัปโหลดได้ เนื่องจากรูปภาพครบ 10 รูปแล้ว !");
        return;
      }
      const newFileName = values.addFile.fileList[0].name;
      const isDuplicate = slideImage.some((image) => image.fileName === newFileName);
      if (isDuplicate) {
        message.error("ไม่สามารถอัปโหลดไฟล์ที่มีชื่อซ้ำกันได้");
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
        message.success("อัปโหลดรูปสำเร็จ");
      }
    } catch (error) {
      message.error("การอัปโหลดล้มเหลว");
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
