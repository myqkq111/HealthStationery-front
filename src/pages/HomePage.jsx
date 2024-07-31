// src/pages/HomePage.js
import React from "react";
import Banner from "../components/MainPage/Banner";
import ProductList from "../components/MainPage/ProductPage/ProductList";
import Footer from "../components/MainPage/Footer";
import ReviewList from "../components/MainPage/ReviewPage/ReviewList";
import VideoPage from "../components/MainPage/VideoPage";
import AboutUs from "../components/MainPage/AboutUs";
import GalleryPage from "../components/MainPage/GalleryPage/GalleryPage";
import BottomPage from "../components/MainPage/BottomPage";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <ProductList />
      <ProductList />
      <ProductList />
      <ReviewList />
      <VideoPage />
      <AboutUs />
      <GalleryPage />
    </div>
  );
};

export default HomePage;
