import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

import {
  FaBed,
  FaParking,
  FaWifi,
  FaCoffee,
  FaSnowflake,
  FaTv,
  FaMapMarkerAlt,
  FaDirections,
} from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { MdPeople, MdAttractions } from "react-icons/md";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Badge,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import room1 from "../assets/roomImages/room-1.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Sửa lỗi icon mặc định của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RoomDetail = () => {
  const { id = 2 } = useParams();
  const { bookingData, updateBooking, errors, validateBooking } = useBooking();
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Dữ liệu phòng (giả lập)
  const room = {
    roomID: parseInt(id),
    name: `Luxury Ocean View Room ${id}`,
    price: "100.00",
    dienTich: 25.5,
    soNguoi: 2,
    bedType: "Double",
    bedCount: 1,
    danhGia: 4.5,
    moTa: "Phòng sang trọng với view hướng biển tuyệt đẹp, được thiết kế theo phong cách hiện đại pha lẫn nét đẹp truyền thống. Phòng được trang bị đầy đủ tiện nghi cao cấp, mang đến trải nghiệm nghỉ dưỡng tuyệt vời cho quý khách.",
    location: `Tầng ${Math.ceil(parseInt(id) / 10)}, Khu Diamond Sea`,
    roomType: "Luxury",
    coordinates: {
      lat: 10.925104878716811,
      lng: 108.12161601762978,
    },
    images: [room1, room1, room1, room1, room1],
    services: ["Parking", "Breakfast", "Wi-Fi"],
    amenities: ["Minibar", "Air Conditioning", "TV"],
    address:
      "Diamond Sea Hotel, Nguyễn Thị Thập, Phường Phú Hài, Phan Thiết, Bình Thuận",
  };

  // Dữ liệu địa điểm lân cận
  const nearbyPlaces = [
    {
      name: "Bãi biển Mũi Né",
      coordinates: [10.927, 108.1238],
      type: "Bãi biển",
      distance: "1.2km",
    },
    {
      name: "Suối Hồng (Fairy Stream)",
      coordinates: [10.928, 108.1258],
      type: "Địa điểm du lịch",
      distance: "2.5km",
    },
    {
      name: "Đồi Cát Bay",
      coordinates: [10.929, 108.1278],
      type: "Địa điểm du lịch",
      distance: "3.1km",
    },
    {
      name: "Làng Chài Mũi Né",
      coordinates: [10.926, 108.1228],
      type: "Văn hóa",
      distance: "0.8km",
    },
  ];

  // Hàm tính số đêm
  const calculateNights = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      return 1;
    }
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  // Hàm tính tổng tiền
  const calculateTotalPrice = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      return parseFloat(room.price) + 10;
    }
    const nights = calculateNights();
    return parseFloat(room.price) * nights + 10;
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "guests" && parseInt(value) > room.soNguoi) {
      alert(`Phòng này chỉ chứa tối đa ${room.soNguoi} khách.`);
      return;
    }
    updateBooking({ [name]: value });
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form:", bookingData);
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      alert("Vui lòng chọn ngày nhận phòng và trả phòng.");
      return;
    }

    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);

    if (checkOut <= checkIn) {
      alert("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }

    if (validateBooking(bookingData)) {
      const nights = calculateNights();
      const totalPrice = parseFloat(room.price) * nights + 10;

      updateBooking({ totalPrice });
      setShowSuccess(true);
      navigate("/InputInfomation");
    }
  };

  // Hàm mở chỉ đường
  const openDirections = (lat, lng) => {
    window.open(
      `https://www.openstreetmap.org/directions?from=&to=${lat},${lng}`
    );
  };

  // Style cho bản đồ
  const mapStyle = {
    height: "400px",
    width: "100%",
    borderRadius: "8px",
    zIndex: 1,
  };

  return (
    <div className="room-detail-page bg-light">
      {/* Hero Section với ảnh phòng */}
      <div className="position-relative mb-5">
        <div className="gallery-container">
          <Row className="g-2">
            <Col md={6}>
              <img
                src={room.images[0]}
                alt="Main"
                className="img-fluid main-image rounded shadow"
                style={{ height: "400px", width: "100%", objectFit: "cover" }}
              />
            </Col>
            <Col md={6}>
              <Row className="g-2">
                {room.images.slice(1).map((image, index) => (
                  <Col md={6} key={index}>
                    <img
                      src={image}
                      alt={`Room ${index + 2}`}
                      className="img-fluid gallery-image rounded shadow"
                      style={{
                        height: "198px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      <Container className="py-4">
        <Row>
          <Col lg={8}>
            {/* Tiêu đề và thông tin cơ bản */}
            <div className="mb-4">
              <h1 className="display-5 fw-bold mb-3">{room.name}</h1>
              <div className="d-flex align-items-center text-muted mb-3">
                <FaMapMarkerAlt className="me-2" />
                <span>{room.location}</span>
                <span className="mx-3">•</span>
                <span className="d-flex align-items-center">
                  <span className="text-warning me-1">★</span>
                  <span>{room.danhGia}</span>
                </span>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="fw-bold mb-4">Thông tin phòng</h4>
                <Row className="g-4">
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <MdPeople className="text-primary fs-3 me-3" />
                      <div>
                        <div className="fw-bold">{room.soNguoi} Khách</div>
                        <small className="text-muted">Sức chứa tối đa</small>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <FaBed className="text-primary fs-3 me-3" />
                      <div>
                        <div className="fw-bold">
                          {room.bedCount} {room.bedType}
                        </div>
                        <small className="text-muted">Loại giường</small>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <IoBed className="text-primary fs-3 me-3" />
                      <div>
                        <div className="fw-bold">{room.dienTich}m²</div>
                        <small className="text-muted">Diện tích</small>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Tiện nghi */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="fw-bold mb-4">Tiện nghi phòng</h4>
                <Row className="g-3">
                  {room.amenities.map((amenity, index) => (
                    <Col md={6} key={index}>
                      <div className="d-flex align-items-center p-2 border rounded">
                        {amenity === "Air Conditioning" && (
                          <FaSnowflake className="text-primary me-3 fs-4" />
                        )}
                        {amenity === "TV" && (
                          <FaTv className="text-primary me-3 fs-4" />
                        )}
                        <span>{amenity}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Dịch vụ */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="fw-bold mb-4">Dịch vụ bao gồm</h4>
                <Row className="g-3">
                  {room.services.map((service, index) => (
                    <Col md={6} key={index}>
                      <div className="d-flex align-items-center p-2 border rounded">
                        {service === "Parking" && (
                          <FaParking className="text-primary me-3 fs-4" />
                        )}
                        {service === "Wi-Fi" && (
                          <FaWifi className="text-primary me-3 fs-4" />
                        )}
                        {service === "Breakfast" && (
                          <FaCoffee className="text-primary me-3 fs-4" />
                        )}
                        <span>{service}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Mô tả */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="fw-bold mb-4">Mô tả</h4>
                <p className="text-muted lh-lg">{room.moTa}</p>
              </Card.Body>
            </Card>

            {/* Vị trí */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="fw-bold mb-4">Vị trí</h4>

                {/* Thông tin địa chỉ */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaMapMarkerAlt className="text-primary me-2 fs-4" />
                    <div>
                      <h6 className="mb-1 fw-bold">{room.address}</h6>
                      <p className="mb-0 text-muted">
                        Khu vực trung tâm, dễ dàng di chuyển
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      openDirections(room.coordinates.lat, room.coordinates.lng)
                    }
                    className="d-flex align-items-center gap-2"
                  >
                    <FaDirections /> Xem chỉ đường
                  </Button>
                </div>

                {/* Bản đồ */}
                <div className="map-container rounded overflow-hidden mb-4">
                  <MapContainer
                    center={[room.coordinates.lat, room.coordinates.lng]}
                    zoom={15}
                    style={mapStyle}
                    scrollWheelZoom={false}
                    zoomControl={true}
                    doubleClickZoom={true}
                    dragging={true}
                  >
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Marker khách sạn */}
                    <Marker
                      position={[room.coordinates.lat, room.coordinates.lng]}
                    >
                      <Popup>
                        <div
                          className="text-center"
                          style={{ minWidth: "200px" }}
                        >
                          <img
                            src={room1}
                            alt={room.name}
                            className="img-fluid mb-2 rounded"
                            style={{
                              width: "150px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <h6 className="mb-1">{room.name}</h6>
                          <p className="mb-1 small text-muted">
                            {room.address}
                          </p>
                          <p className="mb-0 text-primary fw-bold">
                            ${room.price}/đêm
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                    {/* Markers địa điểm lân cận */}
                    {nearbyPlaces.map((place, index) => (
                      <Marker key={index} position={place.coordinates}>
                        <Popup>
                          <div className="text-center">
                            <h6 className="mb-1">{place.name}</h6>
                            <Badge bg="info" className="mb-2">
                              {place.type}
                            </Badge>
                            <p className="mb-0 small text-muted">
                              Cách {place.distance}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Danh sách địa điểm lân cận */}
                <div>
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <MdAttractions className="text-primary" />
                    Địa điểm lân cận
                  </h5>
                  <Row className="g-3">
                    {nearbyPlaces.map((place, index) => (
                      <Col md={6} key={index}>
                        <div className="d-flex align-items-center p-2 border rounded">
                          <div>
                            <h6 className="mb-1">{place.name}</h6>
                            <div className="d-flex align-items-center gap-2">
                              <Badge bg="info">{place.type}</Badge>
                              <small className="text-muted">
                                Cách {place.distance}
                              </small>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Booking Card */}
          <Col lg={4}>
            <Card
              className="booking-card shadow position-sticky"
              style={{ top: "2rem" }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <span className="fs-3 fw-bold">${room.price}</span>
                    <span className="text-muted">/đêm</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-warning me-1">★</span>
                    <span>{room.danhGia}</span>
                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row className="g-2 mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label className="small fw-bold">
                          NHẬN PHÒNG
                        </Form.Label>
                        <Form.Control
                          type="date"
                          className="rounded-3"
                          name="checkInDate"
                          value={bookingData.checkInDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {errors.checkInDate && (
                          <Form.Text className="text-danger">
                            {errors.checkInDate}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label className="small fw-bold">
                          TRẢ PHÒNG
                        </Form.Label>
                        <Form.Control
                          type="date"
                          className="rounded-3"
                          name="checkOutDate"
                          value={bookingData.checkOutDate}
                          onChange={handleInputChange}
                          min={
                            bookingData.checkInDate ||
                            new Date().toISOString().split("T")[0]
                          }
                        />
                        {errors.checkOutDate && (
                          <Form.Text className="text-danger">
                            {errors.checkOutDate}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">KHÁCH</Form.Label>
                    <Form.Select
                      className="rounded-3"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                    >
                      <option value="1">1 khách</option>
                      <option value="2">2 khách</option>
                    </Form.Select>
                    {errors.guests && (
                      <Form.Text className="text-danger">
                        {errors.guests}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 py-3 mb-3 rounded-3"
                    type="submit"
                  >
                    Đặt phòng ngay
                  </Button>
                </Form>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>
                      ${room.price} x {calculateNights()} đêm
                    </span>
                    <span>
                      ${(parseFloat(room.price) * calculateNights()).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí dịch vụ</span>
                    <span>$10</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold mt-3 pt-3 border-top">
                    <span>Tổng tiền</span>
                    <span>${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RoomDetail;