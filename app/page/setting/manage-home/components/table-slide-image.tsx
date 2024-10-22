import React, { useContext, useMemo, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Space,
  Popconfirm,
  Tooltip,
  Form,
  Input,
  Col,
} from "antd";
import { useAxiosIntranet } from "@/app/lib/axios/hooks/userAxiosAuth";
import ManageHomeService from "../services/index.service";
import dayjs from "dayjs";
import { DeleteIcon } from "@/components/icon";
import { HolderOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { GetProps, TableColumnsType } from "antd";
import { SlideImageType } from "../common";
import "../common/style.css";

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

interface propss {
  slideImage: SlideImageType[];
  handleDeleteSlideImage: any;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

export const TableSlideImage: React.FC<propss> = ({
  slideImage,
  handleDeleteSlideImage,
}) => {
  const Auth = useAxiosIntranet();
  const intraAuthService = ManageHomeService(Auth);
  const [dataSource, setDataSource] = React.useState<SlideImageType[]>([]);
  const { Search } = Input;

  useEffect(() => {
    setDataSource(slideImage);
  }, [slideImage]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.id === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.id === over?.id
        );
        const movedData = arrayMove(prevState, activeIndex, overIndex);
        updateSlideImage(movedData);
        return movedData;
      });
    }
  };

  const updateSlideImage = async (movedData: any) => {
    const updatedData = movedData.map((data: any, index: number) => ({
      ...data,
      order: index + 1,
    }));
    for (const data of updatedData) {
      try {
        await intraAuthService.updateTebleSlide(data.fileId, data);
      } catch (error) {
        message.error("Error updating slide");
      }
    }
  };

  const fileNameSearch = (value: string) => {
    const filteredData = slideImage.filter(
      (item) =>
        item.fileName?.toLowerCase().includes(value.toLowerCase()) ||
        item.createdByName?.toLowerCase().includes(value.toLowerCase()) ||
        item.fileType?.toLowerCase().includes(value.toLowerCase())
    );
    setDataSource(filteredData);
  };

  const columns: TableColumnsType<SlideImageType> = [
    { key: "sort", align: "center", width: 80, render: () => <DragHandle /> },
    { title: "fileName", dataIndex: "fileName" },
    { key: "fileType", dataIndex: "fileType", title: "fileType" },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Created At",
      render: (text: string) => dayjs(text).format("DD-MM-YYYY, HH:mm"),
    },
    {
      key: "createdByName",
      dataIndex: "createdByName",
      title: "createdByName",
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Active",
      align: "center",
      render: (value: string) => (
        <Space>
          <Popconfirm
            title="คุณต้องการลบรูปนี้ใช่หรือไม่?"
            onConfirm={() => handleDeleteSlideImage(value)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <a type="link">
                <DeleteIcon />
              </a>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div>
        <Form size="small" layout="horizontal">
          <Col span={6}>
            <Form.Item label="Search :">
              <Search
                placeholder="input search text"
                onSearch={fileNameSearch}
                enterButton
              />
            </Form.Item>
          </Col>
        </Form>
        {/* ),
            },
          ]}
          defaultActiveKey={[]}
        /> */}
      </div>
      <div>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={dataSource ? dataSource.map((i) => i.id) : []}
            strategy={verticalListSortingStrategy}
          >
            <Table
              rowKey={"id"}
              components={{ body: { row: Row } }}
              columns={columns}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
