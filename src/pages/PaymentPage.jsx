import { useState, useEffect } from 'react';
import '../Css/PaymentPage.css';
import { useNavigate } from 'react-router-dom';
import { useContext} from 'react';
import  PaymentContext  from '../context/PaymentContext';
import ProgressStepper from '../components/ProgressStepper';

const PaymentPage = () => {
  const { step, handleStep } = useContext(PaymentContext);
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState('credit-card');
  const [soThe, setSoThe] = useState('');
  const [ngayHetHan, setNgayHetHan] = useState('');
  const [maCVV, setMaCVV] = useState('');
  const [loi, setLoi] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [thongTinDatPhong, setThongTinDatPhong] = useState({
    roomID: '1',
    name: 'Standard Room 101',
    price: 800000,
    dienTich: 25.5,
    soNguoi: 2,
    bedType: 'Double',
    bedCount: 1,
    danhGia: '4.5',
    moTa: 'Cozy standard room',
    location: 'Floor 1',
    roomType: 'Standard',
    images: ['/room/1.png', '/room/2.png', '/room/3.png', '/room/4.png', '/room/5.png'],
    services: ['Parking', 'Breakfast', 'Wi-Fi'],
    amenities: ['Minibar', 'Air Conditioning', 'TV'],
  });

  const [ngayNhanPhong, setNgayNhanPhong] = useState('2025-04-16');
  const [ngayTraPhong, setNgayTraPhong] = useState('2025-04-18');

  const [account] = useState({
    userName: 'Nguyễn An Nguyên',
    phone: '0985746531',
    email: 'Nguyendeptrai@gmail.com',
  });


  const tinhSoNgay = () => {
    const ngayNhan = new Date(ngayNhanPhong);
    const ngayTra = new Date(ngayTraPhong);
    const soMiligiayTrongMotNgay = 1000 * 60 * 60 * 24;
    return Math.round((ngayTra - ngayNhan) / soMiligiayTrongMotNgay);
  };
  const soNgay = tinhSoNgay();
  const tongTien = thongTinDatPhong.price * soNgay;

  
  const orderData = {
    orderID: Math.floor(Date.now() / 1000),
    price: thongTinDatPhong.price * soNgay, 
    roomID: parseInt(thongTinDatPhong.roomID),
    orderDate: new Date().toISOString().split('T')[0],
    checkInDate: ngayNhanPhong,
    checkOutDate: ngayTraPhong,
    accountID: 1,
    attribute: JSON.stringify({
      roomType: thongTinDatPhong.roomType,
      bedType: thongTinDatPhong.bedType,
      bedCount: thongTinDatPhong.bedCount,
      soNguoi: thongTinDatPhong.soNguoi,
      paymentMethod: phuongThucThanhToan, 
    }),
  };

  const renderStars = () => {
    const danhGia = Math.floor(parseFloat(thongTinDatPhong.danhGia));
    const stars = [];
    const maxStars = 5;
    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <span key={i} className={i < danhGia ? 'star1' : 'star-empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    handleStep(1);
  }, [handleStep]);

  const handlePaymentMethodChange = (method) => {
    setPhuongThucThanhToan(method);
    setLoi('');
  };

  const validateCardDetails = () => {
    if (!soThe.match(/^\d{4} \d{4} \d{4} \d{4}$/)) return false;
    if (!ngayHetHan.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) return false;
    if (!maCVV.match(/^\d{3}$/)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleStep(2);
    if (phuongThucThanhToan === 'credit-card' && !validateCardDetails()) {
      setLoi('Vui lòng điền đầy đủ và đúng định dạng thông tin.');
      return;
    }
    try {

      setShowModal(true);
    } catch (error) {
      setLoi('Thanh toán thất bại. Vui lòng thử lại.');
    }
  };

  const handlePayAtHotelConfirm = () => {
    setShowModal(true);
  };

  const handleBankTransferConfirm = () => {

    setShowModal(true);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };


  return (
    <div className="payment-wrapper">
    <div className="payment-container">
      <div className="payment-header">
        <div style={{maxWidth:'60%',margin:'auto'}}>
        <ProgressStepper currentStep={step} />
        </div>
       
        <h1>Thanh toán đặt phòng</h1>
        <p className="subtitle">
          {thongTinDatPhong.name} - {thongTinDatPhong.moTa}
        </p>
      </div>

      <div className="payment-content-container">
        <div className="booking-summary">
          <div className="summary-header">
            <div className="hotel-badge">
              <span className="hotel-badge-text">{thongTinDatPhong.roomType}</span>
            </div>
            <h2 className="summary-title">{thongTinDatPhong.name}</h2>
            <div className="rating">
              {renderStars()}
              <span className="rating-text">{thongTinDatPhong.danhGia}</span>
            </div>
          </div>

          <div className="separator"></div>

          <div className="summary-details">
            <h3>Chi tiết đặt phòng</h3>
            <div className="booking-info">
              <div className="booking-info-row">
                <span className="label">Mã đặt phòng:</span>
                <span className="value highlight">#{thongTinDatPhong.roomID}</span>
              </div>
              <div className="booking-info-row">
                <span className="label">Tên phòng:</span>
                <span className="value">{thongTinDatPhong.name}</span>
              </div>
              <div className="booking-info-row">
                <span className="label">Vị trí:</span>
                <span className="value">{thongTinDatPhong.location}</span>
              </div>
              <div className="booking-info-row">
                <span className="label">Diện tích:</span>
                <span className="value">{thongTinDatPhong.dienTich} m²</span>
              </div>
              <div className="booking-info-row">
                <span className="label">Loại giường:</span>
                <span className="value">
                  {thongTinDatPhong.bedType} (Số lượng: {thongTinDatPhong.bedCount})
                </span>
              </div>
              <div className="booking-info-row">
                <span className="label">Ngày nhận phòng:</span>
                <span className="value">{ngayNhanPhong}</span>
              </div>
              <div className="booking-info-row">
                <span className="label">Ngày trả phòng:</span>
                <span className="value">{ngayTraPhong}</span>
              </div>
              <div className="booking-info-row">
                <span className="label">Loại phòng:</span>
                <span className="value">
                  {thongTinDatPhong.roomType} ({thongTinDatPhong.soNguoi} người)
                </span>
              </div>
              <div className="booking-info-row">
                <span className="label">Tiện ích:</span>
                <span className="value">
                  {thongTinDatPhong.amenities.map((amenity, index) => (
                    <span key={index} className="badge">
                      {amenity}
                    </span>
                  ))}
                </span>
              </div>
              <div className="booking-info-row">
                <span className="label">Dịch vụ:</span>
                <span className="value">
                  {thongTinDatPhong.services.map((service, index) => (
                    <span key={index} className="badge">
                      {service}
                    </span>
                  ))}
                </span>
              </div>

              <div className="separator"></div>

              <div className="booking-info-row total-price">
                <span className="label">Tổng cộng:</span>
                <span className="sum-price">
                  {tongTien.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-form">
          <h2 className="form-title">Chọn phương thức thanh toán</h2>

          <div className="payment-methods">
            <button
              className={`method-btn ${phuongThucThanhToan === 'credit-card' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodChange('credit-card')}
            >
              <i className="fas fa-credit-card"></i> Thẻ tín dụng
            </button>

            <button
              className={`method-btn ${phuongThucThanhToan === 'bank-transfer' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodChange('bank-transfer')}
            >
              <i className="fas fa-university"></i> Chuyển khoản
            </button>

            <button
              className={`method-btn ${phuongThucThanhToan === 'pay-at-hotel' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodChange('pay-at-hotel')}
            >
              <i className="fas fa-hotel"></i> Thanh toán tại khách sạn
            </button>
          </div>

          <div className="payment-content">
            {phuongThucThanhToan === 'credit-card' && (
              <form onSubmit={handleSubmit} className="credit-card-form animate-in">
                <div className="card-visual">
                  <div className="card-chip"></div>
                  <div className="card-number-preview">
                    {soThe || 'XXXX XXXX XXXX XXXX'}
                  </div>
                  <div className="card-details-preview">
                    <div className="card-expiry">
                      <span className="card-label">Valid Thru</span>
                      <span className="card-value">{ngayHetHan || 'MM/YY'}</span>
                    </div>
                    <div className="card-logo"></div>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Số thẻ tín dụng <span className="tooltip">16 chữ số</span>
                  </label>
                  <div className="input-with-icon">
                    <i className="fas fa-credit-card input-icon"></i>
                    <input
                      type="text"
                      value={soThe}
                      onChange={(e) => setSoThe(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="form-input"
                      maxLength="19"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày hết hạn</label>
                    <div className="input-with-icon">
                      <i className="fas fa-calendar-alt input-icon"></i>
                      <input
                        type="text"
                        value={ngayHetHan}
                        onChange={(e) => setNgayHetHan(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className="form-input"
                        maxLength="5"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Mã CVV <span className="tooltip">3 số ở mặt sau</span>
                    </label>
                    <div className="input-with-icon">
                      <i className="fas fa-lock input-icon"></i>
                      <input
                        type="password"
                        value={maCVV}
                        onChange={(e) =>
                          setMaCVV(e.target.value.replace(/[^0-9]/g, ''))
                        }
                        placeholder="123"
                        className="form-input"
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>

                {loi && (
                  <p className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {loi}
                  </p>
                )}

                <button type="submit" className="pay-button">
                  Thanh toán ngay <i className="fas fa-arrow-right"></i>
                </button>

                <p className="security-note">
                  <i className="fas fa-shield-alt"></i> Thanh toán an toàn với mã hóa SSL
                </p>
              </form>
            )}

            {phuongThucThanhToan === 'pay-at-hotel' && (
              <div className="pay-at-hotel-info animate-in">
                <h3>Thanh toán tại khách sạn</h3>
                <p>
                  Bạn sẽ thanh toán toàn bộ chi phí đặt phòng khi làm thủ tục nhận phòng tại khách sạn.
                </p>
                <div className="booking-details">
                  <p>
                    <strong>Tên khách hàng:</strong> {account.userName}
                  </p>
                  <p>
                    <strong>Email:</strong> {account.email}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {account.phone}
                  </p>
                  <p>
                    <strong>Phòng:</strong> {thongTinDatPhong.name} ({thongTinDatPhong.roomType})
                  </p>
                  <p>
                    <strong>Tổng cộng:</strong> {tongTien.toLocaleString('vi-VN')} VND
                  </p>
                </div>
                <p className="note">
                  <i className="fas fa-info-circle"></i> Vui lòng mang theo giấy tờ tùy thân hợp lệ khi nhận phòng. Liên hệ khách sạn qua số 0923646885 nếu có thắc mắc.
                </p>
                <button className="confirm-button" onClick={handlePayAtHotelConfirm}>
                  Xác nhận đặt phòng <i className="fas fa-check"></i>
                </button>
              </div>
            )}

            {phuongThucThanhToan === 'bank-transfer' && (
              <div className="bank-transfer-info animate-in">
                <div className="bank-card">
                  <div className="bank-header">
                    <div className="bank-logo vcb"></div>
                    <p className="bank-name">MB Bank (Ngân hàng Quân đội)</p>
                  </div>

                  <div className="bank-details">
                    <div className="bank-detail-row">
                      <span className="bank-label">Số tài khoản:</span>
                      <span className="bank-value">01122334455660</span>
                      <button className="copy-btn">
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>

                    <div className="bank-detail-row">
                      <span className="bank-label">Chủ tài khoản:</span>
                      <span className="bank-value">Nguyễn An Nguyên</span>
                    </div>

                    <div className="bank-detail-row">
                      <span className="bank-label">Nội dung:</span>
                      <span className="bank-value content-value">
                        Thanh toán #{thongTinDatPhong.roomID}
                      </span>
                      <button className="copy-btn">
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="qr-container">
                  <div className="qr-placeholder">
                    <img style={{ width: '100%', height: '100%' }} src="qr.jpg" alt="" />
                    <i className="fas fa-qrcode"></i>
                  </div>
                  <p className="qr-text">Quét mã QR để thanh toán nhanh</p>
                </div>

                <p className="bank-note">
                  <i className="fas fa-info-circle"></i> Vui lòng chuyển khoản trong 24
                  giờ để xác nhận đặt phòng của bạn.
                </p>

                <button className="confirm-transfer-btn" onClick={handleBankTransferConfirm}>
                  Tôi đã chuyển khoản
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {phuongThucThanhToan === 'pay-at-hotel'
                  ? 'Đặt phòng thành công!'
                  : 'Thanh toán thành công!'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <p>
                Cảm ơn bạn đã đặt phòng tại {thongTinDatPhong.name}!
              </p>
              <div className="modal-details">
                <p>
                  <strong>Mã đặt phòng:</strong> #{orderData.orderID}
                </p>
                <p>
                  <strong>Khách hàng:</strong> {account.userName}
                </p>
                <p>
                  <strong>Phòng:</strong> {thongTinDatPhong.name} ({thongTinDatPhong.roomType})
                </p>
                <p>
                  <strong>Ngày nhận phòng:</strong> {ngayNhanPhong}
                </p>
                <p>
                  <strong>Ngày trả phòng:</strong> {ngayTraPhong}
                </p>
                <p>
                  <strong>Số người:</strong> {thongTinDatPhong.soNguoi}
                </p>
                <p>
                  <strong>Tổng cộng:</strong> {tongTien.toLocaleString('vi-VN')} VND
                </p>
                <p>
                  <strong>Phương thức:</strong>{' '}
                  {phuongThucThanhToan === 'credit-card'
                    ? 'Thẻ tín dụng'
                    : phuongThucThanhToan === 'pay-at-hotel'
                    ? 'Thanh toán tại khách sạn'
                    : 'Chuyển khoản'}
                </p>
                {phuongThucThanhToan === 'pay-at-hotel' && (
                  <p>
                    <strong>Lưu ý:</strong> Vui lòng thanh toán tại quầy lễ tân khi nhận phòng. Mang theo mã đặt phòng và giấy tờ tùy thân.
                  </p>
                )}
                 {phuongThucThanhToan === 'bank-transfer' && (
                  <p>
                   Chúng tôi sẽ kiểm tra thanh toán và gửi email xác nhận ngay sau.
                  </p>
                )}
              </div>
              <p>
                Một email xác nhận đã được gửi đến {account.email}.
             
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-button"
                onClick={() => {
                  setShowModal(false);
                  navigate('/BookingHistory'); 
                }}
              >
                Hoàn tất <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}


    </div>  
  </div>
  );
};

export default PaymentPage