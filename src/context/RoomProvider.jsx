import { createContext, useEffect, useState } from "react";
import anyWhere from "../assets/location/any-where.png";
import austrialia from "../assets/location/austrialia.png";
import europe from "../assets/location/europe.png";
import korea from "../assets/location/korea.png";
import thailand from "../assets/location/thailand.png";
import usa from "../assets/location/usa.png";
import axios from "axios";

export const RoomTypeContext = createContext([]);

const RoomTypeProvider = ({ children }) => {
  const [searchData, setSearchData] = useState({
    location: "Tìm kiếm điểm đến",
    checkInDate: null,
    checkOutDate: null,
    guests: {
      adults: 0,
      children: 0,
      infants: 0,
    },
  });

  const updateSearchData = (newData) => {
    setSearchData((prev) => ({ ...prev, ...newData }));
  };

  // Trạng thái bộ lọc
  const [filters, setFilters] = useState({
    roomType: "Any",
    priceRange: [50, 500],
    amenities: [],
    services: [], // Thêm services vào filters
  });

  const [locations, setLocations] = useState([
    { name: "Tìm kiếm linh hoạt", img: anyWhere },
    { name: "Austrialia", img: austrialia },
    { name: "France", img: europe },
    { name: "South Korea", img: korea },
    { name: "Thailand", img: thailand },
    { name: "United States", img: usa },
  ]);

  
  const [curentRoom,setCurentRoom] = useState({});


  //Danh sách phòng
  const [rooms, setRooms] = useState([]);
  // Danh sách các loại phòng với icon tương ứng
  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Danh sách tiện nghi với icon
  const [availableAmenities, setAvailableAmenities] = useState([]);

  // Danh sách dịch vụ với icon
  const [availableServices, setAvailableServices] = useState([]);

  // Fetch room types từ API
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:3000/roomtypes");
        setRoomTypes(response.data);
      } catch (error) {
        console.error("Error fetching room types:", error);
        setError("Không thể tải danh sách loại phòng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchAmenities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:3000/amenities");
        setAvailableAmenities(response.data);
      } catch (error) {
        console.error("Error fetching room types:", error);
        setError("Không thể tải danh sách loại phòng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:3000/services");
        setAvailableServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await axios.get("http://localhost:3000/rooms").then((response) => {
          setRooms(response.data);
        });
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Không thể tải danh sách phòng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };




    fetchRoomTypes();
    fetchAmenities();
    fetchServices();
    fetchRooms();
  
  }, []);

  // Xử lý thay đổi loại phòng
  const handleRoomTypeChange = (roomType) => {
    setFilters((prev) => ({ ...prev, roomType }));
  };

  // Xử lý thay đổi giá
  const handlePriceChange = (newPriceRange) => {
    setFilters((prev) => ({ ...prev, priceRange: newPriceRange }));
  };

  // Xử lý thay đổi tiện nghi
  const handleAmenityChange = (amenity) => {
    setFilters((prev) => {
      const updatedAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item.amenityID !== amenity.amenityID)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: updatedAmenities };
    });
  };

  // Xử lý thay đổi dịch vụ
  const handleServiceChange = (service) => {
    setFilters((prev) => {
      const updatedServices = prev.services.includes(service)
        ? prev.services.filter((item) => item.serviceID !== service.serviceID)
        : [...prev.services, service];
      return { ...prev, services: updatedServices };
    });
  };


      // setCurentRoom(filteredRooms[0]);
      const handleClickRoom = (roomID) => {

        const selectedRoom = rooms.find(room => room.roomID === roomID);
        setCurentRoom(selectedRoom);

      }
  


  return (
    <RoomTypeContext.Provider
      value={{
        searchData,
        updateSearchData,
        filters,
        setFilters,
        locations,
        roomTypes,
        availableAmenities,
        availableServices,
        handleRoomTypeChange,
        handlePriceChange,
        handleAmenityChange,
        handleServiceChange,
        rooms,
        isLoading,
        error,
        handleClickRoom,
        curentRoom
      }}
    >
      {children}
    </RoomTypeContext.Provider>
  );
};

export default RoomTypeProvider;
