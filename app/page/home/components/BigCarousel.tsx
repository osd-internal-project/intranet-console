import { Carousel } from "antd";
import React from "react";

export interface props {}
const BigCarouselComponent: React.FC<props> = (): React.ReactElement => {
  const contentStyle1: React.CSSProperties = {
    height: "450px",
    color: "#fff",
    lineHeight: "150px",
    textAlign: "center",
    background: "url('/images/homeImg/cover1.png') center center / cover no-repeat",
  };

  const contentStyle2: React.CSSProperties = {
    height: "450px",
    color: "#fff",
    lineHeight: "150px",
    textAlign: "center",
    background: "url('/images/homeImg/cover2.png') center center / cover no-repeat",
  };

  const contentStyle3: React.CSSProperties = {
    height: "450px",
    color: "#fff",
    lineHeight: "150px",
    textAlign: "center",
    background: "url('/images/homeImg/cover3.png') center center / cover no-repeat",
  };

  const contentStyle4: React.CSSProperties = {
    height: "450px",
    color: "#fff",
    lineHeight: "150px",
    textAlign: "center",
    background: "url('/images/homeImg/cover7.png') center center / cover no-repeat",
  };

  return (
    <Carousel autoplay arrows infinite>
      <div>
        <h3 style={contentStyle1}></h3>
      </div>
      <div>
        <h3 style={contentStyle2}></h3>
      </div>
      <div>
        <h3 style={contentStyle3}></h3>
      </div>
      <div>
        <h3 style={contentStyle4}></h3>
      </div>
    </Carousel>
  );
};

export default BigCarouselComponent;
