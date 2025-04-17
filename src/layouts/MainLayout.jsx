import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <section style={{ marginTop: "120px" }}>
        <Outlet />
      </section>
      <Footer />
    </>
  );
};

export default MainLayout;
