import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate로 변경

const ProductItem = ({ image, name, price, details, reviews, link }) => {
  const navigate = useNavigate(); // useNavigate 사용

  // 카드 클릭 시 이동할 함수
  const handleClick = () => {
    navigate(link); // navigate로 페이지 이동
  };

  return (
    <div
      className="border border-gray-300 p-4 rounded-lg shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <img src={image} alt={name} className="object-cover w-full h-40 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-lg text-gray-700 mb-2">{price}</p>
      <p className="text-md text-gray-600 mb-2">{details}</p>
      <p className="text-sm text-red-600 mb-4">{reviews} 리뷰</p>
    </div>
  );
};

export default ProductItem;
