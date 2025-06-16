import { IconEmail, IconRingCall } from "@/components/icon";
import { Avatar, Card, Col, Pagination, PaginationProps, Row, TablePaginationConfig, Tag, Typography } from "antd";
import React from "react";

export interface props {
  dataSource: any;
  pagination: TablePaginationConfig;
  changePagination: (page: TablePaginationConfig) => void;
}

const EmployeeProfileGrid: React.FC<props> = ({ dataSource, pagination, changePagination }): React.ReactElement => {
  console.log(dataSource.length > 0);

  return (
    <div>
      <Row gutter={[16, 8]} className="mb-5">
        {dataSource.map((events: any, index: number) => {
          return (
            <div key={index}>
              <Col>
                <Card className="w-64 h-80 shadow-lg shadow-indigo-500/40">
                  <div className="flex justify-center items-center mb-3">
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <Avatar
                        size={100}
                        src={events.image ? URL.createObjectURL(events.image ? events.image : "") : ""}
                        style={{
                          border: "2px solid orange", // Outer border
                          padding: "2px",
                          backgroundClip: "content-box",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: 4,
                          right: 4,
                          width: 16,
                          height: 16,
                          backgroundColor: events.status === true ? "green" : "red",
                          border: "2px solid white",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center mb-3"> {`${events.firstNameTH} ${events.lastNameTH}`}</div>
                  <div className="flex justify-center items-center mb-3">
                    <Tag color="pink">
                      <div>{`${events?.masterPosition?.nameTh}`}</div>
                    </Tag>
                  </div>
                  <div className="flex justify-start items-center mb-1 space-x-2">
                    <div className="flex justify-start items-center">{IconEmail}</div>
                    <div>{`: ${events.email}`}</div>
                  </div>
                  <div className="flex justify-start items-center mb-1 space-x-2">
                    <div className="flex justify-start items-center"> {IconRingCall} </div>
                    <div>{`: ${events.phoneNumber}`}</div>
                  </div>
                  <div className="flex justify-start items-center mb-1 space-x-2">
                    <div className="flex justify-start items-center"> {IconRingCall} </div>
                    <div>{`: ${events.extensionNumber}`}</div>
                  </div>
                </Card>
              </Col>
            </div>
          );
        })}
      </Row>
      <div className="flex justify-end">
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
    </div>
  );
};

export default EmployeeProfileGrid;
