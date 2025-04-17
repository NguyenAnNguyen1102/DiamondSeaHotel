import  { useState } from "react";
import { Card, Carousel } from "react-bootstrap";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RoomTypeContext } from "../context/RoomProvider";
import { useContext } from "react";
const RoomCard = ({ id, price, bedType, bedCount, location, images }) => {
  const navigate = useNavigate();
  const {handleClickRoom} = useContext(RoomTypeContext);
  // Số lượng hình ảnh trong Carousel (minh họa 3 hình ảnh)
  const imageCount = 3;

  // State để theo dõi trạng thái của trái tim
  const [isFavorite, setIsFavorite] = useState(false);

  // Hàm xử lý khi ấn vào trái tim
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra card
    setIsFavorite(!isFavorite);
  };


  const handleCardClick = () => {
    handleClickRoom(id);
    navigate(`/room/${id}`);

  };




  return (
    <Card
      id={id}
      style={{
        width: "18rem",
        borderRadius: "12px", // Bo góc 12px cho Card
        overflow: "visible", // Đảm bảo không cắt xén các góc
        cursor: "pointer",
      }}
      className="room-card border m-4"
      onClick={handleCardClick} // Thêm sự kiện click vào card
    >
      {/* Carousel với biểu tượng trái tim */}
      <div style={{ position: "relative", overflow: "visible" }}>
        <Carousel
          interval={null}
          indicators={true}
          controls={true}
          className="custom-carousel"
          style={{ borderRadius: "12px", overflow: "visible" }} // Đảm bảo Carousel không cắt xén
        >
          {images.map((img) => (
            <Carousel.Item
              key={img.imageID}
              style={{ borderRadius: "12px", overflow: "visible" }}
            >
              <img
                style={{
                  width: "100%",
                  height: "220px",
                  borderRadius: "12px", // Bo góc 12px cho hình ảnh
                  objectFit: "cover",
                  objectPosition: "center", // Đảm bảo hình ảnh hiển thị đúng với bo góc
                  display: "block", // Loại bỏ khoảng trống dưới hình ảnh
                }}
                loading="lazy"
                src={img.pathImg}
                alt=""
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <CustomHeart
          isFavourite={isFavorite}
          handleFavoriteClick={handleFavoriteClick}
        />
      </div>

      {/* Nội dung thẻ */}
      <Card.Body className="p-3" style={{ padding: "10px 0" }}>
        <Card.Title style={{ fontSize: "16px", fontWeight: "bold" }}>
          {location}
        </Card.Title>
        <Card.Text style={{ fontSize: "14px", color: "#6c757d" }}>
          {`${bedCount} giường ${bedType}`}
        </Card.Text>
        <Card.Text style={{ fontSize: "14px", fontWeight: "bold" }}>
          ${price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;

const CustomHeart = ({ isFavourite = true, handleFavoriteClick }) => {
  return (
    <>
      {isFavourite ? (
        <FaHeart
          size={24}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "red",
            padding: "3px", // Khoảng cách giữa biểu tượng và viền
            cursor: "pointer",
            zIndex: 1, // Đảm bảo biểu tượng nằm trên carousel
          }}
          onClick={handleFavoriteClick} // Sự kiện khi ấn vào trái tim
        />
      ) : (
        <FaRegHeart
          size={24}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "white", // Màu của biểu tượng
            // Làm trái tim nằm trong một vòng tròn
            padding: "3px", // Khoảng cách giữa biểu tượng và viền
            cursor: "pointer",
            zIndex: 1, // Đảm bảo biểu tượng nằm trên carousel
          }}
          onClick={handleFavoriteClick} // Sự kiện khi ấn vào trái tim
        />
      )}
    </>
  );
};
