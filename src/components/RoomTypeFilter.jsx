import React, { useContext } from "react";
import { RoomTypeContext } from "../context/RoomProvider";

const RoomTypeFilter = () => {
  const { roomTypes, handleRoomTypeChange, filters } =
    useContext(RoomTypeContext);
  return (
    <div className="filter-item d-flex flex-column">
      <div
        className="room-types-slider d-flex gap-3"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        {roomTypes.map((type) => (
          <button
            key={type.roomTypeID}
            className={`room-type-btn rounded-pill d-flex align-items-center gap-2 px-3 py-2 ${
              filters.roomType === type.NAME ? "active" : ""
            }`}
            onClick={() => handleRoomTypeChange(type.NAME)}
            style={{
              border: `1px solid ${
                filters.roomType === type.NAME ? "#FF385C" : "#ddd"
              }`,
              backgroundColor:
                filters.roomType === type.NAME ? "#FFF5F7" : "white",
              color: filters.roomType === type.NAME ? "#FF385C" : "#222",
              transition: "all 0.3s ease",
            }}
          >
            <img src={type.pathImg} style={{ width: "24px" }} alt="" />
            <span>{type.NAME}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomTypeFilter;
