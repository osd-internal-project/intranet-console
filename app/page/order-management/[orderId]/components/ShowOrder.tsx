import { ExclamationCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Table, Tag, Form, Input, message, Badge, Select, DatePicker, InputNumber, Popconfirm, Modal } from "antd";
import React, { useEffect, useState } from "react";
import OrderManagementServices from "../../services/order-management.service";
import { useAxiosStock } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ColumnsType } from "antd/lib/table";
import { ITypeOrderShow, ITypeOrderLot } from "../../common";
import { dateToStringTh, dateToStringThNoTime, numberWithCommas } from "@/app/utils/format";
import { checkRule } from "@/app/utils/rules";
export interface props {
  order: ITypeOrderShow;
  propData: (res: { loading: boolean }) => void;
}

const ShowOrder: React.FC<props> = ({ order, propData }): React.ReactElement => {
  const stockAuth = useAxiosStock();
  const cancelOrderRule = checkRule("sm-order-c");
  const successOrderRule = checkRule("sm-order-s");
  const orderManagementServices = OrderManagementServices(stockAuth);
  const [date, setDate] = useState<Date>(new Date());
  const [getcheckdoneButton, setcheckdoneButton] = useState<boolean>(false);
  const columns: ColumnsType<ITypeOrderLot> = [
    {
      title: "CAS NO.",
      dataIndex: "casNo",
      key: "casNo",
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productName",
      key: "productName",
      render: (data: string[]) => data,
    },
    {
      title: "LOT NO.",
      dataIndex: "lotNo",
      key: "lotNo",
    },
    {
      title: "DETAIL",
      dataIndex: "detailLot",
      key: "detailLot",
    },
    {
      title: "GROUP",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "IS EXPIRED",
      dataIndex: "expiredStatus",
      key: "expiredStatus",
      render: (status: boolean) => <Tag color={status ? "red" : "blue"}>{status ? "Expired" : "Not Expried"}</Tag>,
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      render: (d: number) => `${numberWithCommas(d)}`,
    },

    {
      title: "UNIT",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "TOTAL",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (d: number) => (
        <div>
          <> {numberWithCommas(d)}</> <p className="inline  font-thin text-gray-500"> THB</p>
        </div>
      ),
    },
  ];

  const onSendOrder = (id: number) => {
    setcheckdoneButton(true);
    Modal.confirm({
      title: "ยืนยันเสร็จสิ้นการเบิก ?",
      icon: <ExclamationCircleFilled />,
      content: "โปรดตรวจสอบข้อมูลก่อนกดยืนยัน",
      okText: "ยืนยัน",
      okButtonProps: {
        style: {
          backgroundColor: "#00a1df",
          borderColor: "#00a1df",
        },
      },
      cancelText: "ยกเลิก",
      onOk: async () => {
        orderManagementServices
          .updateStaus(id, "done")
          .then(() => {
            message.success("การเบิกเสร็จสิ้นแล้ว");
            propData({ loading: true });
            setcheckdoneButton(false);
          })
          .catch((err) => {
            message.error(err);
          });
      },
      onCancel() {
        setcheckdoneButton(false);
      },
    });
  };
  const onCancelOrder = (id: number) => {
    Modal.confirm({
      title: "ยืนยันการยกเลิกการเบิก ?",
      icon: <ExclamationCircleFilled />,
      content: "โปรดตรวจสอบข้อมูลก่อนกดยืนยัน",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        orderManagementServices
          .updateStaus(id, "cancel")
          .then(() => {
            message.success("การเบิกยกเลิกแล้ว");
            propData({ loading: true });
          })
          .catch((err) => {
            message.error(err);
          });
      },
      onCancel() {},
    });
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <Card className="col-span-5 md:col-span-5">
          <div className=" grid grid-cols-3">
            <div className=" col-span-2">
              <div className="sub-title-page-font ">{`Order ${order.orderId}`}</div>
              <div className=" text-gray-500">{`${dateToStringTh(order.createdAt)} `}</div>
            </div>
            <div className=" space-x-2 text-right">
              {order.status === "new" ? (
                <Button key={1}>
                  <Badge status="warning" text="New" />
                </Button>
              ) : order.status === "cancel" ? (
                <Button key={2}>
                  <Badge status="error" text="Cancel" />
                </Button>
              ) : (
                <Button key={3}>
                  <Badge status="success" text="Done" />
                </Button>
              )}
            </div>
          </div>
          <Form wrapperCol={{ span: 24 }} labelCol={{ flex: "150px" }} labelAlign="left" className=" w-full">
            <div className=" grid grid-cols-3 gap-2">
              <Form.Item label={"Product Form"}>
                <Input className="read-only-input-hide" value={order.inventoryName} />
              </Form.Item>
              <Form.Item label={"ผู้สร้างใบเบิก"}>
                <Input className="read-only-input-hide" value={order.createdByName} />
              </Form.Item>
              <Form.Item label={"Objective"}>
                <Input className="read-only-input-hide" value={order.objectiveName} />
              </Form.Item>
              <Form.Item label={"วันที่ต้องการ"}>
                <Input className="read-only-input-hide" value={dateToStringThNoTime(order.requestDate as any)} />
              </Form.Item>
              <Form.Item label={"ผู้ขอเบิก"}>
                <Input className="read-only-input-hide" value={order.requesterName} />
              </Form.Item>
              <Form.Item label={"Remark"}>
                <Input className="read-only-input-hide" value={order.remark} />
              </Form.Item>
            </div>
          </Form>
        </Card>
        <div className=" col-span-5 md:col-span-4  space-y-2">
          <Card className=" space-y-4">
            <div className=" mb-2">
              <div className="sub-title-page-font ">{`Requisition`}</div>
            </div>
            <div className=" flex space-x-2  mb-4 justify-end">{` `}</div>
            <div className=" w-full overflow-x-auto">
              <Table
                className=" w-full "
                dataSource={order.orderLot}
                columns={columns}
                rowKey={(e) => e.id}
                pagination={false}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ backgroundColor: "#fafafa" }}>
                      <Table.Summary.Cell index={0} className=" font-bold">
                        Total
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={5}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} className=" font-bold">
                        {numberWithCommas(order.totalQty)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} colSpan={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} className="flex  ">
                        <div className="font-bold m-0 ">
                          {numberWithCommas(order.totalPrice)} <p className=" inline font-thin  text-gray-500">THB</p>
                        </div>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
          </Card>
          {/* <Card>
            <div className=" mb-2">
              <div className="sub-title-page-font ">{`Fulfillment`}</div>
            </div>
          </Card> */}
        </div>
        <div className="col-span-5 md:col-span-1 space-y-2 ">
          <Card>Activity {order.status}</Card>
          <Card className="space-y-1 ">
            {order.status === "new" ? (
              <>
                <div className=" mb-2">
                  <div className=" flex justify-between">
                    <div className="font-bold">New Request</div>
                    <div className="text-gray-500">{dateToStringTh(date)}</div>
                  </div>
                  {/* <div className=" text-gray-500">{`${session?.user.firstNameTh} ${session?.user.lastNameTh}`}</div> */}
                </div>
                <div>
                  {successOrderRule ? (
                    <Button className=" w-full mb-2 button-blue" type="primary" onClick={() => onSendOrder(order.id)} loading={getcheckdoneButton}>
                      {`Done`}
                    </Button>
                  ) : (
                    <></>
                  )}
                  {cancelOrderRule ? <Button danger className=" w-full" onClick={() => onCancelOrder(order.id)}>{`Cancel Request`}</Button> : <></>}
                </div>
              </>
            ) : (
              <>
                <div className=" mb-2">
                  <div className=" flex justify-between">
                    <div className="font-bold">{order.status === "cancel" ? `Cancel` : `Done`}</div>
                    <div className="text-gray-500">{dateToStringTh(new Date())}</div>
                  </div>
                  {/* <div className=" text-gray-500">{`${session?.user.firstNameTh} ${session?.user.lastNameTh}`}</div> */}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default ShowOrder;
