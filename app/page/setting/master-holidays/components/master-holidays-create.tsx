"use client";
import React from "react";
import { Button, Col, DatePicker, Form, Modal, Row } from "antd";
import { ICreateMasterHolidayYearDto, IManagePageYear } from "../common";
import { FormInstance } from "antd/lib";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import MasterHolidaysService from "../services/index.service";
import dayjs from "dayjs";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";

export interface props {
  onFinishCreate: (event: ICreateMasterHolidayYearDto) => void;
  setManageStatusYear: (value: IManagePageYear) => void;
  manageStatusYear: IManagePageYear;
  formCreate: FormInstance;
}

export const CreateMasterHolidays: React.FC<props> = ({ onFinishCreate, setManageStatusYear, manageStatusYear, formCreate }): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(loadAppConfig().REACT_APP_API_BASE_URL_INTRANET);
  const masterholidaysService = MasterHolidaysService(baseUrIntranet);
  const validateName = (name: string): Promise<string | undefined> => masterholidaysService.validateNameYear(name);
  return (
    <div>
      <Modal
        title={`${manageStatusYear.statusAction} year`}
        open={manageStatusYear.statusModal}
        onCancel={() => {
          setManageStatusYear({ statusModal: false }), formCreate.resetFields();
        }}
        footer={false}>
        <Form layout="vertical" form={formCreate} autoComplete="off" onFinish={onFinishCreate}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Form.Item<ICreateMasterHolidayYearDto>
                className=" mb-0"
                label="ปี:"
                name="holidaysYear"
                rules={[
                  { required: true },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        const year = dayjs(value).format("YYYY");
                        const validationFailReason = await validateName(year);
                        if (validationFailReason) {
                          throw new Error(validationFailReason);
                        }
                      }
                    },
                  },
                ]}>
                <DatePicker className="w-full" picker="year" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className=" flex justify-end space-x-4 mt-2">
              <Button
                onClick={() => {
                  setManageStatusYear({ statusModal: false }), formCreate.resetFields();
                }}>{`Cancel`}</Button>
              <Button type="primary" htmlType="submit">
                {`Add`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <div className="flex justify-end mb-5">
        <Button
          type="primary"
          onClick={() => {
            setManageStatusYear({ statusModal: true, statusAction: "create" });
          }}>{`Add Year`}</Button>
      </div>
    </div>
  );
};
