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
  submitLoading: boolean;
}

export const BigCarouselComponent: React.FC<Props> = ({

}) => {
  const intraAuth = useAxiosIntranet();
  const slideImageService = SlideImageService(intraAuth);


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
