import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Table, Tag, Form, Input, message, Badge, Select, DatePicker, InputNumber, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import OrderManagementServices from "../../services/order-management.service";
import { useAxiosStock, useAxiosUser } from "@/app/lib/axios/hooks/userAxiosAuth";
import { ColumnsType } from "antd/lib/table";
import { ITypeOption, ITypeOrderLotForm } from "../../common";
import { dateToStringTh, dateToStringThNoTime, numberWithCommas } from "@/app/utils/format";
import { deleteIcon } from "@/components/icon";
import { useSession } from "next-auth/react";
import { SearchStockTable } from "./SearchStockTable";
import { useRouter } from "next/navigation";
import UserServices from "../../services/user.service";
export interface props {
  department?: { value: number; label: string };
  inventory?: ITypeOption[];
}

interface ITypeObjective {
  id: number;
  name: string;
}
interface ITypeRequester {
  id: number;
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
  ownerGroup: {
    groupId: string;
    groupName: string;
  };
}
const AddOrder: React.FC<props> = ({ department, inventory }): React.ReactElement => {
  const router = useRouter();
  const { data: session } = useSession();
  const stockAuth = useAxiosStock();
  const userAuth = useAxiosUser();
  const orderManagementServices = OrderManagementServices(stockAuth);
  const userServices = UserServices(userAuth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [inventorySelected, setInventorySelected] = useState<ITypeOption>();
  const [openModal, setOpenModal] = useState(false);
  const [objectiveOption, setObjectiveOption] = useState<ITypeOption[]>([]);
  const [requester, setRequester] = useState<ITypeRequester[]>([]);
  const [objectiveSelected, setObjectiveSelected] = useState<ITypeObjective>();
  const [selectedProduct, setSelectedProduct] = useState<ITypeOrderLotForm[]>([]);
  const [totalQty, setTotalQty] = useState<number>(0);
  const [difLotId, setDifLotId] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [buttonLoading, setbuttonLoading] = useState<boolean>(false);
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    setInventorySelected(undefined);
    setSelectedProduct([]);
    setDifLotId([]);
    form.resetFields();
    setTotalQty(0);
    setTotalPrice(0);
  }, [department]);
  useEffect(() => {
    setSelectedProduct([]);
    setDifLotId([]);
  }, [inventorySelected]);

  const loadData = async () => {
    setLoading(true);
    const req = await userServices.getRequestUsers();
    const objectives = await orderManagementServices.getMasterObjectiveAll();
    const objoption = objectives.map((objective: ITypeObjective) => ({ value: objective.id, label: objective.name }));
    setObjectiveOption(objoption);
    setRequester(req);
    setLoading(false);
  };
  const propDataManage = (e: { openModal: boolean; selectedProduct?: ITypeOrderLotForm }) => {
    setOpenModal(e.openModal);
    if (e.selectedProduct) {
      const selected = [...selectedProduct, e.selectedProduct];
      setSelectedProduct(selected);
      const difId = selected.map((data) => data.inventoryLotId);
      setDifLotId(difId);
    }
  };
  const submitForm = () => {
    form.submit();
  };
  const onFinish = async (value: any) => {
    setbuttonLoading(true);
    let requestForm = null as ITypeRequester | null;
    if (value.requester) {
      requestForm = requester.filter((req: ITypeRequester) => req.userId === value.requester)[0];
    }
    const requestName = requestForm?.userId ? `${requestForm?.firstNameTh} ${requestForm?.lastNameTh}` : "";

    const form = {
      createdById: session?.user.userId,
      createdByName: `${session?.user?.firstNameTh} ${session?.user?.lastNameTh}`,
      objectiveId: objectiveSelected?.id,
      objectiveName: objectiveSelected?.name,
      requestDate: value.requestDate,
      requesterId: requestForm?.userId,
      requesterName: requestName,
      requesterGroupId: requestForm?.ownerGroup.groupId,
      requesterGroupName: requestForm?.ownerGroup.groupName,
      remark: value.remark,
      inventory: { connect: { id: value.inventoryId } },
      inventoryName: inventorySelected?.label,
      locationId: department?.value,
      locationName: department?.label,
      totalPrice: totalPrice,
      totalQty: totalQty,
      ownerGroup: session?.user?.ownerGroup,
    };

    const orderLots = selectedProduct;
    await orderManagementServices
      .create(form, orderLots)
      .then(() => {
        message.success("success");
        router.push(`/page/order-management`);
      })
      .catch((err) => {
        message.error(err);
      });
    setbuttonLoading(false);
  };

  const onChangeInventory = (value: number) => {
    if (inventory) {
      const selectedInventory = inventory.find((option) => option.value === value);
      setInventorySelected(selectedInventory);
    }
  };
  const selectObejectiveOption = async (id: number) => {
    const selected = objectiveOption.find((d: ITypeOption) => d.value === id);
    if (selected) {
      setObjectiveSelected({ id: selected.value, name: selected.label });
    }
  };
  const columns: ColumnsType<ITypeOrderLotForm> = [
    {
      title: "CAS NO.",
      dataIndex: "casNo",
      key: "id",
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "masterProductDetails",
      key: "id",
      render: (data: { name: string }[]) =>
        data.map((d, i) => (
          <React.Fragment key={i}>
            <Tag color="blue" className=" mb-1">
              {d.name}
            </Tag>
            <br />
          </React.Fragment>
        )),
    },

    { title: "LOT NO.", dataIndex: "lotNo", key: "lotNo" },
    { title: "DETAIL", dataIndex: "detailLot", key: "detailLot" },

    {
      title: "GROUP",
      dataIndex: "groupName",
      key: "id",
    },
    {
      title: "IS EXPIRED",
      dataIndex: "expiredStatus",
      key: "id",
      render: (status: boolean) => <Tag color={status ? "red" : "blue"}>{status ? "Expired" : "Not Expried"}</Tag>,
    },
    { title: "EXPIRY DATE", dataIndex: "expiryDate", key: "expiryDate", render: (date: Date) => dateToStringThNoTime(date) },
    {
      title: "QTY",
      dataIndex: "id",
      key: "id",
      render: (data: string, row: ITypeOrderLotForm, index: number) => {
        return (
          <InputNumber
            key={index}
            defaultValue={row.qty !== 0 ? row.qty : 0}
            max={row.balance ? row.balance : 0}
            min={0}
            onChange={(value) => {
              value !== 0 ? onChangeQty(index, value, row.balance) : onChangeQty(index, 0, row.balance);
            }}
          />
        );
      },
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "id",
      render: (data: number, row: any, i: number) => (data ? numberWithCommas(data) : numberWithCommas(0)),
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      key: "id",
    },
    {
      title: "TOTAL",
      dataIndex: "orderPrice",
      key: "id",
      render: (data: number, row: any, i: number) => (data ? numberWithCommas(data) : numberWithCommas(0)),
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (id: number, row: any, index: number) => (
        <Popconfirm title="ยืนยันการลบ ?" onConfirm={() => handleDeleteRow(index)}>
          <Button danger type="link">
            {deleteIcon}
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const onChangeQty = (index: number, qty: any, balance: any) => {
    setSelectedProduct((prevItems) => {
      const newItems = [...prevItems];
      if (qty) {
        newItems[index].qty = Number(qty);
        newItems[index].orderPrice = Number(Number(qty.toFixed(2)) * Number(newItems[index].price.toFixed(2)));
      } else {
        newItems[index].qty = Number(0);
        newItems[index].orderPrice = Number(Number(0.0) * Number(newItems[index].price.toFixed(2)));
      }
      return newItems;
    });
    const totalQty = selectedProduct.reduce((total, cerrent) => {
      return total + cerrent.qty;
    }, 0);
    setTotalQty(totalQty);
    const totalPrice = selectedProduct.reduce((total, cerrent) => {
      return total + cerrent.orderPrice;
    }, 0);
    setTotalPrice(totalPrice);
  };

  const onReCheckRow = (index: React.Key) => {
    const newData = selectedProduct.filter((d, i) => i !== index);
    setSelectedProduct(newData);
    const totalQty = newData.reduce((total, cerrent) => {
      return total + cerrent.qty;
    }, 0);
    setTotalQty(totalQty);
    const totalPrice = newData.reduce((total, cerrent) => {
      return total + cerrent.orderPrice;
    }, 0);
    setTotalPrice(totalPrice);
  };

  const handleDeleteRow = (index: React.Key) => {
    onReCheckRow(index);
    const difId = difLotId.filter((d, i) => i !== index);
    setDifLotId(difId);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <Card className="col-span-5 md:col-span-5">
          <div className=" grid grid-cols-3">
            <div className=" col-span-2">
              <div className="sub-title-page-font ">{`Order`}</div>
              <div className=" text-gray-500">{`${dateToStringTh(new Date())} `}</div>
            </div>
            <div className=" space-x-2 text-right">
              <Button>
                <Badge status="warning" text="New" />
              </Button>
            </div>
          </div>
          <Form className=" w-full" form={form} onFinish={onFinish} layout="horizontal" wrapperCol={{ span: 24 }} labelCol={{ flex: "120px" }} labelAlign="left">
            <div className=" grid grid-cols-3 gap-2">
              <Form.Item label={"Product Form"} name={"inventoryId"} rules={[{ required: true, message: "กรุณาเลือกคลัง" }]}>
                <Select
                  placeholder="Please Select"
                  options={inventory}
                  onChange={(e) => {
                    onChangeInventory(e);
                  }}
                />
              </Form.Item>
              <Form.Item label={"ผู้สร้างใบเบิก"} name={"createdByName"} initialValue={`${session?.user?.firstNameTh} ${session?.user?.lastNameTh}`}>
                <Input disabled className="read-only-input-disable " />
              </Form.Item>
              <Form.Item label={"Objective"} name={"objectiveId"} rules={[{ required: true, message: "กรุณาเลือกเหตุผลการเบิก" }]}>
                <Select options={objectiveOption} onChange={selectObejectiveOption} placeholder="Please Select" />
              </Form.Item>
              <Form.Item label={"วันที่ต้องการ"} name={"requestDate"} rules={[{ required: true, message: "กรุณาเลือกวันที่ต้องการ" }]}>
                <DatePicker className=" w-full" placeholder="Please Select" />
              </Form.Item>
              <Form.Item label={"ผู้ขอเบิก (ถ้ามี)"} name={"requester"}>
                <Select
                  placeholder="Please Select"
                  options={requester.map((req: ITypeRequester) => ({
                    value: req.userId,
                    label: `${req.firstNameTh} ${req.lastNameTh} (${req.ownerGroup?.groupName})`,
                  }))}
                  allowClear
                />
              </Form.Item>
              <Form.Item label={"Remark"} name={"remark"}>
                <Input placeholder="Please Enter" />
              </Form.Item>
            </div>
          </Form>
        </Card>
        <div className=" col-span-5 md:col-span-4  space-y-2">
          <Card className=" space-y-4">
            <div className=" mb-2">
              <div className="sub-title-page-font ">{`Requisition`}</div>
            </div>
            <div className=" flex space-x-2  mb-4 justify-end">
              <Button
                className="button-blue"
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  if (inventorySelected?.value) {
                    setOpenModal(true);
                  } else {
                    message.warning("กรุณาเลือก Product Form ");
                  }
                }}
              >
                {`ค้นหาเพื่อเลือกเบิก`}
              </Button>
            </div>
            <div className=" w-full overflow-x-auto">
              <Table
                className=" w-full "
                dataSource={selectedProduct}
                columns={columns}
                scroll={{ x: "calc(800px + 80%)" }}
                rowKey={(e) => e.inventoryLotId}
                pagination={false}
                summary={() => (
                  <Table.Summary>
                    <Table.Summary.Row style={{ backgroundColor: "#fafafa" }}>
                      <Table.Summary.Cell index={0} className=" font-bold">
                        Total
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={6}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} className=" font-bold">
                        {numberWithCommas(totalQty)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} className=" font-bold">
                        {numberWithCommas(totalPrice)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={1}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
          </Card>
        </div>

        <div className="col-span-5 md:col-span-1 space-y-2 ">
          <Card>Activity </Card>
          <Card className="space-y-1 ">
            <div className=" mb-2">
              <div className=" flex justify-between">
                <div className=" font-bold">New Request</div>
                <div className=" text-gray-500">{dateToStringTh(new Date())}</div>
              </div>
              <div className=" text-gray-500">{`${session?.user.firstNameTh} ${session?.user.lastNameTh}`}</div>
            </div>
            <Button className=" w-full mb-2 button-blue" type="primary" loading={buttonLoading} onClick={submitForm}>
              {`Send Request`}
            </Button>
            <Button className=" w-full" onClick={() => router.back()}>{`Cancel`}</Button>
          </Card>
        </div>
      </div>
      {inventorySelected && openModal === true ? (
        <SearchStockTable difLotId={difLotId} openModal={openModal} inventoryId={inventorySelected.value} propDataManage={propDataManage} selectedProduct={selectedProduct} />
      ) : (
        <></>
      )}
    </>
  );
};

export default AddOrder;
