import { Card, Carousel, ConfigProvider, Image } from "antd";
import React from "react";
import { SlideImageType } from "../common";
export interface Props {
  slideImage: SlideImageType[];
}

export const BigCarouselComponent: React.FC<Props> = ({ slideImage }) => {
  return (
    <Card styles={{ body: { padding: 0 } }}>
      {slideImage?.length > 0 ? (
        <div
          className="relative w-full "
          style={{
            minHeight: "500px",
          }}>
          <Carousel autoplay effect="fade" dots infinite adaptiveHeight={true}>
            {slideImage.map((image) => (
              // <div key={image.id}>
              //   <img
              //     src={`${process.env.NEXT_PUBLIC_API_BASE_URL_INTRANET}/slide-image/get-file/${image.fileId}`}
              //     loading="lazy"
              //     className="w-full h-full object-cover"
              //     crossOrigin="anonymous"
              //   />
              // </div>
              <ConfigProvider theme={{ components: { Carousel: { arrowSize: 35 } } }}>
                <Carousel autoplay={true} adaptiveHeight={true} arrows infinite effect="fade" lazyLoad="ondemand">
                  {slideImage.map((image) => {
                    return (
                      <div key={image.id}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL_INTRANET}/slide-image/get-file/${image.fileId}`}
                          loading="lazy"
                          style={{
                            objectFit: "cover",
                            aspectRatio: "21/9",
                            width: "100%",
                          }}
                          crossOrigin="anonymous"
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </ConfigProvider>
            ))}
          </Carousel>
        </div>
      ) : (
        <div style={{ padding: "450px", color: "#888" }}>No images available</div>
      )}
    </Card>
  );
};

export default BigCarouselComponent;
