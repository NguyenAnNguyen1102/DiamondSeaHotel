import React from "react";
import { Container, Row, Col, Button, Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import TopReviews from "../components/TopReviews";
import Highlights from "../components/Highlights";
import InsideInfor from "../components/InsideInfo";

export default function About() {
  const carouselImages = [
    "https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1547&q=80",
  ];

  return (
    <>
      <Container
        as="section"
        className="py-5 px-md-4 About-hero-section"
        style={{ maxWidth: "1140px" }}
      >
        <Row className="g-5 align-items-center">
          <Col md={6} className="text-center text-md-start">
            <h1 className="display-5 fw-bold About-text-pink lh-tight About-heading-hover mb-4">
              <span className="d-block mt-2">Không gian nghỉ dưỡng lý tưởng</span>
              <span className="d-block mt-2">
                Dịch vụ đẳng cấp và tiện nghi hiện đại
              </span>
              <span className="d-block mt-2">Tận hưởng kỳ nghỉ trọn vẹn</span>
            </h1>
            <p className="text-muted fs-5 mb-4">
              Tại Amazing Hotel, chúng tôi mang đến cho bạn không gian nghỉ dưỡng sang trọng,
              kết hợp hoàn hảo giữa sự tiện nghi hiện đại và phong cách thiết kế tinh tế.
              Hãy để kỳ nghỉ của bạn trở nên đáng nhớ cùng những trải nghiệm tuyệt vời tại đây.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start gap-3">
              <Button
                to="/contact"
                as={Link}
                variant={null}
                size="lg"
                className="About-button-pink-solid rounded-pill px-4 py-2 fw-semibold"
              >
                Liên hệ với chúng tôi
              </Button>
              <Button
                to="/"
                as={Link}
                variant={null}
                size="lg"
                className="About-button-pink-outline rounded-pill px-4 py-2 fw-semibold"
              >
                Xem các loại phòng
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <Carousel>
              {carouselImages.map((src, index) => (
                <Carousel.Item key={index}>
                  <Image
                    className="d-block w-100 rounded About-carousel-image"
                    src={src}
                    alt={`Slide ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
      <Highlights />
      <InsideInfor />
      <TopReviews />
    </>
  );
}
