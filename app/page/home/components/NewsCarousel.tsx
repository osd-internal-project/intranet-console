import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Card, Modal, Image } from "antd";
import React, { useState, useRef } from "react";
import { InformationNewsType, NewsImageType } from "../common";

export interface Props {
  informationNews: InformationNewsType[];
  NewsImage: NewsImageType[];
}

const NewsCarouselComponent: React.FC<Props> = ({
  informationNews,
  NewsImage,
}): React.ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<InformationNewsType | null>(
    null
  );

  const carouselRef = useRef<any>(null);

  const showModal = (news: InformationNewsType) => {
    setSelectedNews(news);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedNews(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedNews(null);
  };

  const chunkedNews = [];
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
          style={{ position: "relative" }}
          arrows={false}
        >
          {chunkedNews.map((chunk, index) => (
            <div key={index} style={{ display: "flex" }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chunk.map((file, fileIndex) => (
                  <Card
                    key={fileIndex}
                    onClick={() => showModal(file)}
                    style={{
                      margin: "20px",
                      cursor: "pointer",
                      transition: "transform 0.3s, box-shadow 0.3s",
                    }}
                    cover={
                      <Image
                        alt="news"
                        preview={false}
                        crossOrigin="anonymous"
                        // src={`http://localhost:4003/api/informationNews/${file.newsImage[0].fileimagePath}`}
                      />
                    }
                    hoverable
                  >
                    <Card.Meta
                      title={file.newsName || "Untitled"}
                      description={
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                          }}
                        >
                          <p className="truncate-text" style={{ flexGrow: 1 }}>
                            {file.content || "No content available"}
                          </p>
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
        title={selectedNews?.newsName}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        {selectedNews && (
          <div>
            <p>
              <strong>วันที่เผยแพร่:</strong>{" "}
              {new Date(selectedNews.phblishedAt || "").toLocaleDateString()}
            </p>
            <Carousel
              arrows
              infinite={true}
              autoplay={true}
              autoplaySpeed={1500}
              effect="fade"
            >
              {selectedNews.newsImage.map((image, index) => (
                <Image
                  key={index}
                  preview={true}
                  src={`http://localhost:4003/api/news-image/${image.fileimagePath}`}
                  crossOrigin="anonymous"
                  style={{ width: "calc(100% - 5px)", marginBottom: "5px" }}
                />
              ))}
            </Carousel>
            <div>{selectedNews.content}</div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NewsCarouselComponent;
