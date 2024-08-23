// ProductItem.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "/images/products/"; // 서버의 기본 URL

const ProductItem = ({
  cate,
  name,
  price,
  image,
  content,
  isSoldOut,
  link,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // 카드 클릭 시 이동할 함수
  const handleClick = () => {
    if (!isSoldOut) {
      navigate(link);
    }
  };
  const firstImage = image.split(",")[0];
  const secondImage = image.split(",")[1];

  const imageUrl = `${IMAGE_BASE_URL}/${cate}/${firstImage}`;
  const hoverImageUrl = `${IMAGE_BASE_URL}/${cate}/${secondImage}`;

  return (
    <div
      className={`p-1 cursor-pointer flex flex-col max-w-xs w-full h-auto ${
        isSoldOut ? "opacity-50 pointer-events-none" : ""
      }`} // 품절 시 흐리게 표시하고 클릭 비활성화
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-64 mb-4">
        {/* 기본 이미지 */}
        <img
          src={imageUrl}
          alt={name}
          className={`absolute inset-0 object-contain w-full h-full transition-opacity duration-300 ${
            isHovered && image ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* 마우스 오버 이미지 */}
        {image && hoverImageUrl && (
          <img
            src={hoverImageUrl}
            alt={`${name} hover`}
            className={`absolute inset-0 object-contain w-full h-full transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* 품절 상품인 경우 "SOLD OUT" 표시 */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-white text-2xl font-bold">SOLD OUT</p>
          </div>
        )}
      </div>
      <h3 className="text-sm ">{name}</h3>
      <p className="text-lg font-semibold text-gray-700 mb-6">{price}원</p>
      <p className="text-sm font-bold text-gray-600 mb-2">{content}</p>{" "}
      {/* 상품 설명 */}
      <p className="text-sm text-red-600 mb-4">리뷰:</p>{" "}
    </div>
  );
};

export default ProductItem;
