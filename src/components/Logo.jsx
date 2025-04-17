import React, { useContext } from "react";

import logo from "../assets/airbnb-logo.png";
import { Link } from "react-router-dom";
import { NavigateContext } from "../context/NavigateProvider";

const Logo = () => {
  const { paths } = useContext(NavigateContext);

  return (
    <Link
      to={paths.home}
      className="d-flex align-items-center text-decoration-none"
      style={{ width: "30px" }}
    >
      <img className="img-fluid me-2" src={logo} alt="" />
      <div className="text-danger fw-bold">airbnb</div>
    </Link>
  );
};

export default Logo;
