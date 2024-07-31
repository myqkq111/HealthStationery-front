import React from "react";

const ShopImage = () => {
  return (
    <div className="bg-white px-0 py-0 mb-4">
      {/* 이미지 섹션 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        <div className="relative w-full h-80 md:h-96">
          <img
            src="/images/shop/1.jpg"
            alt="Shop Image 1"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="relative w-full h-80 md:h-96">
          <img
            src="/images/shop/2.jpg"
            alt="Shop Image 2"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="relative w-full h-80 md:h-96">
          <img
            src="/images/shop/3.jpg"
            alt="Shop Image 3"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="relative w-full h-80 md:h-96">
          <img
            src="/images/shop/4.jpg"
            alt="Shop Image 4"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ShopImage;
