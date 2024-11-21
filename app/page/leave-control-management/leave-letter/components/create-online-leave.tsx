"use client";
import React, { useEffect } from "react";
import { Card, UploadFile } from "antd";
import { Dayjs } from "dayjs";
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
  // onChangeParams: (value: Dayjs, type: string) => void;
  groupDetail: any;
  groupUserId: any;
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
  // onChangeParams,
  groupDetail,
  groupUserId,
}: any): React.ReactElement => {
  useEffect(() => {
    const getdatauser = () => {
      if (groupUserId?.length) {
        const ownerName = groupUserId
          .filter((u: ITypeDataLeaveCreate) => u.firstNameTh && u.lastNameTh)
          .map((u: ITypeDataLeaveCreate) => `${u.firstNameTh} ${u.lastNameTh}`)
          .join(", ");
        ownerName && createdataleaveForm.setFieldsValue({ ownerName: ownerName, ownerId: groupUserId[0].userId });
      }

      createdataleaveForm.setFieldsValue({
        userId: getUser?.userId,
        posId: getUser?.position?.posId,
        position: getUser?.position?.nameEn,
        firstNameTh: getUser?.firstNameTh,
        lastNameTh: getUser?.lastNameTh,
        groupName: groupDetail.groupName,
      });
    };
    getdatauser();
  }, [checkSwitch, groupUserId]);

  return (
    <div>
      <Card className="w-full grid grid-cols-1 gap-y-2 mt-2">
        <CreateLeaveForm
          createdataleaveForm={createdataleaveForm}
          onfinishCreate={onfinishCreate}
          getTypeLeaveOption={getTypeLeaveOption}
          // onChangeParams={onChangeParams}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          getStartDate={getStartDate}
          getEndDate={getEndDate}
          attendFiles={attendFiles}
          setCheckSwitch={setCheckSwitch}
          checkSwitch={checkSwitch}
          handleChangeAttendFiles={handleChangeAttendFiles}
          beforeUploadAttendFiles={beforeUploadAttendFiles}
        />
      </Card>
    </div>
  );
};
