import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Card, Spin } from "antd";

const Loading: React.FC = () => (
  <div className=" flex justify-center">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  </div>
);

export default Loading;
