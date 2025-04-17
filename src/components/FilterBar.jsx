import { useState, useEffect, useRef, useContext } from "react";
import { ChevronDown, Home } from "lucide-react";
import PriceFilter from "./PriceFilter";
import { RoomTypeContext } from "../context/RoomProvider";
import RoomTypeFilter from "./RoomTypeFilter";

const FilterBar = () => {
  const {
    filters,
    roomTypes,
    availableAmenities,
    availableServices,
    handleRoomTypeChange,
    handlePriceChange,
    handleAmenityChange,
    handleServiceChange, // Thêm handler cho dịch vụ
  } = useContext(RoomTypeContext);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const amenitiesRef = useRef(null);

  // Xử lý click bên ngoài để đóng dropdown tiện nghi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        amenitiesRef.current &&
        !amenitiesRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="filter-bar d-flex align-items-center gap-5 py-2 bg-white">
      {/* Bộ lọc loại phòng - Thanh trượt ngang với icon */}
      <RoomTypeFilter />

      {/* Bộ lọc giá - Sử dụng PriceFilter */}
      <div className="filter-item d-flex flex-column">
        <PriceFilter
          priceRange={filters.priceRange}
          setPriceRange={handlePriceChange}
        />
      </div>

      {/* Bộ lọc tiện nghi và dịch vụ */}
      <div className="filter-item position-relative" ref={amenitiesRef}>
        <button
          className="rounded-pill d-flex align-items-center gap-2 px-3 py-2"
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          style={{
            border: "1px solid #ddd",
            backgroundColor: "white",
            color: "#222",
            transition: "all 0.3s ease",
          }}
          aria-label="Toggle amenities and services filter"
        >
          Tiện nghị và dịch vụ
          <ChevronDown size={16} style={{ color: "#FF385C" }} />
        </button>
        {showFilterDropdown && (
          <div
            className="position-absolute bg-white border rounded-3 mt-2 p-3 shadow-sm"
            style={{ zIndex: 1000, width: "220px" }}
          >
            <div>
              <h5>Tiện nghi</h5>
              {availableAmenities.map((amenity) => (
                <div
                  key={amenity.amenityID}
                  className="d-flex align-items-center gap-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    style={{ accentColor: "#FF385C" }}
                    aria-label={`Select ${amenity.name} amenity`}
                  />
                  <img src={amenity.pathImg} style={{ width: "18px" }} alt="" />
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
            <div>
              <h5>Dịch vụ</h5>
              {availableServices.map((service) => (
                <div
                  key={service.serviceID}
                  className="d-flex align-items-center gap-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={filters.services.includes(service)}
                    onChange={() => handleServiceChange(service)}
                    style={{ accentColor: "#FF385C" }}
                    aria-label={`Select ${service.name} service`}
                  />
                  <img src={service.pathImg} style={{ width: "18px" }} alt="" />
                  <span>{service.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
