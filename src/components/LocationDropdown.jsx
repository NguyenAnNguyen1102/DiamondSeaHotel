import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { RoomTypeContext } from "../context/RoomProvider";

const LocationDropdown = ({ onSelect }) => {
  const { locations, updateSearchData } = useContext(RoomTypeContext);

  const handleLocationClick = (locationName) => {
    updateSearchData({ location: locationName }); // Fixed: Use 'location' instead of 'locationName'
    onSelect(locationName);
  };

  return (
    <div
      className="bg-white border p-3 position-absolute end-0"
      style={{
        top: "80px",
        width: "max-content",
        left: "-12%",
        borderRadius: "16px",
        zIndex: 1001, // Ensures it’s above FilterBar
      }}
    >
      <div className="fw-bold ms-2">Tìm kiếm theo khu vực</div>
      <Container fluid>
        <Row>
          {locations.slice(0, 3).map((location, index) => (
            <Col
              key={index}
              className="location-option p-2 rounded-4 d-flex flex-column justify-content-center align-items-center"
              onClick={() => handleLocationClick(location.name)}
            >
              <img
                src={location.img}
                className="rounded-4"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                alt={location.name}
              />
              <div className="mt-2">{location.name}</div>
            </Col>
          ))}
        </Row>
        <Row>
          {locations.slice(3).map((location, index) => (
            <Col
              key={index}
              className="location-option p-2 rounded-4 d-flex flex-column justify-content-center align-items-center"
              onClick={() => handleLocationClick(location.name)}
            >
              <img
                src={location.img}
                className="rounded-4"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                alt={location.name}
              />
              <div className="mt-2">{location.name}</div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default LocationDropdown;
