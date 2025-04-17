import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { NavigateContext } from "../context/NavigateProvider";
import { AuthContext } from "../context/AuthProvider";

const UserActionDropdown = () => {
  const { paths } = useContext(NavigateContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div
      className="user-action-dropdown position-absolute bg-white border p-3 rounded-4"
      style={{
        top: "60px",
        right: "0px",
        zIndex: 2000,
        pointerEvents: "auto",
      }}
    >
      <ul className="user-action-list list-unstyled m-0">
        {isAuthenticated ? (
          <>
            <li className="mb-2 fw-bold">{user?.fullName || user?.email}</li>
            <li className="mb-2">
              <Link to={paths.profile} className="text-decoration-none text-dark d-block py-1">
                Thông tin cá nhân
              </Link>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-decoration-none text-dark d-block py-1"
                onClick={handleLogout}
              >
                Đăng xuất
              </a>
            </li>
          </>
        ) : (
          <>
            <li className="mb-2">
              <Link to={paths.login} className="text-decoration-none text-dark d-block py-1">
                Đăng nhập
              </Link>
            </li>
            <li className="mb-2">
              <Link to={paths.register} className="text-decoration-none text-dark d-block py-1">
                Đăng ký
              </Link>
            </li>
          </>
        )}
        <div className="w-100 border my-2"></div>
        <li className="mb-2">
          <span className="d-block py-1">Cho thuê ở Airbnb</span>
        </li>
        <li className="mb-2">
          <span className="d-block py-1">Tổ chức trải nghiệm</span>
        </li>
        <li className="mb-2">
          <span className="d-block py-1">Trung tâm trợ giúp</span>
        </li>
      </ul>
    </div>
  );
};

export default UserActionDropdown;
