import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, FormInstance, Input, Modal, Row, Select, Upload, type SelectProps, type UploadProps } from "antd";
import React from "react";

export interface props {
  handleModalOpen: (open: boolean, type: "create" | "edit" | "delete" | "close", data: any) => void;
  handleModal: { open: boolean; type: "create" | "edit" | "delete" | "close"; data: any };
  ManageForm: FormInstance;
  onfinish: (type: "create" | "edit" | "delete" | "close", values: any) => void;
  getUploadProps: () => UploadProps;
}

const ManageRestaurant: React.FC<props> = ({ handleModalOpen, handleModal, ManageForm, onfinish, getUploadProps }): React.ReactElement => {
  return (
    <div>
      <Modal
        title="เพิ่มร้านอาหาร"
        closable={{ "aria-label": "Custom Close Button" }}
        open={handleModal.open}
        onCancel={() => handleModalOpen(false, "close", null)}
        footer={null}
        width={800}
        style={{ top: 10 }}
      >
        <Form form={ManageForm} autoComplete="off" layout={"vertical"} onFinish={(e) => onfinish(handleModal.type, e)}>
          <Form.Item name={`name`} label={`ชื่อร้านอาหาร`}>
            <Input />
          </Form.Item>
          <Form.Item name={`menu`} label={`รายการอาหาร`}>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="พิมพ์แล้วกด Enter หรือ ,"
              onChange={(value) => console.log(value)}
              tokenSeparators={[","]}
            />
          </Form.Item>
          <Form.Item name={`pricing`} label={`ราคา`}>
            <Input />
          </Form.Item>
          <Form.Item name={`category`} label={`หมวดหมู่`}>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="พิมพ์แล้วกด Enter หรือ ,"
              onChange={(value) => console.log(value)}
              tokenSeparators={[","]}
            />
          </Form.Item>
          <Form.List name="contact">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <div key={key}>
                      <Row gutter={[8, 8]}>
                        <Col span={8}>
                          <Form.Item {...restField} name={[name, "type"]} label="ช่องทางติดต่อ" rules={[{ required: true }]}>
                            <Select
                              showSearch
                              allowClear
                              optionFilterProp="label"
                              placeholder="Please Select"
                              options={[
                                { label: "Line", value: "line" },
                                { label: "Facebook", value: "facebook" },
                                { label: "เบอรโทรศัพท์", value: "phoneNumber" },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item {...restField} name={[name, "userId"]} label="เบอร์ / ชื่อ / Id" rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <div className="flex justify-end items-center ">
                          <Button
                            danger
                            type="link"
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              remove(name);
                            }}
                          />
                        </div>
                      </Row>
                    </div>
                  );
                })}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="w-full my-2">
                  เพิ่มช่องทางติดต่อ
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item name={`remark`} label={`note`}>
            <Input.TextArea showCount maxLength={250} />
          </Form.Item>
          <Form.Item name={`files`} label={`ไฟล์ PDF`}>
            <Upload {...getUploadProps()} listType="picture-card" maxCount={1}>
              {"+ Upload"}
            </Upload>
          </Form.Item>
          <Button htmlType="submit" type="primary">{`ยืนยัน`}</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageRestaurant;
