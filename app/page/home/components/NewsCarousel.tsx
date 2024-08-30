import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Carousel, Card, Modal, Image } from "antd";
import React, { useState, useEffect } from "react";
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
  const [numCols, setNumCols] = useState(3);

  const chunkArray = (array: any[], size: number) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  };

  const updateNumCols = () => {
    if (window.innerWidth < 768) {
      setNumCols(1);
    } else if (window.innerWidth < 1024) {
      setNumCols(2);
    } else {
      setNumCols(3);
    }
  };

  useEffect(() => {
    updateNumCols();
    window.addEventListener("resize", updateNumCols);
    return () => window.removeEventListener("resize", updateNumCols);
  }, []);

  const newsChunks = chunkArray(informationNews, numCols);

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

  return (
    <>
      <Carousel
        dots
        arrows
        nextArrow={<RightOutlined />}
        prevArrow={<LeftOutlined />}
        infinite
        autoplay={true}
        effect="fade"
        lazyLoad="progressive"
      >
        {newsChunks.map((chunk, index) => (
          <div key={index}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chunk.map((file, idx) => (
                <Card
                  key={file.imageId}
                  // hoverable
                  cover={
                    <Image
                      preview={false}
                      // alt="news"
                      crossOrigin="anonymous"
                      src={`http://localhost:4003/api/informationNews/${file.newsImage[0].fileimagePath}`}
                    />
                  }
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
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <a onClick={() => showModal(file)}>
                            read more <RightOutlined />
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Carousel>

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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {selectedNews.newsImage.map((image, index) => (
                <Image
                  key={index}
                  preview={false}
                  src={`http://localhost:4003/api/news-image/${image.fileimagePath}`}
                  crossOrigin="anonymous"
                  style={{ width: "calc(100% - 5px)", marginBottom: "5px" }}
                />
              ))}
            </div>
            <div>{selectedNews.content}</div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NewsCarouselComponent;
