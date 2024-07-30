// src/components/ProductCard.js
import React from "react";
import { useHistory } from "react-router-dom";

const ProductCard = ({ id, image, title, price }) => {
  // const history = useHistory();

  // const handleCardClick = () => {
  //   history.push(`/product/${id}`);
  // };

  return (
    <div
      // onClick={handleCardClick}
      className="bg-white p-4 rounded shadow-lg cursor-pointer transition-transform transform hover:scale-105"
    >
      <div className="w-full h-48 overflow-hidden rounded mb-4">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex justify-between items-center">
        <span className="font-bold text-xl">${price}</span>
      </div>
    </div>
  );
};

export default ProductCard;
