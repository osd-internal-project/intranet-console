import { RightOutlined } from "@ant-design/icons";
import { Carousel, Row, Col, Card, Modal } from "antd";
import React, { useState, useEffect } from "react";

export interface props {}

const NewsCarouselComponent: React.FC<props> = (): React.ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [numCols, setNumCols] = useState(3);

  const newsData = [
    {
      title: "Science Career and Internship Festival (SCI Festival)",
      date: "04-March-2024",
      imgSrc: "/images/homeImg/test.png",
      link: "#",
      description: `
        พบกับพี่ๆ จาก OSD กับงาน Science Career and Internship Festival (SCI Festival)
        ณ อาคารศูนย์ปาฐกถา ประดิษฐ เชยจิตร (ตึกฟักทอง) คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์วิทยาเขตหาดใหญ่
        ตั้งแต่ 09.00 - 15.00 น. ร่วมสนุกรับของรางวัลกันได้นะคะ <br><br>
        สอบถามตำแหน่งงานว่าง และสมัครงาน <br>
        คุณรัชพร (ฝ่ายบุคคล) <br>
        T. 020801111 #5100 <br>
        T. 0852279575 <br>
        M. hr@osd.co.th`,
    },
    {
      title: "OSD 20th YEARS ANIVERSARY",
      date: "16-October-2023",
      imgSrc: "/images/homeImg/test2.png",
      link: "#",
      description: `O S D #20thanniversary FROM LEARNING TO RUNNING #OSD #OSDCOMPANY`,
    },
    {
      title:
        "โอ เอส ดี ร่วมพันธมิตรธุรกิจดิจิตอล เสริมพลังธุรกิจ ติดอาวุธเทคโนโลยีการสื่อสารรอบด้าน ในงาน O S D econnect 2023",
      date: "18-july-2023",
      imgSrc: "/images/homeImg/test3.png",
      link: "#",
      description: `📣 โอ เอส ดี ร่วมพันธมิตรธุรกิจดิจิตอล เสริมพลังธุรกิจ ติดอาวุธเทคโนโลยีการสื่อสารรอบด้าน ในงาน O S D econnect 2023 <br>
        นับเป็นอีกหนึ่งความสำเร็จจากความร่วมมือของเหล่าพันธมิตรฝีมือดี นำทีมโดย คุณอรสา ขาวงาม (ประธาน กรรมการบริหาร บริษัท โอ เอส ดี จำกัด) ที่นำเอาเทคโนโลยีเพื่อธุรกิจ (Ecosystem Tech for Business) นำเสนอผลงานนวัตกรรมสร้างสรรค์ที่ทรงพลังในงาน OSD e-connect 2023 ภายใต้หัวข้อ <br>
        “EMPOWERING TECH ALLIANCE FOR BUSINESS GROWTH” <br>
        ที่ได้บริษัทเทคฯ ชั้นนำร่วมเป็น Partner มากมาก ได้แก่ AVAYA, HUAWEI, NICE, DIGITAL DIALOGUE, BIZCUIT, SUNLINE THAILAND และ SUNDAE ทั้งนี้ภายในงานมีจุดเด่นที่น่าสนใจ เช่น <br>
        • การพูดสร้างแรงบันดาลใจ โดยนายแพทย์เก่งพงศ์ ตั้งอรุณสันติ ผู้ก่อตั้งและผู้อำนวยการ Chersery Home โรงพยาบาลผู้สูงอายุและศูนย์เวชศาสตร์ฟื้นฟู <br>
        • เวทีแลกเปลี่ยนความคิดเห็นโดยผู้บริหารชั้นนำของประเทศ เรื่องอนาคตธุรกิจกับการเปลี่ยนผ่านเข้าสู่เทคโนโลยี Digital Transformation และการ Synchronization โดยให้ความสำคัญในประเด็นต่างๆ ที่ เกี่ยวข้องกัน ทั้งด้าน Human โดย คุณใจพร ศรีสกุล จาก AIS 
          ด้าน Infrastructure โดย คุณสุรศักดิ์ วนิชเวทย์พิบูล จาก Huawei ด้าน Data Transformation โดยคุณปริญญา แพทยานันท์ จาก NICE ด้าน Technology โดย Mr. Bhadresh R. Veeraiah จาก AVAYA International และด้าน Security โดย ดร. มนประอร ศุขรุ่งเรือง จาก Bangkok Airways <br>
        • การนำเสนอวิสัยทัศน์ทางด้าน Digital Solution และ Innovation ที่ช่วยเสริมความแข็งแกร่งให้คู่ค้าธุรกิจ ในด้านต่างๆ อาทิเช่น Digital Workplace, Innovation for Senior Care Business, Innovation without disruption AXP เป็นต้น 
          ซึ่งในงานนี้ O S D ได้จับมือร่วมกับ AVAYA อัพเดทเทคโนโลยีและบริการ ที่ตอบโจทย์ต่อกลุ่มธุรกิจ ที่ต้องการเพิ่มประสิทธิภาพให้เกิดบริการใหม่สร้างประสบการณ์ที่ดีให้กับลูกค้า (end user) <br>
        • โอกาสในการเชื่อมต่อเครือข่ายกับผู้มีวิสัยทัศน์ เพื่อสร้างความร่วมมือและแลกเปลี่ยนความคิดเห็นที่มีค่า ซึ่งกันและกัน <br><br>
        📍 งานนี้จัดขึ้นเมื่อวันพุธที่ 5 กรกฎาคม 2566 ที่ผ่านมา ณ ห้อง Grand Ballroom Carlton Sukhumvit Hotel`,
      images: [
        "/images/homeImg/test3_1.png",
        "/images/homeImg/test3_2.png",
        "/images/homeImg/test3_3.png",
        "/images/homeImg/test3_4.png",
        "/images/homeImg/test3_5.png",
      ],
    },
    {
      title: "Example4",
      date: "01-April-2020",
      imgSrc: "https://example.com/image4.jpg",
      link: "#",
      description: "This is a detailed description of Example4.",
    },
    {
      title: "Example5",
      date: "01-April-2020",
      imgSrc: "https://example.com/image5.jpg",
      link: "#",
      description: "This is a detailed description of Example5.",
    },
    {
      title: "Example6",
      date: "01-April-2020",
      imgSrc: "https://example.com/image6.jpg",
      link: "#",
      description: "This is a detailed description of Example6.",
    },
  ];

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
  const newsChunks = chunkArray(newsData, numCols);

  const showModal = (news: any) => {
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
      <Carousel autoplay arrows infinite>
        {newsChunks.map((newsChunk, index) => (
          <div key={index}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsChunk.map((news, idx) => (
                <Card
                  key={idx}
                  hoverable
                  cover={
                    <img
                      src={news.imgSrc}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={news.title}
                    description={
                      <>
                        <p>{news.date}</p>
                        <a onClick={() => showModal(news)}>
                          read more <RightOutlined />
                        </a>
                      </>
                    }
                  />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Carousel>

      <Modal
        title={selectedNews?.title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        {selectedNews && (
          <div>
            <p>{selectedNews.date}</p>
            <img
              src={selectedNews.imgSrc}
              style={{ width: "100%", marginBottom: "15px" }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: selectedNews.description }}
            />
            <a
              href={selectedNews.link}
              target="_blank"
              rel="noopener noreferrer"
            ></a>
          </div>
        )}
        <br />
        {selectedNews?.images && (
          <Carousel autoplay arrows infinite>
            {selectedNews.images.map((image: string, index: number) => (
              <div key={index}>
                <div
                  style={{
                    backgroundImage: `url(${image})`,
                    height: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    margin: "0 10px",
                  }}
                ></div>
              </div>
            ))}
          </Carousel>
        )}
      </Modal>
    </>
  );
};

export default NewsCarouselComponent;
