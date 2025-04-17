import React, { useState, useEffect, useContext } from "react";
import { RoomTypeContext } from "../context/RoomProvider";

const PriceFilter = () => {
  const { filters, setPriceRange } = useContext(RoomTypeContext);

  const [range, setRange] = useState({
    min: 0,
    max: 600,
  });

  // Sync range with priceRange from props
  useEffect(() => {
    setRange({ min: filters.priceRange[0], max: filters.priceRange[1] });
  }, [filters.priceRange]);

  const handleMinChange = (e) => {
    const min = parseInt(e.target.value);
    if (min <= range.max - 10) {
      const newRange = { ...range, min };
      setRange(newRange);
      setPriceRange([newRange.min, newRange.max]);
    }
  };

  const handleMaxChange = (e) => {
    const max = parseInt(e.target.value);
    if (max >= range.min + 10) {
      const newRange = { ...range, max };
      setRange(newRange);
      setPriceRange([newRange.min, newRange.max]);
    }
  };

  // Calculate percentage for custom range track
  const minPos = (range.min / 1000) * 100;
  const maxPos = (range.max / 1000) * 100;

  return (
    <div className="filter-item d-flex flex-column">
      <div className="d-flex justify-content-between mb-2">
        <span style={{ color: "#222", fontWeight: "bold" }}>{range.min} $</span>
        <span style={{ color: "#222", fontWeight: "bold" }}>{range.max} $</span>
      </div>
      <div className="position-relative" style={{ height: "20px" }}>
        {/* Custom track background */}
        <div
          className="position-absolute"
          style={{
            height: "2px",
            backgroundColor: "#ddd",
            borderRadius: "3px",
            top: "7px",
            zIndex: 0,
            left: 0,
            right: 0,
          }}
        ></div>

        {/* Active track section */}
        <div
          className="position-absolute"
          style={{
            height: "2px",
            backgroundColor: "#FF385C",
            borderRadius: "3px",
            top: "7px",
            left: `${minPos}%`,
            right: `${100 - maxPos}%`,
          }}
        ></div>

        <input
          type="range"
          min="0"
          max="1000"
          value={range.min}
          onChange={handleMinChange}
          className="position-absolute start-0 end-0 range-min"
          style={{
            zIndex: 2,
            top: 0,
            width: "100%",
            background: "transparent",
            appearance: "none",
            WebkitAppearance: "none",
            pointerEvents: "none", // Prevent track from capturing events
          }}
        />
        <input
          type="range"
          min="0"
          max="1000"
          value={range.max}
          onChange={handleMaxChange}
          className="position-absolute start-0 end-0 range-max"
          style={{
            zIndex: 1,
            top: 0,
            width: "100%",
            background: "transparent",
            appearance: "none",
            WebkitAppearance: "none",
            pointerEvents: "none", // Prevent track from capturing events
          }}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
