import React, { useEffect } from "react";
import { Button, Card, DatePicker, Form, Input } from "antd";
import { exportIcon } from "@/components/icon";
import { useForm } from "antd/es/form/Form";
const { RangePicker } = DatePicker;
export interface props {
  exportMa: (filter: any) => void;
  searchMa: (filter: any) => void;
}

const MaFilterComponent: React.FC<props> = ({ exportMa, searchMa }): React.ReactElement => {
  const [filterForm] = useForm();
  const handdleExport = () => {
    let form = filterForm.getFieldsValue();
    for (let key in filterForm) {
      if (form[key] === undefined || form[key] === "") {
        delete form[key];
      }
    }
    exportMa(form);
  };
  const handdleSearch = (form: any) => {
    for (let key in filterForm) {
      if (form[key] === undefined || form[key] === "") {
        delete form[key];
      }
    }
    searchMa(form);
  };
  return (
    <>
      <Card title="Filter" size="small">
        <Form size="small" layout="vertical" onFinish={handdleSearch} form={filterForm}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Form.Item name={"maName"} label={"MA Name"}>
              <Input />
            </Form.Item>
            <Form.Item name={"maDate"} label={"วันที่นัดหมาย"}>
              <RangePicker className=" w-full" format={"DD/MM/YYYY"} allowClear={true} />
            </Form.Item>
            <Form.Item name={"contact"} label={"ผู้นัดหมาย"}>
              <Input />
            </Form.Item>
          </div>
          <div className=" flex justify-end space-x-2">
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button type="primary" ghost icon={exportIcon} onClick={handdleExport}>
              {`Export`}
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default MaFilterComponent;
