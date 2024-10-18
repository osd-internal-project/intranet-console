"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, Row, message } from "antd";
import { CreateSlideImage } from "./components/create-slide-image";
import { TableSlideImage } from "./components/table-slide-image";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import ManageHomeService from "./services/index.service";
import { SlideImageType } from "./common";
import { RcFile, UploadProps } from "antd/es/upload";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";

export default function TypeLeave() {
  const { data: session } = useSession();
  const Auth = useAxiosIntranet();
  const intraAuthService = ManageHomeService(Auth);
  const [slideImage, setSlideImage] = useState<SlideImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addFile, setAddFile] = useState<any[]>([]);
  const [createSlideImageForm] = useForm();
  const [modalAddSlide, setModalAddSlide] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<any[]>([]);

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
      createByName: `${session?.user.firstNameTh || ""} ${
        session?.user.lastNameTh || ""
      }`,
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

  const handleChangeAddFile: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    return setAddFile(newFileList);
  };

  const onfinishCreateSlide = async (values: any) => {
    try {
      if (slideImage && slideImage.length >= 10) {
        message.error("ไม่สามารถอัปโหลดได้ เนื่องจากรูปภาพครบ 10 รูปแล้ว !");
        return;
      }
      const newFileName = values.addFile.fileList[0].name;
      const isDuplicate = slideImage.some(
        (image) => image.fileName === newFileName
      );
      if (isDuplicate) {
        message.error("ไม่สามารถอัปโหลดไฟล์ที่มีชื่อซ้ำกันได้");
        return;
      }
      if (imageFiles.length > 0) {
        let createdByName =
          session?.user.firstNameTh && session?.user.lastNameTh
            ? `${session.user.firstNameTh} ${session.user.lastNameTh}`
            : "";
        let createdById = session?.user.userId;
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
              showModal={showModal}
              setImageFiles={setImageFiles}
              imageFiles={imageFiles}
              slideImage={slideImage}
            />
            <TableSlideImage
              slideImage={slideImage}
              handleDeleteSlideImage={handleDeleteSlideImage}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
