import {
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import Logo from "./Logo";
import { Container, Navbar, Nav } from "react-bootstrap";
import SearchBar from "./Searchbar";
import { Globe } from "lucide-react";
import UserActions from "./UserActions";
import SearchbarFiller from "./SearchbarFiller";
import FilterBar from "./FilterBar"; // Import FilterBar component
import { Link } from "react-router-dom";
import { RoomTypeContext } from "../context/RoomProvider";
import { useLocation } from "react-router-dom";
import { NavigateContext } from "../context/NavigateProvider";

const Header = () => {
  const { paths } = useContext(NavigateContext);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { searchData, updateSearchData, filters, setFilters } =
    useContext(RoomTypeContext);
  const [showSearchFiller, setShowSearchFiller] = useState(false);
  const [itemSelected, setItemSelected] = useState("");
  const lastScrollY = useRef(0);
  const rafId = useRef(null);
  const isScrolling = useRef(false);
  const headerRef = useRef(null);

  // Xử lý click bên ngoài để đóng SearchFiller
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowSearchFiller(false);
        setItemSelected("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="position-fixed bg-white start-0 end-0"
      style={{ top: 0, zIndex: 1000 }}
      ref={headerRef}
    >
      <Navbar
        className={` ${!showSearchFiller ? "border-bottom" : ""}`}
        style={{ padding: "35px 0px" }}
      >
        <Container className="ms-5" style={{ paddingRight: "0" }}>
          <Navbar.Brand>
            <Link to="/">
              <Logo />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Link
                style={{ marginLeft: "100px" }}
                to={paths.about}
                className="btn-item p-2 fw-semibold text-black text-decoration-none"
              >
                About
              </Link>
              <Link
                style={{ marginRight: "100px" }}
                to={paths.contact}
                className="btn-item p-2 fw-semibold text-black text-decoration-none"
              >
                Contact
              </Link>
              <Link
                style={{ marginRight: "100px" }}
                to={paths.hotelhot}
                className="btn-item p-2 fw-semibold text-black text-decoration-none"
              >
                <span
                  style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}
                >
                  Hot
                </span>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <Container
          className="position-relative"
          style={{ marginLeft: "-105px" }}
        >
          {!showSearchFiller && (
            <SearchBar
              showSearchFiller={showSearchFiller}
              setShowSearchFiller={setShowSearchFiller}
              setItemSelected={setItemSelected}
            />
          )}
        </Container>
        <Container className="me-5" style={{ width: "max-content" }}>
          <div
            className="btn-item p-2 fw-semibold"
            style={{ width: "max-content" }}
          >
            Cho thuê chỗ ở qua Airbnb
          </div>
          <div className="btn-item p-2 d-flex justify-content-center align-items-center">
            <Globe size={19} />
          </div>
          <UserActions />
        </Container>
      </Navbar>
      <Navbar
        className={`search-bar-filler position-relative ${
          showSearchFiller ? "fade-in d-block border-bottom" : "fade-out d-none"
        }`}
        style={{ zIndex: 2 }}
      >
        <Container className="d-flex justify-content-center">
          <SearchbarFiller
            searchData={searchData}
            updateSearchData={updateSearchData}
            setShowSearchFiller={setShowSearchFiller}
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
          />
        </Container>
      </Navbar>
      {
        // <Navbar
        //   className="filter-bar border-bottom py-3 bg-white"
        //   style={{ zIndex: 1 }}
        // >
        //   <Container className="d-flex justify-content-center">
        //     <FilterBar />
        //   </Container>
        // </Navbar>
      }
    </div>
  );
};

export default Header;
