import React from "react";
import { Col, Divider, Row, Typography } from "antd";
import { typeContact, typeVender } from "../common";

export interface props {
  row?: typeVender;
  contact?: typeContact[];
}
export const DetailVender: React.FC<props> = ({ row, contact }): React.ReactElement => {
  const header = [
    "เลขที่ :",
    "หมู่ :",
    "อาคาร/หมู่บ้าน :",
    "ซอย :",
    "ถนน :",
    "ตำบล/แขวง :",
    "อำเภอ/เขต :",
    "จังหวัด :",
    "รหัสไปษณีย์ :",
    "เบอร์โทรศัพท์ :",
    "เบอร์ FAX :",
    "E-mail :",
    "เลขประจำตัวผู้เสียภาษี :",
    "Credit Term :",
  ];

  return Array(row).length !== 0 ? (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[0]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.house_number}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[1]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.group}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[2]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.village}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[3]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.alley}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[4]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.road}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[5]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.sub_district}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[6]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.district}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[7]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.province}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[8]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.post_code}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[9]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.phoneNumber}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[10]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.fax_number}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[11]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.email}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[12]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{`${row?.IDcard}`}</Typography>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            <Col span={10}>
              <Typography style={{ color: "#9E9E9E" }}>{`${header[13]}`}</Typography>
            </Col>
            <Col span={14}>
              <Typography>{``}</Typography>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />
      {contact?.map((value: typeContact, index: number) => {
        return (
          <Row gutter={[8, 8]} key={index}>
            <>
              <Col span={8}>
                <Row gutter={[8, 8]}>
                  <Col span={10}>
                    <Typography style={{ color: "#9E9E9E" }}>{`ชื่อผู่ติดต่อ #${index + 1} :`}</Typography>
                  </Col>
                  <Col span={14}>
                    <Typography>{`${value.contact_name}`}</Typography>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row gutter={[8, 8]}>
                  <Col span={10}>
                    <Typography style={{ color: "#9E9E9E" }}>{`เบอร์โทรศัพท์ :`}</Typography>
                  </Col>
                  <Col span={14}>
                    <Typography>{`${value.phoneNumber}`}</Typography>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row gutter={[8, 8]}>
                  <Col span={10}>
                    <Typography style={{ color: "#9E9E9E" }}>{`เบอร์ FAX :`}</Typography>
                  </Col>
                  <Col span={14}>
                    <Typography>{`${value.fax_number}`}</Typography>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row gutter={[8, 8]}>
                  <Col span={10}>
                    <Typography style={{ color: "#9E9E9E" }}>{`E-mail :`}</Typography>
                  </Col>
                  <Col span={14}>
                    <Typography>{`${value.email}`}</Typography>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row gutter={[8, 8]}>
                  <Col span={10}>
                    <Typography style={{ color: "#9E9E9E" }}>{`หมายเหตุ :`}</Typography>
                  </Col>
                  <Col span={14}>
                    <Typography>{`${value.description}`}</Typography>
                  </Col>
                </Row>
              </Col>
              <Divider />
            </>
          </Row>
        );
      })}
    </div>
  ) : (
    <></>
  );
};
