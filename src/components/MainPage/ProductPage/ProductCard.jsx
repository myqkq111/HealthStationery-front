// src/components/ProductCard.js
import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import

const ProductCard = ({ id, name, image, price, cate }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  console.log(id);
  const handleCardClick = () => {
    navigate(`/product/${id}`); // 클릭 시 상세보기 페이지로 이동
  };

  // strImage를 쉼표로 분리하여 이미지 배열로 변환합니다.
  const images = image ? image.split(",") : [];

  // 첫 번째 이미지를 가져옵니다.
  const firstImage = images.length > 0 ? images[0] : "default-placeholder.jpg";

  // 이미지 경로를 동적으로 설정합니다.
  const imagePath = `https://project-image.s3.ap-northeast-2.amazonaws.com/${cate}/${firstImage}`;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white text-center cursor-pointer transition-transform transform hover:scale-105"
      style={{ maxWidth: "300px" }}
    >
      <div className="w-full h-64 overflow-hidden  mb-4 bg-gray-200 flex items-center justify-center">
        <img
          src={imagePath}
          alt={name}
          className="w-full h-full object-fill transition-transform duration-300 transform hover:scale-110"
          style={{ objectFit: "fill" }}
        />
      </div>
      <h3 className="text-lg font-sans font-bold mb-3 text-gray-900 truncate">
        {name}
      </h3>
      <div className="flex justify-center items-center">
        <span className="text-l font-bold text-gray-800">{price}원</span>
      </div>
    </div>
  );
};

export default ProductCard;
