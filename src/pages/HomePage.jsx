// src/pages/HomePage.js
import React from "react";
import MainHeader from "../components/MainHeader";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <MainHeader />
      <Header />
      <Banner />
      <ProductList />
      <ProductList />
      <ProductList />
      <Footer />
    </div>
  );
};

export default HomePage;
