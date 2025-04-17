import React, { useContext } from "react";
import { Search } from "lucide-react";
import { RoomTypeContext } from "../context/RoomProvider";

const SearchBar = ({
  showSearchFiller,
  setShowSearchFiller,
  setItemSelected, // Thêm prop setItemSelected
}) => {
  const { searchData } = useContext(RoomTypeContext);

  const handleItemClick = (item) => {
    setShowSearchFiller(true); // Hiển thị SearchbarFiller
    setItemSelected(item); // Cập nhật item được chọn
  };

  // Hàm định dạng ngày hiển thị
  const formatDateRange = () => {
    if (searchData.checkInDate && searchData.checkOutDate) {
      const start = searchData.checkInDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const end = searchData.checkOutDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${start} - ${end}`;
    }
    return "Tuần bất kỳ";
  };

  return (
    <div
      className={`search-bar d-flex align-items-center border position-absolute p-2 rounded-pill ${
        !showSearchFiller ? "fade-in" : "fade-out"
      }`}
    >
      <div
        className="px-3 fw-bold search-item search-item-1"
        onClick={() => handleItemClick("location")} // Truyền "location"
      >
        {searchData.location || "Địa điểm bất kỳ"}
      </div>
      <div className="split-line split-line-1"></div>
      <div
        className="px-3 fw-bold search-item ms-1 search-item-2"
        onClick={() => handleItemClick("check-in")} // Truyền "check-in"
      >
        {formatDateRange()}
      </div>
      <div className="split-line split-line-2"></div>
      <div
        className={`px-3 search-item ms-1 search-item-3 ${
          searchData.guests.adults +
            searchData.guests.children +
            searchData.guests.infants >
          0
            ? "fw-bold"
            : "text-secondary"
        }`}
        onClick={() => handleItemClick("guest")} // Truyền "guest"
      >
        {searchData.guests.adults +
          searchData.guests.children +
          searchData.guests.infants >
        0
          ? `${
              searchData.guests.adults +
              searchData.guests.children +
              searchData.guests.infants
            } khách`
          : "Thêm khách"}
      </div>
      <div className="d-flex align-items-center">
        <div className="search-btn p-1 rounded-circle d-flex justify-content-center align-items-center">
          <Search size={20} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
