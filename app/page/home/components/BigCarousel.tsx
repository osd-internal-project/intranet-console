import { Card, Carousel, ConfigProvider, Image } from "antd";
import React from "react";
import { SlideImageType } from "../common";
import { errImage } from "@/app/config/data";
export interface Props {
  slideImage: SlideImageType[];
}

export const BigCarouselComponent: React.FC<Props> = ({ slideImage }) => {
  const baseImageUrl = process.env.BACKEND_INTRANET_URL;

  return (
    <Card styles={{ body: { padding: 0 } }}>
      {slideImage?.length > 0 ? (
        <ConfigProvider theme={{ components: { Carousel: { arrowSize: 35 } } }}>
          <Carousel
            autoplay={true}
            adaptiveHeight={true}
            arrows
            infinite
            effect="fade"
            lazyLoad="progressive"
          >
            {slideImage.map((image) => (
              <div key={image.id}>
                <Image
                  src={
                    `${baseImageUrl}/slide-image/${image.filePath}`
                      ? `${baseImageUrl}/slide-image/${image.filePath}`
                      : errImage
                  }
                  // fallback={errImage}
                  crossOrigin="anonymous"
                  style={{
                    objectFit: "cover",
                    aspectRatio: "16/3",
                  }}
                  preview={false}
                  width={"100%"}
                  // height={300}
                />
              </div>
            ))}
          </Carousel>
        </ConfigProvider>
      ) : (
        <div style={{ padding: "450px", color: "#888" }}>
          No images available
        </div>
      )}
    </Card>
  );
};

export default BigCarouselComponent;
