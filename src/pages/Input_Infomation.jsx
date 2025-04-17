import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Input_Infomation.css';
import ProgressStepper from '../components/ProgressStepper';
import PaymentContext from '../context/PaymentContext';
import { AuthContext } from '../context/AuthProvider';
import { RoomTypeContext } from '../context/RoomProvider';
import {
  User, Phone, Mail, LogIn, LogOut, Users, Bed, Ruler, MapPin, Wifi,
  BadgeCheck, ConciergeBell, Info, ArrowRight
} from 'lucide-react';

const Input_Information = () => {
  const { curentRoom } = useContext(RoomTypeContext);
  const { user, updateUser } = useContext(AuthContext);
  const { step, handleStep } = useContext(PaymentContext);
  const navigate = useNavigate();

  useEffect(() => {
    handleStep(0);
  }, [handleStep]);

  const [ngayNhanPhong, setNgayNhanPhong] = useState('2025-04-16');
  const [ngayTraPhong, setNgayTraPhong] = useState('2025-04-19');

  // Initialize input states based on user existence
  const [fullName, setFullName] = useState(user?.userName || '');
  const [phone, setPhone] = useState(user?.sdt || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialRequest, setSpecialRequest] = useState('');

  // Update input states when user changes
  useEffect(() => {
    if (user) {
      setFullName(user.userName || '');
      setPhone(user.sdt || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const tinhSoNgay = () => {
    const ngayNhan = new Date(ngayNhanPhong);
    const ngayTra = new Date(ngayTraPhong);
    const soMiligiayTrongMotNgay = 1000 * 60 * 60 * 24;
    const soNgay = Math.round((ngayTra - ngayNhan) / soMiligiayTrongMotNgay);
    return soNgay > 0 ? soNgay : 1;
  };

  const soNgay = tinhSoNgay();
  const tongTien = curentRoom.price * soNgay;
  const danhGia = Math.floor(curentRoom.danhGia);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < danhGia ? 'star1' : 'star-empty'}>★</span>
      );
    }
    return stars;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create or update user data
    const userData = {
      accountID: user?.accountID || Math.floor(Math.random() * 1000),
      userName: fullName,
      sdt: phone,
      email: email,
    };

    // Update user in context
    updateUser(userData);

    const orderData = {
      orderID: Date.now().toString(),
      price: tongTien,
      roomID: curentRoom.roomID,
      orderDate: new Date().toISOString().split('T')[0],
      checkInDate: ngayNhanPhong,
      checkOutDate: ngayTraPhong,
      accountID: userData.accountID,
      attribute: JSON.stringify({
        roomType: curentRoom.roomType,
        bedType: curentRoom.bedType,
        bedCount: curentRoom.bedCount,
        soNguoi: curentRoom.soNguoi,
        specialRequest: specialRequest,
      }),
    };

    console.log('Lưu dữ liệu vào Orders:', orderData);

    setTimeout(() => {
      console.log('Đã lưu đơn đặt phòng thành công (giả lập)');
      handleStep(1);
      navigate('/paymentpage');
    }, 500);
  };

  return (
    <div className="booking-wrapper">
      <div className="booking-container">
        <div className="booking-header-infomation">
          <div style={{ maxWidth: '60%', margin: 'auto' }}>
            <ProgressStepper currentStep={step} />
          </div>
          <h1>Thông tin đặt phòng</h1>
          <p className="subtitle">{curentRoom.moTa}</p>
        </div>

        <div className="booking-content">
          <div className="booking-summary">
            <div className="summary-header">
              <div className="hotel-badge">
                <span className="hotel-badge-text">{curentRoom.roomTypeName}</span>
              </div>
              <h2 className="summary-title">{curentRoom.name}</h2>
              <div className="rating">
                {renderStars()}
                <span className="rating-text">{curentRoom.danhGia}</span>
              </div>
              <div className="room-type-badge">{curentRoom.roomType}</div>
            </div>

            <div className="separator"></div>

            <div className="booking-details">
              <div className="booking-period">
                <div className="date-column check-in">
                  <div className="date-label">Nhận phòng</div>
                  <div className="date-value">{ngayNhanPhong}</div>
                  <div className="date-icon">
                    <LogIn size={20} />
                  </div>
                </div>
                <div className="date-duration">
                  <div className="duration-line"></div>
                  <div className="duration-value">{soNgay} đêm</div>
                </div>
                <div className="date-column check-out">
                  <div className="date-label">Trả phòng</div>
                  <div className="date-value">{ngayTraPhong}</div>
                  <div className="date-icon">
                    <LogOut size={20} />
                  </div>
                </div>
              </div>

              <div className="separator"></div>

              <div className="booking-info-row">
                <div className="info-item">
                  <div className="info-icon">
                    <Users size={20} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Số khách</div>
                    <div className="info-value">{curentRoom.soNguoi} người</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <Bed size={20} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Loại giường</div>
                    <div className="info-value">{curentRoom.bedType}</div>
                  </div>
                </div>
              </div>

              <div className="booking-info-row">
                <div className="info-item">
                  <div className="info-icon">
                    <Ruler size={20} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Diện tích</div>
                    <div className="info-value">{curentRoom.dienTich} m²</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Vị trí</div>
                    <div className="info-value highlight">{curentRoom.location}</div>
                  </div>
                </div>
              </div>

              <div className="booking-info-row">
                <div className="info-item">
                  <div className="info-icon">
                    <Wifi size={20} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Tiện ích</div>
                    <div className="info-value">{curentRoom.amenities.join(', ')}</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <BadgeCheck size={20} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Mã đặt phòng</div>
                    <div className="info-value highlight">#{curentRoom.roomID}</div>
                  </div>
                </div>
              </div>

              <div className="booking-info-row">
                <div className="info-item full-width">
                  <div className="info-icon">
                    <ConciergeBell size={20} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Dịch vụ</div>
                    <div className="info-value">
                      {curentRoom.services.map((service, index) => (
                        <span key={index} className="badge" style={{ marginRight: '5px' }}>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="separator"></div>

              <div className="price-summary">
                <div className="price-row">
                  <span className="price-label">Giá phòng (1 đêm)</span>
                  <span className="price-value">{curentRoom.price.toLocaleString('vi-VN')} VND</span>
                </div>
                <div className="separator price-separator"></div>
                <div className="price-row total">
                  <span className="price-label">Tổng cộng</span>
                  <span className="price-value total-value">{tongTien.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h2 className="form-title">Thông tin khách hàng</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">
                  Họ và tên <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <User className="input-icon" size={20} />
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">
                    Số điện thoại <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Phone className="input-icon" size={20} />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+123456789"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Mail className="input-icon" size={20} />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@email.com"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="specialRequest">Yêu cầu đặc biệt</label>
                <div className="input-with-icon textarea-container">
                  <Info className="input-icon textarea-icon" size={20} />
                  <textarea
                    id="specialRequest"
                    name="specialRequest"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="Vui lòng chia sẻ những yêu cầu đặc biệt của bạn (nếu có)..."
                    rows="4"
                    className="form-input textarea"
                  />
                </div>
                <div className="form-note">
                  <Info size={16} className="note-icon" />
                  <span>Yêu cầu đặc biệt không được đảm bảo và có thể phát sinh phí bổ sung.</span>
                </div>
              </div>

              <div className="button-container">
                <button type="submit" className="pay-button">
                  Tiếp tục thanh toán <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input_Information;