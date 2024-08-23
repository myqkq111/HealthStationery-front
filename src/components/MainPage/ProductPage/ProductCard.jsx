// src/components/ProductCard.js
import React from "react";

const ProductCard = ({ name, image, price, cate }) => {
  const handleCardClick = () => {
    // 클릭 시 동작 추가 필요
  };

  // strImage를 쉼표로 분리하여 이미지 배열로 변환합니다.
  const images = image ? image.split(",") : [];

  // 첫 번째 이미지를 가져옵니다.
  const firstImage = images.length > 0 ? images[0] : "default-placeholder.jpg";

  // 이미지 경로를 동적으로 설정합니다.
  const imagePath = `/images/products/${cate}/${firstImage}`;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white cursor-pointer transition-transform transform hover:scale-105 "
      style={{ maxWidth: "300px" }} // 카드의 최대 너비 설정
    >
      <div className="w-full h-64 overflow-hidden rounded-lg mb-4 bg-gray-200 flex items-center justify-center">
        <img
          src={imagePath}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
          style={{ objectFit: "cover" }} // 이미지가 카드의 공간을 완전히 채우도록 설정
        />
      </div>
      <h3 className="text-lg  mb-2 text-gray-800 truncate">{name}</h3>
      <div className="flex justify-between items-center">
        <span className=" text-s text-gray-900 text-center">{price}원</span>
      </div>
    </div>
  );
};

export default ProductCard;
