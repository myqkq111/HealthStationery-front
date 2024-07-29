// src/pages/HomePage.js
import React from "react";
import MainHeader from "../components/MainHeader";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import ReviewList from "../components/ReviewList";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <ProductList />
      <ProductList />
      <ProductList />
      <ReviewList />
      <Footer />
    </div>
  );
};

export default HomePage;
