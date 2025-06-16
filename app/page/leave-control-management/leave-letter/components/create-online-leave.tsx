"use client";
import React, { useEffect } from "react";
import { Card, UploadFile } from "antd";
import { IDataUser, ISelect, ITypeDataLeaveCreate } from "../../common";
import { RcFile } from "antd/es/upload";
import { FormInstance } from "antd/lib";
import { CreateLeaveForm } from "./create-online-leave-form";

export interface props {
  getUser?: IDataUser | null;
  getTypeLeaveOption: ISelect[];
  onfinishCreate: (values: ITypeDataLeaveCreate) => void;
  createdataleaveForm: FormInstance<ITypeDataLeaveCreate>;
  setStartDate: (values: Date) => void;
  setEndDate: (values: Date) => void;
  setCheckSwitch: (values: boolean) => void;
  getStartDate: Date | undefined;
  getEndDate: Date | undefined;
  checkSwitch: boolean | undefined;
  beforeUploadAttendFiles: (e: RcFile) => void;
  handleChangeAttendFiles: (e: any) => void;
  attendFiles: UploadFile[];
  getHeader: any;
  onChangeFormCreate: (values: any) => void;
}
export const CreateOnlineLeave: React.FC<props> = ({
  getUser,
  getTypeLeaveOption,
  onfinishCreate,
  createdataleaveForm,
  setStartDate,
  setEndDate,
  setCheckSwitch,
  getStartDate,
  getEndDate,
  checkSwitch,
  beforeUploadAttendFiles,
  handleChangeAttendFiles,
  attendFiles,
  getHeader,
  onChangeFormCreate,
}: any): React.ReactElement => {
  useEffect(() => {
    const getdatauser = () => {
      createdataleaveForm.setFieldsValue({
        userId: getUser?.userId,
        posId: getUser?.masterPosition?.posId,
        position: getUser?.masterPosition?.nameEn,
        firstNameTh: getUser?.firstNameTh,
        lastNameTh: getUser?.lastNameTh,
        groupName: getUser?.ownerGroup?.groupName,
        ownerName: getHeader ? getHeader.map((user: any) => `คุณ ${user.firstNameTh} ${user.lastNameTh}`).join(" , ") : "",
      });
    };
    getdatauser();
  }, [checkSwitch, getHeader]);

  return (
    <div>
      <Card className="w-full grid grid-cols-1 gap-y-2 mt-2">
        <CreateLeaveForm
          createdataleaveForm={createdataleaveForm}
          onfinishCreate={onfinishCreate}
          getTypeLeaveOption={getTypeLeaveOption}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          getStartDate={getStartDate}
          getEndDate={getEndDate}
          attendFiles={attendFiles}
          setCheckSwitch={setCheckSwitch}
          checkSwitch={checkSwitch}
          handleChangeAttendFiles={handleChangeAttendFiles}
          beforeUploadAttendFiles={beforeUploadAttendFiles}
          onChangeFormCreate={onChangeFormCreate}
        />
      </Card>
    </div>
  );
};
