import { Carousel, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { SlideImageType } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import SlideImageService from "../services/index.service";

export interface Props {
  slideImage: SlideImageType[];
  isModalVisible: boolean;
  setIsModalVisible: (e: boolean) => void;
}

export const BigCarouselComponent: React.FC<Props> = ({
  slideImage,
  isModalVisible,
  setIsModalVisible,
}) => {
  const intraAuth = useAxiosIntranet();
  const slideImageService = SlideImageService(intraAuth);

  // console.log(slideImage);

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
          onClick={() => setIsModalVisible(true)}
        >
          AddSlide
        </button>
      </div>

      <Modal
        title="Add Slide"
        open={isModalVisible}
        // onOk={handleOk}
        // onCancel={handleCancel}
        onOk={() => setIsModalVisible(true)}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      ></Modal>

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
