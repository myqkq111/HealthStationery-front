import React from "react";
import ShopImage from "../components/MainPage/ShopPage/ShopImage";
import ShopDetail from "../components/MainPage/ShopPage/ShopDetail";

const Shop = () => {
  return (
    <div className="min-h-screen bg-white">
      <ShopImage />
      <ShopDetail />
    </div>
  );
};

export default Shop;
