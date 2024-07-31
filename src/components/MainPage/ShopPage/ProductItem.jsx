import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductItem = ({
  image,
  hoverImage,
  name,
  price,
  details,
  reviews,
  link,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // 카드 클릭 시 이동할 함수
  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      className="p-1 cursor-pointer flex flex-col max-w-xs w-full h-auto"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-64 mb-4">
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 object-contain w-full h-full transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={hoverImage}
          alt={`${name} hover`}
          className={`absolute inset-0 object-contain w-full h-full transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-lg text-gray-700 mb-2">{price}</p>
      <p className="text-md text-gray-600 mb-2">{details}</p>
      <p className="text-sm text-red-600 mb-4">리뷰: {reviews}</p>
    </div>
  );
};

export default ProductItem;
