import { Minus, Plus } from "lucide-react";
import { useContext } from "react";
import { RoomTypeContext } from "../context/RoomProvider";

const GuestDropdown = () => {
  const { searchData, updateSearchData } = useContext(RoomTypeContext);

  const guests = searchData.guests;

  return (
    <div
      className="guest-dropdown position-absolute bg-white border p-4"
      style={{ top: "80px", left: "-40px", borderRadius: "16px", zIndex: 1001 }} // Giữ z-index 1001
    >
      <GuestDropdownItem
        title="Adults"
        description="Ages 13 or above"
        count={guests.adults}
        setCount={(count) =>
          updateSearchData({
            guests: { ...guests, adults: count },
          })
        }
      />
      <GuestDropdownItem
        title="Trẻ em"
        description="Độ tuổi 2 - 12"
        count={guests.children}
        setCount={(count) =>
          updateSearchData({
            guests: { ...guests, children: count },
          })
        }
      />
      <GuestDropdownItem
        title="Em bé"
        description="Thú cưng"
        end={true}
        count={guests.infants}
        setCount={(count) =>
          updateSearchData({
            guests: { ...guests, infants: count },
          })
        }
      />
    </div>
  );
};

export default GuestDropdown;

const GuestDropdownItem = ({
  title,
  description,
  end = false,
  count,
  setCount,
}) => {
  const decrement = () => {
    if (count > 0) setCount(count - 1);
  };
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div
      className={`guest-dropdown-item d-flex align-items-center py-3 ${
        !end ? "border-bottom" : ""
      }`}
    >
      <div className="me-5" style={{ width: "100px" }}>
        <h5 className="fw-bold">{title}</h5>
        <p className="text-secondary">{description}</p>
      </div>
      <div className="d-flex ms-5 align-items-center">
        <div
          className="border border-2 p-1 rounded-circle mx-2"
          onClick={decrement}
        >
          <Minus />
        </div>
        <div className="mx-2 text-center" style={{ width: "50px" }}>
          {count}
        </div>
        <div
          className="border border-2 p-1 rounded-circle mx-2"
          onClick={increment}
        >
          <Plus />
        </div>
      </div>
    </div>
  );
};
