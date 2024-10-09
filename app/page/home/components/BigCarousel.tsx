import { Card, Carousel, ConfigProvider, Image } from "antd";
import React, { useState } from "react";
import { SlideImageType } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import SlideImageService from "../services/index.service";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
export interface Props {
  loading: boolean;
  slideImage: SlideImageType[];
}

export const BigCarouselComponent: React.FC<Props> = ({
  loading,
  slideImage,
}) => {
  const intraAuth = useAxiosIntranet();
  const intraAuthService = SlideImageService(intraAuth);
  const baseImageUrl = process.env.BACKEND_INTRANET_URL;

  return (
    <Card
      className="  text-center   bg-zinc-300 bg-opacity-80"
      styles={{ body: { paddingBottom: 0, paddingTop: 0 } }}
    >
      <ConfigProvider theme={{ components: { Carousel: { arrowSize: 35 } } }}>
        <Carousel
          autoplay={true}
          adaptiveHeight={true}
          arrows
          // prevArrow={<CaretLeftOutlined />}
          infinite
          effect="fade"
          lazyLoad="progressive"
        >
          {slideImage?.map((image, index) => (
            <div key={image.id}>
              <Image
                src={`${baseImageUrl}/slide-image/${image.filePath}`}
                crossOrigin="anonymous"
                preview={false}
                style={{ height: "100%" }}
              />
            </div>
          ))}
        </Carousel>
      </ConfigProvider>
    </Card>
  );
};

export default BigCarouselComponent;
