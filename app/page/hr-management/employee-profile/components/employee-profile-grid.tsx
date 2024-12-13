import { Avatar, Card, Pagination, PaginationProps, TablePaginationConfig, Tag, Typography } from "antd";
import React from "react";

export interface props {
  dataSource: any;
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
}

const EmployeeProfileGrid: React.FC<props> = ({ dataSource, pagination, changePagination }): React.ReactElement => {
  return dataSource.lenght > 0 ? (
    <div>
      {dataSource.map((event: any) => {
        return (
          <Card className="w-80 h-80 justify-start flex">
            <div>
              <Avatar />
            </div>
            <div>
              <Typography></Typography>
            </div>
            <div>
              <Tag></Tag>
            </div>
          </Card>
        );
      })}
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={(page, pageSize) => {
          changePagination({
            current: page,
            pageSize: pageSize,
            total: pagination.total,
          });
        }}
        showSizeChanger
      />
    </div>
  ) : (
    <Card className="w-80 h-80 justify-start flex">
      <div>
        <Avatar />
      </div>
      <div>
        <Typography></Typography>
      </div>
      <div>
        <Tag></Tag>
      </div>
    </Card>
  );
};

export default EmployeeProfileGrid;
