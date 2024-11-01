import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Card, Modal, Image, Input, Typography } from "antd";
import React, { useState, useRef } from "react";
import { InformationNewsType } from "../common";
import dayjs from "dayjs";

export interface Props {
  informationNews: InformationNewsType[];
}

const NewsCarouselComponent: React.FC<Props> = ({
  informationNews,
}): React.ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<InformationNewsType | null>(
    null
  );
  const baseImageUrl = process.env.BACKEND_INTRANET_URL;
  const carouselRef = useRef<any>(null);
  const { Paragraph } = Typography;

  const showModal = (news: InformationNewsType) => {
    setSelectedNews(news);
    setIsModalVisible(true);
  };

  const chunkedNews = [];
  if (informationNews)
    for (let i = 0; i < informationNews.length; i += 3) {
      chunkedNews.push(informationNews.slice(i, i + 3));
    }

  return (
    <>
      <div style={{ position: "relative" }}>
        <Carousel
          ref={carouselRef}
          autoplay
          dots={false}
          infinite
          arrows={false}
        >
          {chunkedNews?.map((chunk, index) => (
            <div key={index} style={{ display: "flex" }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chunk?.map((file, fileIndex) => (
                  <Card
                    key={fileIndex}
                    onClick={() => showModal(file)}
                    style={{
                      margin: "0 0",
                      backgroundColor: "#F0F8FF",
                      width: "300px",
                      height: "450px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    hoverable
                  >
                    {file.newsImage.length > 0 &&
                    file.newsImage[0]?.fileName ? (
                      <Image
                        alt="news"
                        preview={false}
                        crossOrigin="anonymous"
                        src={`${baseImageUrl}/news-image/${file.newsImage[0].fileimagePath}`}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />
                    ) : null}
                    <>
                      <p />
                    </>
                    <Card.Meta
                      title={file.newsName || "Untitled"}
                      description={
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "10px",
                          }}
                        >
                          <h4 style={{ margin: 0 }}>
                            ผู้เขียน : {file.author}
                          </h4>
                          <h4 style={{ margin: 0 }}>
                            วันที่ :{" "}
                            {dayjs(file.updatedAt).format("DD-MM-YYYY , HH:mm")}
                          </h4>
                        </div>
                      }
                    />
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
        <LeftOutlined
          onClick={() => carouselRef.current.prev()}
          style={{
            position: "absolute",
            top: "50%",
            left: "0",
            transform: "translateY(-50%)",
            zIndex: 2,
            cursor: "pointer",
            fontSize: "24px",
            color: "#4E31AA",
          }}
        />
        <RightOutlined
          onClick={() => carouselRef.current.next()}
          style={{
            position: "absolute",
            top: "50%",
            right: "0",
            transform: "translateY(-50%)",
            zIndex: 2,
            cursor: "pointer",
            fontSize: "24px",
            color: "#4E31AA",
          }}
        />
      </div>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        footer={null}
      >
        {selectedNews && (
          <div>
            <h3
              style={{
                textAlign: "center",
                margin: "10px 10px",
              }}
            >
              <strong>{selectedNews.newsName}</strong>
            </h3>
            <Carousel
              arrows
              infinite={true}
              autoplay={true}
              autoplaySpeed={1500}
              effect="fade"
            >
              {selectedNews?.newsImage.map((image, index) => (
                <Image
                  key={index}
                  preview={true}
                  src={`${baseImageUrl}/news-image/${image.fileimagePath}`}
                  crossOrigin="anonymous"
                  style={{ width: "calc(100% - 5px)", marginBottom: "5px" }}
                />
              ))}
            </Carousel>

            <div>
              <Paragraph
                style={{
                  fontSize: "14px",
                  padding: "10px",
                  minHeight: "150px",
                  maxHeight: "350px",
                  overflowY: "auto",
                }}
              >
                <Input.TextArea
                  style={{
                    fontSize: "14px",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    boxShadow: "none",
                    minHeight: "150px",
                    maxHeight: "350px",
                    overflowY: "auto",
                    padding: "10px",
                  }}
                  value={selectedNews?.content || ""}
                  readOnly
                  autoSize={{ minRows: 5, maxRows: 10 }}
                />
              </Paragraph>
            </div>

            <p />
            <h5>
              <strong>ผู้เขียน:</strong> {selectedNews.author}
            </h5>
            {selectedNews.updatedAt && (
              <h5>
                <strong>วันที่อัปเดต:</strong>
                {dayjs(selectedNews.updatedAt).format("DD-MM-YYYY , HH:mm")}
              </h5>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default NewsCarouselComponent;
