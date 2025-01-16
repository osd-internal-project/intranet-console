import { Card } from "antd";
import React from "react";

export interface props {
  getStartTime: number;
  getEndTime: number;
}

export const OvertimeShowDetail: React.FC<props> = ({ getStartTime, getEndTime }) => {
  return (
    <div>
      <Card>
        <div className=" text-blue-600  text-base font-bold">คำนวณเวลา</div>
        <div className=" flex ">
          <div className=" w-28">เวลาทั้งหมด (ชม.)</div>
          <div className=" ml-2 text-base">
            : {getStartTime < getEndTime ? getEndTime - getStartTime : 24 - getStartTime + getEndTime} {` ชม.`}
          </div>
        </div>
        <div className=" flex ">
          <div className=" w-28">เวลาพัก (ชม.) </div>
          <div className=" ml-2  text-base">
            {`: `}
            {getStartTime < getEndTime
              ? getEndTime - getStartTime > 4
                ? getEndTime - getStartTime > 4 && getEndTime - getStartTime < 5
                  ? 0.5
                  : 1
                : 0
              : 24 - getStartTime + getEndTime > 4
              ? 1
              : 0}
            {` ชม.`}
          </div>
        </div>
        <div className=" flex">
          <div className=" w-28">สรุปเวลา (ชม.) </div>
          <div className=" ml-2 text-base">
            {`: `}
            {getStartTime < getEndTime
              ? getEndTime - getStartTime > 4
                ? getEndTime - getStartTime > 4 && getEndTime - getStartTime < 5
                  ? getEndTime - getStartTime - 0.5
                  : getEndTime - getStartTime - 1
                : getEndTime - getStartTime
              : 24 - getStartTime + getEndTime > 4
              ? 24 - getStartTime + getEndTime - 1
              : 24 - getStartTime + getEndTime}
            {` ชม.`}
          </div>
        </div>
      </Card>
    </div>
  );
};
