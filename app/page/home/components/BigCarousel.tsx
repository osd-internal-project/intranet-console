import { Carousel, Image } from "antd";
import React, { useState } from "react";
import { SlideImageType } from "../common";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import SlideImageService from "../services/index.service";
export interface Props {
  loading: boolean;
  slideImage: SlideImageType[];
  slideImages: Blob[];
}

export const BigCarouselComponent: React.FC<Props> = ({
  loading,
  slideImage,
  slideImages,
}) => {
  const intraAuth = useAxiosIntranet();
  const intraAuthService = SlideImageService(intraAuth);
  const baseImageUrl = process.env.BACKEND_INTRANET_URL;
  const [useFallback, setUseFallback] = useState(false);

  return (
    <Carousel
      autoplay={true}
      arrows
      infinite
      effect="fade"
      lazyLoad="progressive"
      responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }]}
      style={{
        width: "1640px",
        height: "925px",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      {slideImage?.map((image, index) => (
        <div key={index}>
          <Image
            src={`${baseImageUrl}/slide-image/${image.filePath}`}
            crossOrigin="anonymous"
            preview={false}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default BigCarouselComponent;
