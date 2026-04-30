import type { ITypeMasterRestaurant } from "@/app/common/master-restaurant";
import { Button, Card, Popover, Space, Table, TablePaginationConfig, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";

export interface props {
  data: { data: ITypeMasterRestaurant[]; count: number };
  pagination: TablePaginationConfig;
  onChangePagination: (pagination: TablePaginationConfig) => void;
  handleModalOpen: (status: boolean, type: "create" | "edit", data: any) => void;
  downloadFile: (fileName: string) => void;
  handleDelete: (id: number) => void;
  setLoading: (value: boolean) => void;
}

const TableRestaurant: React.FC<props> = ({
  data,
  pagination,
  onChangePagination,
  handleModalOpen,
  downloadFile,
  handleDelete,
  setLoading,
}): React.ReactElement => {
  const [openRowId, setOpenRowId] = React.useState<any>(null);
  const columns: ColumnsType<ITypeMasterRestaurant> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "ชื่อร้าน",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เมนู",
      dataIndex: "menu",
      key: "menu",
      render: (menu: any[]) => {
        return (
          <Space size={[4, 8]} wrap>
            {menu?.map((item, index) => (
              <Tag color="blue" key={index}>
                {`${item.name} (${item.pricing} บ.)`}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "หมวดหมู่",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        const values = category ? Object.values(category) : [];
        return (
          <Space size={[4, 8]} wrap>
            {values.map((item: any, index) => (
              <Tag color="blue" key={index}>
                {item}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "ติดต่อ",
      dataIndex: "contact",
      key: "contact",
      render: (contact) => {
        if (!contact) return "-";

        const iconMap: Record<string, { icon: string; color: string; bg: string; label: string }> = {
          line: {
            icon: "💬",
            color: "#06C755",
            bg: "#E8F9EE",
            label: "LINE",
          },
          phoneNumber: {
            icon: "📞",
            color: "#1677ff",
            bg: "#E6F1FF",
            label: "Phone",
          },
          facebook: {
            icon: "👤",
            color: "#1877F2",
            bg: "#EBF2FD",
            label: "Facebook",
          },
        };

        const entries = Array.isArray(contact) ? contact : Object.entries(contact).map(([key, value]) => ({ type: key, userId: value }));

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {entries.map((item: any, index: number) => {
              const meta = iconMap[item.type] ?? {
                icon: "🔗",
                color: "#888",
                bg: "#f5f5f5",
                label: item.type,
              };

              return (
                <div
                  key={index}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 10px 3px 6px",
                    borderRadius: 20,
                    background: meta.bg,
                    width: "fit-content",
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{meta.icon}</span>
                  <span style={{ color: meta.color, fontWeight: 500 }}>{meta.label}</span>
                  <span style={{ color: "#555" }}>{item.userId}</span>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "หมายเหตุ",
      dataIndex: "remark",
      key: "remark",
      ellipsis: true,
    },
    {
      title: "File",
      dataIndex: "pathFIles",
      key: "id",
      align: "center",
      render(i) {
        return (
          <div>
            <Button onClick={() => downloadFile(i)} type="link" size="small" disabled={!i ? true : false}>{`Download`}</Button>
          </div>
        );
      },
    },
    {
      title: "...",
      dataIndex: "id",
      key: "id",
      align: "center",
      render(i, record) {
        return (
          <div>
            <Button onClick={() => handleModalOpen(true, "edit", record)} type="link">
              edit
            </Button>

            <Popover
              trigger="click"
              placement="bottomRight"
              open={openRowId === record.id}
              onOpenChange={(visible) => {
                setOpenRowId(visible ? record.id : null);
              }}
              content={
                <div className="space-x-2">
                  <Button size="small" danger onClick={() => setOpenRowId(null)}>
                    cancel
                  </Button>

                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      handleDelete(record.id);
                      setOpenRowId(null);
                      setLoading(true);
                    }}
                  >
                    ok
                  </Button>
                </div>
              }
            >
              <Button type="link" danger>
                delete
              </Button>
            </Popover>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Card>
        <div className="flex justify-end mb-2">
          <Button type="primary" htmlType="button" onClick={() => handleModalOpen(true, "create", null)}>
            {`เพิ่มร้านอาหาร`}
          </Button>
        </div>
        <Table
          rowKey={"id"}
          scroll={{ x: "max-content" }}
          size="small"
          columns={columns}
          dataSource={data.data}
          pagination={{
            total: data.count,
          }}
          onChange={onChangePagination}
        />
      </Card>
    </div>
  );
};

export default TableRestaurant;
