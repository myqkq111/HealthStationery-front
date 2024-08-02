import React from "react";
import ShopImage from "../components/MainPage/ShopPage/ShopImage";
import ShopDetail from "../components/MainPage/ShopPage/ShopDetail";
import ScrollToTopButton from "../components/MainPage/ScrollToTopButton";

const Shop = () => {
  return (
    <div className="min-h-screen bg-white">
      <ShopImage />
      <ShopDetail />
      <ScrollToTopButton />
    </div>
  );
};

export default Shop;
