import {
  Button,
  Carousel,
  Form,
  Modal,
  Popconfirm,
  Space,
  Table,
  Upload,
  Image,
} from "antd";
import React from "react";
import { SlideImageType } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import SlideImageService from "../services/index.service";

export interface Props {
  loading: boolean;
  slideImage: SlideImageType[];
}

export const BigCarouselComponent: React.FC<Props> = ({
  loading,
  slideImage,
}) => {
  const intraAuth = useAxiosIntranet();
  const slideImageService = SlideImageService(intraAuth);

  return (
    <Carousel
      autoplay={true}
      arrows
      infinite
      effect="fade"
      lazyLoad="progressive"
      responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }]}
    >
      {slideImage.map((image, index) => (
        <div key={index}>
          <Image
            src={`http://localhost:4003/api/slide-image/${image.filePath}`}
            crossOrigin="anonymous"
            preview={false}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default BigCarouselComponent;
