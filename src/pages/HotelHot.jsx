import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { additionalHotelData } from "../data/data";
import ImageGallery from "../components/ImageGallery";
import ListingInfo from "../components/ListingInfo";
import BookingCard from "../components/BookingCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
function HotelHot() {
  return (
    <>
      <Header />
      {additionalHotelData.map((hotel) => (
        <div className="App" key={hotel.id}>
          <ImageGallery hotel={hotel} />
          <Container>
            <Row>
              <Col md={7} lg={8}>
                <ListingInfo hotel={hotel} />
              </Col>
              <Col md={5} lg={4}>
                <BookingCard hotel={hotel} />
              </Col>
            </Row>
          </Container>
        </div>
      ))}
      <Footer />
    </>
  );
}

export default HotelHot;
