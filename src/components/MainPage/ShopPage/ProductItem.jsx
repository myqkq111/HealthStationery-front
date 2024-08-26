import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://project-image.s3.ap-northeast-2.amazonaws.com"; // 서버의 기본 URL

const ProductItem = ({
  cate,
  name,
  price,
  image,
  content,
  isSoldOut,
  link,
  like,
  view,
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
      className={`p-2 cursor-pointer flex flex-col max-w-xs w-full h-[400px] ${
        isSoldOut ? "opacity-50 pointer-events-none" : ""
      }`} // 고정된 높이
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-4/5 mb-4">
        {/* 기본 이미지 */}
        <img
          src={imageUrl}
          alt={name}
          className={`absolute inset-0 object-contain  w-full h-full transition-opacity duration-300 ${
            isHovered && image ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* 마우스 오버 이미지 */}
        {image && hoverImageUrl && (
          <img
            src={hoverImageUrl}
            alt={`${name} hover`}
            className={`absolute inset-0 object-contain  w-full h-full transition-opacity duration-300 ${
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
      <div className="flex flex-col flex-grow">
        <h3 className="text-base font-bold mb-2 truncate">{name}</h3>
        <p className="text-sm text-right font-semibold text-gray-700 mb-6 truncate">
          {price}원
        </p>
        <p className="text-sm font-semibold font-serif text-gray-600 mb-2 flex-grow truncate">
          {content}
        </p>
      </div>
      <div className="flex justify-end text-sm text-gray-600 space-x-4">
        <p className="text-red-600">좋아요: {like}</p>
      </div>
    </div>
  );
};

export default ProductItem;
