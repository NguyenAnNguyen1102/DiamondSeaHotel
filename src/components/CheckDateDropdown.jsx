import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import { RoomTypeContext } from "../context/RoomProvider";

const CheckDateDropdown = ({
  onSelectCheckIn,
  onSelectCheckOut,
  onSelectLocation,
}) => {
  const { checkInDate, checkOutDate, updateSearchData } =
    useContext(RoomTypeContext);
  const [selectedStartDate, setSelectedStartDate] = useState(checkInDate);
  const [selectedEndDate, setSelectedEndDate] = useState(checkOutDate);
  const [checkDate, setCheckDate] = useState({
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    rangeOfDate: 0,
  });
  const [currentMonthLeft, setCurrentMonthLeft] = useState(3); // Tháng 4
  const [currentMonthRight, setCurrentMonthRight] = useState(4); // Tháng 5
  const [currentYearLeft, setCurrentYearLeft] = useState(2025);
  const [currentYearRight, setCurrentYearRight] = useState(2025);

  const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  useEffect(() => {
    setSelectedStartDate(checkInDate);
    setSelectedEndDate(checkOutDate);
    setCheckDate({
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      rangeOfDate: checkDate.rangeOfDate,
    });
  }, [checkInDate, checkOutDate]);

  const generateDays = (month, year) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < adjustedFirstDay; i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }

    return daysArray;
  };

  const daysLeft = generateDays(currentMonthLeft, currentYearLeft);
  const daysRight = generateDays(currentMonthRight, currentYearRight);

  const handleDateClick = (day, month, year) => {
    const clickedDate = new Date(year, month, day);

    if (
      checkDate.checkInDate &&
      clickedDate.getTime() === checkDate.checkInDate.getTime()
    ) {
      return;
    }

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      setCheckDate({
        ...checkDate,
        checkInDate: clickedDate,
        checkOutDate: null,
      });
      updateSearchData({
        checkInDate: clickedDate,
        checkOutDate: null,
      });
      onSelectCheckIn();
    } else if (selectedStartDate && !selectedEndDate) {
      if (clickedDate >= selectedStartDate) {
        setSelectedEndDate(clickedDate);
        setCheckDate({
          ...checkDate,
          checkInDate: selectedStartDate,
          checkOutDate: clickedDate,
        });
        updateSearchData({
          checkInDate: selectedStartDate,
          checkOutDate: clickedDate,
        });
        onSelectCheckOut();
      } else {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(clickedDate);
        setCheckDate({
          ...checkDate,
          checkInDate: clickedDate,
          checkOutDate: selectedStartDate,
        });
        updateSearchData({
          checkInDate: clickedDate,
          checkOutDate: selectedStartDate,
        });
        onSelectLocation();
      }
    }
  };

  const handlePrevMonth = () => {
    let newMonthLeft = currentMonthLeft - 1;
    let newYearLeft = currentYearLeft;
    if (newMonthLeft < 0) {
      newMonthLeft = 11;
      newYearLeft -= 1;
    }

    let newMonthRight = currentMonthRight - 1;
    let newYearRight = currentYearRight;
    if (newMonthRight < 0) {
      newMonthRight = 11;
      newYearRight -= 1;
    }

    setCurrentMonthLeft(newMonthLeft);
    setCurrentYearLeft(newYearLeft);
    setCurrentMonthRight(newMonthRight);
    setCurrentYearRight(newYearRight);
  };

  const handleNextMonth = () => {
    let newMonthLeft = currentMonthLeft + 1;
    let newYearLeft = currentYearLeft;
    if (newMonthLeft > 11) {
      newMonthLeft = 0;
      newYearLeft += 1;
    }

    let newMonthRight = currentMonthRight + 1;
    let newYearRight = currentYearRight;
    if (newMonthRight > 11) {
      newMonthRight = 0;
      newYearRight += 1;
    }

    setCurrentMonthLeft(newMonthLeft);
    setCurrentYearLeft(newYearLeft);
    setCurrentMonthRight(newMonthRight);
    setCurrentYearRight(newYearRight);
  };

  const handleQuickSelect = (range) => {
    setCheckDate({ ...checkDate, rangeOfDate: range });
  };

  const isDateInRange = (day, month, year) => {
    if (!selectedStartDate || !selectedEndDate || !day) return false;
    const date = new Date(year, month, day);
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isStartOrEndDate = (day, month, year) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    return (
      (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
      (selectedEndDate && date.getTime() === selectedEndDate.getTime())
    );
  };

  const isDayAfterCheckIn = (day, month, year) => {
    if (!selectedStartDate || !selectedEndDate || !day) return false;
    const date = new Date(year, month, day);
    const dayAfterCheckIn = new Date(selectedStartDate);
    dayAfterCheckIn.setDate(selectedStartDate.getDate() + 1);
    return date.getTime() === dayAfterCheckIn.getTime();
  };

  const isDayBeforeCheckOut = (day, month, year) => {
    if (!selectedEndDate || !day) return false;
    const date = new Date(year, month, day);
    const dayBeforeCheckOut = new Date(selectedEndDate);
    dayBeforeCheckOut.setDate(selectedEndDate.getDate() - 1);
    return date.getTime() === dayBeforeCheckOut.getTime();
  };

  const getGradientDirection = (index, isAfterCheckIn) => {
    const columnIndex = index % 7;
    if (isAfterCheckIn) {
      return columnIndex === 0 ? "to right" : "to right";
    } else {
      return columnIndex === 6 ? "to right" : "to right";
    }
  };

  return (
    <div
      className="check-date-dropdown bg-white position-absolute"
      style={{ top: "80px", left: "-43%", zIndex: 1001 }} // Thêm z-index để nằm trên FilterBar
    >
      <div className="check-date-header">
        <button className="nav-btn" onClick={handlePrevMonth}>
          <ChevronLeft />
        </button>
        <button className="nav-btn" onClick={handleNextMonth}>
          <ChevronRight />
        </button>
      </div>

      <div className="calendars">
        <div className="calendar">
          <h3>
            Tháng {currentMonthLeft + 1} năm {currentYearLeft}
          </h3>
          <div className="days-of-week">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="day-label">
                {day}
              </div>
            ))}
          </div>
          <div className="days">
            {daysLeft.map((day, index) => {
              const inRange = isDateInRange(
                day,
                currentMonthLeft,
                currentYearLeft
              );
              const isStartOrEnd = isStartOrEndDate(
                day,
                currentMonthLeft,
                currentYearLeft
              );
              const isAfterCheckIn = isDayAfterCheckIn(
                day,
                currentMonthLeft,
                currentYearLeft
              );
              const isBeforeCheckOut = isDayBeforeCheckOut(
                day,
                currentMonthLeft,
                currentYearLeft
              );

              let backgroundStyle = "transparent";
              if (isStartOrEnd) {
                backgroundStyle = "#000";
              } else if (isAfterCheckIn) {
                const direction = getGradientDirection(index, true);
                backgroundStyle = `linear-gradient(${direction}, #FFFFFF, #E6E6E6)`;
              } else if (isBeforeCheckOut) {
                const direction = getGradientDirection(index, false);
                backgroundStyle = `linear-gradient(${direction}, #E6E6E6, #FFFFFF)`;
              } else if (inRange) {
                backgroundStyle = "#E6E6E6";
              }

              return (
                <div
                  key={index}
                  className="day"
                  style={{
                    borderRadius: isStartOrEnd ? "50%" : "0",
                    background: backgroundStyle,
                    color: isStartOrEnd ? "#fff" : "#000",
                  }}
                  onClick={() =>
                    day &&
                    handleDateClick(day, currentMonthLeft, currentYearLeft)
                  }
                >
                  {day || ""}
                </div>
              );
            })}
          </div>
        </div>

        <div className="calendar">
          <h3>
            Tháng {currentMonthRight + 1} năm {currentYearRight}
          </h3>
          <div className="days-of-week">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="day-label">
                {day}
              </div>
            ))}
          </div>
          <div className="days">
            {daysRight.map((day, index) => {
              const inRange = isDateInRange(
                day,
                currentMonthRight,
                currentYearRight
              );
              const isStartOrEnd = isStartOrEndDate(
                day,
                currentMonthRight,
                currentYearRight
              );
              const isAfterCheckIn = isDayAfterCheckIn(
                day,
                currentMonthRight,
                currentYearRight
              );
              const isBeforeCheckOut = isDayBeforeCheckOut(
                day,
                currentMonthRight,
                currentYearRight
              );

              let backgroundStyle = "transparent";
              if (isStartOrEnd) {
                backgroundStyle = "#000";
              } else if (isAfterCheckIn) {
                const direction = getGradientDirection(index, true);
                backgroundStyle = `linear-gradient(${direction}, #FFFFFF, #E6E6E6)`;
              } else if (isBeforeCheckOut) {
                const direction = getGradientDirection(index, false);
                backgroundStyle = `linear-gradient(${direction}, #E6E6E6, #FFFFFF)`;
              } else if (inRange) {
                backgroundStyle = "#E6E6E6";
              }

              return (
                <div
                  key={index}
                  className="day"
                  style={{
                    borderRadius: isStartOrEnd ? "50%" : "0",
                    background: backgroundStyle,
                    color: isStartOrEnd ? "#fff" : "#000",
                  }}
                  onClick={() =>
                    day &&
                    handleDateClick(day, currentMonthRight, currentYearRight)
                  }
                >
                  {day || ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="quick-select">
        <button
          className={`quick-select-btn ${
            checkDate.rangeOfDate === 0 ? "active" : ""
          }`}
          onClick={() => handleQuickSelect(0)}
        >
          Ngày chính xác
        </button>
        <button
          className={`quick-select-btn ${
            checkDate.rangeOfDate === 1 ? "active" : ""
          }`}
          onClick={() => handleQuickSelect(1)}
        >
          ± 1 ngày
        </button>
        <button
          className={`quick-select-btn ${
            checkDate.rangeOfDate === 2 ? "active" : ""
          }`}
          onClick={() => handleQuickSelect(2)}
        >
          ± 2 ngày
        </button>
        <button
          className={`quick-select-btn ${
            checkDate.rangeOfDate === 3 ? "active" : ""
          }`}
          onClick={() => handleQuickSelect(3)}
        >
          ± 3 ngày
        </button>
        <button
          className={`quick-select-btn ${
            checkDate.rangeOfDate === 7 ? "active" : ""
          }`}
          onClick={() => handleQuickSelect(7)}
        >
          ± 7 ngày
        </button>
        <button
          className={`quick-select-btn ${
            checkDate.rangeOfDate === 14 ? "active" : ""
          }`}
          onClick={() => handleQuickSelect(14)}
        >
          ± 14 ngày
        </button>
      </div>

      <div className="selected-dates">
        <p>
          Check-in Date:{" "}
          {checkDate.checkInDate?.toLocaleDateString() || "Not selected"}
        </p>
        <p>
          Check-out Date:{" "}
          {checkDate.checkOutDate?.toLocaleDateString() || "Not selected"}
        </p>
        <p>Range of Date: {checkDate.rangeOfDate}</p>
      </div>
    </div>
  );
};

export default CheckDateDropdown;
