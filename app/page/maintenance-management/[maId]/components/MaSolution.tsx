import React, { useState } from "react";
import type { BadgeProps, CalendarProps, TableColumnsType, TableColumnType } from "antd";
import { Badge, Button, Calendar, Card, DatePicker, Divider, Form, Input, Modal, Select, Switch, Table, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { ColumnType } from "antd/es/table";
import { dateToStringTh, dateToStringThNoTime } from "@/app/utils/format";
import { ITMaDetail, ITMaTask, ITMaType, ITMaUpdateForm } from "../../common";
import TextArea from "antd/es/input/TextArea";

export interface props {
  data: ITMaTask;
}

const MaDescriptionComponent: React.FC<props> = ({ data }): React.ReactElement => {
  const [checkNextTask, setCheckNextTask] = useState<boolean>(false);

  return (
    <>
      <h2>ผลการดำเนินการ</h2>
      <div className="grid  grid-cols-1 md:grid-cols-3">
        <div className="grid  grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">วันที่ดำเนินการ :</div>
          <div className=" col-span-2"> {data.actionDate ? dateToStringThNoTime(data.actionDate) : ""}</div>
        </div>
        <div className="grid  grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">วันที่อัพเดท :</div>
          <div className=" col-span-2"> {data.updatedAt ? dateToStringThNoTime(data.updatedAt) : ""}</div>
        </div>
        <div className="grid  grid-cols-3 mb-2">
          <div className=" col-span-1 font-bold">ผู้อัพเดท :</div>
          <div className=" col-span-2"> {data.updatedByName}</div>
        </div>
        <div>
          <div className=" col-span-1 font-bold">สรุปผลการดำเนินการ :</div>
          <div className=" col-span-2">{data.solution}</div>
        </div>
      </div>
    </>
  );
};

export default MaDescriptionComponent;
