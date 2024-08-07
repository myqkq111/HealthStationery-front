import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "/images/products/"; // 서버의 기본 URL

const ProductItem = ({ cate, name, price, image, content, inven, link }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // 카드 클릭 시 이동할 함수
  const handleClick = () => {
    navigate(link);
  };

  const imageUrl = `${IMAGE_BASE_URL}/${cate}/1.JPG`;
  const hoverImageUrl = `${IMAGE_BASE_URL}/${cate}/2.JPG`;

  return (
    <div
      className="p-1 cursor-pointer flex flex-col max-w-xs w-full h-auto"
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
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* 마우스 오버 이미지 */}
        {image && (
          <img
            src={hoverImageUrl}
            alt={`${name} hover`}
            className={`absolute inset-0 object-contain w-full h-full transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
      <h3 className="text-sm mb-2">{name}</h3>
      <p className="text-lg font-semibold text-gray-700 mb-2">{price}원</p>
      <p className="text-sm text-gray-600 mb-2">{content}</p> {/* 상품 설명 */}
      <p className="text-sm text-red-600 mb-4">재고: {inven}개</p>{" "}
      {/* 재고 수량 */}
    </div>
  );
};

export default ProductItem;
