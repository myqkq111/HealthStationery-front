import React from "react";
import { useParams } from "react-router-dom";

const ShopImage = () => {
  const { category } = useParams(); // URL 파라미터에서 카테고리 값 가져오기

  // 카테고리별로 동적으로 이미지 경로 생성
  const images = Array.from(
    { length: 4 },
    (_, index) => `/images/shop/${category}/${index + 1}.jpg`
  );

  return (
    <div className="bg-white px-0 py-0 mb-4">
      {/* 이미지 섹션 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-80 md:h-96">
            <img
              src={image}
              alt={`Shop Image ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopImage;
