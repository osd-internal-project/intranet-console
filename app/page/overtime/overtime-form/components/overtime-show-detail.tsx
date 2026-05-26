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
            {(() => {
              const duration = getStartTime < getEndTime ? getEndTime - getStartTime : 24 - getStartTime + getEndTime;
              return duration > 9 ? 1.5 : duration >= 5 ? 1 : duration > 4 ? 0.5 : 0;
            })()}
            {` ชม.`}
          </div>
        </div>
        <div className=" flex">
          <div className=" w-28">สรุปเวลา (ชม.) </div>
          <div className=" ml-2 text-base">
            {`: `}
            {(() => {
              const duration = getStartTime < getEndTime ? getEndTime - getStartTime : 24 - getStartTime + getEndTime;

              let result;
              if (duration > 9) {
                result = duration - 1.5;
              } else if (duration > 4 && duration < 5) {
                result = duration - 0.5;
              } else if (duration >= 5) {
                result = duration - 1;
              } else {
                result = duration;
              }
              return result;
            })()}
            {` ชม.`}
          </div>
        </div>
      </Card>
    </div>
  );
};
