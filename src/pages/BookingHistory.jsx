import { useState, useEffect } from "react";
import "../Css/BookingHistory.css";

// Mock data dựa trên CSDL
const mockData = [
  {
    orderID: 1,
    accountID: 1,
    price: 100.00, // Khớp với Orders
    orderDate: "2025-04-10", // Thêm từ Orders
    checkInDate: "2025-04-17", // Khớp với Orders
    checkOutDate: "2025-04-20", // Khớp với Orders
    room: {
      roomID: "1", // Khớp với Orders
      name: "Standard Room 101", // Khớp với Rooms
      price: 100.00, // Khớp với Rooms
      dienTich: 25.5,
      soNguoi: 2,
      bedType: "Double",
      bedCount: 1,
      danhGia: 4.5,
      moTa: "Cozy standard room",
      location: "Floor 1",
      roomType: "Standard", // Lấy từ RoomTypes qua roomTypeID
      images: ["3.jpg", "2.jpg", "3.jpg", "4.jpg"], // Khớp với RoomImages
      services: ["Wi-Fi", "Breakfast", "Parking"], // Khớp với Room_Service
      amenities: ["Air Conditioning", "TV", "Minibar"], // Khớp với Room_Amenity
      chinhSachHuy: "Miễn phí trước 2025-04-13", // Giả lập
    },
  },
  {
    orderID: 2,
    accountID: 2,
    price: 200.00, // Khớp với Orders
    orderDate: "2025-04-11", // Thêm từ Orders
    checkInDate: "2025-04-20", // Khớp với Orders
    checkOutDate: "2025-04-22", // Khớp với Orders
    room: {
      roomID: "3", // Khớp với Orders
      name: "Deluxe Room 201", // Khớp với Rooms
      price: 200.00, // Khớp với Rooms
      dienTich: 35.0,
      soNguoi: 3,
      bedType: "Queen",
      bedCount: 1,
      danhGia: 4.7,
      moTa: "Spacious deluxe room",
      location: "Floor 2",
      roomType: "Deluxe", // Lấy từ RoomTypes
      images: ["4.jpg", "1.jpg", "3.jpg", "2.jpg"], // Khớp với RoomImages
      services: ["Wi-Fi", "Breakfast", "Spa", "Pool"], // Khớp với Room_Service
      amenities: ["Air Conditioning", "TV", "Minibar", "Safe", "Hairdryer"], // Khớp với Room_Amenity
      chinhSachHuy: "Miễn phí trước 2025-04-17", // Giả lập
    },
  },
  // Thêm các đơn đặt phòng đã hoàn thành
  {
    orderID: 3,
    accountID: 1,
    price: 150.00,
    orderDate: "2025-03-01",
    checkInDate: "2025-03-10",
    checkOutDate: "2025-03-12",
    room: {
      roomID: "2",
      name: "Superior Room 105",
      price: 150.00,
      dienTich: 30.0,
      soNguoi: 2,
      bedType: "Twin",
      bedCount: 2,
      danhGia: 4.3,
      moTa: "Comfortable superior room with city view",
      location: "Floor 1",
      roomType: "Superior",
      images: ["1.jpg", "2.jpg", "4.jpg", "3.jpg"],
      services: ["Wi-Fi", "Breakfast", "Room Service"],
      amenities: ["Air Conditioning", "TV", "Minibar", "Bathtub"],
      chinhSachHuy: "Đã hoàn thành",
    },
  },
];

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeFilter, setActiveFilter] = useState("all"); // all, upcoming, completed
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredBookings, setFilteredBookings] = useState([]);

  // Ngày hiện tại (2025-04-15)
  const currentDate = new Date("2025-04-15");

  // Hàm tính số ngày giữa ngày nhận và trả phòng
  const tinhSoNgay = (ngayNhanPhong, ngayTraPhong) => {
    const ngayNhan = new Date(ngayNhanPhong);
    const ngayTra = new Date(ngayTraPhong);
    const soMiligiayTrongMotNgay = 1000 * 60 * 60 * 24;
    const soNgay = Math.round((ngayTra - ngayNhan) / soMiligiayTrongMotNgay);
    return soNgay > 0 ? soNgay : 1;
  };

  // Hàm kiểm tra xem có thể hủy phòng không
  const canCancelBooking = (checkInDate) => {
    const checkIn = new Date(checkInDate);
    return checkIn > currentDate; // Có thể hủy nếu ngày nhận phòng chưa qua
  };

  // Hàm xử lý hủy phòng
  const handleCancelBooking = (orderID) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đặt phòng này không?")) {
      // Giả lập gọi API để xóa đặt phòng
      console.log(`Hủy đặt phòng với orderID: ${orderID}`);
      const updatedBookings = bookings.filter((booking) => booking.orderID !== orderID);
      setBookings(updatedBookings);
      applyFilters(updatedBookings, activeFilter, dateFilter);
      // Nếu có API, bạn sẽ gọi:
      // fetch(`/api/orders/${orderID}`, { method: 'DELETE' })
    }
  };

  // Hàm hiển thị sao đánh giá
  const renderStars = (danhGia) => {
    const stars = [];
    const maxStars = 5;
    const rating = Math.floor(parseFloat(danhGia));
    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star1" : "star-empty"}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Hàm toggle trạng thái mở rộng
  const toggleDetails = (orderID) => {
    setExpanded((prev) => ({
      ...prev,
      [orderID]: !prev[orderID],
    }));
  };

  // Áp dụng tất cả bộ lọc
  const applyFilters = (data, filterType, dateRange) => {
    let result = [...data];

    // Lọc theo loại (sắp đến/đã hoàn thành)
    if (filterType !== "all") {
      if (filterType === "upcoming") {
        result = result.filter(booking => new Date(booking.checkInDate) >= currentDate);
      } else if (filterType === "completed") {
        result = result.filter(booking => new Date(booking.checkOutDate) < currentDate);
      }
    }

    // Lọc theo khoảng ngày nếu có
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      result = result.filter(booking => {
        const checkIn = new Date(booking.checkInDate);
        return checkIn >= startDate && checkIn <= endDate;
      });
    }

    setFilteredBookings(result);
  };

  // Xử lý thay đổi bộ lọc theo trạng thái
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(bookings, filter, dateFilter);
  };

  // Xử lý thay đổi bộ lọc theo ngày
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    const newDateFilter = { ...dateFilter, [name]: value };
    setDateFilter(newDateFilter);
    
    if (newDateFilter.startDate && newDateFilter.endDate) {
      applyFilters(bookings, activeFilter, newDateFilter);
    }
  };

  // Xử lý xóa bộ lọc
  const clearFilters = () => {
    setActiveFilter("all");
    setDateFilter({ startDate: "", endDate: "" });
    setFilteredBookings(bookings);
  };

  useEffect(() => {
    setBookings(mockData);
    setFilteredBookings(mockData);
  }, []);

  return (
    <div className="booking-history-wrapper">
      <div className="booking-history-container">
        {/* Header */}
        <div className="booking-history-header">
          <h1>Lịch Sử Đặt Phòng</h1>
          <p className="subtitle">Xem lại các đặt phòng của bạn</p>
        </div>

        {/* Bộ lọc */}
        <div className="booking-filters">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              Tất cả
            </button>
            <button 
              className={`filter-tab ${activeFilter === "upcoming" ? "active" : ""}`}
              onClick={() => handleFilterChange("upcoming")}
            >
              Sắp đến
            </button>
            <button 
              className={`filter-tab ${activeFilter === "completed" ? "active" : ""}`}
              onClick={() => handleFilterChange("completed")}
            >
              Đã hoàn thành
            </button>
          </div>

          <div className="date-filter">
            <div className="date-inputs">
              <div className="date-input-group">
                <label htmlFor="startDate">Từ ngày:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateFilter.startDate}
                  onChange={handleDateFilterChange}
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="endDate">Đến ngày:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateFilter.endDate}
                  onChange={handleDateFilterChange}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Hiển thị số lượng kết quả */}
        <div className="filter-result-count">
          Tìm thấy <span>{filteredBookings.length}</span> đơn đặt phòng
        </div>

        <div className="booking-list">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>Không tìm thấy đơn đặt phòng nào phù hợp với bộ lọc.</p>
              <button className="reset-filter-btn" onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const soNgay = tinhSoNgay(
                booking.checkInDate,
                booking.checkOutDate
              );
              const isExpanded = expanded[booking.orderID] || false;
              const canCancel = canCancelBooking(booking.checkInDate);
              const isCompleted = new Date(booking.checkOutDate) < currentDate;

              return (
                <div key={booking.orderID} className={`booking-card ${isCompleted ? "completed" : "upcoming"}`}>
                  <div className="booking-card-header">
                    <div className="booking-card-image">
                      <img
                      style={{ width: "220px", height: "120px", objectFit: "cover"}}
                        src={booking.room.images[0]}
                        alt="Room"
                       
                      />
                      {isCompleted && <div className="status-badge completed">Đã hoàn thành</div>}
                      {!isCompleted && <div className="status-badge upcoming">Sắp đến</div>}
                    </div>
                    <div className="booking-card-info">
                      <h3 className="booking-title">
                        {booking.room.name} - {booking.room.roomType}
                      </h3>
                      <p className="booking-dates">
                        <span>
                          <i className="fas fa-calendar-check"></i>{" "}
                          {booking.checkInDate}
                        </span>
                        <span>
                          <i className="fas fa-calendar-times"></i>{" "}
                          {booking.checkOutDate}
                        </span>
                      </p>
                      <p className="booking-price">
                        Tổng cộng: {booking.price.toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                    <div className="booking-actions">
                    {canCancel && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelBooking(booking.orderID)}
                        >
                          Hủy phòng
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                      <button
                        className="details-btn"
                        onClick={() => toggleDetails(booking.orderID)}
                      >
                        {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                        <i
                          className={`fas fa-chevron-${
                            isExpanded ? "up" : "down"
                          }`}
                        ></i>
                      </button>

                    </div>
                  </div>

                  {isExpanded && (
                    <div className="booking-card-details">
                      <div className="separator"></div>
                      <h4>Chi tiết đặt phòng</h4>
                      <div className="booking-info">
                        <div className="booking-info-row">
                          <span className="label">Mã đặt phòng:</span>
                          <span className="value highlight">
                            #{booking.orderID}
                          </span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Ngày đặt:</span>
                          <span className="value">{booking.orderDate}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Tên phòng:</span>
                          <span className="value">{booking.room.name}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Vị trí:</span>
                          <span className="value">{booking.room.location}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Diện tích:</span>
                          <span className="value">
                            {booking.room.dienTich} m²
                          </span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Loại giường:</span>
                          <span className="value">
                            {booking.room.bedType} (Số lượng:{" "}
                            {booking.room.bedCount})
                          </span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Số ngày:</span>
                          <span className="value">{soNgay} ngày</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Loại phòng:</span>
                          <span className="value">
                            {booking.room.roomType} ({booking.room.soNguoi}{" "}
                            người)
                          </span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Đánh giá:</span>
                          <span className="value">
                            {renderStars(booking.room.danhGia)}{" "}
                            {booking.room.danhGia}/5
                          </span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Mô tả:</span>
                          <span className="value">{booking.room.moTa}</span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Tiện ích:</span>
                          <span className="value">
                            {booking.room.amenities.map((amenity, index) => (
                              <span key={index} className="badge">
                                {amenity}
                              </span>
                            ))}
                          </span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Dịch vụ:</span>
                          <span className="value">
                            {booking.room.services.map((service, index) => (
                              <span key={index} className="badge">
                                {service}
                              </span>
                            ))}
                          </span>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Hình ảnh phòng:</span>
                          <div className="image-gallery">
                            {booking.room.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Room ${index + 1}`}
                                className="room-image"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/150")
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <div className="booking-info-row">
                          <span className="label">Chính sách hủy:</span>
                          <span className="value policy">
                            {booking.room.chinhSachHuy}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;